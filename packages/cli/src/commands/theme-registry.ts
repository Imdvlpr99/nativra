import type { Command } from "commander";
import chalk from "chalk";
import { createClient } from "../client.js";
import { loadConfig, saveConfig } from "../config.js";
import { destPathFor, filesForTarget, readLock, writeInstalledFile, writeLock } from "../install.js";

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
    .action(async (id: string, options: { cwd: string; registry?: string }) => {
      const config = await requireConfig(options.cwd);
      const item = await createClient(config, options.registry).getItem(id);
      if (item.type !== "theme") {
        console.error(chalk.red(`\n✗ "${id}" is a ${item.type}, not a theme.\n`));
        process.exit(1);
      }
      const lock = await readLock(options.cwd);
      const entry = { version: item.version, files: {} as Record<string, string> };
      for (const file of filesForTarget(item, config)) {
        const dest = destPathFor(options.cwd, item, file, config);
        entry.files[dest] = await writeInstalledFile(dest, file.content ?? "");
        console.log(chalk.green(`  ✓ Written: ${dest}`));
      }
      lock.items[id] = entry;
      await writeLock(options.cwd, lock);
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

