import type { Command } from "commander";
import { readFile, readdir, writeFile, rm, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import chalk from "chalk";
import { loadConfig } from "../config.js";
import type { BackupManifest } from "../install.js";

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
      const manifestPath = join(backupDir, "manifest.json");

      // 1. Manifest-driven rollback preserving exact project-relative paths (Plan Section 2.3)
      try {
        const manifestRaw = await readFile(manifestPath, "utf8");
        const manifest = JSON.parse(manifestRaw) as BackupManifest;

        console.log(chalk.bold(`\n⏪ Rolling back "${id}" using verified backup manifest (${manifest.backupId})...`));

        for (const entry of manifest.files) {
          const targetPath = join(options.cwd, entry.projectRelativePath);

          if (entry.stateBefore === "present") {
            const backupFile = entry.backupFileName ?? `${entry.projectRelativePath.split("/").pop()}.bak`;
            const backupContent = await readFile(join(backupDir, backupFile), "utf8");
            await mkdir(dirname(targetPath), { recursive: true });
            await writeFile(targetPath, backupContent, "utf8");
            console.log(chalk.green(`  ✓ Restored ${entry.projectRelativePath}`));
          } else {
            // If file was created during the operation, remove it on rollback
            await rm(targetPath, { force: true }).catch(() => {});
            console.log(chalk.yellow(`  - Removed newly created file: ${entry.projectRelativePath}`));
          }
        }

        console.log(chalk.bold.green(`\n✅ Rollback for "${id}" completed successfully.\n`));
        return;
      } catch {
        // Fall back to legacy flat backup restoration
      }

      // 2. Legacy fallback
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

