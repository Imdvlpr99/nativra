import raw from "@/generated/docs-index.json";

/** Item types, in the order the docs present them. */
export type ItemType = "component" | "block" | "template" | "hook" | "utility" | "theme" | "style";
export type StylingTarget = "nativewind" | "stylesheet";

export interface ItemSummary {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  status: string;
  version: string;
  tags: string[];
  stylingTargets: StylingTarget[];
  platforms: { ios?: boolean; android?: boolean; expoGo?: boolean; web?: boolean };
  /** Registry item ids this item depends on */
  dependencies: string[];
  npmDependencies: Array<{ package: string; version: string; peer?: boolean }>;
  files: Array<{ path: string; target?: StylingTarget }>;
  hasDocs: boolean;
  deprecationMessage?: string;
}

export interface CompatibilityMatrix {
  reactNative: { min: string; tested: string[] };
  expo: { minSdk: number; testedSdks: number[] };
  react: { min: string; tested: string[] };
  typescript: { min: string; tested: string[] };
  nativewind: { supportedVersions: string[] };
  reactNavigation: { supportedVersions: string[] };
  android: { minSdk: number; targetSdk: number };
  ios: { minDeploymentTarget: string };
}

interface DocsIndex {
  cliVersion: string;
  matrix: CompatibilityMatrix;
  items: ItemSummary[];
}

/** Generated at build time by scripts/generate-data.mjs from the built registry. */
const index = raw as unknown as DocsIndex;

export const CLI_VERSION = index.cliVersion;
export const MATRIX = index.matrix;
export const ITEMS: readonly ItemSummary[] = [...index.items].sort((a, b) => a.name.localeCompare(b.name));

const byId = new Map(ITEMS.map((i) => [i.id, i]));

export function findItem(id: string): ItemSummary | undefined {
  return byId.get(id);
}

export function itemsOfType(type: ItemType): ItemSummary[] {
  return ITEMS.filter((i) => i.type === type);
}

export function countOfType(type: ItemType): number {
  return itemsOfType(type).length;
}

/** Items that list `id` as a registry dependency ("Used by"). */
export function dependentsOf(id: string): ItemSummary[] {
  return ITEMS.filter((i) => i.dependencies.includes(id));
}

/** Human list: "a, b and c". */
export function joinList(values: readonly string[]): string {
  if (values.length <= 1) return values.join("");
  return `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;
}

export const EXPO_MIN = MATRIX.expo.minSdk;
export const RN_MIN = MATRIX.reactNative.min.replace(/\.0$/, "");
