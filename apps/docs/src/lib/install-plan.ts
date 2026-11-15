import { findItem, type ItemType, type StylingTarget } from "./data";
import { TYPE_META } from "./item-types";

export interface PlannedFile {
  itemId: string;
  type: ItemType;
  path: string;
}

/**
 * The files `nativra add <id>` writes into a project with default settings: dependencies
 * first (depth-first, like the CLI's resolver), one styling target's files only.
 */
export function installPlan(id: string, target: StylingTarget = "nativewind"): PlannedFile[] {
  const ordered: string[] = [];
  const seen = new Set<string>();
  const visit = (itemId: string) => {
    if (seen.has(itemId)) return;
    seen.add(itemId);
    const item = findItem(itemId);
    if (!item) return;
    item.dependencies.forEach(visit);
    ordered.push(itemId);
  };
  visit(id);

  return ordered.flatMap((itemId) => {
    const item = findItem(itemId)!;
    return item.files
      .filter((f) => !f.target || f.target === target)
      .map((f) => ({ itemId, type: item.type, path: `${TYPE_META[item.type].dir}/${f.path.split("/").pop() ?? f.path}` }));
  });
}
