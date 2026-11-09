import { access, lstat, mkdir, readFile, writeFile, rename, rm } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import type { RegistryItem, SourceFile } from "@nativra/registry-schema";
import { sha256 } from "@nativra/utils";
import type { NativraConfig } from "./config.js";

/**
 * Ensures targetPath resolves strictly inside rootDir (at least one level below rootDir).
 */
export function assertChildOfRoot(rootDir: string, targetPath: string, label = "path"): string {
  const normalizedRoot = resolve(rootDir);
  const resolvedTarget = resolve(normalizedRoot, targetPath);
  if (!resolvedTarget.startsWith(normalizedRoot + sep)) {
    throw new Error(`Unsafe ${label} rejected (escapes project root): "${targetPath}"`);
  }
  return resolvedTarget;
}

export function toLockKey(cwd: string, filePath: string): string {
  const safeAbs = assertChildOfRoot(cwd, filePath, "lockfile path");
  return relative(resolve(cwd), safeAbs).replace(/\\/g, "/");
}

export function resolveLockFilePath(cwd: string, fileKey: string): string {
  if (!fileKey || typeof fileKey !== "string" || fileKey.includes("\0")) {
    throw new Error(`Invalid lockfile path entry: "${String(fileKey)}"`);
  }
  return assertChildOfRoot(cwd, fileKey, "tracked lockfile path");
}

export async function assertNotSymlink(filePath: string): Promise<void> {
  try {
    const stat = await lstat(filePath);
    if (stat.isSymbolicLink()) {
      throw new Error(`Refusing to operate on symbolic link: "${filePath}"`);
    }
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return;
    throw err;
  }
}

export function resolveDestDir(cwd: string, item: RegistryItem, config: NativraConfig): string {
  let rawDir: string;
  switch (item.type) {
    case "hook":
      rawDir = join(cwd, config.hooksDir);
      break;
    case "utility": {
      const uDir = config.utilsDir.replace(/\.(ts|js|tsx)$/, "");
      rawDir = join(cwd, uDir);
      break;
    }
    case "theme":
      rawDir = join(cwd, "lib/themes");
      break;
    case "block":
      rawDir = join(cwd, config.blocksDir ?? config.componentsDir);
      break;
    default:
      rawDir = join(cwd, config.componentsDir);
      break;
  }
  return assertChildOfRoot(cwd, rawDir, "destination directory");
}

export function filesForTarget(item: RegistryItem, config: NativraConfig): SourceFile[] {
  return item.files.filter((f) => !f.target || f.target === config.stylingTarget);
}

export function destPathFor(cwd: string, item: RegistryItem, file: SourceFile, config: NativraConfig): string {
  const destDir = resolveDestDir(cwd, item, config);
  const fileName = file.path.split(/[/\\]/).pop() ?? file.path;
  if (!fileName || fileName === "." || fileName === "..") {
    throw new Error(`Unsafe file name in registry item: ${file.path}`);
  }
  const target = resolve(destDir, fileName);

  // Security containment check (Plan Section 2.6): both inside destDir and inside cwd
  const normalizedDestDir = resolve(destDir);
  if (!target.startsWith(normalizedDestDir + sep)) {
    throw new Error(`Unsafe destination path resolved for ${file.path}`);
  }
  return assertChildOfRoot(cwd, target, "destination file path");
}

export async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Lock file: records hashes of installed files so `update` can detect local edits
// ---------------------------------------------------------------------------

export const LOCK_FILENAME = "nativra.lock.json";

export interface LockFile {
  items: Record<string, { version: string; files: Record<string, string> }>;
}

export async function readLock(cwd: string): Promise<LockFile> {
  try {
    return JSON.parse(await readFile(join(cwd, LOCK_FILENAME), "utf8")) as LockFile;
  } catch {
    return { items: {} };
  }
}

/** Atomic lockfile writer using temporary file and atomic rename (Plan Section 3.6) */
export async function writeLock(cwd: string, lock: LockFile): Promise<void> {
  const targetPath = join(cwd, LOCK_FILENAME);
  const tmpPath = join(cwd, `.${LOCK_FILENAME}.${Date.now()}.tmp`);
  await writeFile(tmpPath, JSON.stringify(lock, null, 2), "utf8");
  try {
    await rename(tmpPath, targetPath);
  } catch {
    // Fallback on environments where atomic rename is locked
    await writeFile(targetPath, JSON.stringify(lock, null, 2), "utf8");
    await rm(tmpPath, { force: true }).catch(() => {});
  }
}

