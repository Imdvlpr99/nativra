import { getItem, getManifest, STUDIO_CONTROLS } from "@/lib/registry";
import StudioClient, { type StudioItem } from "./StudioClient";

export default async function StudioPage() {
  const manifest = await getManifest();
  const items: StudioItem[] = [];
  for (const entry of manifest.items) {
    const controls = STUDIO_CONTROLS[entry.id] ?? [];
    const item = await getItem(entry.id);
    if (!item) continue;
    items.push({
      id: item.id,
      name: item.name,
      ...(item.title ? { title: item.title } : {}),
      type: item.type,
      ...(item.category ? { category: item.category } : {}),
      description: item.description,
      stylingTargets: item.stylingTargets,
      files: item.files,
      controls,
    });
  }
  return <StudioClient items={items} />;
}
