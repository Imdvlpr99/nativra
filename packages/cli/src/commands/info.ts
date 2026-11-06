import type { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { createClient } from "../client.js";
import { loadConfig } from "../config.js";

export function registerInfoCommand(program: Command) {
  program
    .command("info <id>")
    .description("Show detailed metadata about a registry item")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--registry <url>", "Override registry URL")
    .action(async (id: string, options: { cwd: string; registry?: string }) => {
      const config = await loadConfig(options.cwd).catch((err) => {
        console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
        process.exit(1);
      });

      const client = createClient(config, options.registry);

      const spinner = ora(`Fetching info for "${id}"...`).start();
      try {
        const item = await client.getItem(id);
        spinner.stop();

        console.log(chalk.bold(`\n${item.name}`) + chalk.gray(` v${item.version}`));
        console.log(chalk.gray(item.description));
        console.log();
        console.log(`  ${chalk.bold("Type:")}           ${item.type}`);
        console.log(`  ${chalk.bold("Status:")}         ${item.status}`);
        console.log(`  ${chalk.bold("Styling targets:")} ${item.stylingTargets.join(", ")}`);
        console.log(`  ${chalk.bold("Platforms:")}      Android: ${item.platforms.android ? "✓" : "✗"} | iOS: ${item.platforms.ios ? "✓" : "✗"}${item.platforms.web ? ` | Web: ${item.platforms.web ? "✓" : "✗"}` : ""}`);

        if (item.registryDependencies?.length) {
          console.log(`\n  ${chalk.bold("Registry deps:")}`);
          for (const dep of item.registryDependencies) {
            console.log(`    - ${dep.id} (from ${dep.registry ?? "default"})`);
          }
        }

        if (item.npmDependencies?.length) {
          console.log(`\n  ${chalk.bold("npm deps:")}`);
          for (const dep of item.npmDependencies) {
            console.log(`    - ${dep.package}@${dep.version}${dep.peer ? " (peer)" : ""}`);
          }
        }

        console.log(`\n  ${chalk.bold("Files:")}`);
        for (const file of item.files) {
          console.log(`    ${chalk.cyan(file.path)}${file.target ? chalk.gray(` [${file.target}]`) : ""}`);
        }

        console.log(
          `\n  ${chalk.bold("Install:")} ${chalk.cyan(`nativra add ${item.id}`)}\n`
        );
      } catch (err) {
        spinner.fail(chalk.red(`Failed: ${(err as Error).message}`));
        process.exit(1);
      }
    });
}

