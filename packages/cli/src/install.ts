import { access, lstat, mkdir, readFile, readdir, writeFile, rename, rm } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import type { RegistryItem, SourceFile } from "@nativra/registry-schema";
import { sha256 } from "@nativra/utils";
import type { NativraConfig } from "./config.js";
import { importBaseForType, importTargets, transformFileImports } from "./transform.js";

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
      rawDir = join(cwd, config.themesDir);
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

/**
 * Sibling imports (`./Card`) from `item` to files of `related` items that get installed in a
 * different directory, mapped to the alias that reaches them.
 */
export function crossDirectoryImports(
  cwd: string,
  item: RegistryItem,
  related: RegistryItem[],
  config: NativraConfig
): Record<string, string> {
  const ownDir = resolveDestDir(cwd, item, config);
  const targets = importTargets(config);
  const map: Record<string, string> = {};
  for (const other of related) {
    if (other.id === item.id || resolveDestDir(cwd, other, config) === ownDir) continue;
    const base = importBaseForType(other.type, targets);
    for (const file of filesForTarget(other, config)) {
      const name = (file.path.split(/[/\\]/).pop() ?? "").replace(/\.(tsx?|jsx?)$/, "");
      if (name) map[name] = `${base}/${name}`;
    }
  }
  return map;
}

/** The exact content Nativra writes for `file`: registry source with imports rewritten. */
export function renderFile(
  cwd: string,
  item: RegistryItem,
  file: SourceFile,
  related: RegistryItem[],
  config: NativraConfig
): string {
  return transformFileImports(file.content ?? "", config, crossDirectoryImports(cwd, item, related, config));
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

export interface LockEntry {
  version: string;
  /** project-relative path -> sha256 of the content Nativra wrote */
  files: Record<string, string>;
  /** Registry item ids this item depends on (recorded since 0.3; absent in older lockfiles) */
  dependencies?: string[];
}

export interface LockFile {
  items: Record<string, LockEntry>;
}

/** Ids of installed items whose recorded dependencies include `id`. */
export function findDependents(lock: LockFile, id: string): string[] {
  return Object.entries(lock.items)
    .filter(([otherId, entry]) => otherId !== id && entry.dependencies?.includes(id))
    .map(([otherId]) => otherId);
}

/**
 * Records freshly written file hashes for an item and refreshes its version/dependencies.
 * Legacy absolute-path keys are migrated to project-relative keys.
 */
export function recordLockEntry(
  lock: LockFile,
  cwd: string,
  item: RegistryItem,
  writtenFiles: Record<string, string>
): void {
  const entry: LockEntry = lock.items[item.id] ?? { version: item.version, files: {} };
  for (const [absPath, hash] of Object.entries(writtenFiles)) {
    delete entry.files[absPath];
    entry.files[toLockKey(cwd, absPath)] = hash;
  }
  if (Object.keys(entry.files).length === 0) return;
  entry.version = item.version;
  const deps = (item.registryDependencies ?? []).map((d) => d.id);
  if (deps.length > 0) entry.dependencies = deps;
  else delete entry.dependencies;
  lock.items[item.id] = entry;
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

export const BACKUP_ID_REGEX = /^[a-z][a-z0-9-]*$/;
const BACKUP_SNAPSHOT_REGEX = /^\d{13}-[a-z0-9]{6}$/;

/** Root directory holding every backup snapshot for one component. */
export function backupDirFor(cwd: string, componentId: string): string {
  if (!BACKUP_ID_REGEX.test(componentId)) {
    throw new Error(`Invalid component ID for backup: "${componentId}"`);
  }
  const backupsRoot = join(cwd, ".nativra", "backups");
  return assertChildOfRoot(backupsRoot, join(backupsRoot, componentId), "backup directory");
}

/**
 * Snapshots every file in `filesToModify` into a fresh, timestamped directory
 * (`.nativra/backups/<id>/<snapshot>/`) with one manifest covering all of them,
 * so multi-file operations can be rolled back as a unit and older snapshots survive.
 */
export async function createBackup(
  cwd: string,
  componentId: string,
  filesToModify: Array<{ destPath: string; exists: boolean }>
): Promise<string> {
  const componentDir = backupDirFor(cwd, componentId);
  const snapshot = `${Date.now()}-${Math.random().toString(36).slice(2, 8).padEnd(6, "0")}`;
  const backupDir = join(componentDir, snapshot);
  await mkdir(backupDir, { recursive: true });

  const entries: BackupFileEntry[] = [];
  for (const [index, { destPath, exists }] of filesToModify.entries()) {
    const relPath = toLockKey(cwd, destPath);
    if (!exists) {
      entries.push({ projectRelativePath: relPath, stateBefore: "absent" });
      continue;
    }

    const localContent = await readFile(destPath, "utf8");
    const baseName = destPath.split(/[/\\]/).pop() ?? "file";
    const backupFileName = `${index}-${baseName}.bak`;
    await writeFile(join(backupDir, backupFileName), localContent, "utf8");
    entries.push({
      projectRelativePath: relPath,
      backupFileName,
      stateBefore: "present",
      sha256: sha256(localContent),
    });
  }

  const manifest: BackupManifest = {
    schemaVersion: 1,
    backupId: `${componentId}/${snapshot}`,
    componentId,
    createdAt: new Date().toISOString(),
    files: entries,
  };
  await writeFile(join(backupDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  return manifest.backupId;
}

/**
 * Returns the newest backup snapshot directory for a component, or null.
 * Also recognises the pre-0.3 layout where `manifest.json` sat directly in the component dir.
 */
export async function findLatestBackup(cwd: string, componentId: string): Promise<string | null> {
  const componentDir = backupDirFor(cwd, componentId);
  let entries: string[];
  try {
    entries = await readdir(componentDir);
  } catch {
    return null;
  }
  const snapshots = entries.filter((e) => BACKUP_SNAPSHOT_REGEX.test(e)).sort();
  const latest = snapshots[snapshots.length - 1];
  if (latest) return join(componentDir, latest);
  return entries.includes("manifest.json") ? componentDir : null;
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


