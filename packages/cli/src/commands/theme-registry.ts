import type { Command } from "commander";
import { join } from "node:path";
import chalk from "chalk";
import prompts from "prompts";
import { createClient, toSource } from "../client.js";
import { loadConfig, saveConfig } from "../config.js";
import {
  assertSafeWriteTarget,
  createBackup,
  destPathFor,
  resolveDestDir,
  fileExists,
  filesForTarget,
  recordLockEntry,
  writeInstalledFile,
  writeLock,
} from "../install.js";
import { transformFileImports } from "../transform.js";
import { applyThemeCss } from "../theme-css.js";
import { readLockOrExit } from "./shared.js";

async function requireConfig(cwd: string) {
  return loadConfig(cwd).catch((err) => {
    console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
    process.exit(1);
  });
}

export function registerThemeCommand(program: Command) {
  const theme = program.command("theme").description("Manage themes");

  theme
    .command("list")
    .description("List available themes")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--registry <url>", "Override registry location")
    .action(async (options: { cwd: string; registry?: string }) => {
      const config = await requireConfig(options.cwd);
      const items = (await createClient(config, options.registry).listItems()).filter((i) => i.type === "theme");
      if (items.length === 0) console.log(chalk.yellow("\nNo themes found.\n"));
      for (const i of items) console.log(`  ${chalk.cyan(i.id.padEnd(24))} ${i.description}`);
    });

  theme
    .command("add <id>")
    .description("Add a theme/token file to your project")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--registry <url>", "Override registry location")
    .option("--as <name>", "Install theme under a custom file name (e.g. --as midnight installs <themesDir>/midnight.ts)")
    .option("--overwrite", "Overwrite an existing theme file (a backup is created first)")
    .option("--apply-css", "Automatically wire and inject theme CSS variables into global.css")
    .action(
      async (
        id: string,
        options: { cwd: string; registry?: string; as?: string; overwrite?: boolean; applyCss?: boolean }
      ) => {
        const config = await requireConfig(options.cwd);
        let item;
        try {
          item = await createClient(config, options.registry).getItem(id);
        } catch (err) {
          console.error(chalk.red(`\n✗ Could not load theme "${id}": ${(err as Error).message}\n`));
          process.exit(1);
        }
        if (item.type !== "theme") {
          console.error(chalk.red(`\n✗ "${id}" is a ${item.type}, not a theme.\n`));
          process.exit(1);
        }

        let customName: string | undefined;
        if (options.as !== undefined) {
          customName = options.as.replace(/\.ts$/, "");
          if (!/^[a-zA-Z0-9_-]+$/.test(customName)) {
            console.error(chalk.red(`\n✗ Invalid --as name "${options.as}". Use letters, numbers, "-" or "_".\n`));
            process.exit(1);
          }
        }

        const lock = await readLockOrExit(options.cwd);
        const writes: Record<string, string> = {};
        for (const file of filesForTarget(item, config)) {
          const dest = customName
            ? join(resolveDestDir(options.cwd, item, config), `${customName}.ts`)
            : destPathFor(options.cwd, item, file, config);

          if (await fileExists(dest)) {
            let overwrite = Boolean(options.overwrite);
            if (!overwrite && process.stdin.isTTY) {
              ({ overwrite } = await prompts({
                type: "confirm",
                name: "overwrite",
                message: `${dest} already exists. Overwrite it (a backup is kept)?`,
                initial: false,
              }));
            }
            if (!overwrite) {
              console.log(chalk.yellow(`  → Skipped (existing file): ${dest}. Use --overwrite or --as <name>.`));
              continue;
            }
            try {
              await createBackup(options.cwd, id, [{ destPath: dest, exists: true }]);
            } catch (err) {
              console.error(chalk.red(`\n✗ Could not back up ${dest}: ${(err as Error).message}. Nothing was written.\n`));
              process.exit(1);
            }
          }
          try {
            await assertSafeWriteTarget(options.cwd, dest);
          } catch (err) {
            console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
            process.exit(1);
          }
          writes[dest] = await writeInstalledFile(dest, transformFileImports(file.content ?? "", config));
          console.log(chalk.green(`  ✓ Written: ${dest}`));
        }
        recordLockEntry(lock, options.cwd, item, writes);
        await writeLock(options.cwd, lock);

        if (options.applyCss) await applyThemeCss(options.cwd, id);
      }
    );
}

export function registerRegistryCommand(program: Command) {
  const reg = program.command("registry").description("Manage configured registries");

  reg
    .command("list")
    .description("List configured registries")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .action(async (options: { cwd: string }) => {
      const config = await requireConfig(options.cwd);
      for (const r of config.registries) console.log(`  ${chalk.cyan(r.name.padEnd(20))} ${r.url}`);
    });

  reg
    .command("add <name> <url>")
    .description("Register another registry (remote URL or local directory)")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .action(async (name: string, url: string, options: { cwd: string }) => {
      const config = await requireConfig(options.cwd);
      if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
        console.error(chalk.red(`\n✗ Invalid registry name "${name}". Use lowercase letters, numbers and "-".\n`));
        process.exit(1);
      }
      try {
        // Same rules every other command applies: HTTPS, http://localhost, or a local directory.
        toSource(url, name);
      } catch (err) {
        console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
        process.exit(1);
      }
      if (config.registries.some((r) => r.name === name)) {
        console.error(chalk.red(`\n✗ Registry "${name}" already exists.\n`));
        process.exit(1);
      }
      config.registries.push({ name, url });
      await saveConfig(options.cwd, config);
      console.log(chalk.green(`  ✓ Added registry "${name}" → ${url}`));
    });
}

