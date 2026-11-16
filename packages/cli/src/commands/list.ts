import type { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { RegistryItemTypeSchema } from "@nativra/registry-schema";
import { createClient } from "../client.js";
import { loadConfigOrDefault } from "../config.js";
import { listAllItems, printable, type ListedItem } from "./shared.js";

export function registerListCommand(program: Command) {
  program
    .command("list")
    .description("List available items in every configured registry")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--type <type>", `Filter by type: ${RegistryItemTypeSchema.options.join(", ")}`)
    .option("--registry <url>", "Override registry URL")
    .option("--json", "Print the items as JSON")
    .action(async (options: { cwd: string; type?: string; registry?: string; json?: boolean }) => {
      const config = await loadConfigOrDefault(options.cwd).catch((err) => {
        console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
        process.exit(1);
      });

      const rawType = options.type?.toLowerCase();
      const targetType = rawType === "primitive" ? "component" : rawType;
      if (targetType !== undefined && !RegistryItemTypeSchema.safeParse(targetType).success) {
        console.error(
          chalk.red(`\n✗ Unknown --type "${options.type}". Use one of: ${RegistryItemTypeSchema.options.join(", ")}.\n`)
        );
        process.exit(1);
      }

      const client = createClient(config, options.registry, options.cwd);
      const spinner = options.json ? null : ora("Fetching registry...").start();
      let items: ListedItem[];
      try {
        items = await listAllItems(client);
        spinner?.succeed(`Fetched ${items.length} items`);
      } catch (err) {
        if (spinner) spinner.fail(chalk.red(`Failed: ${printable((err as Error).message)}`));
        else console.error(printable((err as Error).message));
        process.exit(1);
      }

      const filtered = targetType ? items.filter((i) => i.type === targetType) : items;

      if (options.json) {
        console.log(JSON.stringify(filtered, null, 2));
        return;
      }
      if (filtered.length === 0) {
        console.log(chalk.yellow("\nNo items found.\n"));
        return;
      }

      const grouped = filtered.reduce<Record<string, ListedItem[]>>((acc, item) => {
        (acc[item.type] ??= []).push(item);
        return acc;
      }, {});

      for (const [type, typeItems] of Object.entries(grouped)) {
        console.log(chalk.bold(chalk.blue(`\n${type.toUpperCase()}S`)));
        for (const item of typeItems) {
          const badge = item.status !== "stable" ? chalk.yellow(` [${printable(item.status)}]`) : "";
          console.log(`  ${chalk.cyan(printable(item.ref).padEnd(30))} ${chalk.gray(printable(item.description))}${badge}`);
        }
      }
      console.log();
    });
}
