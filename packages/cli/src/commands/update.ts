import type { Command } from "commander";
import { readFile } from "node:fs/promises";
import chalk from "chalk";
import type { RegistryItem } from "@nativra/registry-schema";
import { sha256 } from "@nativra/utils";
import { createClient, formatItemRef, parseItemRef } from "../client.js";
import { loadConfig } from "../config.js";
import {
  createBackup,
  upstreamHashes,
  discardBackup,
  PartialRollbackError,
  destPathFor,
  executeInstallTransaction,
  filesForTarget,
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
import { markFailed, printable, readLockOrExit } from "./shared.js";
import { ensureNativeWindTheme, installedStyleId, installedThemeId } from "../theme-css.js";

export function registerUpdateCommand(program: Command) {
  program
    .command("update [ids...]")
    .description("Update installed items; files you modified locally are never overwritten unless --force")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--registry <url>", "Override registry location")
    .option("--force", "Overwrite locally modified files")
    .option("--dry-run", "Show what would change without writing anything")
    .action(async (ids: string[], options: { cwd: string; registry?: string; force?: boolean; dryRun?: boolean }) => {
      const config = await loadConfig(options.cwd).catch((err) => {
        console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
        process.exit(1);
      });
      const client = createClient(config, options.registry, options.cwd);
      const lock = await readLockOrExit(options.cwd);
      // Installed items are looked up in the registry they came from.
      const targets = ids.length > 0 ? ids : Object.entries(lock.items).map(([id, e]) => (options.registry ? id : formatItemRef(id, e.registry)));

      if (targets.length === 0) {
        console.log(chalk.yellow("\nNothing installed yet (no nativra.lock.json entries).\n"));
        return;
      }

      const npmDeps = new Map<string, PackageDependency>();
      const handled = new Set<string>();
      let pending = 0;

      for (const target of targets) {
        let items: RegistryItem[];
        let id: string;
        const registryOf = new Map<string, string>();
        try {
          const ref = parseItemRef(target);
          id = ref.id;
          // --registry replaces every configured source with one "default" source.
          const registry = options.registry
            ? "default"
            : ids.length > 0 && !target.includes("/")
              ? (lock.items[id]?.registry ?? "default")
              : ref.registry;
          const resolved = await client.resolveWithSources(id, registry);
          items = resolved.map((r) => r.item);
          for (const r of resolved) registryOf.set(r.item.id, r.registry);
        } catch (e) {
          console.error(chalk.red(`  ✗ ${printable(target)}: ${printable((e as Error).message)}`));
          markFailed();
          continue;
        }

        for (let item of items) {
          if (handled.has(item.id)) continue;
          handled.add(item.id);
          // The default style dependency becomes the project's configured style.
          if (item.type === "style" && !lock.items[item.id] && item.id !== id && config.style && config.style !== item.id) {
            try {
              item = await client.getItem(config.style, registryOf.get(item.id) ?? "default");
              handled.add(item.id);
            } catch (err) {
              console.error(chalk.red(`  ✗ style "${printable(config.style)}": ${printable((err as Error).message)}`));
              markFailed();
              continue;
            }
          }
          for (const dep of item.npmDependencies ?? []) {
            if (!npmDeps.has(dep.package)) npmDeps.set(dep.package, dep);
          }

          const entry = lock.items[item.id];
          const isNewDependency = !entry && item.id !== id;
          // A component's theme or style dependency is satisfied by whichever one is installed.
          const active = item.type === "theme" ? installedThemeId(lock) : item.type === "style" ? installedStyleId(lock) : undefined;
          if (isNewDependency && active) {
            console.log(chalk.gray(`  = ${item.id}: using the installed ${item.type} "${active}"`));
            continue;
          }
          if (isNewDependency) console.log(chalk.cyan(`  + ${item.id} (new dependency of ${id})`));

          const plan: PlannedInstallFile[] = [];
          const toBackup: Array<{ destPath: string; exists: boolean }> = [];
          const unchanged: Record<string, string> = {};

          for (const file of filesForTarget(item, config)) {
            const dest = destPathFor(options.cwd, item, file, config);
            const key = toLockKey(options.cwd, dest);
            const recordedHash = entry?.files[key] ?? entry?.files[dest];
            const next = renderFile(options.cwd, item, file, items, config);
            const local = await readFile(dest, "utf8").catch(() => null);

            // Same version, different source: either the registry forgot a version bump or the
            // content was tampered with. Either way, review before trusting it.
            const recordedUpstream = entry?.upstream?.[key];
            if (entry?.version === item.version && recordedUpstream && file.hash && recordedUpstream !== file.hash.toLowerCase()) {
              console.log(
                chalk.yellow(`  ⚠ ${dest}: the registry changed this file without bumping ${item.id} past ${item.version}. Review it with 'nativra diff ${item.id}'.`)
              );
            }

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
            // Created files are recorded too (as absent before), so rollback removes them.
            toBackup.push({ destPath: dest, exists: local !== null });
            plan.push({ componentId: item.id, destPath: dest, content: next, action: local === null ? "create" : "overwrite" });
          }

          if (options.dryRun) {
            for (const p of plan) console.log(chalk.cyan(`  ~ would ${p.action === "create" ? "create" : "update"} ${p.destPath}`));
            pending += plan.length;
            continue;
          }

          let backupId: string | undefined;
          if (toBackup.length > 0) {
            try {
              // The lock entry lets rollback restore the recorded version along with the files.
              backupId = await createBackup(options.cwd, item.id, toBackup, entry);
            } catch (backupErr) {
              console.error(chalk.red(`  ✗ Cannot create required backup for "${item.id}": ${(backupErr as Error).message}`));
              console.error(chalk.red(`    Update aborted to prevent loss of local source.`));
              markFailed();
              continue;
            }
          }

          let writtenFiles: Record<string, string>;
          try {
            ({ writtenFiles } = await executeInstallTransaction(options.cwd, plan));
          } catch (err) {
            console.error(chalk.red(`  ✗ ${item.id}: ${(err as Error).message}`));
            // Files were restored, so the snapshot would make the next rollback a no-op. After a
            // partial restore it holds the only copy of the previous content, so it stays.
            if (backupId && !(err instanceof PartialRollbackError)) {
              const unused = backupId;
              await discardBackup(options.cwd, unused).catch((e: Error) =>
                console.error(chalk.yellow(`  ⚠ Could not remove unused backup ${unused}: ${e.message}`))
              );
            }
            markFailed();
            continue;
          }
          for (const path of Object.keys(writtenFiles)) console.log(chalk.green(`  ✓ Updated ${path}`));
          recordLockEntry(lock, options.cwd, item, { ...unchanged, ...writtenFiles }, {
            registry: registryOf.get(item.id),
            upstream: upstreamHashes(options.cwd, item, config),
          });
          // Persist after every item so a later failure can't leave updated files with stale hashes.
          await writeLock(options.cwd, lock);
        }
      }

      if (options.dryRun) {
        console.log(
          pending > 0
            ? chalk.bold(`\n[Dry Run] ${pending} file(s) would change. Nothing was written.\n`)
            : chalk.bold.green("\n✓ Everything is up to date.\n")
        );
        return;
      }

      // Updated NativeWind components may use newer theme classes (status colors, shape classes),
      // so refresh the installed theme's block. Without an installed theme, global.css is left alone.
      if (config.stylingTarget === "nativewind") {
        const installedTheme = installedThemeId(lock);
        if (installedTheme) await ensureNativeWindTheme(options.cwd, installedTheme, installedStyleId(lock));
      }

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
