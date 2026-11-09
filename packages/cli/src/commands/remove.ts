import type { Command } from "commander";
import { rm, readFile, readdir } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import chalk from "chalk";
import prompts from "prompts";
import { sha256 } from "@nativra/utils";
import { loadConfig } from "../config.js";
import { assertNotSymlink, fileExists, readLock, resolveLockFilePath, writeLock } from "../install.js";

async function pruneEmptyDir(dir: string, stopAt: string): Promise<void> {
  try {
    const resolvedDir = resolve(dir);
    const resolvedStop = resolve(stopAt);
    if (resolvedDir === resolvedStop || !resolvedDir.startsWith(resolvedStop + sep)) return;
    const entries = await readdir(resolvedDir);
    if (entries.length === 0) {
      await rm(resolvedDir, { recursive: true, force: true }).catch(() => {});
      await pruneEmptyDir(dirname(resolvedDir), resolvedStop);
    }
  } catch {
    // Ignore cleanup errors
  }
}

export function registerRemoveCommand(program: Command) {
  program
    .command("remove <components...>")
    .description("Safely remove one or more installed components from your project")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--yes", "Skip interactive confirmation prompts")
    .option("--force", "Force removal even if local modifications are detected")
    .action(
      async (
        components: string[],
        options: {
          cwd: string;
          yes?: boolean;
          force?: boolean;
        }
      ) => {
        await loadConfig(options.cwd).catch((err) => {
          console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
          process.exit(1);
        });

        const lock = await readLock(options.cwd);

        if (Object.keys(lock.items).length === 0) {
          console.log(chalk.yellow("\n⚠ No installed components found in nativra.lock.json.\n"));
          return;
        }

        let anyRemoved = false;

        for (const componentId of components) {
          console.log(chalk.bold(`\n🗑️  Inspecting ${chalk.cyan(componentId)}...`));

          const lockEntry = lock.items[componentId];
          if (!lockEntry) {
            console.warn(
              chalk.yellow(`  ⚠ "${componentId}" is not registered in nativra.lock.json. Skipping.`)
            );
            continue;
          }

          const filePaths = Object.keys(lockEntry.files);
          if (filePaths.length === 0) {
            console.warn(chalk.yellow(`  ⚠ No tracked files found for "${componentId}".`));
            delete lock.items[componentId];
            anyRemoved = true;
            continue;
          }

          // Resolve and validate all tracked file paths within cwd before touching disk
          const resolvedEntries: Array<{ filePath: string; expectedHash: string }> = [];
          try {
            for (const [fileKey, expectedHash] of Object.entries(lockEntry.files)) {
              const safePath = resolveLockFilePath(options.cwd, fileKey);
              await assertNotSymlink(safePath);
              resolvedEntries.push({ filePath: safePath, expectedHash });
            }
          } catch (err) {
            console.error(
              chalk.red(`\n✗ Security check failed for "${componentId}": ${(err as Error).message}\n`)
            );
            process.exit(1);
          }

          // Check for local modifications
          const modifiedFiles: string[] = [];
          for (const { filePath, expectedHash } of resolvedEntries) {
            if (await fileExists(filePath)) {
              try {
                const currentContent = await readFile(filePath, "utf8");
                const currentHash = sha256(currentContent);
                if (currentHash !== expectedHash) {
                  modifiedFiles.push(filePath);
                }
              } catch {
                // Ignore read errors
              }
            }
          }

          if (modifiedFiles.length > 0 && !options.force) {
            console.log(
              chalk.yellow(`\n  ⚠ Local modifications detected in ${modifiedFiles.length} file(s):`)
            );
            for (const f of modifiedFiles) {
              console.log(chalk.yellow(`    • ${f}`));
            }

            if (options.yes) {
              console.error(
                chalk.red(
                  `\n✗ Cannot remove modified files without --force when running non-interactively (--yes).\n`
                )
              );
              process.exit(1);
            }

            const { proceedWithModified } = await prompts({
              type: "confirm",
              name: "proceedWithModified",
              message: "Delete modified files anyway?",
              initial: false,
            });

            if (!proceedWithModified) {
              console.log(chalk.gray(`  Skipped removal of "${componentId}".\n`));
              continue;
            }
          }

          if (!options.yes && modifiedFiles.length === 0) {
            const { confirmed } = await prompts({
              type: "confirm",
              name: "confirmed",
              message: `Remove "${componentId}" and its ${resolvedEntries.length} tracked file(s)?`,
              initial: true,
            });
            if (!confirmed) {
              console.log(chalk.gray(`  Skipped removal of "${componentId}".\n`));
              continue;
            }
          }

          // Delete tracked files
          for (const { filePath } of resolvedEntries) {
            if (await fileExists(filePath)) {
              await assertNotSymlink(filePath);
              await rm(filePath, { force: true });
              console.log(chalk.red(`  - Deleted: ${filePath}`));
              await pruneEmptyDir(dirname(filePath), options.cwd);
            } else {
              console.log(chalk.gray(`  • Already absent: ${filePath}`));
            }
          }

          delete lock.items[componentId];
          anyRemoved = true;
          console.log(chalk.green(`  ✓ Removed "${componentId}" successfully.`));
        }

        if (anyRemoved) {
          await writeLock(options.cwd, lock);
          console.log(chalk.bold.green("\n✅ Updated nativra.lock.json successfully.\n"));
        }
      }
    );
}

