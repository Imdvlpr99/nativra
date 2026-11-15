import chalk from "chalk";
import { readLock, type LockFile } from "../install.js";

/** Reads nativra.lock.json, or prints why it can't be used and exits (it is never overwritten). */
export async function readLockOrExit(cwd: string): Promise<LockFile> {
  try {
    return await readLock(cwd);
  } catch (err) {
    console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
    process.exit(1);
  }
}

/** Marks the run as failed without stopping it, so later items still get processed. */
export function markFailed(): void {
  process.exitCode = 1;
}
