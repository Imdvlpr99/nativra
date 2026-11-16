import type { Command } from "commander";
import { rm, readFile, readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import chalk from "chalk";
import prompts from "prompts";
import { loadConfig, type NativraConfig } from "../config.js";
import { assertSafeWriteTarget, contentHash, createBackup, fileExists, findDependents, isStrictlyInside, resolveLockFilePath, writeLock } from "../install.js";
import { themeSlotDependents } from "../theme-css.js";
import { markFailed, readLockOrExit } from "./shared.js";

/** The install folders nativra.json names: emptied by a remove, but never deleted. */
function configuredDirs(cwd: string, config: NativraConfig): Set<string> {
  const dirs = [config.componentsDir, config.blocksDir, config.hooksDir, config.utilsDir.replace(/\.(ts|js|tsx)$/, ""), config.themesDir];
  return new Set(dirs.filter((d): d is string => !!d).map((d) => resolve(cwd, d)));
}

async function pruneEmptyDir(dir: string, stopAt: string, keep: ReadonlySet<string>): Promise<void> {
  try {
    const resolvedDir = resolve(dir);
    const resolvedStop = resolve(stopAt);
    if (resolvedDir === resolvedStop || keep.has(resolvedDir) || !isStrictlyInside(resolvedStop, resolvedDir)) return;
    const entries = await readdir(resolvedDir);
    if (entries.length === 0) {
      await rm(resolvedDir, { recursive: true, force: true });
      await pruneEmptyDir(dirname(resolvedDir), resolvedStop, keep);
    }
  } catch (err) {
    // Cleanup only: the files are already removed, so a folder that can't go stays.
    console.warn(chalk.gray(`  • Left folder ${dir} in place: ${(err as Error).message}`));
  }
}

export function registerRemoveCommand(program: Command) {
  program
    .command("remove <components...>")
    .description("Safely remove one or more installed components from your project")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--yes", "Skip interactive confirmation prompts")
    .option("--force", "Force removal even if local modifications or dependent items are detected")
    .action(
      async (
        components: string[],
        options: {
          cwd: string;
          yes?: boolean;
          force?: boolean;
        }
      ) => {
        const config = await loadConfig(options.cwd).catch((err) => {
          console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
          process.exit(1);
        });
        const keepDirs = configuredDirs(options.cwd, config);

        const lock = await readLockOrExit(options.cwd);

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
            markFailed();
            continue;
          }

          const dependents = [
            ...new Set([...findDependents(lock, componentId), ...themeSlotDependents(lock, componentId)]),
          ].filter((d) => !components.includes(d));
          if (dependents.length > 0 && !options.force) {
            console.log(
              chalk.yellow(`  ⚠ Still required by installed item(s): ${dependents.join(", ")}`)
            );
            if (options.yes) {
              console.error(
                chalk.red(`\n✗ Refusing to remove "${componentId}" while other items depend on it. Use --force to override.\n`)
              );
              process.exit(1);
            }
            const { proceedWithDependents } = await prompts({
              type: "confirm",
              name: "proceedWithDependents",
              message: `Removing "${componentId}" will break ${dependents.join(", ")}. Continue?`,
              initial: false,
            });
            if (!proceedWithDependents) {
              console.log(chalk.gray(`  Skipped removal of "${componentId}".\n`));
              continue;
            }
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
              await assertSafeWriteTarget(options.cwd, safePath);
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
                const currentHash = contentHash(currentContent);
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

          // Back up everything first: `nativra rollback <id>` restores the files and their tracking.
          const present: Array<{ destPath: string; exists: boolean }> = [];
          for (const { filePath } of resolvedEntries) {
            if (await fileExists(filePath)) present.push({ destPath: filePath, exists: true });
          }
          if (present.length > 0) {
            try {
              await createBackup(options.cwd, componentId, present, lockEntry);
            } catch (err) {
              console.error(chalk.red(`  ✗ Could not back up "${componentId}" before removing it: ${(err as Error).message}`));
              markFailed();
              continue;
            }
          }

          // Delete tracked files
          for (const { filePath } of resolvedEntries) {
            if (await fileExists(filePath)) {
              await assertSafeWriteTarget(options.cwd, filePath);
              await rm(filePath, { force: true });
              console.log(chalk.red(`  - Deleted: ${filePath}`));
              await pruneEmptyDir(dirname(filePath), options.cwd, keepDirs);
            } else {
              console.log(chalk.gray(`  • Already absent: ${filePath}`));
            }
          }

          delete lock.items[componentId];
          anyRemoved = true;
          // Persist per item so a later failure can't leave deleted files in the lockfile.
          await writeLock(options.cwd, lock);
          console.log(chalk.green(`  ✓ Removed "${componentId}" successfully. Undo with: nativra rollback ${componentId}`));
        }

        if (anyRemoved) {
          await writeLock(options.cwd, lock);
          console.log(chalk.bold.green("\n✅ Updated nativra.lock.json successfully.\n"));
        }
      }
    );
}

