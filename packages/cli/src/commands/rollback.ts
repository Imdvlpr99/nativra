import type { Command } from "commander";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";
import { loadConfig } from "../config.js";

export function registerRollbackCommand(program: Command) {
  program
    .command("rollback <id>")
    .description("Restore a previously backed up version of an installed component")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .action(async (id: string, options: { cwd: string }) => {
      const config = await loadConfig(options.cwd).catch((err) => {
        console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
        process.exit(1);
      });

      const backupDir = join(options.cwd, ".nativra", "backups", id);
      try {
        const files = await readdir(backupDir);
        if (files.length === 0) {
          console.log(chalk.yellow(`\nNo backups found for component "${id}" in ${backupDir}\n`));
          return;
        }

        for (const file of files) {
          if (!file.endsWith(".bak")) continue;
          const origName = file.replace(/\.bak$/, "");
          const targetPath = join(options.cwd, config.componentsDir, origName);
          const backupContent = await readFile(join(backupDir, file), "utf8");
          await writeFile(targetPath, backupContent, "utf8");
          console.log(chalk.green(`  ✓ Restored ${targetPath} from backup`));
        }

        console.log(chalk.bold.green(`\n✅ Rollback for "${id}" completed.\n`));
      } catch {
        console.log(chalk.yellow(`\nNo backups available for "${id}".\n`));
      }
    });
}

