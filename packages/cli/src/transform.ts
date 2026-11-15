import type { RegistryItemType } from "@nativra/registry-schema";
import type { NativraConfig } from "./config.js";

export interface ImportTargets {
  components: string;
  blocks: string;
  hooks: string;
  utils: string;
  themes: string;
}

const cleanDir = (d: string) => d.replace(/\\/g, "/").replace(/^\/+/, "").replace(/^[@~]\//, "").replace(/\/+$/, "");

/**
 * The folder the path alias points at (e.g. "src/" for `"@/*": ["./src/*"]`), inferred from an
 * explicit alias: utilsDir "src/lib/utils" with alias "@/lib/utils" means the base is "src/".
 * Lets configs written before `aliases.themes` existed still resolve themes correctly.
 */
function inferAliasBase(config: NativraConfig, prefix: string): string | null {
  const pairs: Array<[string | undefined, string]> = [
    [config.aliases?.utils, config.utilsDir.replace(/\.(ts|js|tsx)$/, "")],
    [config.aliases?.hooks, config.hooksDir],
    [config.aliases?.components, config.componentsDir],
  ];
  for (const [alias, dir] of pairs) {
    if (!alias?.startsWith(prefix)) continue;
    const aliasPath = cleanDir(alias.slice(prefix.length));
    const dirPath = cleanDir(dir);
    if (dirPath === aliasPath) return "";
    if (dirPath.endsWith(`/${aliasPath}`)) return dirPath.slice(0, dirPath.length - aliasPath.length);
  }
  return null;
}

/** Module specifiers the canonical registry aliases are rewritten to for this project. */
export function importTargets(config: NativraConfig): ImportTargets {
  const rawPrefix = config.aliasPrefix ?? "@/";
  const prefix = rawPrefix.endsWith("/") ? rawPrefix : `${rawPrefix}/`;

  let themes = config.aliases?.themes;
  if (!themes) {
    const themesDir = cleanDir(config.themesDir);
    const base = inferAliasBase(config, prefix);
    themes = base && themesDir.startsWith(base) ? `${prefix}${themesDir.slice(base.length)}` : `${prefix}${themesDir}`;
  }

  return {
    components: config.aliases?.components ?? `${prefix}${cleanDir(config.componentsDir)}`,
    utils: config.aliases?.utils ?? `${prefix}${cleanDir(config.utilsDir.replace(/\.(ts|js|tsx)$/, ""))}`,
    hooks: config.aliases?.hooks ?? `${prefix}${cleanDir(config.hooksDir)}`,
    blocks: config.aliases?.blocks ?? `${prefix}${cleanDir(config.blocksDir ?? config.componentsDir)}`,
    themes,
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
