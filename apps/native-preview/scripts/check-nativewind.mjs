#!/usr/bin/env node
/**
 * Type-checks the NativeWind implementation of every registry item. The preview app only runs
 * (and type-checks) the StyleSheet sources, so without this nothing compiles the NativeWind ones.
 *
 * Stages the NativeWind sources, the hooks, the cn utility and a theme + style into
 * .nativewind-check/ (git-ignored) with registry aliases rewritten to sibling imports, then runs
 * tsc there with NativeWind's className types.
 */
import { spawnSync } from "node:child_process";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const app = resolve(here, "..");
const registry = resolve(app, "../../registry/default");
const out = join(app, ".nativewind-check");
await rm(out, { recursive: true, force: true });
await mkdir(join(out, "utils"), { recursive: true });

/** Registry aliases -> sibling files, mirroring what the CLI writes into a flat project. */
function rewrite(src) {
  const open = String.raw`((?:\bfrom\s+|\bimport\s*\(\s*|\bimport\s+|\brequire\s*\(\s*)["'])`;
  return src
    .replace(new RegExp(`${open}@\\/lib\\/utils(?=["'])`, "g"), "$1./utils")
    .replace(new RegExp(`${open}@\\/(?:components\\/ui|blocks|hooks|lib\\/themes)\\/`, "g"), "$1./");
}

async function stage(from, name) {
  await writeFile(join(out, name), rewrite(await readFile(from, "utf8")), "utf8");
}

let count = 0;
for (const kind of ["components", "blocks", "templates"]) {
  for (const id of await readdir(join(registry, kind))) {
    const dir = join(registry, kind, id, "nativewind");
    let files;
    try {
      files = await readdir(dir);
    } catch {
      continue; // StyleSheet-only item
    }
    for (const f of files) await stage(join(dir, f), f);
    count++;
  }
}
for (const id of await readdir(join(registry, "hooks"))) {
  for (const f of await readdir(join(registry, "hooks", id))) {
    if (/\.tsx?$/.test(f)) await stage(join(registry, "hooks", id, f), f);
  }
}
for (const f of await readdir(join(registry, "utilities/cn/nativewind"))) {
  await stage(join(registry, "utilities/cn/nativewind", f), join("utils", f));
}
await stage(join(registry, "themes/zinc/theme.ts"), "theme.ts");
await stage(join(registry, "styles/soft/style.ts"), "style.ts");

await writeFile(join(out, "nativewind-env.d.ts"), `/// <reference types="nativewind/types" />\n`, "utf8");
await writeFile(
  join(out, "tsconfig.json"),
  JSON.stringify({ extends: "../tsconfig.json", include: ["./**/*.ts", "./**/*.tsx"], exclude: [] }, null, 2),
  "utf8"
);

const tsc = createRequire(import.meta.url).resolve("typescript/bin/tsc");
console.log(`Type-checking the NativeWind sources of ${count} items...`);
const result = spawnSync(process.execPath, [tsc, "-p", join(out, "tsconfig.json")], { stdio: "inherit" });
process.exit(result.status ?? 1);
