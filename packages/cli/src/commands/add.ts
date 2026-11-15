import type { Command } from "commander";
import chalk from "chalk";
import prompts from "prompts";
import ora from "ora";
import { compareVersions, parseVersion, type RegistryItem } from "@nativra/registry-schema";
import { createClient, parseItemRef } from "../client.js";
import { loadConfig } from "../config.js";
import { detectProjectEnvironment } from "../detect.js";
import {
  createBackup,
  upstreamHashes,
  discardBackup,
  PartialRollbackError,
  destPathFor,
  fileExists,
  filesForTarget,
  writeLock,
  recordLockEntry,
  executeInstallTransaction,
  renderFile,
  type PlannedInstallFile,
} from "../install.js";
import {
  getMissingDependencies,
  getInstallCommand,
  formatInstallCommand,
  executeDependencyInstall,
  type PackageDependency,
} from "../installer.js";
import { ensureNativeWindTheme, installedThemeId } from "../theme-css.js";
import { listAllItems, markFailed, printable, readLockOrExit, type ListedItem } from "./shared.js";

/**
 * Warnings to show before installing `item`: deprecation, and platform minimums the project
 * doesn't meet (Expo SDK, React Native). Installation still proceeds.
 */
export async function installWarnings(cwd: string, item: RegistryItem): Promise<string[]> {
  const warnings: string[] = [];
  if (item.status === "deprecated") {
    warnings.push(`${item.id} is deprecated${item.deprecationMessage ? `: ${printable(item.deprecationMessage)}` : "."}`);
  }
  const { minExpoSdk, minReactNative } = item.platforms;
  if (!minExpoSdk && !minReactNative) return warnings;
  const env = await detectProjectEnvironment(cwd);
  if (minExpoSdk && env.expoSdkVersion !== undefined && env.expoSdkVersion < minExpoSdk) {
    warnings.push(`${item.id} needs Expo SDK ${minExpoSdk}+; this project uses SDK ${env.expoSdkVersion}.`);
  }
  const installed = env.reactNativeVersion ? parseVersion(env.reactNativeVersion) : null;
  const minimum = minReactNative ? parseVersion(minReactNative) : null;
  if (installed && minimum && compareVersions(installed, minimum) < 0) {
    warnings.push(`${item.id} needs React Native ${printable(minReactNative)}+; this project uses ${env.reactNativeVersion}.`);
  }
  return warnings;
}

