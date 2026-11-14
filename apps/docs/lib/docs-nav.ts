import type { RegistryItemType } from "@nativra/registry-schema";
import { getManifest } from "./registry";
import { GUIDE_SECTIONS } from "./site";
import { ITEM_TYPE_ORDER, TYPE_META, catalogHref, itemHref } from "./item-types";

export interface NavLink {
  title: string;
  href: string;
  /** Short marker shown next to the link, e.g. "beta" */
  tag?: string;
}

export interface NavSection {
  title: string;
  /** Overview page for registry sections */
  href?: string;
  count?: number;
  /** Registry sections are collapsible and filterable */
  collapsible: boolean;
  links: NavLink[];
}

/** Sidebar model: hand-written guides first, then one section per registry item type. */
export async function getDocsNav(): Promise<NavSection[]> {
  const manifest = await getManifest();
  const registrySections: NavSection[] = ITEM_TYPE_ORDER.map((type: RegistryItemType) => {
    const items = manifest.items
      .filter((i) => i.type === type)
      .sort((a, b) => a.name.localeCompare(b.name));
    return {
      title: TYPE_META[type].plural,
      href: catalogHref(type),
      count: items.length,
      collapsible: true,
      links: items.map((i) => ({
        title: i.name,
        href: itemHref(type, i.id),
        ...(i.status !== "stable" ? { tag: i.status } : {}),
      })),
    };
  }).filter((s) => s.links.length > 0);

  return [...GUIDE_SECTIONS.map((s) => ({ ...s, collapsible: false })), ...registrySections];
}
