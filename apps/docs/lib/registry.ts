import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { RegistryItemSchema, RegistryManifestSchema } from "@nativra/registry-schema";
import type { RegistryItem, RegistryManifest } from "@nativra/registry-schema";

export type RegistryItemSummary = RegistryManifest["items"][number];

const BUILT_REGISTRY = resolve(process.cwd(), "../../dist/registry");

export async function getManifest(): Promise<RegistryManifest> {
  const raw = await readFile(join(BUILT_REGISTRY, "registry.json"), "utf8");
  return RegistryManifestSchema.parse(JSON.parse(raw));
}

export async function getItem(id: string): Promise<RegistryItem | null> {
  try {
    const raw = await readFile(join(BUILT_REGISTRY, "items", `${id}.json`), "utf8");
    return RegistryItemSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

export async function getComponents(): Promise<RegistryItemSummary[]> {
  const manifest = await getManifest();
  return manifest.items.filter((i) => i.type === "component");
}

export async function getBlocks(): Promise<RegistryItemSummary[]> {
  const manifest = await getManifest();
  return manifest.items.filter((i) => i.type === "block");
}

export async function getHooks(): Promise<RegistryItemSummary[]> {
  const manifest = await getManifest();
  return manifest.items.filter((i) => i.type === "hook");
}

export async function getThemes(): Promise<RegistryItemSummary[]> {
  const manifest = await getManifest();
  return manifest.items.filter((i) => i.type === "theme");
}