export async function writeInstalledFile(destPath: string, content: string): Promise<string> {
  await mkdir(dirname(destPath), { recursive: true });
  await writeFile(destPath, content, "utf8");
  return sha256(content);
}

// ---------------------------------------------------------------------------
// Versioned Backup Manifest & Management (Plan Section 2.3 & 2.4)
// ---------------------------------------------------------------------------

export interface BackupFileEntry {
  projectRelativePath: string;
  backupFileName?: string;
  stateBefore: "present" | "absent";
  sha256?: string;
}

export interface BackupManifest {
  schemaVersion: 1;
  backupId: string;
  componentId: string;
  createdAt: string;
  files: BackupFileEntry[];
}

export async function createBackup(
  cwd: string,
  componentId: string,
  filesToModify: Array<{ destPath: string; exists: boolean }>
): Promise<string> {
  if (!/^[a-z][a-z0-9-]*$/.test(componentId)) {
    throw new Error(`Invalid component ID for backup: "${componentId}"`);
  }
  const backupId = `backup-${componentId}-${Date.now()}`;
  const backupsRoot = join(cwd, ".nativra", "backups");
  const backupDir = assertChildOfRoot(backupsRoot, join(backupsRoot, componentId), "backup directory");
  await mkdir(backupDir, { recursive: true });

  const entries: BackupFileEntry[] = [];

  for (const { destPath, exists } of filesToModify) {
    const relPath = relative(cwd, destPath).replace(/\\/g, "/");
    if (!exists) {
      entries.push({
        projectRelativePath: relPath,
        stateBefore: "absent",
      });
      continue;
    }

    const localContent = await readFile(destPath, "utf8");
    const hash = sha256(localContent);
    const safeBaseName = destPath.split(/[/\\]/).pop() ?? "file.tsx";
    const backupFileName = `${safeBaseName}.${Date.now()}.bak`;
    await writeFile(join(backupDir, backupFileName), localContent, "utf8");

    // Also write simple .bak for backward-compatibility with legacy tooling
    await writeFile(join(backupDir, `${safeBaseName}.bak`), localContent, "utf8");

    entries.push({
      projectRelativePath: relPath,
      backupFileName,
      stateBefore: "present",
      sha256: hash,
    });
  }

  const manifest: BackupManifest = {
    schemaVersion: 1,
    backupId,
    componentId,
    createdAt: new Date().toISOString(),
    files: entries,
  };

  await writeFile(join(backupDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  return backupId;
}

// ---------------------------------------------------------------------------
// Transactional Installation Execution (Plan Section 2.1)
// ---------------------------------------------------------------------------

export interface PlannedInstallFile {
  componentId: string;
  destPath: string;
  content: string;
  action: "create" | "overwrite" | "skip";
}

export async function executeInstallTransaction(
  plan: PlannedInstallFile[]
): Promise<{ installedPaths: string[]; writtenFiles: Record<string, string> }> {
  const writtenFiles: Record<string, string> = {};
  const previousState: Array<{ destPath: string; existed: boolean; originalContent?: string }> = [];

  const activePlan = plan.filter((p) => p.action !== "skip");

  // Step 1: Snapshot previous states of files being changed
  for (const item of activePlan) {
    const existed = await fileExists(item.destPath);
    if (existed) {
      const orig = await readFile(item.destPath, "utf8");
      previousState.push({ destPath: item.destPath, existed: true, originalContent: orig });
    } else {
      previousState.push({ destPath: item.destPath, existed: false });
    }
  }

  // Step 2: Attempt writes
  const modifiedPaths: string[] = [];
  try {
    for (const item of activePlan) {
      const hash = await writeInstalledFile(item.destPath, item.content);
      writtenFiles[item.destPath] = hash;
      modifiedPaths.push(item.destPath);
    }
    return { installedPaths: modifiedPaths, writtenFiles };
  } catch (err) {
    // Step 3: Rollback all changes if any write fails
    for (const prev of previousState) {
      if (prev.existed && prev.originalContent !== undefined) {
        await writeFile(prev.destPath, prev.originalContent, "utf8");
      } else {
        await rm(prev.destPath, { force: true }).catch(() => {});
      }
    }
    throw new Error(
      `Installation failed and project changes were safely rolled back: ${(err as Error).message}`
    );
  }
}


