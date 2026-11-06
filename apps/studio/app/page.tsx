import { getItem, getManifest, STUDIO_CONTROLS } from "@/lib/registry";
import StudioClient, { type StudioItem } from "./StudioClient";

export default async function StudioPage() {
  const manifest = await getManifest();
  const items: StudioItem[] = [];
  for (const entry of manifest.items) {
    const controls = STUDIO_CONTROLS[entry.id];
    if (!controls) continue; // only schema-defined, editable items appear in Studio
    const item = await getItem(entry.id);
    items.push({ id: item.id, name: item.name, stylingTargets: item.stylingTargets, files: item.files, controls });
  }
  return <StudioClient items={items} />;
}
