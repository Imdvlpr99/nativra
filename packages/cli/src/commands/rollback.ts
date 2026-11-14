import type { Command } from "commander";
import { readFile, writeFile, rm, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import chalk from "chalk";
import { sha256 } from "@nativra/utils";
import { loadConfig } from "../config.js";
import {
  assertChildOfRoot,
  assertNotSymlink,
  backupDirFor,
  BACKUP_ID_REGEX,
  findLatestBackup,
  readLock,
  writeLock,
  type BackupManifest,
} from "../install.js";

export function registerRollbackCommand(program: Command) {
  program
    .command("rollback <id>")
    .description("Restore the most recent backup of an installed item (repeat to go further back)")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .action(async (id: string, options: { cwd: string }) => {
      if (!BACKUP_ID_REGEX.test(id)) {
        console.error(chalk.red(`\n✗ Invalid component ID "${id}".\n`));
        process.exit(1);
      }

      await loadConfig(options.cwd).catch((err) => {
        console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
        process.exit(1);
      });

      const backupDir = await findLatestBackup(options.cwd, id);
      if (!backupDir) {
        console.log(chalk.yellow(`\nNo backups available for "${id}".\n`));
        return;
      }

      let manifest: BackupManifest;
      try {
        manifest = JSON.parse(await readFile(join(backupDir, "manifest.json"), "utf8")) as BackupManifest;
      } catch (err) {
        console.error(chalk.red(`\n✗ Backup manifest in ${backupDir} is unreadable: ${(err as Error).message}\n`));
        process.exit(1);
      }

      const lock = await readLock(options.cwd);
      const lockEntry = lock.items[id];

      try {
        console.log(chalk.bold(`\n⏪ Rolling back "${id}" from backup ${manifest.backupId}...`));

        for (const entry of manifest.files) {
          const targetPath = assertChildOfRoot(
            options.cwd,
            join(options.cwd, entry.projectRelativePath),
            "rollback target path"
          );
          await assertNotSymlink(targetPath);

          if (entry.stateBefore === "present") {
            if (!entry.backupFileName) {
              throw new Error(`Backup manifest entry for "${entry.projectRelativePath}" has no backup file`);
            }
            const safeBackupFile = assertChildOfRoot(backupDir, join(backupDir, entry.backupFileName), "backup source file");
            await assertNotSymlink(safeBackupFile);
            const backupContent = await readFile(safeBackupFile, "utf8");
            const hash = sha256(backupContent);
            if (entry.sha256 && hash !== entry.sha256.toLowerCase()) {
              throw new Error(`Backup integrity check failed for "${entry.projectRelativePath}": SHA-256 mismatch`);
            }
            await mkdir(dirname(targetPath), { recursive: true });
            await writeFile(targetPath, backupContent, "utf8");
            if (lockEntry) lockEntry.files[entry.projectRelativePath] = hash;
            console.log(chalk.green(`  ✓ Restored ${entry.projectRelativePath}`));
          } else {
            await rm(targetPath, { force: true });
            if (lockEntry) delete lockEntry.files[entry.projectRelativePath];
            console.log(chalk.yellow(`  - Removed newly created file: ${entry.projectRelativePath}`));
          }
        }
      } catch (err) {
        console.error(chalk.red(`\n✗ Rollback failed: ${(err as Error).message}\n`));
        process.exit(1);
      }

      // Restored content is now the tracked baseline, so `update` treats it as unmodified.
      if (lockEntry) await writeLock(options.cwd, lock);

      // Consume the snapshot so the next rollback steps further back.
      if (backupDir === backupDirFor(options.cwd, id)) {
        // pre-0.3 layout: manifest and files live directly in the component dir
        await rm(join(backupDir, "manifest.json"), { force: true });
        for (const entry of manifest.files) {
          if (entry.backupFileName) await rm(join(backupDir, entry.backupFileName), { force: true });
        }
      } else {
        await rm(backupDir, { recursive: true, force: true });
      }

      console.log(chalk.bold.green(`\n✅ Rollback for "${id}" completed successfully.\n`));
    });
}
