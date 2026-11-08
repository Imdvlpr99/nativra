import type { Command } from "commander";
import chalk from "chalk";
import prompts from "prompts";
import ora from "ora";
import type { RegistryItem } from "@nativra/registry-schema";
import { createClient } from "../client.js";
import { loadConfig } from "../config.js";
import {
  destPathFor,
  fileExists,
  filesForTarget,
  readLock,
  writeLock,
  executeInstallTransaction,
  type PlannedInstallFile,
} from "../install.js";

export function registerAddCommand(program: Command) {
  program
    .command("add [components...]")
    .description("Add one or more registry items to your project")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--yes", "Skip interactive confirmation prompts. Existing files are preserved unless --overwrite is set.")
    .option("--overwrite", "Overwrite existing files without prompting (equivalent to --on-conflict overwrite)")
    .option("--on-conflict <mode>", "Conflict resolution strategy for existing files: 'skip', 'overwrite', or 'error'", "skip")
    .option("--dry-run", "Preview installation plan and dependencies without writing files to disk")
    .option("--registry <url>", "Override registry location (URL or local directory)")
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
        }
      ) => {
        const config = await loadConfig(options.cwd).catch((err) => {
          console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
          process.exit(1);
        });
        const client = createClient(config, options.registry);

        if (!components || components.length === 0) {
          if (!process.stdin.isTTY) {
            console.error(chalk.red("\n✗ No components specified. Usage: npx nativra add <components...>\n"));
            process.exit(1);
          }

          const spinner = ora("Fetching available items from registry...").start();
          let availableItems: { id: string; name: string; type: string; description: string }[] = [];
          try {
            const manifest = await client.getManifest();
            availableItems = manifest.items;
            spinner.succeed(`Found ${availableItems.length} registry items`);
          } catch (err) {
            spinner.fail(chalk.red(`Failed to fetch registry items: ${(err as Error).message}`));
            process.exit(1);
          }

          const response = await prompts({
            type: "autocompleteMultiselect",
            name: "selected",
            message: "Select components, blocks, or templates to install:",
            choices: availableItems.map((item) => ({
              title: `${item.name} (${item.type})`,
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

          // Build transactional installation plan (Plan Section 2.1)
          const plan: PlannedInstallFile[] = [];
          for (const item of items) {
            for (const file of filesForTarget(item, config)) {
              const destPath = destPathFor(options.cwd, item, file, config);
              let action: "create" | "overwrite" | "skip" = "create";

              if (await fileExists(destPath)) {
                if (options.overwrite || options.onConflict === "overwrite") {
                  action = "overwrite";
                } else if (options.yes || options.onConflict === "error") {
                  if (options.onConflict === "error") {
                    console.error(chalk.red(`\n✗ File conflict: "${destPath}" already exists and --on-conflict=error is set.\n`));
                    process.exit(1);
                  }
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
                content: file.content ?? "",
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
            const entry = lock.items[item.id] ?? {
              version: item.version,
              files: {} as Record<string, string>,
            };
            for (const file of filesForTarget(item, config)) {
              const destPath = destPathFor(options.cwd, item, file, config);
              if (writtenFiles[destPath]) {
                entry.files[destPath] = writtenFiles[destPath];
              }
            }
            if (Object.keys(entry.files).length > 0) {
              lock.items[item.id] = entry;
            }

            if (item.npmDependencies && item.npmDependencies.length > 0) {
              const deps = item.npmDependencies.map((d) => `${d.package}@${d.version}`).join(" ");
              console.log(
                chalk.yellow(`\n  ⚠ Install dependencies:\n`) + chalk.cyan(`    npx expo install ${deps}`)
              );
            }
          }
        }

        if (!options.dryRun) {
          await writeLock(options.cwd, lock);
          console.log(chalk.bold.green("\n✅ Done!\n"));
        }
      }
    );
}
