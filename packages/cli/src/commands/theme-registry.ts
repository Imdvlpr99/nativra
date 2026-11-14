import type { Command } from "commander";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";
import prompts from "prompts";
import { THEME_PRESETS, toCssVariables } from "@nativra/theme-engine";
import { createClient } from "../client.js";
import { loadConfig, saveConfig } from "../config.js";
import {
  createBackup,
  destPathFor,
  resolveDestDir,
  fileExists,
  filesForTarget,
  readLock,
  recordLockEntry,
  writeInstalledFile,
  writeLock,
} from "../install.js";
import { transformFileImports } from "../transform.js";

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
        const item = await createClient(config, options.registry).getItem(id);
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

        const lock = await readLock(options.cwd);
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
          writes[dest] = await writeInstalledFile(dest, transformFileImports(file.content ?? "", config));
          console.log(chalk.green(`  ✓ Written: ${dest}`));
        }
        recordLockEntry(lock, options.cwd, item, writes);
        await writeLock(options.cwd, lock);

        if (options.applyCss) await applyThemeCss(options.cwd, id);
      }
    );
}

async function applyThemeCss(cwd: string, id: string): Promise<void> {
  const tokens = THEME_PRESETS[id];
  if (!tokens) {
    console.warn(
      chalk.yellow(`  ⚠ No built-in CSS token preset for "${id}"; global.css was not changed. Wire its variables manually.`)
    );
    return;
  }

  const cssCandidates = [join(cwd, "global.css"), join(cwd, "src", "global.css"), join(cwd, "app", "global.css")];
  let targetCss: string | null = null;
  for (const candidate of cssCandidates) {
    if (await fileExists(candidate)) {
      targetCss = candidate;
      break;
    }
  }
  if (!targetCss) {
    console.log(chalk.yellow(`  ⚠ No global.css found. Create global.css to wire CSS variables automatically.`));
    return;
  }

  try {
    const existingCss = await readFile(targetCss, "utf8");
    const block = `/* NATIVRA THEME START: ${id} */\n@layer base {\n${toCssVariables(tokens)}\n}\n/* NATIVRA THEME END: ${id} */`;
    const anyThemeMarker = /\/\* NATIVRA THEME START: [\s\S]*?\/\* NATIVRA THEME END: .*?\*\//;
    const updatedCss = anyThemeMarker.test(existingCss)
      ? existingCss.replace(anyThemeMarker, block)
      : `${existingCss.trimEnd()}\n\n${block}\n`;
    await writeFile(targetCss, updatedCss, "utf8");
    console.log(chalk.green(`  ✓ Injected CSS variables for "${id}" into: ${targetCss}`));
  } catch (err) {
    console.warn(chalk.yellow(`  ⚠ Could not wire CSS variables: ${(err as Error).message}`));
  }
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
      if (config.registries.some((r) => r.name === name)) {
        console.error(chalk.red(`\n✗ Registry "${name}" already exists.\n`));
        process.exit(1);
      }
      config.registries.push({ name, url });
      await saveConfig(options.cwd, config);
      console.log(chalk.green(`  ✓ Added registry "${name}" → ${url}`));
    });
}

