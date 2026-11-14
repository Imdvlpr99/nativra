#!/usr/bin/env node
/**
 * Copies the StyleSheet implementation of every registry component — plus the
 * use-theme-colors hook and the default theme they read colors from — into
 * apps/native-preview/components/nativra, so the preview app runs the exact source the
 * CLI installs. The preview app has no path aliases, so registry aliases are rewritten
 * to sibling imports.
 */
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const registry = resolve(here, "../../../registry/default");
const out = resolve(here, "../components/nativra");
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

/** Registry aliases -> sibling files in components/nativra */
const rewriteImports = (src) =>
  src
    .replace(/(from\s+["'])@\/components\/ui\//g, "$1./")
    .replace(/(from\s+["'])@\/hooks\//g, "$1./")
    .replace(/(from\s+["'])@\/lib\/themes\//g, "$1./");

async function copy(from, name) {
  await writeFile(join(out, name), rewriteImports(await readFile(from, "utf8")), "utf8");
}

await copy(join(registry, "hooks/use-theme-colors/use-theme-colors.ts"), "use-theme-colors.ts");
await copy(join(registry, "themes/zinc/theme.ts"), "theme.ts");

const names = [];
for (const entry of (await readdir(join(registry, "components"))).sort()) {
  const itemDir = join(registry, "components", entry);
  let item;
  try {
    item = JSON.parse(await readFile(join(itemDir, "item.json"), "utf8"));
  } catch {
    continue;
  }
  for (const f of item.files ?? []) {
    if (f.target && f.target !== "stylesheet") continue;
    const name = f.path.split("/").pop();
    await copy(resolve(itemDir, f.path), name);
    names.push(name.replace(/\.tsx$/, ""));
  }
}

await writeFile(join(out, "index.ts"), names.map((n) => `export * from "./${n}";`).join("\n") + "\n", "utf8");
console.log(`Synced ${names.length} component(s) + theme hook`);
