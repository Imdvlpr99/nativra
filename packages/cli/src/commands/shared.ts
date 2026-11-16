import chalk from "chalk";
import type { RegistryClient } from "@nativra/registry-client";
import type { RegistryManifest } from "@nativra/registry-schema";
import { formatItemRef } from "../client.js";
import { readLock, type LockFile } from "../install.js";

export type ListedItem = RegistryManifest["items"][number] & { registry: string; ref: string };

/**
 * Items from every configured registry, each with the reference `add` accepts ("button" or
 * "acme/button"). Throws only when no registry could be read; otherwise unreadable registries
 * are reported on stderr and skipped.
 */
export async function listAllItems(client: RegistryClient): Promise<ListedItem[]> {
  return (await listAllItemsWithFailures(client)).items;
}

/** Like listAllItems, but also names the registries that couldn't be read. */
export async function listAllItemsWithFailures(client: RegistryClient): Promise<{ items: ListedItem[]; unavailable: Set<string> }> {
  const names = client.registryNames();
  const items: ListedItem[] = [];
  const failures: string[] = [];
  const unavailable = new Set<string>();
  for (const registry of names) {
    try {
      for (const item of await client.listItems(registry)) {
        items.push({ ...item, registry, ref: formatItemRef(item.id, registry) });
      }
    } catch (err) {
      failures.push(`${registry}: ${(err as Error).message}`);
      unavailable.add(registry);
    }
  }
  if (failures.length === names.length) throw new Error(failures.join("; "));
  for (const f of failures) console.error(chalk.yellow(`  ⚠ Skipped registry ${printable(f)}`));
  return { items, unavailable };
}

/** Reads nativra.lock.json, or prints why it can't be used and exits (it is never overwritten). */
export async function readLockOrExit(cwd: string): Promise<LockFile> {
  try {
    return await readLock(cwd);
  } catch (err) {
    console.error(chalk.red(`\n✗ ${(err as Error).message}\n`));
    process.exit(1);
  }
}

/** Marks the run as failed without stopping it, so later items still get processed. */
export function markFailed(): void {
  process.exitCode = 1;
}

/**
 * Registry text (names, descriptions, paths) made safe to print: control characters are removed
 * so a registry can't send terminal escape sequences that rewrite output or reach the clipboard.
 */
export function printable(text: unknown): string {
  return String(text ?? "").replace(/[\u0000-\u0008\u000b-\u001f\u007f-\u009f]/g, "");
}
