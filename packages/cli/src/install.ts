import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { RegistryItem, SourceFile } from "@nativra/registry-schema";
import { sha256 } from "@nativra/utils";
import type { NativraConfig } from "./config.js";

export function resolveDestDir(cwd: string, item: RegistryItem, config: NativraConfig): string {
  switch (item.type) {
    case "hook":
      return join(cwd, config.hooksDir);
    case "utility":
      return join(cwd, config.utilsDir);
    case "theme":
      return join(cwd, "lib/themes");
    default:
      return join(cwd, config.componentsDir);
  }
}

export function filesForTarget(item: RegistryItem, config: NativraConfig): SourceFile[] {
  return item.files.filter((f) => !f.target || f.target === config.stylingTarget);
}

export function destPathFor(cwd: string, item: RegistryItem, file: SourceFile, config: NativraConfig): string {
  return join(resolveDestDir(cwd, item, config), file.path.split("/").pop() ?? file.path);
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

export async function writeLock(cwd: string, lock: LockFile): Promise<void> {
  await writeFile(join(cwd, LOCK_FILENAME), JSON.stringify(lock, null, 2), "utf8");
}

export async function writeInstalledFile(destPath: string, content: string): Promise<string> {
  await mkdir(dirname(destPath), { recursive: true });
  await writeFile(destPath, content, "utf8");
  return sha256(content);
}

