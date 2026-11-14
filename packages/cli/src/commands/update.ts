import type { Command } from "commander";
import { readFile } from "node:fs/promises";
import chalk from "chalk";
import type { RegistryItem } from "@nativra/registry-schema";
import { sha256 } from "@nativra/utils";
import { createClient } from "../client.js";
import { loadConfig } from "../config.js";
import {
  createBackup,
  destPathFor,
  executeInstallTransaction,
  filesForTarget,
  readLock,
  recordLockEntry,
  renderFile,
  writeLock,
  toLockKey,
  type PlannedInstallFile,
} from "../install.js";
import {
  formatInstallCommand,
  getInstallCommand,
  getMissingDependencies,
  type PackageDependency,
} from "../installer.js";

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

      const npmDeps = new Map<string, PackageDependency>();
      const handled = new Set<string>();

      for (const id of targets) {
        let items: RegistryItem[];
        try {
          items = await client.resolveWithDependencies(id);
        } catch (e) {
          console.error(chalk.red(`  ✗ ${id}: ${(e as Error).message}`));
          continue;
        }

        for (const item of items) {
          if (handled.has(item.id)) continue;
          handled.add(item.id);
          for (const dep of item.npmDependencies ?? []) {
            if (!npmDeps.has(dep.package)) npmDeps.set(dep.package, dep);
          }

          const entry = lock.items[item.id];
          const isNewDependency = !entry && item.id !== id;
          if (isNewDependency) console.log(chalk.cyan(`  + ${item.id} (new dependency of ${id})`));

          const plan: PlannedInstallFile[] = [];
          const toBackup: Array<{ destPath: string; exists: boolean }> = [];
          const unchanged: Record<string, string> = {};

          for (const file of filesForTarget(item, config)) {
            const dest = destPathFor(options.cwd, item, file, config);
            const recordedHash = entry?.files[toLockKey(options.cwd, dest)] ?? entry?.files[dest];
            const next = renderFile(options.cwd, item, file, items, config);
            const local = await readFile(dest, "utf8").catch(() => null);

            if (local === next) {
              console.log(chalk.gray(`  = ${dest} (up to date)`));
              unchanged[dest] = sha256(next);
              continue;
            }
            if (local !== null && isNewDependency) {
              console.log(chalk.yellow(`  ! ${dest} already exists and is not tracked — skipped`));
              continue;
            }
            const locallyModified = local !== null && sha256(local) !== recordedHash;
            if (locallyModified && !options.force) {
              console.log(chalk.yellow(`  ! ${dest} has local changes — skipped (use --force, or 'nativra diff ${item.id}')`));
              continue;
            }
            if (local !== null) toBackup.push({ destPath: dest, exists: true });
            plan.push({ componentId: item.id, destPath: dest, content: next, action: local === null ? "create" : "overwrite" });
          }

          if (toBackup.length > 0) {
            try {
              await createBackup(options.cwd, item.id, toBackup);
            } catch (backupErr) {
              console.error(chalk.red(`  ✗ Cannot create required backup for "${item.id}": ${(backupErr as Error).message}`));
              console.error(chalk.red(`    Update aborted to prevent loss of local source.`));
              continue;
            }
          }

          const { writtenFiles } = await executeInstallTransaction(plan);
          for (const path of Object.keys(writtenFiles)) console.log(chalk.green(`  ✓ Updated ${path}`));
          recordLockEntry(lock, options.cwd, item, { ...unchanged, ...writtenFiles });
        }
      }
      await writeLock(options.cwd, lock);

      const missing = await getMissingDependencies(options.cwd, [...npmDeps.values()]);
      if (missing.length > 0) {
        try {
          const cmd = formatInstallCommand(await getInstallCommand(options.cwd, missing));
          console.log(chalk.yellow(`\n  ⚠ Install newly required dependencies:\n`) + chalk.cyan(`    ${cmd}`));
        } catch (err) {
          console.error(chalk.red(`\n✗ ${(err as Error).message}`));
        }
      }
      console.log();
    });
}
