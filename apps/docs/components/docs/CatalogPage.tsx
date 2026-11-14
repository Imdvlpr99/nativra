import React from "react";
import type { Metadata } from "next";
import type { RegistryItemType } from "@nativra/registry-schema";
import { THEME_PRESETS } from "@nativra/theme-engine";
import { getAllItems } from "@/lib/registry";
import { TYPE_META, catalogHref, itemHref } from "@/lib/item-types";
import { Catalog, type CatalogEntry } from "./Catalog";
import { CommandLine } from "./CopyButton";

export function catalogMetadata(type: RegistryItemType): Metadata {
  const meta = TYPE_META[type];
  return {
    title: `React Native ${meta.plural}`,
    description: `${meta.blurb} Copy the source into your Expo or React Native app with nativra-cli.`,
    alternates: { canonical: catalogHref(type) },
  };
}

/** Header + filterable grid for one registry item type. */
export async function CatalogPage({ type, children }: { type: RegistryItemType; children?: React.ReactNode }) {
  const meta = TYPE_META[type];
  const items = (await getAllItems()).filter((i) => i.type === type).sort((a, b) => a.name.localeCompare(b.name));

  const entries: CatalogEntry[] = items.map((i) => {
    const deps = i.registryDependencies?.length ?? 0;
    const theme = type === "theme" ? THEME_PRESETS[i.id] : undefined;
    return {
      id: i.id,
      name: i.name,
      description: i.description,
      href: itemHref(type, i.id),
      status: i.status,
      tags: i.tags ?? [],
      ...(deps > 0 ? { meta: `Uses ${deps} registry ${deps === 1 ? "item" : "items"}` } : {}),
      ...(theme
        ? {
            swatches: [theme.light.background, theme.light.primary, theme.light.muted, theme.dark.background, theme.dark.primary].map(String),
          }
        : {}),
    };
  });

  const example = items[0];

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <p className="eyebrow">{items.length} {meta.plural.toLowerCase()}</p>
        <h1 className="text-3xl font-semibold sm:text-4xl">{meta.plural}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{meta.blurb}</p>
        {example && (
          <div className="max-w-md">
            <CommandLine
              command={type === "theme" ? `npx nativra-cli theme add ${example.id}` : `npx nativra-cli add ${example.id}`}
            />
          </div>
        )}
      </header>
      {children}
      <Catalog entries={entries} noun={meta.plural.toLowerCase()} />
    </div>
  );
}
