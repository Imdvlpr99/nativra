import type { RegistryItemType } from "@nativra/registry-schema";
import type { NativraConfig } from "./config.js";

export interface ImportTargets {
  components: string;
  blocks: string;
  hooks: string;
  utils: string;
  themes: string;
}

/** Module specifiers the canonical registry aliases are rewritten to for this project. */
export function importTargets(config: NativraConfig): ImportTargets {
  const rawPrefix = config.aliasPrefix ?? "@/";
  const prefix = rawPrefix.endsWith("/") ? rawPrefix : `${rawPrefix}/`;
  const cleanDir = (d: string) => d.replace(/^\/+/, "").replace(/^[@~]\//, "");

  return {
    components: config.aliases?.components ?? `${prefix}${cleanDir(config.componentsDir)}`,
    utils: config.aliases?.utils ?? `${prefix}${cleanDir(config.utilsDir.replace(/\.(ts|js|tsx)$/, ""))}`,
    hooks: config.aliases?.hooks ?? `${prefix}${cleanDir(config.hooksDir)}`,
    blocks: config.aliases?.blocks ?? `${prefix}${cleanDir(config.blocksDir ?? config.componentsDir)}`,
    themes: config.aliases?.themes ?? `${prefix}${cleanDir(config.themesDir)}`,
  };
}

/** Import base for an item of the given type (mirrors `resolveDestDir`). */
export function importBaseForType(type: RegistryItemType, targets: ImportTargets): string {
  switch (type) {
    case "hook":
      return targets.hooks;
    case "utility":
      return targets.utils;
    case "theme":
      return targets.themes;
    case "block":
      return targets.blocks;
    default:
      return targets.components;
  }
}

/**
 * Transforms import statements in authored registry source to match the consumer project's
 * configured aliases and directories.
 *
 * @param relativeImports  basename -> module specifier for sibling imports (`./Card`) whose
 *   target is installed in a different directory than the importing file.
 */
export function transformFileImports(
  content: string,
  config: NativraConfig,
  relativeImports: Record<string, string> = {}
): string {
  if (!content) return content;
  const targets = importTargets(config);

  let transformed = content
    .replace(/(from\s+["'])@\/lib\/utils(?=["'])/g, `$1${targets.utils}`)
    .replace(/(from\s+["'])@\/lib\/themes(?=\/|["'])/g, `$1${targets.themes}`)
    .replace(/(from\s+["'])@\/components\/ui(?=\/|["'])/g, `$1${targets.components}`)
    .replace(/(from\s+["'])@\/hooks(?=\/|["'])/g, `$1${targets.hooks}`)
    .replace(/(from\s+["'])@\/blocks(?=\/|["'])/g, `$1${targets.blocks}`);

  if (Object.keys(relativeImports).length > 0) {
    transformed = transformed.replace(
      /(from\s+["'])\.\/([A-Za-z0-9_-]+)(["'])/g,
      (match, open: string, name: string, close: string) => {
        const target = relativeImports[name];
        return target ? `${open}${target}${close}` : match;
      }
    );
  }
  return transformed;
}
