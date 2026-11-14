import type { Command } from "commander";
import chalk from "chalk";
import prompts from "prompts";
import ora from "ora";
import type { RegistryItem, RegistryManifest } from "@nativra/registry-schema";
import { createClient } from "../client.js";
import { loadConfig } from "../config.js";
import {
  destPathFor,
  fileExists,
  filesForTarget,
  readLock,
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
import {
  TAILWIND_COLORS_SNIPPET,
  applyThemeCss,
  findGlobalCss,
  hasThemeCss,
  tailwindMapsThemeColors,
} from "../theme-css.js";

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
        const conflictMode: "skip" | "overwrite" | "error" | "prompt" = options.overwrite
          ? "overwrite"
          : options.onConflict ?? (options.yes || !process.stdin.isTTY ? "skip" : "prompt");
        const client = createClient(config, options.registry);

        if (!components || components.length === 0) {
          if (!process.stdin.isTTY) {
            console.error(chalk.red("\n✗ No components specified. Usage: npx nativra-cli add <components...>\n"));
            process.exit(1);
          }

          const spinner = ora("Fetching registry items...").start();
          let allItems: RegistryManifest["items"];
          try {
            allItems = await client.listItems();
            spinner.succeed(`Found ${allItems.length} available items`);
          } catch (err) {
            spinner.fail(chalk.red(`Failed to fetch registry items: ${(err as Error).message}`));
            process.exit(1);
          }

          const response = await prompts({
            type: "multiselect",
            name: "selected",
            message: "Select components, blocks, or templates to install:",
            choices: allItems.map((item) => ({
              title: `${item.name} (${chalk.dim(item.type)})`,
              value: item.id,
              description: item.description,
            })),
            hint: "- Space to select. Return to submit",
          });

          if (!response.selected || response.selected.length === 0) {
            console.log(chalk.yellow("\n  No items selected. Exiting.\n"));
            return;
          }

          components = response.selected;
        }

        const lock = await readLock(options.cwd);
        const accumulatedDeps: PackageDependency[] = [];
        const themeIds = new Set<string>();

        for (const componentId of components) {
          console.log(chalk.bold(`\n📦 Resolving ${chalk.cyan(componentId)}...`));

          let items: RegistryItem[];
          const spinner = ora("Fetching from registry...").start();
          try {
            items = await client.resolveWithDependencies(componentId);
            spinner.succeed(`Resolved ${items.length} item(s)`);
          } catch (err) {
            spinner.fail(chalk.red(`Failed to fetch "${componentId}": ${(err as Error).message}`));
            continue;
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
                if (conflictMode === "error") {
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

          // Execute transaction safely with rollback protection
          const { writtenFiles } = await executeInstallTransaction(plan);
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
            recordLockEntry(lock, options.cwd, item, itemWrites);
            if (item.type === "theme") themeIds.add(item.id);

            if (item.npmDependencies && item.npmDependencies.length > 0) {
              accumulatedDeps.push(...item.npmDependencies);
            }
          }
        }

        if (!options.dryRun) {
          await writeLock(options.cwd, lock);

          if (config.stylingTarget === "nativewind" && themeIds.size > 0) {
            await ensureNativeWindTheme(options.cwd, [...themeIds][0]!);
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

          console.log(chalk.bold.green("\n✅ Done!\n"));
        }
      }
    );
}

/**
 * NativeWind components use semantic classes (bg-primary, text-muted-foreground, ...) backed
 * by CSS variables. Make sure the variables exist and tell the user if Tailwind doesn't map them.
 */
async function ensureNativeWindTheme(cwd: string, themeId: string): Promise<void> {
  const css = await findGlobalCss(cwd);
  if (css && !(await hasThemeCss(css))) {
    await applyThemeCss(cwd, themeId);
  }
  if ((await tailwindMapsThemeColors(cwd)) === false) {
    console.log(
      chalk.yellow("\n  ⚠ tailwind.config doesn't map Nativra's theme colors yet. Add this to theme.extend:\n") +
        chalk.gray(TAILWIND_COLORS_SNIPPET.replace(/^/gm, "    "))
    );
  }
}
