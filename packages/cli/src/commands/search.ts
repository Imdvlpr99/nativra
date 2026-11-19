import type { Command } from "commander";
import chalk from "chalk";
import { createClient } from "../client.js";
import { loadConfigOrDefault } from "../config.js";
import { listAllItems, printable } from "./shared.js";

export function registerSearchCommand(program: Command) {
  program
    .command("search <query>")
    .description("Search every configured registry by id, name, description or tag")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--registry <url>", "Override registry location")
    .option("--json", "Print the matches as JSON")
    .action(async (query: string, options: { cwd: string; registry?: string; json?: boolean }) => {
      const config = await loadConfigOrDefault(options.cwd).catch((err) => {
        console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
        process.exit(1);
      });
      const items = await listAllItems(createClient(config, options.registry, options.cwd));
      const q = query.toLowerCase();
      const hits = items.filter((i) =>
        [i.id, i.name, i.description, ...(i.tags ?? [])].some((s) => s.toLowerCase().includes(q))
      );
      if (options.json) {
        console.log(JSON.stringify(hits, null, 2));
        return;
      }
      if (hits.length === 0) {
        console.log(chalk.yellow(`\nNo results for "${printable(query)}".\n`));
        return;
      }
      console.log();
      for (const i of hits) {
        // Stable is the norm; anything else is worth seeing before installing.
        const badge = i.status && i.status !== "stable" ? `${(i.status === "deprecated" ? chalk.red : chalk.yellow)(`[${printable(i.status)}]`)} ` : "";
        console.log(`  ${chalk.cyan(printable(i.ref).padEnd(24))} ${badge}${chalk.gray(`[${printable(i.type)}]`)} ${printable(i.description)}`);
      }
      console.log();
    });
}
