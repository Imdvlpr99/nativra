import type { Command } from "commander";
import { readFile } from "node:fs/promises";
import chalk from "chalk";
import { sha256 } from "@nativra/utils";
import { createClient } from "../client.js";
import { loadConfig } from "../config.js";
import {
  destPathFor,
  filesForTarget,
  readLock,
  writeInstalledFile,
  writeLock,
  createBackup,
} from "../install.js";

export function registerUpdateCommand(program: Command) {
  program
    .command("update [ids...]")
    .description("Update installed items; files you modified locally are never overwritten unless --force")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--registry <url>", "Override registry location")
    .option("--force", "Overwrite locally modified files")
    .action(async (ids: string[], options: { cwd: string; registry?: string; force?: boolean }) => {
      const config = await loadConfig(options.cwd).catch((err) => {
        console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
        process.exit(1);
      });
      const client = createClient(config, options.registry);
      const lock = await readLock(options.cwd);
      const targets = ids.length > 0 ? ids : Object.keys(lock.items);

      if (targets.length === 0) {
        console.log(chalk.yellow("\nNothing installed yet (no nativra.lock.json entries).\n"));
        return;
      }

      for (const id of targets) {
        const item = await client.getItem(id).catch((e) => {
          console.error(chalk.red(`  ✗ ${id}: ${(e as Error).message}`));
          return null;
        });
        if (!item) continue;

        const entry = lock.items[id] ?? { version: item.version, files: {} };
        for (const file of filesForTarget(item, config)) {
          const dest = destPathFor(options.cwd, item, file, config);
          const next = file.content ?? "";
          const local = await readFile(dest, "utf8").catch(() => null);

          if (local === next) {
            console.log(chalk.gray(`  = ${dest} (up to date)`));
            entry.files[dest] = sha256(next);
            continue;
          }
          const locallyModified = local !== null && sha256(local) !== entry.files[dest];
          if (locallyModified && !options.force) {
            console.log(chalk.yellow(`  ! ${dest} has local changes — skipped (use --force, or 'nativra diff ${id}')`));
            continue;
          }

          // Safety backup before update (Plan Section 2.3 & 2.4)
          if (local !== null) {
            try {
              await createBackup(options.cwd, id, [{ destPath: dest, exists: true }]);
            } catch (backupErr) {
              console.error(
                chalk.red(`  ✗ Cannot create required backup for "${dest}": ${(backupErr as Error).message}`)
              );
              console.error(chalk.red(`    Update aborted to prevent loss of local source.`));
              continue;
            }
          }

          entry.files[dest] = await writeInstalledFile(dest, next);
          console.log(chalk.green(`  ✓ Updated ${dest}`));
        }
        entry.version = item.version;
        lock.items[id] = entry;
      }
      await writeLock(options.cwd, lock);
      console.log();
    });
}


