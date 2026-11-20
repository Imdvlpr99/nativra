import type { RegistryItem, RegistryItemType, SourceFile } from "@nativra/registry-schema";
import type { NativraConfig } from "./config.js";

// This module has no Node imports on purpose: the docs playground runs it in the browser, so the
// playground installs exactly what the CLI would.

/** The files a project with this styling target receives. */
export function filesForTarget(item: RegistryItem, config: NativraConfig): SourceFile[] {
  return item.files.filter((f) => !f.target || f.target === config.stylingTarget);
}

/**
 * Sibling imports (`./Card`) from `item` to files of `related` items that get installed in a
 * different folder, mapped to the alias that reaches them. `folderOf` names an item's install
 * folder (the CLI passes an absolute path, the playground a project path).
 */
export function siblingImportMap(
  item: RegistryItem,
  related: RegistryItem[],
  config: NativraConfig,
  folderOf: (item: RegistryItem) => string
): Record<string, string> {
  const ownFolder = folderOf(item);
  const targets = importTargets(config);
  const baseName = (path: string) => (path.split(/[/\\]/).pop() ?? "").replace(/\.(tsx?|jsx?)$/, "");
  // An item's own sibling files always resolve next to it, even if a dependency shares the name.
  const own = new Set(filesForTarget(item, config).map((f) => baseName(f.path)));
  // No prototype: a sibling import named `./toString` or `./constructor` must not hit Object.prototype.
  const map: Record<string, string> = Object.create(null);
  for (const other of related) {
    if (other.id === item.id || folderOf(other) === ownFolder) continue;
    const base = importBaseForType(other.type, targets);
    for (const file of filesForTarget(other, config)) {
      const name = baseName(file.path);
      if (name && !own.has(name)) map[name] = `${base}/${name}`;
    }
  }
  return map;
}

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
    case "style":
      return targets.themes;
    case "block":
      return targets.blocks;
    default:
      return targets.components;
  }
}

/**
 * Everything before a module specifier's path, captured with its opening quote: `from "`
 * (imports and re-exports), `import "` (side-effect imports), `import("` and `require("`.
 */
const SPECIFIER_OPEN = String.raw`((?:\bfrom\s+|\bimport\s*\(\s*|\bimport\s+|\brequire\s*\(\s*)["'])`;

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

  // Replacer functions, not strings: a configured alias containing "$&" or "$1" must be inserted
  // literally rather than expanded as a replacement pattern.
  const to = (target: string) => (_match: string, open: string) => `${open}${target}`;
  const spec = (pattern: string) => new RegExp(`${SPECIFIER_OPEN}${pattern}`, "g");
  let transformed = content
    .replace(spec(String.raw`@\/lib\/utils(?=["'])`), to(targets.utils))
    .replace(spec(String.raw`@\/lib\/themes(?=\/|["'])`), to(targets.themes))
    .replace(spec(String.raw`@\/components\/ui(?=\/|["'])`), to(targets.components))
    .replace(spec(String.raw`@\/hooks(?=\/|["'])`), to(targets.hooks))
    .replace(spec(String.raw`@\/blocks(?=\/|["'])`), to(targets.blocks));

  if (Object.keys(relativeImports).length > 0) {
    transformed = transformed.replace(
      spec(String.raw`\.\/([A-Za-z0-9_-]+)(["'])`),
      (match, open: string, name: string, close: string) => {
        const target = Object.hasOwn(relativeImports, name) ? relativeImports[name] : undefined;
        return target ? `${open}${target}${close}` : match;
      }
    );
  }
  return transformed;
}
