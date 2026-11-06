#!/usr/bin/env node
/**
 * Copies the StyleSheet implementation of every registry component from the
 * built registry into apps/native-preview/components/nativra, so the preview app
 * runs the exact same source that the CLI would install (no Nativra runtime package).
 *
 * Requires `node scripts/build-registry.mjs` to have run first.
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const built = resolve(here, "../../../dist/registry");
const out = resolve(here, "../components/nativra");
await mkdir(out, { recursive: true });

const names = [];
for (const file of await readdir(join(built, "items"))) {
  const item = JSON.parse(await readFile(join(built, "items", file), "utf8"));
  if (item.type !== "component") continue;
  for (const f of item.files) {
    if (f.target && f.target !== "stylesheet") continue;
    const name = f.path.split("/").pop();
    await writeFile(join(out, name), f.content ?? "", "utf8");
    names.push(name.replace(/\.tsx$/, ""));
  }
}
await writeFile(
  join(out, "index.ts"),
  names.map((n) => `export * from "./${n}";`).join("\n") + "\n",
  "utf8"
);
console.log(`Synced ${names.length} component(s): ${names.join(", ")}`);

