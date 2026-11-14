import type { MetadataRoute } from "next";
import { getManifest } from "@/lib/registry";
import { ITEM_TYPE_ORDER, catalogHref, itemHref } from "@/lib/item-types";
import { GUIDE_SECTIONS, SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const manifest = await getManifest();
  const lastModified = new Date();

  const guides = ["", ...GUIDE_SECTIONS.flatMap((s) => s.links.map((l) => l.href))].map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const catalogs = ITEM_TYPE_ORDER.map((t) => ({
    url: `${SITE.url}${catalogHref(t)}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const items = manifest.items.map((i) => ({
    url: `${SITE.url}${itemHref(i.type, i.id)}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: i.type === "component" ? 0.85 : 0.75,
  }));

  return [...guides, ...catalogs, ...items];
}
