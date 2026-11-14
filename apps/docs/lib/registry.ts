import { readFile } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import { ITEM_ID_REGEX, RegistryItemSchema, RegistryManifestSchema } from "@nativra/registry-schema";
import type { RegistryItem, RegistryItemType, RegistryManifest } from "@nativra/registry-schema";
import { ITEM_TYPE_ORDER } from "./item-types";

export type RegistryItemSummary = RegistryManifest["items"][number];

const BUILT_REGISTRY = resolve(process.cwd(), "../../dist/registry");

export async function getManifest(): Promise<RegistryManifest> {
  const raw = await readFile(join(BUILT_REGISTRY, "registry.json"), "utf8");
  return RegistryManifestSchema.parse(JSON.parse(raw));
}

export async function getItem(id: string): Promise<RegistryItem | null> {
  if (!ITEM_ID_REGEX.test(id)) {
    return null;
  }
  try {
    const itemsDir = resolve(BUILT_REGISTRY, "items");
    const targetPath = resolve(itemsDir, `${id}.json`);
    if (!targetPath.startsWith(itemsDir + sep)) {
      return null;
    }
    const raw = await readFile(targetPath, "utf8");
    return RegistryItemSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

/** Manifest items of one type, sorted by name. */
export async function getItemsByType(type: RegistryItemType): Promise<RegistryItemSummary[]> {
  const manifest = await getManifest();
  return manifest.items.filter((i) => i.type === type).sort((a, b) => a.name.localeCompare(b.name));
}

export type CatalogCounts = Record<RegistryItemType, number>;

export async function getCatalogCounts(): Promise<CatalogCounts> {
  const manifest = await getManifest();
  const counts = Object.fromEntries(ITEM_TYPE_ORDER.map((t) => [t, 0])) as CatalogCounts;
  for (const item of manifest.items) counts[item.type] += 1;
  return counts;
}

let allItemsPromise: Promise<RegistryItem[]> | undefined;

/** Every full item (with sources and docs). Cached per process; used for reverse-dependency lookups. */
export function getAllItems(): Promise<RegistryItem[]> {
  allItemsPromise ??= getManifest().then(async (m) => {
    const items = await Promise.all(m.items.map((i) => getItem(i.id)));
    return items.filter((i): i is RegistryItem => i !== null);
  });
  return allItemsPromise;
}

/** Items that list `id` as a registry dependency ("Used by"). */
export async function getDependents(id: string): Promise<RegistryItemSummary[]> {
  const [manifest, all] = await Promise.all([getManifest(), getAllItems()]);
  const ids = new Set(all.filter((i) => i.registryDependencies?.some((d) => d.id === id)).map((i) => i.id));
  return manifest.items.filter((i) => ids.has(i.id)).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getSummaries(ids: string[]): Promise<RegistryItemSummary[]> {
  const manifest = await getManifest();
  return ids
    .map((id) => manifest.items.find((i) => i.id === id))
    .filter((i): i is RegistryItemSummary => Boolean(i));
}
