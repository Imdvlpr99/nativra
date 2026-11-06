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
  writeInstalledFile,
  writeLock,
} from "../install.js";

export function registerAddCommand(program: Command) {
  program
    .command("add <components...>")
    .description("Add one or more registry items to your project")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--yes", "Skip confirmation prompts")
    .option("--overwrite", "Overwrite existing files without prompting")
    .option("--registry <url>", "Override registry location (URL or local directory)")
    .action(
      async (
        components: string[],
        options: { cwd: string; yes?: boolean; overwrite?: boolean; registry?: string }
      ) => {
        const config = await loadConfig(options.cwd).catch((err) => {
          console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
          process.exit(1);
        });
        const client = createClient(config, options.registry);
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

          for (const item of items) {
            const entry = { version: item.version, files: {} as Record<string, string> };

            for (const file of filesForTarget(item, config)) {
              const destPath = destPathFor(options.cwd, item, file, config);

              // Never silently overwrite. Non-interactive (--yes) runs skip conflicts.
              if (!options.overwrite && (await fileExists(destPath))) {
                let action = "skip";
                if (!options.yes) {
                  ({ action } = await prompts({
                    type: "select",
                    name: "action",
                    message: `${chalk.yellow(destPath)} already exists. What should Nativra do?`,
                    choices: [
                      { title: "Skip", value: "skip" },
                      { title: "Overwrite", value: "overwrite" },
                    ],
                  }));
                }
                if (action !== "overwrite") {
                  console.log(chalk.gray(`  → Skipped: ${destPath}`));
                  continue;
                }
              }

              entry.files[destPath] = await writeInstalledFile(destPath, file.content ?? "");
              console.log(chalk.green(`  ✓ Written: ${destPath}`));
            }

            if (Object.keys(entry.files).length > 0) lock.items[item.id] = entry;

            if (item.npmDependencies && item.npmDependencies.length > 0) {
              const deps = item.npmDependencies.map((d) => `${d.package}@${d.version}`).join(" ");
              console.log(
                chalk.yellow(`\n  ⚠ Install dependencies:\n`) + chalk.cyan(`    npx expo install ${deps}`)
              );
            }
          }
        }

        await writeLock(options.cwd, lock);
        console.log(chalk.bold.green("\n✅ Done!\n"));
      }
    );
}
