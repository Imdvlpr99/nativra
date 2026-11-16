import type { Command } from "commander";
import { readFile, writeFile, rm, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import chalk from "chalk";
import { sha256 } from "@nativra/utils";
import { loadConfig } from "../config.js";
import {
  assertChildOfRoot,
  assertNotSymlink,
  assertSafeWriteTarget,
  backupDirFor,
  BACKUP_ID_REGEX,
  fileExists,
  findLatestBackup,
  lockOwnerOf,
  writeLock,
  type BackupManifest,
} from "../install.js";
import { readLockOrExit } from "./shared.js";

export function registerRollbackCommand(program: Command) {
  program
    .command("rollback <id>")
    .description("Restore the most recent backup of an installed item (repeat to go further back)")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--force", "Restore even if files were edited after the operation being undone (those edits are lost)")
    .action(async (id: string, options: { cwd: string; force?: boolean }) => {
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

      const lock = await readLockOrExit(options.cwd);
      // After `remove` the item has no lock entry; the manifest carries the one it had.
      const restoringEntry = !lock.items[id] && manifest.lockEntry;
      const lockEntry = lock.items[id] ?? (manifest.lockEntry ? { ...manifest.lockEntry, files: { ...manifest.lockEntry.files } } : undefined);
      // Undoing an update restores the old files, so the lock must name the old version too.
      if (lockEntry && lock.items[id] && typeof manifest.lockEntry?.version === "string") {
        lockEntry.version = manifest.lockEntry.version;
        if (manifest.lockEntry.dependencies) lockEntry.dependencies = [...manifest.lockEntry.dependencies];
        else delete lockEntry.dependencies;
      }

      try {
        // Resolve every target and refuse to discard edits made after the operation being undone.
        const targets: Array<{ entry: BackupManifest["files"][number]; targetPath: string }> = [];
        const editedSince: string[] = [];
        for (const entry of manifest.files) {
          const targetPath = assertChildOfRoot(options.cwd, join(options.cwd, entry.projectRelativePath), "rollback target path");
          await assertSafeWriteTarget(options.cwd, targetPath);
          targets.push({ entry, targetPath });

          // Compare against whoever tracks the file now: this item, or one that took it over since
          // (e.g. a newer theme in theme.ts after `remove zinc` + `theme add rose`).
          const key = entry.projectRelativePath;
          const owner = lock.items[id]?.files[key] !== undefined ? id : lockOwnerOf(lock, key, id);
          const recorded = owner ? lock.items[owner]?.files[key] : undefined;
          if (recorded && (await fileExists(targetPath))) {
            const current = sha256(await readFile(targetPath, "utf8"));
            if (current !== recorded) editedSince.push(entry.projectRelativePath);
          }
        }
        if (editedSince.length > 0 && !options.force) {
          console.error(chalk.red(`\n✗ These files changed after the operation you're undoing, and rollback would discard that:`));
          for (const f of editedSince) console.error(chalk.red(`    • ${f}`));
          console.error(chalk.red(`  Commit or copy your edits, then re-run with --force.\n`));
          process.exit(1);
        }

        console.log(chalk.bold(`\n⏪ Rolling back "${id}" from backup ${manifest.backupId}...`));

        for (const { entry, targetPath } of targets) {
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
            // A file Nativra didn't track before the operation (the user's own, replaced by
            // `add --overwrite`) goes back to untracked, so `update` won't overwrite it unasked.
            const wasTracked = manifest.lockEntry ? entry.projectRelativePath in manifest.lockEntry.files : false;
            if (lockEntry) {
              if (wasTracked) lockEntry.files[entry.projectRelativePath] = hash;
              else delete lockEntry.files[entry.projectRelativePath];
            }
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
      if (lockEntry) {
        // A file belongs to one item: take restored files back from whoever claimed them since.
        for (const key of Object.keys(lockEntry.files)) {
          for (const [otherId, other] of Object.entries(lock.items)) {
            if (otherId === id || !(key in other.files)) continue;
            delete other.files[key];
            if (Object.keys(other.files).length === 0) delete lock.items[otherId];
          }
        }
        if (Object.keys(lockEntry.files).length > 0) lock.items[id] = lockEntry;
        else delete lock.items[id];
        await writeLock(options.cwd, lock);
        if (restoringEntry && lock.items[id]) console.log(chalk.green(`  ✓ "${id}" is tracked in nativra.lock.json again`));
      }

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
