import type { Command } from "commander";
import { readFile, readdir, writeFile, rm, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import chalk from "chalk";
import { sha256 } from "@nativra/utils";
import { loadConfig } from "../config.js";
import { assertChildOfRoot, assertNotSymlink, type BackupManifest } from "../install.js";

export function registerRollbackCommand(program: Command) {
  program
    .command("rollback <id>")
    .description("Restore a previously backed up version of an installed component")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .action(async (id: string, options: { cwd: string }) => {
      if (!/^[a-z][a-z0-9-]*$/.test(id)) {
        console.error(chalk.red(`\n✗ Invalid component ID "${id}".\n`));
        process.exit(1);
      }

      const config = await loadConfig(options.cwd).catch((err) => {
        console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
        process.exit(1);
      });

      const backupsRoot = join(options.cwd, ".nativra", "backups");
      const backupDir = assertChildOfRoot(backupsRoot, join(backupsRoot, id), "backup directory");
      const manifestPath = join(backupDir, "manifest.json");

      // 1. Manifest-driven rollback preserving exact project-relative paths (Plan Section 2.3)
      let manifest: BackupManifest | null = null;
      try {
        const manifestRaw = await readFile(manifestPath, "utf8");
        manifest = JSON.parse(manifestRaw) as BackupManifest;
      } catch {
        manifest = null;
      }

      if (manifest) {
        try {
          console.log(chalk.bold(`\n⏪ Rolling back "${id}" using verified backup manifest (${manifest.backupId})...`));

          for (const entry of manifest.files) {
            const targetPath = assertChildOfRoot(
              options.cwd,
              join(options.cwd, entry.projectRelativePath),
              "rollback target path"
            );
            await assertNotSymlink(targetPath);

            if (entry.stateBefore === "present") {
              const backupFile = entry.backupFileName ?? `${entry.projectRelativePath.split("/").pop()}.bak`;
              const safeBackupFile = assertChildOfRoot(
                backupDir,
                join(backupDir, backupFile),
                "backup source file"
              );
              await assertNotSymlink(safeBackupFile);
              const backupContent = await readFile(safeBackupFile, "utf8");
              if (entry.sha256 && sha256(backupContent) !== entry.sha256.toLowerCase()) {
                throw new Error(
                  `Backup integrity check failed for "${entry.projectRelativePath}": SHA-256 mismatch`
                );
              }
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
        } catch (err) {
          console.error(chalk.red(`\n✗ Rollback failed: ${(err as Error).message}\n`));
          process.exit(1);
        }
      }

      // 2. Legacy fallback
      try {
        const files = await readdir(backupDir);
        if (files.length === 0) {
          console.log(chalk.yellow(`\nNo backups found for component "${id}" in ${backupDir}\n`));
          return;
        }

        const componentsRoot = assertChildOfRoot(
          options.cwd,
          join(options.cwd, config.componentsDir),
          "components directory"
        );
        for (const file of files) {
          if (!file.endsWith(".bak")) continue;
          const origName = file.replace(/\.bak$/, "");
          const targetPath = assertChildOfRoot(
            componentsRoot,
            join(componentsRoot, origName),
            "restored component file"
          );
          const safeBackupFile = assertChildOfRoot(backupDir, join(backupDir, file), "backup file");
          await assertNotSymlink(targetPath);
          await assertNotSymlink(safeBackupFile);
          const backupContent = await readFile(safeBackupFile, "utf8");
          await writeFile(targetPath, backupContent, "utf8");
          console.log(chalk.green(`  ✓ Restored ${targetPath} from backup`));
        }

        console.log(chalk.bold.green(`\n✅ Rollback for "${id}" completed.\n`));
      } catch {
        console.log(chalk.yellow(`\nNo backups available for "${id}".\n`));
      }
    });
}

