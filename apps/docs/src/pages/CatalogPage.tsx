import React from "react";
import type { ItemType } from "@/lib/data";
import { itemsOfType } from "@/lib/data";
import { TYPE_META, catalogHref, installCommand } from "@/lib/item-types";
import { Seo } from "@/lib/head";
import { Catalog } from "@/components/Catalog";
import { CommandLine } from "@/components/ui/CopyButton";

export default function CatalogPage({ type }: { type: ItemType }) {
  const meta = TYPE_META[type];
  const items = itemsOfType(type);
  const example = items[0];

  return (
    <div className="space-y-10">
      <Seo
        title={`React Native ${meta.plural}`}
        description={`${meta.blurb} Copy the source into your Expo or React Native app with nativra-cli.`}
        path={catalogHref(type)}
      />
      <header className="space-y-4 border-b border-border pb-10">
        <p className="eyebrow">
          Library · {items.length} {items.length === 1 ? meta.label.toLowerCase() : meta.plural.toLowerCase()}
        </p>
        <h1 className="text-[2.125rem] font-bold leading-tight sm:text-[2.75rem]">{meta.plural}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{meta.blurb}</p>
        {example && (
          <div className="max-w-md pt-1">
            <CommandLine command={installCommand(type, example.id)} />
          </div>
        )}
      </header>
      <Catalog items={items} noun={meta.plural.toLowerCase()} />
    </div>
  );
}
