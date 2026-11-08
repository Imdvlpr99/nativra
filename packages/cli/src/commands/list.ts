import type { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { createClient } from "../client.js";
import { loadConfig } from "../config.js";

export function registerListCommand(program: Command) {
  program
    .command("list")
    .description("List available items in the configured registry")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--type <type>", "Filter by type: component, hook, utility, block, template, theme")
    .option("--registry <url>", "Override registry URL")
    .action(async (options: { cwd: string; type?: string; registry?: string }) => {
      const config = await loadConfig(options.cwd).catch((err) => {
        console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
        process.exit(1);
      });

      const client = createClient(config, options.registry);

      const spinner = ora("Fetching registry...").start();
      let items;
      try {
        items = await client.listItems();
        spinner.succeed(`Fetched ${items.length} items`);
      } catch (err) {
        spinner.fail(chalk.red(`Failed: ${(err as Error).message}`));
        process.exit(1);
      }

      const targetType =
        options.type === "primitive"
          ? "component"
          : options.type?.toLowerCase();

      const filtered = targetType
        ? items.filter((i) => i.type.toLowerCase() === targetType)
        : items;

      if (filtered.length === 0) {
        console.log(chalk.yellow("\nNo items found.\n"));
        return;
      }

      console.log();
      const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, item) => {
        if (!acc[item.type]) acc[item.type] = [];
        acc[item.type]!.push(item);
        return acc;
      }, {});

      for (const [type, typeItems] of Object.entries(grouped)) {
        console.log(chalk.bold(chalk.blue(`\n${type.toUpperCase()}S`)));
        for (const item of typeItems) {
          const badge = item.status !== "stable" ? chalk.yellow(` [${item.status}]`) : "";
          console.log(
            `  ${chalk.cyan(item.id.padEnd(30))} ${chalk.gray(item.description)}${badge}`
          );
        }
      }
      console.log();
    });
}

