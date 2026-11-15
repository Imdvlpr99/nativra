import type { Command } from "commander";
import { readFile } from "node:fs/promises";
import chalk from "chalk";
import { createPatch } from "diff";
import ora from "ora";
import { createClient, parseItemRef } from "../client.js";
import { loadConfig } from "../config.js";
import type { RegistryItem } from "@nativra/registry-schema";
import { destPathFor, filesForTarget, readLock, renderFile } from "../install.js";
import { printable } from "./shared.js";

export function registerDiffCommand(program: Command) {
  program
    .command("diff <item>")
    .description('Compare installed files with the current registry version ("button", or "<registry>/<id>")')
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--registry <url>", "Override registry URL")
    .action(async (id: string, options: { cwd: string; registry?: string }) => {
      const config = await loadConfig(options.cwd).catch((err) => {
        console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
        process.exit(1);
      });

      const client = createClient(config, options.registry, options.cwd);
      const ref = parseItemRef(id);
      // An installed item is compared against the registry it was installed from.
      const registry = id.includes("/") ? ref.registry : ((await readLock(options.cwd).catch(() => null))?.items[ref.id]?.registry ?? "default");

      const spinner = ora(`Fetching registry version of "${printable(id)}"...`).start();
      let item: RegistryItem;
      let related: RegistryItem[];
      try {
        related = await client.resolveWithDependencies(ref.id, registry);
        item = related[related.length - 1]!;
        spinner.stop();
      } catch (err) {
        spinner.fail(chalk.red(`Failed: ${printable((err as Error).message)}`));
        process.exit(1);
      }

      const targetFiles = filesForTarget(item, config);

      let hasDiff = false;

      for (const file of targetFiles) {
        // Shared path resolution (Plan Section 3.3)
        const localPath = destPathFor(options.cwd, item, file, config);

        let localContent: string;
        try {
          localContent = await readFile(localPath, "utf8");
        } catch {
          console.log(chalk.yellow(`\n  Not installed: ${localPath}`));
          hasDiff = true;
          continue;
        }

        // Compare against what `add`/`update` would actually write (aliases rewritten)
        const registryContent = renderFile(options.cwd, item, file, related, config);
        if (localContent === registryContent) {
          console.log(chalk.green(`  ✓ Up to date: ${localPath}`));
          continue;
        }

        hasDiff = true;
        const patch = createPatch(localPath, localContent, registryContent, "installed", "registry");
        const lines = patch.split("\n");
        for (const raw of lines) {
          const line = printable(raw);
          if (line.startsWith("+")) console.log(chalk.green(line));
          else if (line.startsWith("-")) console.log(chalk.red(line));
          else console.log(chalk.gray(line));
        }
      }

      if (!hasDiff) {
        console.log(chalk.bold.green(`\n✓ "${id}" is up to date.\n`));
      }
    });
}

