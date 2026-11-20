import type { Command } from "commander";
import { readFile, writeFile, rm, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import chalk from "chalk";
import { sha256 } from "@nativra/utils";
import { loadConfig } from "../config.js";
import {
  assertChildOfRoot,
  assertNotSymlink,
  contentHash,
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

      /** Another item's tracked file this rollback restored, while that file was unedited. */
      const ownerRefreshes: Array<{ owner: string; key: string; hash: string }> = [];
      try {
        if (!Array.isArray(manifest.files)) throw new Error(`Backup manifest in ${backupDir} has no "files" list`);
        // Phase 1, nothing written yet: resolve every target, read and verify every backup file, and
        // refuse to discard edits made after the operation being undone. A bad backup file then
        // fails the rollback before any file has changed.
        const targets: Array<{
          entry: BackupManifest["files"][number];
          targetPath: string;
          /** Backup content to write back; absent for a file the operation created (it is removed) */
          restore?: { content: string; hash: string };
          /** What is on disk now, put back if a later write fails */
          current: string | null;
          cleanOwner?: string;
        }> = [];
        const editedSince: string[] = [];
        for (const entry of manifest.files) {
          if (typeof entry?.projectRelativePath !== "string") {
            throw new Error(`Backup manifest in ${backupDir} has an entry without a path`);
          }
          const targetPath = assertChildOfRoot(options.cwd, join(options.cwd, entry.projectRelativePath), "rollback target path");
          await assertSafeWriteTarget(options.cwd, targetPath);

          let restore: { content: string; hash: string } | undefined;
          if (entry.stateBefore === "present") {
            if (!entry.backupFileName) {
              throw new Error(`Backup manifest entry for "${entry.projectRelativePath}" has no backup file`);
            }
            const safeBackupFile = assertChildOfRoot(backupDir, join(backupDir, entry.backupFileName), "backup source file");
            await assertNotSymlink(safeBackupFile);
            const content = await readFile(safeBackupFile, "utf8");
            // Integrity is about the backup file's exact bytes; the lockfile hash ignores line endings.
            if (entry.sha256 && sha256(content) !== entry.sha256.toLowerCase()) {
              throw new Error(`Backup integrity check failed for "${entry.projectRelativePath}": SHA-256 mismatch. Nothing was changed`);
            }
            restore = { content, hash: contentHash(content) };
          }

          // Compare against whoever tracks the file now: this item, or one that took it over since
          // (e.g. a newer theme in theme.ts after `remove zinc` + `theme add rose`).
          const key = entry.projectRelativePath;
          const owner = lock.items[id]?.files[key] !== undefined ? id : lockOwnerOf(lock, key, id);
          // An untracked file (nativra.json) is compared with what the operation wrote instead.
          const tracked = owner ? lock.items[owner]?.files[key] : undefined;
          const recorded = tracked ?? (typeof entry.hashAfter === "string" ? entry.hashAfter : undefined);
          const current = (await fileExists(targetPath)) ? await readFile(targetPath, "utf8") : null;
          let cleanOwner: string | undefined;
          if (recorded && current !== null) {
            const now = contentHash(current);
            // Already back to the backed-up content (the operation failed before writing): nothing to lose.
            if (now !== recorded && now !== restore?.hash) editedSince.push(entry.projectRelativePath);
            else if (tracked && owner !== id) cleanOwner = owner;
          }
          targets.push({ entry, targetPath, current, ...(restore ? { restore } : {}), ...(cleanOwner ? { cleanOwner } : {}) });
        }
        if (editedSince.length > 0 && !options.force) {
          console.error(chalk.red(`\n✗ These files changed after the operation you're undoing, and rollback would discard that:`));
          for (const f of editedSince) console.error(chalk.red(`    • ${f}`));
          console.error(chalk.red(`  Commit or copy your edits, then re-run with --force.\n`));
          process.exit(1);
        }

        console.log(chalk.bold(`\n⏪ Rolling back "${id}" from backup ${manifest.backupId}...`));

        // Phase 2: write. If a write fails, the files already written are put back as they were,
        // so the project still matches the lockfile (which is only written afterwards).
        const done: typeof targets = [];
        try {
          for (const target of targets) {
            if (target.restore) {
              await mkdir(dirname(target.targetPath), { recursive: true });
              await writeFile(target.targetPath, target.restore.content, "utf8");
            } else {
              await rm(target.targetPath, { force: true });
            }
            done.push(target);
          }
        } catch (err) {
          const unrestored: string[] = [];
          for (const { targetPath, current, entry } of done.reverse()) {
            try {
              if (current === null) await rm(targetPath, { force: true });
              else await writeFile(targetPath, current, "utf8");
            } catch {
              unrestored.push(entry.projectRelativePath);
            }
          }
          throw new Error(
            `${(err as Error).message}. ` +
              (unrestored.length > 0
                ? `These files could not be put back and may hold the backup's content: ${unrestored.join(", ")}`
                : "Every file was put back as it was; nothing changed")
          );
        }

        for (const { entry, restore, cleanOwner } of targets) {
          if (restore) {
            const hash = restore.hash;
            // A file Nativra didn't track before the operation (the user's own, replaced by
            // `add --overwrite`) goes back to untracked, so `update` won't overwrite it unasked.
            const wasTracked = manifest.lockEntry ? entry.projectRelativePath in manifest.lockEntry.files : false;
            if (lockEntry) {
              if (wasTracked) lockEntry.files[entry.projectRelativePath] = hash;
              else delete lockEntry.files[entry.projectRelativePath];
            } else if (cleanOwner) {
              // A snapshot with no item of its own (`audit-fix`): the owner's hash follows the content
              // back, as `audit --fix` moved it forward.
              ownerRefreshes.push({ owner: cleanOwner, key: entry.projectRelativePath, hash });
            }
            console.log(chalk.green(`  ✓ Restored ${entry.projectRelativePath}`));
          } else {
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
      } else if (ownerRefreshes.length > 0) {
        for (const { owner, key, hash } of ownerRefreshes) {
          const files = lock.items[owner]?.files;
          if (files) files[key] = hash;
        }
        await writeLock(options.cwd, lock);
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