export function registerAddCommand(program: Command) {
  program
    .command("add [components...]")
    .description("Add one or more registry items to your project")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--yes", "Skip interactive confirmation prompts. Existing files are preserved unless --overwrite is set.")
    .option("--overwrite", "Overwrite existing files without prompting (equivalent to --on-conflict overwrite)")
    .option("--on-conflict <mode>", "Conflict resolution strategy for existing files: 'skip', 'overwrite', or 'error' (default: prompt, or skip with --yes)")
    .option("--dry-run", "Preview installation plan and dependencies without writing files to disk")
    .option("--registry <url>", "Override registry location (URL or local directory)")
    .option("--install", "Automatically install required npm/peer dependencies via detected package manager or Expo CLI")
    .option("--no-install", "Skip installing npm dependencies (only copy component source files)")
    .action(
      async (
        components: string[] = [],
        options: {
          cwd: string;
          yes?: boolean;
          overwrite?: boolean;
          onConflict?: "skip" | "overwrite" | "error";
          dryRun?: boolean;
          registry?: string;
          install?: boolean;
        }
      ) => {
        const config = await loadConfig(options.cwd).catch((err) => {
          console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
          process.exit(1);
        });
        if (options.onConflict && !["skip", "overwrite", "error"].includes(options.onConflict)) {
          console.error(chalk.red(`\n✗ Invalid --on-conflict value "${options.onConflict}". Use skip, overwrite or error.\n`));
          process.exit(1);
        }
        if (options.overwrite && options.onConflict && options.onConflict !== "overwrite") {
          console.error(chalk.red(`\n✗ --overwrite contradicts --on-conflict ${options.onConflict}. Pass only one of them.\n`));
          process.exit(1);
        }
        const conflictMode: "skip" | "overwrite" | "error" | "prompt" = options.overwrite
          ? "overwrite"
          : options.onConflict ?? (options.yes || !process.stdin.isTTY ? "skip" : "prompt");
        const client = createClient(config, options.registry, options.cwd);

        if (!components || components.length === 0) {
          if (!process.stdin.isTTY) {
            console.error(chalk.red("\n✗ No components specified. Usage: npx nativra-cli add <components...>\n"));
            process.exit(1);
          }

          const spinner = ora("Fetching registry items...").start();
          let allItems: ListedItem[];
          try {
            allItems = await listAllItems(client);
            spinner.succeed(`Found ${allItems.length} available items`);
          } catch (err) {
            spinner.fail(chalk.red(`Failed to fetch registry items: ${printable((err as Error).message)}`));
            process.exit(1);
          }

          const response = await prompts({
            type: "multiselect",
            name: "selected",
            message: "Select components, blocks, or templates to install:",
            choices: allItems.map((item) => ({
              title: `${printable(item.name)} (${chalk.dim(item.ref === item.id ? item.type : `${item.type}, ${item.registry}`)})`,
              value: item.ref,
              description: printable(item.description),
            })),
            hint: "- Space to select. Return to submit",
          });

          if (!response.selected || response.selected.length === 0) {
            console.log(chalk.yellow("\n  No items selected. Exiting.\n"));
            return;
          }

          components = response.selected;
        }

        const lock = await readLockOrExit(options.cwd);
        const accumulatedDeps: PackageDependency[] = [];
        const themeIds = new Set<string>();
        /** Themes that arrived only as dependencies and were skipped because a theme is installed. */
        const keptThemeIds = new Set<string>();

        for (const componentId of components) {
          console.log(chalk.bold(`\n📦 Resolving ${chalk.cyan(componentId)}...`));

          let items: RegistryItem[];
          let requestedId: string;
          const registryOf = new Map<string, string>();
          const spinner = ora("Fetching from registry...").start();
          try {
            const ref = parseItemRef(componentId);
            requestedId = ref.id;
            const resolved = await client.resolveWithSources(ref.id, ref.registry);
            items = resolved.map((r) => r.item);
            for (const r of resolved) registryOf.set(r.item.id, r.registry);
            spinner.succeed(`Resolved ${items.length} item(s)`);
          } catch (err) {
            spinner.fail(chalk.red(`Failed to fetch "${printable(componentId)}": ${printable((err as Error).message)}`));
            markFailed();
            continue;
          }

          for (const item of items) {
            for (const warning of await installWarnings(options.cwd, item)) {
              console.log(chalk.yellow(`  ⚠ ${warning}`));
            }
          }

          console.log(chalk.bold("\nInstallation plan:"));
          for (const item of items) {
            for (const file of filesForTarget(item, config)) {
              console.log(chalk.gray(`  + ${destPathFor(options.cwd, item, file, config)}`));
            }
          }

          if (options.dryRun) {
            console.log(chalk.bold("\nRequired dependencies:"));
            let hasDeps = false;
            for (const item of items) {
              if (item.npmDependencies && item.npmDependencies.length > 0) {
                hasDeps = true;
                const deps = item.npmDependencies.map((d) => `${d.package}@${d.version}`).join(" ");
                console.log(chalk.cyan(`  • ${item.name}: ${deps}`));
              }
            }
            if (!hasDeps) {
              console.log(chalk.gray("  None (zero external dependencies)"));
            }

            console.log(chalk.yellow.bold(`\n🔍 [Dry Run] Simulation complete for "${componentId}". No files were written to disk.\n`));
            continue;
          }

          if (!options.yes) {
            const { confirmed } = await prompts({
              type: "confirm",
              name: "confirmed",
              message: "Proceed with installation?",
              initial: true,
            });
            if (!confirmed) {
              console.log(chalk.yellow("  Skipped.\n"));
              continue;
            }
          }

          // Build transactional installation plan with import alias rewriting
          const plan: PlannedInstallFile[] = [];
          for (const item of items) {
            for (const file of filesForTarget(item, config)) {
              const destPath = destPathFor(options.cwd, item, file, config);
              let action: "create" | "overwrite" | "skip" = "create";

              if (await fileExists(destPath)) {
                // Every theme installs the same theme.ts and components depend on a default one, so
                // a theme that only arrives as a dependency must never replace the installed theme.
                if (item.type === "theme" && item.id !== requestedId) {
                  action = "skip";
                  console.log(chalk.gray(`  → Kept installed theme: ${destPath}`));
                } else if (conflictMode === "error") {
                  console.error(chalk.red(`\n✗ File conflict: "${destPath}" already exists and --on-conflict=error is set.\n`));
                  process.exit(1);
                } else if (conflictMode === "overwrite") {
                  action = "overwrite";
                } else if (conflictMode === "skip") {
                  action = "skip";
                  console.log(chalk.gray(`  → Skipped (existing file): ${destPath}`));
                } else {
                  const { chosen } = await prompts({
                    type: "select",
                    name: "chosen",
                    message: `${chalk.yellow(destPath)} already exists. What should Nativra do?`,
                    choices: [
                      { title: "Skip", value: "skip" },
                      { title: "Overwrite", value: "overwrite" },
                    ],
                  });
                  action = chosen === "overwrite" ? "overwrite" : "skip";
                }
              }

              plan.push({
                componentId: item.id,
                destPath,
                content: renderFile(options.cwd, item, file, items, config),
                action,
              });
            }
          }

          // Overwriting replaces files that may hold local edits: snapshot them first so
          // `nativra rollback <id>` can restore them.
          const overwritesByItem = new Map<string, Array<{ destPath: string; exists: boolean }>>();
          for (const p of plan.filter((p) => p.action === "overwrite")) {
            const list = overwritesByItem.get(p.componentId) ?? [];
            list.push({ destPath: p.destPath, exists: true });
            overwritesByItem.set(p.componentId, list);
          }
          // Snapshots of an operation that never happened would make the next rollback a no-op.
          const backupIds: string[] = [];
          const discardBackups = async () => {
            for (const backupId of backupIds) {
              await discardBackup(options.cwd, backupId).catch((e: Error) =>
                console.error(chalk.yellow(`  ⚠ Could not remove unused backup ${backupId}: ${e.message}`))
              );
            }
          };
          try {
            for (const [itemId, files] of overwritesByItem) {
              backupIds.push(await createBackup(options.cwd, itemId, files, lock.items[itemId]));
            }
          } catch (err) {
            console.error(chalk.red(`  ✗ Could not back up files before overwriting: ${(err as Error).message}. Nothing was written.`));
            await discardBackups();
            markFailed();
            continue;
          }

          // Execute transaction safely with rollback protection
          let writtenFiles: Record<string, string>;
          try {
            ({ writtenFiles } = await executeInstallTransaction(options.cwd, plan));
          } catch (err) {
            console.error(chalk.red(`  ✗ ${(err as Error).message}`));
            // Files were restored, so the snapshots describe nothing to undo. If restoring
            // failed, keep them: they're the only copy of the user's previous content.
            if (!(err instanceof PartialRollbackError)) await discardBackups();
            markFailed();
            continue;
          }
          for (const [path] of Object.entries(writtenFiles)) {
            console.log(chalk.green(`  ✓ Written: ${path}`));
          }

          // Update lockfile metadata only after transaction commits
          for (const item of items) {
            const itemWrites: Record<string, string> = {};
            for (const file of filesForTarget(item, config)) {
              const destPath = destPathFor(options.cwd, item, file, config);
              const hash = writtenFiles[destPath];
              if (hash) itemWrites[destPath] = hash;
            }
            recordLockEntry(lock, options.cwd, item, itemWrites, {
              registry: registryOf.get(item.id),
              upstream: upstreamHashes(options.cwd, item, config),
            });
            if (item.type === "theme") (Object.keys(itemWrites).length > 0 ? themeIds : keptThemeIds).add(item.id);

            if (item.npmDependencies && item.npmDependencies.length > 0) {
              accumulatedDeps.push(...item.npmDependencies);
            }
          }
          // Record each component as soon as its files are on disk, so a later failure in this
          // run can't leave written files untracked.
          await writeLock(options.cwd, lock);
        }

        if (!options.dryRun) {

          // CSS follows the theme actually in theme.ts: one just written, else the installed one.
          const cssTheme = [...themeIds][0] ?? (keptThemeIds.size > 0 ? installedThemeId(lock) ?? [...keptThemeIds][0] : undefined);
          if (config.stylingTarget === "nativewind" && cssTheme) {
            await ensureNativeWindTheme(options.cwd, cssTheme);
          }

          // Handle missing npm dependencies
          if (accumulatedDeps.length > 0) {
            const uniqueDepsMap = new Map<string, PackageDependency>();
            for (const dep of accumulatedDeps) {
              if (!uniqueDepsMap.has(dep.package)) {
                uniqueDepsMap.set(dep.package, dep);
              }
            }
            const missing = await getMissingDependencies(options.cwd, Array.from(uniqueDepsMap.values()));

            if (missing.length > 0) {
              let install;
              try {
                install = await getInstallCommand(options.cwd, missing);
              } catch (err) {
                console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
                process.exit(1);
              }
              const installCmd = formatInstallCommand(install);

              if (options.install === true) {
                await executeDependencyInstall(options.cwd, install);
              } else if (options.install === false) {
                console.log(chalk.yellow(`\n  ⚠ Install required dependencies:\n`) + chalk.cyan(`    ${installCmd}\n`));
              } else if (!options.yes && process.stdin.isTTY) {
                const { doInstall } = await prompts({
                  type: "confirm",
                  name: "doInstall",
                  message: `Install ${missing.length} missing npm package(s) via "${installCmd}"?`,
                  initial: true,
                });
                if (doInstall) {
                  await executeDependencyInstall(options.cwd, install);
                } else {
                  console.log(chalk.yellow(`\n  ⚠ Install dependencies manually:\n`) + chalk.cyan(`    ${installCmd}\n`));
                }
              } else {
                console.log(chalk.yellow(`\n  ⚠ Install dependencies:\n`) + chalk.cyan(`    ${installCmd}\n`));
              }
            }
          }

          console.log(
            process.exitCode ? chalk.bold.red("\n✗ Finished with errors (see above).\n") : chalk.bold.green("\n✅ Done!\n")
          );
        }
      }
    );
}
