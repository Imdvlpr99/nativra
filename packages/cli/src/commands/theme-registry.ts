import type { Command } from "commander";
import { join } from "node:path";
import chalk from "chalk";
import prompts from "prompts";
import { createClient, parseItemRef, toSource } from "../client.js";
import { loadConfig, loadConfigOrDefault, saveConfig } from "../config.js";
import {
  assertSafeWriteTarget,
  createBackup,
  destPathFor,
  resolveDestDir,
  fileExists,
  filesForTarget,
  lockOwnerOf,
  recordLockEntry,
  toLockKey,
  upstreamHashes,
  writeInstalledFile,
  writeLock,
} from "../install.js";
import { transformFileImports } from "../transform.js";
import { applyThemeCss, installedStyleId, installedThemeId } from "../theme-css.js";
import { listAllItems, printable, readLockOrExit } from "./shared.js";

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
      const config = await loadConfigOrDefault(options.cwd);
      const items = (await listAllItems(createClient(config, options.registry, options.cwd))).filter((i) => i.type === "theme");
      if (items.length === 0) console.log(chalk.yellow("\nNo themes found.\n"));
      for (const i of items) console.log(`  ${chalk.cyan(printable(i.ref).padEnd(24))} ${printable(i.description)}`);
    });

  theme
    .command("add <id>")
    .description("Add a theme/token file to your project")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--registry <url>", "Override registry location")
    .option("--as <name>", "Install theme under a custom file name (e.g. --as midnight installs <themesDir>/midnight.ts)")
    .option("--overwrite", "Overwrite an existing theme file (a backup is created first)")
    .option("--apply-css", "Write the theme's CSS variables into global.css (always done for NativeWind projects)")
    .action(
      async (
        ref: string,
        options: { cwd: string; registry?: string; as?: string; overwrite?: boolean; applyCss?: boolean }
      ) => {
        const config = await requireConfig(options.cwd);
        const { registry, id } = parseItemRef(ref);
        let item;
        try {
          item = await createClient(config, options.registry, options.cwd).getItem(id, registry);
        } catch (err) {
          console.error(chalk.red(`\n✗ Could not load theme "${printable(ref)}": ${printable((err as Error).message)}\n`));
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
        const undoHints = new Set<string>();
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
            // Back the file up under the item that owns it now (e.g. "zinc" when switching to
            // "rose"), so `nativra rollback zinc` restores both the file and its tracking.
            const owner = lockOwnerOf(lock, toLockKey(options.cwd, dest)) ?? id;
            try {
              await createBackup(options.cwd, owner, [{ destPath: dest, exists: true }], lock.items[owner]);
            } catch (err) {
              console.error(chalk.red(`\n✗ Could not back up ${dest}: ${(err as Error).message}. Nothing was written.\n`));
              process.exit(1);
            }
            undoHints.add(owner);
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
        const upstream: Record<string, string> = {};
        for (const file of filesForTarget(item, config)) {
          const dest = customName
            ? join(resolveDestDir(options.cwd, item, config), `${customName}.ts`)
            : destPathFor(options.cwd, item, file, config);
          if (file.hash) upstream[dest] = file.hash;
        }
        recordLockEntry(lock, options.cwd, item, writes, { registry, upstream });
        await writeLock(options.cwd, lock);
        for (const owner of undoHints) console.log(chalk.gray(`  Undo with: nativra rollback ${owner}`));

        // global.css must describe the theme in theme.ts. A theme saved under --as, or one that
        // wasn't written, isn't the active one, so its CSS would put the two out of sync.
        const activated = !customName && Object.keys(writes).length > 0;
        if (activated && (options.applyCss || config.stylingTarget === "nativewind")) {
          await applyThemeCss(options.cwd, id, installedStyleId(lock));
        } else if (options.applyCss) {
          console.log(
            chalk.yellow(
              `  ⚠ global.css was not changed: ${customName ? `--as saves "${id}" without making it the active theme` : "theme.ts was not replaced"}.`
            )
          );
        }
      }
    );
}

export function registerStyleCommand(program: Command) {
  const style = program.command("style").description("Manage the UI style (shape, type, density, surfaces)");

  style
    .command("list")
    .description("List available styles")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--registry <url>", "Override registry location")
    .action(async (options: { cwd: string; registry?: string }) => {
      const config = await loadConfigOrDefault(options.cwd);
      const items = (await listAllItems(createClient(config, options.registry, options.cwd))).filter((i) => i.type === "style");
      if (items.length === 0) console.log(chalk.yellow("\nNo styles found.\n"));
      for (const i of items) console.log(`  ${chalk.cyan(printable(i.ref).padEnd(16))} ${printable(i.description)}`);
    });

  style
    .command("add <id>")
    .description("Install a style into style.ts, replacing the current one (a backup is kept)")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--registry <url>", "Override registry location")
    .action(async (ref: string, options: { cwd: string; registry?: string }) => {
      const config = await requireConfig(options.cwd);
      const { registry, id } = parseItemRef(ref);
      let item;
      try {
        item = await createClient(config, options.registry, options.cwd).getItem(id, registry);
      } catch (err) {
        console.error(chalk.red(`\n✗ Could not load style "${printable(ref)}": ${printable((err as Error).message)}\n`));
        process.exit(1);
      }
      if (item.type !== "style") {
        console.error(chalk.red(`\n✗ "${printable(ref)}" is a ${item.type}, not a style. See: nativra style list\n`));
        process.exit(1);
      }

      const lock = await readLockOrExit(options.cwd);
      const writes: Record<string, string> = {};
      let previous: string | undefined;
      for (const file of filesForTarget(item, config)) {
        const dest = destPathFor(options.cwd, item, file, config);
        try {
          await assertSafeWriteTarget(options.cwd, dest);
          if (await fileExists(dest)) {
            // Switching styles is the point of this command, so the old file is backed up, not kept.
            // The backup belongs to the style being replaced: `rollback <it>` restores it.
            previous = lockOwnerOf(lock, toLockKey(options.cwd, dest)) ?? id;
            await createBackup(options.cwd, previous, [{ destPath: dest, exists: true }], lock.items[previous]);
          }
        } catch (err) {
          console.error(chalk.red(`\n✗ ${(err as Error).message}. Nothing was written.\n`));
          process.exit(1);
        }
        writes[dest] = await writeInstalledFile(dest, transformFileImports(file.content ?? "", config));
        console.log(chalk.green(`  ✓ Written: ${dest}`));
      }
      recordLockEntry(lock, options.cwd, item, writes, { registry, upstream: upstreamHashes(options.cwd, item, config) });
      await writeLock(options.cwd, lock);

      // Remember the choice so components added later bring this style, not the default.
      if (config.style !== id) {
        await saveConfig(options.cwd, { ...config, style: id });
      }

      // NativeWind components read the style through the classes in global.css.
      const theme = installedThemeId(lock);
      if (config.stylingTarget === "nativewind" && theme) await applyThemeCss(options.cwd, theme, id);
      console.log(
        chalk.bold.green(`\n✅ Style "${id}" installed.`) +
          (previous ? chalk.gray(` Undo with: nativra rollback ${previous}`) : "") +
          "\n"
      );
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
      if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
        console.error(chalk.red(`\n✗ Invalid registry name "${name}". Use lowercase letters, numbers and "-".\n`));
        process.exit(1);
      }
      try {
        // Same rules every other command applies: HTTPS, http://localhost, or a local directory.
        toSource(url, name, options.cwd);
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

