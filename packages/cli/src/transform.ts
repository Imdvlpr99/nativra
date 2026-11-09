import type { NativraConfig } from "./config.js";

/**
 * Transforms import statements in authored registry component source code to match
 * the consumer project's configured aliases and directories (componentsDir, utilsDir, hooksDir, blocksDir).
 */
export function transformFileImports(content: string, config: NativraConfig): string {
  if (!content) return content;

  const rawPrefix = config.aliasPrefix ?? "@/";
  const prefix = rawPrefix.endsWith("/") ? rawPrefix : `${rawPrefix}/`;

  const cleanDir = (d: string) => d.replace(/^\/+/, "").replace(/^[@~]\//, "");

  const componentsTarget = config.aliases?.components ?? `${prefix}${cleanDir(config.componentsDir)}`;
  const utilsTarget = config.aliases?.utils ?? `${prefix}${cleanDir(config.utilsDir.replace(/\.(ts|js|tsx)$/, ""))}`;
  const hooksTarget = config.aliases?.hooks ?? `${prefix}${cleanDir(config.hooksDir)}`;
  const blocksTarget = config.aliases?.blocks ?? `${prefix}${cleanDir(config.blocksDir ?? config.componentsDir)}`;

  let transformed = content;

  // Rewrite @/lib/utils -> utilsTarget
  transformed = transformed.replace(
    /(from\s+["'])@\/lib\/utils(?=["'])/g,
    `$1${utilsTarget}`
  );

  // Rewrite @/components/ui -> componentsTarget
  transformed = transformed.replace(
    /(from\s+["'])@\/components\/ui(?=\/|["'])/g,
    `$1${componentsTarget}`
  );

  // Rewrite @/hooks -> hooksTarget
  transformed = transformed.replace(
    /(from\s+["'])@\/hooks(?=\/|["'])/g,
    `$1${hooksTarget}`
  );

  // Rewrite @/blocks -> blocksTarget
  transformed = transformed.replace(
    /(from\s+["'])@\/blocks(?=\/|["'])/g,
    `$1${blocksTarget}`
  );

  return transformed;
}

