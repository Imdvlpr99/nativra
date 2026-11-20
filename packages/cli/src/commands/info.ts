import type { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { compareVersions, parseVersion, type RegistryItem } from "@nativra/registry-schema";
import { createClient, formatItemRef, parseItemRef } from "../client.js";
import { loadConfigOrDefault } from "../config.js";
import { readLock } from "../install.js";
import { printable } from "./shared.js";

export function registerInfoCommand(program: Command) {
  program
    .command("info <item>")
    .description('Show detailed metadata about a registry item ("button", or "<registry>/<id>")')
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--registry <url>", "Override registry URL")
    .option("--json", "Print the item metadata as JSON (without file contents)")
    .option("--docs", "With --json, include the item's usage docs (Markdown)")
    .action(async (ref: string, options: { cwd: string; registry?: string; json?: boolean; docs?: boolean }) => {
      const config = await loadConfigOrDefault(options.cwd).catch((err) => {
        console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
        process.exit(1);
      });
      const { registry, id } = parseItemRef(ref);
      const client = createClient(config, options.registry, options.cwd);

      const spinner = options.json ? null : ora(`Fetching info for "${printable(ref)}"...`).start();
      let item: RegistryItem;
      try {
        item = await client.getItem(id, registry);
        spinner?.stop();
      } catch (err) {
        if (spinner) spinner.fail(chalk.red(`Failed: ${printable((err as Error).message)}`));
        else console.error(printable((err as Error).message));
        process.exit(1);
      }

      // The installed version, when this project has the item from the same registry. A lockfile
      // that can't be read just means "not known": info only reads.
      const installed = await readLock(options.cwd)
        .then((lock) => {
          const entry = lock.items[item.id];
          return entry && (entry.registry ?? "default") === registry ? entry.version : undefined;
        })
        .catch(() => undefined);
      const installedV = installed ? parseVersion(installed) : null;
      const latestV = parseVersion(item.version);
      const updateAvailable = Boolean(installedV && latestV && compareVersions(installedV, latestV) < 0);

      if (options.json) {
        // Metadata only: file contents and docs can be hundreds of KB.
        const meta: Record<string, unknown> = { ...item, files: item.files.map((f) => ({ path: f.path, target: f.target, hash: f.hash })) };
        if (!options.docs) delete meta["docs"];
        if (installed) Object.assign(meta, { installedVersion: installed, updateAvailable });
        console.log(JSON.stringify(meta, null, 2));
        return;
      }

      const p = item.platforms;
      console.log(chalk.bold(`\n${printable(item.name)}`) + chalk.gray(` v${printable(item.version)}`));
      console.log(chalk.gray(printable(item.description)));
      if (item.status === "deprecated") {
        console.log(chalk.yellow(`\n  ⚠ Deprecated${item.deprecationMessage ? `: ${printable(item.deprecationMessage)}` : ""}`));
      }
      console.log();
      if (installed) {
        console.log(
          `  ${chalk.bold("Installed:")}      v${printable(installed)}` +
            (updateAvailable ? chalk.yellow(` (update available: nativra update ${formatItemRef(item.id, registry)})`) : chalk.gray(" (up to date)"))
        );
      }
      console.log(`  ${chalk.bold("Type:")}           ${item.type}`);
      console.log(`  ${chalk.bold("Status:")}         ${item.status}`);
      console.log(`  ${chalk.bold("Styling targets:")} ${item.stylingTargets.join(", ")}`);
      console.log(
        `  ${chalk.bold("Platforms:")}      Android: ${p.android ? "✓" : "✗"} | iOS: ${p.ios ? "✓" : "✗"} | Web: ${p.web ? "✓" : "✗"}`
      );
      if (p.minExpoSdk || p.minReactNative) {
        const req = [p.minExpoSdk ? `Expo SDK ${p.minExpoSdk}+` : "", p.minReactNative ? `React Native ${printable(p.minReactNative)}+` : ""];
        console.log(`  ${chalk.bold("Requires:")}       ${req.filter(Boolean).join(", ")}`);
      }

      if (item.registryDependencies?.length) {
        console.log(`\n  ${chalk.bold("Registry deps:")}`);
        for (const dep of item.registryDependencies) {
          console.log(`    - ${formatItemRef(dep.id, dep.registry)}`);
        }
      }

      if (item.npmDependencies?.length) {
        console.log(`\n  ${chalk.bold("npm deps:")}`);
        for (const dep of item.npmDependencies) {
          console.log(`    - ${dep.package}@${dep.version}${dep.peer ? " (peer)" : ""}`);
        }
      }

      console.log(`\n  ${chalk.bold("Files:")}`);
      for (const file of item.files) {
        console.log(`    ${chalk.cyan(printable(file.path))}${file.target ? chalk.gray(` [${file.target}]`) : ""}`);
      }

      console.log(`\n  ${chalk.bold("Install:")} ${chalk.cyan(`npx nativra-cli add ${formatItemRef(item.id, registry)}`)}\n`);
    });
}
