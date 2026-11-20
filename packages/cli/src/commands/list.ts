import type { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { RegistryItemTypeSchema, compareVersions, parseVersion } from "@nativra/registry-schema";
import { createClient, formatItemRef } from "../client.js";
import { loadConfigOrDefault } from "../config.js";
import { listAllItemsWithFailures, printable, readLockOrExit, type ListedItem } from "./shared.js";

type InstalledStatus = "up-to-date" | "update-available" | "not-in-registry" | "registry-unavailable";

interface InstalledRow {
  ref: string;
  type: string;
  installed: string;
  latest: string | null;
  status: InstalledStatus;
}

/** Each lockfile entry next to its registry's current version. */
function installedRows(
  lock: Awaited<ReturnType<typeof readLockOrExit>>,
  items: ListedItem[],
  unavailable: ReadonlySet<string>,
  override: boolean
): InstalledRow[] {
  return Object.entries(lock.items)
    .map(([id, entry]) => {
      // --registry replaces every source with one "default" source.
      const registry = override ? "default" : (entry.registry ?? "default");
      const latest = items.find((i) => i.id === id && i.registry === registry)?.version ?? null;
      const a = parseVersion(entry.version);
      const b = latest ? parseVersion(latest) : null;
      // A registry that couldn't be read says nothing about whether the item is still in it.
      const status: InstalledStatus = unavailable.has(registry)
        ? "registry-unavailable"
        : !latest
          ? "not-in-registry"
          : a && b && compareVersions(a, b) < 0
            ? "update-available"
            : "up-to-date";
      return { ref: formatItemRef(id, entry.registry), type: entry.type ?? "item", installed: entry.version, latest, status };
    })
    .sort((x, y) => x.ref.localeCompare(y.ref));
}

export function registerListCommand(program: Command) {
  program
    .command("list")
    .description("List available items in every configured registry")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--type <type>", `Filter by type: ${RegistryItemTypeSchema.options.join(", ")}`)
    .option("--registry <url>", "Override registry URL")
    .option("--json", "Print the items as JSON")
    .option("--installed", "List what this project has installed, with the registry's current version")
    .option("--outdated", "Like --installed, but only items with an update available (exits 1 if any, for CI)")
    .action(async (options: { cwd: string; type?: string; registry?: string; json?: boolean; installed?: boolean; outdated?: boolean }) => {
      if (options.outdated) options.installed = true;
      const config = await loadConfigOrDefault(options.cwd).catch((err) => {
        console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
        process.exit(1);
      });

      const rawType = options.type?.toLowerCase();
      const targetType = rawType === "primitive" ? "component" : rawType;
      if (targetType !== undefined && !RegistryItemTypeSchema.safeParse(targetType).success) {
        console.error(
          chalk.red(`\n✗ Unknown --type "${options.type}". Use one of: ${RegistryItemTypeSchema.options.join(", ")}.\n`)
        );
        process.exit(1);
      }

      const client = createClient(config, options.registry, options.cwd);
      const spinner = options.json ? null : ora("Fetching registry...").start();
      let items: ListedItem[];
      let unavailable: Set<string>;
      try {
        ({ items, unavailable } = await listAllItemsWithFailures(client));
        spinner?.succeed(`Fetched ${items.length} items`);
      } catch (err) {
        if (spinner) spinner.fail(chalk.red(`Failed: ${printable((err as Error).message)}`));
        else console.error(printable((err as Error).message));
        process.exit(1);
      }

      if (options.installed) {
        const lock = await readLockOrExit(options.cwd);
        // --outdated also keeps items whose registry couldn't be read: "up to date" can't be confirmed
        // for them, and a CI gate must not pass because the registry was down.
        const rows = installedRows(lock, items, unavailable, Boolean(options.registry)).filter(
          (r) =>
            (!targetType || r.type === targetType) &&
            (!options.outdated || r.status === "update-available" || r.status === "registry-unavailable")
        );
        if (options.outdated && rows.length > 0) process.exitCode = 1;
        if (options.json) {
          console.log(JSON.stringify(rows, null, 2));
          return;
        }
        if (rows.length === 0) {
          console.log(options.outdated ? chalk.green("\n✓ Everything installed is up to date.\n") : chalk.yellow("\nNothing installed yet.\n"));
          return;
        }
        console.log();
        for (const r of rows) {
          const state =
            r.status === "update-available"
              ? chalk.yellow(`update available: v${printable(r.latest)}`)
              : r.status === "not-in-registry"
                ? chalk.gray("not in the registry")
                : r.status === "registry-unavailable"
                  ? chalk.yellow("registry unavailable")
                  : chalk.green("up to date");
          console.log(`  ${chalk.cyan(printable(r.ref).padEnd(28))} ${chalk.gray(`v${printable(r.installed)}`.padEnd(10))} ${state}`);
        }
        const outdated = rows.filter((r) => r.status === "update-available").length;
        const unchecked = rows.filter((r) => r.status === "registry-unavailable").length;
        console.log(outdated > 0 ? chalk.yellow(`\n  ${outdated} update(s) available: nativra update`) : "");
        if (unchecked > 0) console.log(chalk.yellow(`  ${unchecked} item(s) couldn't be checked: their registry is unavailable`));
        console.log();
        return;
      }

      const filtered = targetType ? items.filter((i) => i.type === targetType) : items;

      if (options.json) {
        console.log(JSON.stringify(filtered, null, 2));
        return;
      }
      if (filtered.length === 0) {
        console.log(chalk.yellow("\nNo items found.\n"));
        return;
      }

      const grouped = filtered.reduce<Record<string, ListedItem[]>>((acc, item) => {
        (acc[item.type] ??= []).push(item);
        return acc;
      }, {});

      for (const [type, typeItems] of Object.entries(grouped)) {
        console.log(chalk.bold(chalk.blue(`\n${type.toUpperCase()}S`)));
        for (const item of typeItems) {
          const badge = item.status !== "stable" ? chalk.yellow(` [${printable(item.status)}]`) : "";
          console.log(`  ${chalk.cyan(printable(item.ref).padEnd(30))} ${chalk.gray(printable(item.description))}${badge}`);
        }
      }
      console.log();
    });
}
