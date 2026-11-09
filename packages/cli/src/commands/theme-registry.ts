import type { Command } from "commander";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";
import { getThemePreset, toCssVariables } from "@nativra/theme-engine";
import { createClient } from "../client.js";
import { loadConfig, saveConfig } from "../config.js";
import {
  createBackup,
  destPathFor,
  resolveDestDir,
  fileExists,
  filesForTarget,
  readLock,
  toLockKey,
  writeInstalledFile,
  writeLock,
} from "../install.js";

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
    .option("--as <name>", "Install theme under a custom name/file (e.g. --as midnight installs to lib/themes/midnight.ts)")
    .option("--apply-css", "Automatically wire and inject theme CSS variables into global.css")
    .action(async (id: string, options: { cwd: string; registry?: string; as?: string; applyCss?: boolean }) => {
      const config = await requireConfig(options.cwd);
      const item = await createClient(config, options.registry).getItem(id);
      if (item.type !== "theme") {
        console.error(chalk.red(`\n✗ "${id}" is a ${item.type}, not a theme.\n`));
        process.exit(1);
      }
      const lock = await readLock(options.cwd);
      const entry = { version: item.version, files: {} as Record<string, string> };
      for (const file of filesForTarget(item, config)) {
        let dest = destPathFor(options.cwd, item, file, config);
        if (options.as) {
          const safeName = options.as.replace(/\.ts$/, "").replace(/[^a-zA-Z0-9_-]/g, "");
          const baseDir = resolveDestDir(options.cwd, item, config);
          dest = join(baseDir, `${safeName}.ts`);
        }
        if (await fileExists(dest)) {
          await createBackup(options.cwd, id, [{ destPath: dest, exists: true }]).catch(() => {});
        }
        const hash = await writeInstalledFile(dest, file.content ?? "");
        entry.files[toLockKey(options.cwd, dest)] = hash;
        console.log(chalk.green(`  ✓ Written: ${dest}`));
      }
      lock.items[id] = entry;
      await writeLock(options.cwd, lock);

      if (options.applyCss) {
        const cssCandidates = [
          join(options.cwd, "global.css"),
          join(options.cwd, "src", "global.css"),
          join(options.cwd, "app", "global.css"),
        ];
        let targetCss: string | null = null;
        for (const candidate of cssCandidates) {
          if (await fileExists(candidate)) {
            targetCss = candidate;
            break;
          }
        }

        if (targetCss) {
          try {
            const existingCss = await readFile(targetCss, "utf8");
            const themeTokens = getThemePreset(id);
            const cssVars = toCssVariables(themeTokens);
            const startMarker = `/* NATIVRA THEME START: ${id} */`;
            const endMarker = `/* NATIVRA THEME END: ${id} */`;
            const anyThemeMarker = /\/\* NATIVRA THEME START: [\s\S]*?\/\* NATIVRA THEME END: .*?\*\//;

            const block = `${startMarker}\n@layer base {\n${cssVars}\n}\n${endMarker}`;

            let updatedCss: string;
            if (anyThemeMarker.test(existingCss)) {
              updatedCss = existingCss.replace(anyThemeMarker, block);
            } else {
              updatedCss = `${existingCss.trimEnd()}\n\n${block}\n`;
            }

            await writeFile(targetCss, updatedCss, "utf8");
            console.log(chalk.green(`  ✓ Injected CSS variables for "${id}" into: ${targetCss}`));
          } catch (err) {
            console.warn(chalk.yellow(`  ⚠ Could not wire CSS variables: ${(err as Error).message}`));
          }
        } else {
          console.log(chalk.yellow(`  ⚠ No global.css found. Create global.css to wire CSS variables automatically.`));
        }
      }
    });
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

