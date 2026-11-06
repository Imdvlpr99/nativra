import type { Command } from "commander";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";
import { createPatch } from "diff";
import ora from "ora";
import { createClient } from "../client.js";
import { loadConfig } from "../config.js";

export function registerDiffCommand(program: Command) {
  program
    .command("diff <id>")
    .description("Compare installed files with the current registry version")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--registry <url>", "Override registry URL")
    .action(async (id: string, options: { cwd: string; registry?: string }) => {
      const config = await loadConfig(options.cwd).catch((err) => {
        console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
        process.exit(1);
      });

      const client = createClient(config, options.registry);

      const spinner = ora(`Fetching registry version of "${id}"...`).start();
      let item;
      try {
        item = await client.getItem(id);
        spinner.stop();
      } catch (err) {
        spinner.fail(chalk.red(`Failed: ${(err as Error).message}`));
        process.exit(1);
      }

      const targetFiles = item.files.filter(
        (f) => !f.target || f.target === config.stylingTarget
      );

      let hasDiff = false;

      for (const file of targetFiles) {
        const destDir = item.type === "hook"
          ? join(options.cwd, config.hooksDir)
          : item.type === "utility"
          ? join(options.cwd, config.utilsDir)
          : join(options.cwd, config.componentsDir);

        const localPath = join(destDir, file.path.split("/").pop() ?? file.path);

        let localContent: string;
        try {
          localContent = await readFile(localPath, "utf8");
        } catch {
          console.log(chalk.yellow(`\n  Not installed: ${localPath}`));
          hasDiff = true;
          continue;
        }

        const registryContent = file.content ?? "";
        if (localContent === registryContent) {
          console.log(chalk.green(`  ✓ Up to date: ${localPath}`));
          continue;
        }

        hasDiff = true;
        const patch = createPatch(localPath, localContent, registryContent, "installed", "registry");
        const lines = patch.split("\n");
        for (const line of lines) {
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

