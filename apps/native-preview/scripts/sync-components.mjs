#!/usr/bin/env node
/**
 * Copies the StyleSheet implementation of every registry component from the
 * registry into apps/native-preview/components/nativra, so the preview app
 * runs the exact same source that the CLI would install (no Nativra runtime package).
 */
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const builtItemsDir = resolve(here, "../../../dist/registry/items");
const sourceComponentsDir = resolve(here, "../../../registry/default/components");
const out = resolve(here, "../components/nativra");
await mkdir(out, { recursive: true });

const names = [];
if (existsSync(builtItemsDir)) {
  for (const file of (await readdir(builtItemsDir)).sort()) {
    const item = JSON.parse(await readFile(join(builtItemsDir, file), "utf8"));
    if (item.type !== "component") continue;
    for (const f of item.files) {
      if (f.target && f.target !== "stylesheet") continue;
      const name = f.path.split("/").pop();
      await writeFile(join(out, name), f.content ?? "", "utf8");
      names.push(name.replace(/\.tsx$/, ""));
    }
  }
} else {
  for (const entry of (await readdir(sourceComponentsDir)).sort()) {
    const itemDir = join(sourceComponentsDir, entry);
    const defPath = join(itemDir, "item.json");
    if (!existsSync(defPath)) continue;
    const item = JSON.parse(await readFile(defPath, "utf8"));
    if (item.type !== "component") continue;
    for (const f of item.files ?? []) {
      if (f.target && f.target !== "stylesheet") continue;
      const name = f.path.split("/").pop();
      const content = await readFile(resolve(itemDir, f.path), "utf8");
      await writeFile(join(out, name), content, "utf8");
      names.push(name.replace(/\.tsx$/, ""));
    }
  }
}

await writeFile(
  join(out, "index.ts"),
  names.map((n) => `export * from "./${n}";`).join("\n") + "\n",
  "utf8"
);
console.log(`Synced ${names.length} component(s): ${names.join(", ")}`);

