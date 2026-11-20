import type { Command } from "commander";
import { readFile, rm } from "node:fs/promises";
import chalk from "chalk";
import type { RegistryItem } from "@nativra/registry-schema";
import { createClient, formatItemRef, parseItemRef } from "../client.js";
import { loadConfig, type NativraConfig } from "../config.js";
import {
  assertSafeWriteTarget,
  contentHash,
  createBackup,
  sameContent,
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
  registryClash,
  resolveLockFilePath,
  type LockEntry,
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

interface DroppedFile {
  /** The key as recorded in the lock entry (legacy entries may hold absolute paths) */
  key: string;
  path: string;
  exists: boolean;
  /** Changed since Nativra wrote it */
  edited: boolean;
}

/**
 * Tracked files of an installed item that its registry version no longer ships. Themes and styles
 * are skipped: `theme add --as` records extra files under the theme's id on purpose.
 */
async function droppedFiles(cwd: string, item: RegistryItem, entry: LockEntry, config: NativraConfig): Promise<DroppedFile[]> {
  if (item.type === "theme" || item.type === "style") return [];
  const shipped = new Set(filesForTarget(item, config).map((f) => toLockKey(cwd, destPathFor(cwd, item, f, config))));
  const dropped: DroppedFile[] = [];
  for (const [key, hash] of Object.entries(entry.files)) {
    let path: string;
    try {
      path = resolveLockFilePath(cwd, key);
    } catch {
      continue; // an unsafe entry is never touched; `remove` reports it
    }
    if (shipped.has(toLockKey(cwd, path))) continue;
    const local = await readFile(path, "utf8").catch(() => null);
    dropped.push({ key, path, exists: local !== null, edited: local !== null && contentHash(local) !== hash });
  }
  return dropped;
}

export function registerUpdateCommand(program: Command) {
  program
    .command("update [ids...]")
    .description("Update installed items; files you modified locally are never overwritten unless --force")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--registry <url>", "Override registry location")
    .option("--force", "Overwrite locally modified files")
    .option("--dry-run", "Show what would change without writing anything")
    .option("--check", "Like --dry-run, but exit with code 1 if anything is out of date (for CI)")
    .action(async (ids: string[], options: { cwd: string; registry?: string; force?: boolean; dryRun?: boolean; check?: boolean }) => {
      if (options.check) options.dryRun = true;
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
      /** Files with a registry change that local edits or an untracked file keep from applying. */
      let blocked = 0;

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
          const clash = options.registry ? undefined : registryClash(resolved, lock);
          if (clash) throw new Error(clash);
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
            // content was tampered with. Either way, review before trusting it. A file that already
            // matches what the registry renders has nothing left to review.
            const recordedUpstream = entry?.upstream?.[key];
            const upToDate = local !== null && sameContent(local, next);
            if (!upToDate && entry?.version === item.version && recordedUpstream && file.hash && recordedUpstream !== file.hash.toLowerCase()) {
              console.log(
                chalk.yellow(`  ⚠ ${printable(dest)}: the registry changed this file without bumping ${item.id} past ${item.version}. Review it with 'nativra diff ${item.id}'.`)
              );
            }

            if (upToDate) {
              console.log(chalk.gray(`  = ${printable(dest)} (up to date)`));
              unchanged[dest] = contentHash(next);
              continue;
            }
            if (local !== null && isNewDependency) {
              console.log(chalk.yellow(`  ! ${printable(dest)} already exists and is not tracked — skipped`));
              blocked++;
              continue;
            }
            const locallyModified = local !== null && contentHash(local) !== recordedHash;
            if (locallyModified && !options.force) {
              if (recordedHash !== undefined && contentHash(next) === recordedHash) {
                // The registry still renders what was installed: the only difference is the user's edit.
                console.log(chalk.gray(`  = ${printable(dest)} (your edits; no registry changes)`));
                continue;
              }
              console.log(chalk.yellow(`  ! ${printable(dest)} has local changes — skipped (use --force, or 'nativra diff ${item.id}')`));
              blocked++;
              continue;
            }
            // Created files are recorded too (as absent before), so rollback removes them.
            toBackup.push({ destPath: dest, exists: local !== null });
            plan.push({ componentId: item.id, destPath: dest, content: next, action: local === null ? "create" : "overwrite" });
          }

          // Files the installed version had that this version no longer ships.
          const dropped = entry ? await droppedFiles(options.cwd, item, entry, config) : [];

          if (options.dryRun) {
            for (const p of plan) console.log(chalk.cyan(`  ~ would ${p.action === "create" ? "create" : "update"} ${printable(p.destPath)}`));
            // A dropped file that is already gone only leaves a stale lock key; nothing to review.
            const present = dropped.filter((d) => d.exists);
            for (const d of present) {
              console.log(
                chalk.cyan(
                  d.edited
                    ? `  ~ would stop tracking ${printable(d.path)} (no longer part of ${item.id}; your edits are kept)`
                    : `  ~ would remove ${printable(d.path)} (no longer part of ${item.id})`
                )
              );
            }
            pending += plan.length + present.length;
            continue;
          }
          // Unedited dropped files are removed after the update, so they are backed up with it.
          for (const d of dropped) if (d.exists && !d.edited) toBackup.push({ destPath: d.path, exists: true });

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
          for (const path of Object.keys(writtenFiles)) console.log(chalk.green(`  ✓ Updated ${printable(path)}`));
          for (const d of dropped) {
            if (d.edited) {
              console.log(chalk.yellow(`  ! ${printable(d.path)} is no longer part of ${item.id}; kept with your edits and no longer tracked`));
            } else if (d.exists) {
              try {
                await assertSafeWriteTarget(options.cwd, d.path);
                await rm(d.path, { force: true });
                console.log(chalk.green(`  - Removed ${printable(d.path)} (no longer part of ${item.id})`));
              } catch (err) {
                console.error(chalk.yellow(`  ⚠ Could not remove ${printable(d.path)}: ${(err as Error).message}`));
                // Still on disk: keep tracking it so a later `update` or `remove` can clean it up.
                continue;
              }
            }
            delete entry?.files[d.key];
            if (entry?.upstream) delete entry.upstream[d.key];
          }
          recordLockEntry(lock, options.cwd, item, { ...unchanged, ...writtenFiles }, {
            registry: registryOf.get(item.id),
            upstream: upstreamHashes(options.cwd, item, config),
          });
          if (entry && Object.keys(entry.files).length === 0) delete lock.items[item.id];
          // Persist after every item so a later failure can't leave updated files with stale hashes.
          await writeLock(options.cwd, lock);
        }
      }

      if (options.dryRun) {
        console.log(
          pending > 0
            ? chalk.bold(`\n[Dry Run] ${pending} file(s) would change. Nothing was written.\n`)
            : blocked > 0
              ? chalk.bold.yellow(`\n[Dry Run] Nothing would change; ${blocked} file(s) with registry changes were skipped (see above).\n`)
              : chalk.bold.green("\n✓ Everything is up to date.\n")
        );
        // --check: CI fails while anything is out of date, including updates blocked by local edits.
        if (options.check && pending + blocked > 0) process.exitCode = 1;
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
