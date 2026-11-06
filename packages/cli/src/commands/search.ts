import type { Command } from "commander";
import chalk from "chalk";
import { createClient } from "../client.js";
import { loadConfig } from "../config.js";

export function registerSearchCommand(program: Command) {
  program
    .command("search <query>")
    .description("Search registry items by id, name, description or tag")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--registry <url>", "Override registry location")
    .action(async (query: string, options: { cwd: string; registry?: string }) => {
      const config = await loadConfig(options.cwd).catch((err) => {
        console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
        process.exit(1);
      });
      const items = await createClient(config, options.registry).listItems();
      const q = query.toLowerCase();
      const hits = items.filter((i) =>
        [i.id, i.name, i.description, ...(i.tags ?? [])].some((s) => s.toLowerCase().includes(q))
      );
      if (hits.length === 0) {
        console.log(chalk.yellow(`\nNo results for "${query}".\n`));
        return;
      }
      console.log();
      for (const i of hits) {
        console.log(`  ${chalk.cyan(i.id.padEnd(24))} ${chalk.gray(`[${i.type}]`)} ${i.description}`);
      }
      console.log();
    });
}

