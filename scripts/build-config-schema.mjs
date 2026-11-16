#!/usr/bin/env node
/**
 * scripts/build-config-schema.mjs
 *
 * Writes apps/docs/public/schema.json from the CLI's NativraConfigSchema, so the "$schema" URL in
 * every nativra.json resolves and can never drift from what the CLI accepts.
 *
 * Requires packages/cli/dist (run the CLI build first).
 */
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const lib = join(root, "packages/cli/dist/index.js");
const out = join(root, "apps/docs/public/schema.json");

if (!existsSync(lib)) {
  console.error(`❌ ${lib} not found. Build the CLI first (pnpm --filter nativra-cli build).`);
  process.exit(1);
}

const { nativraConfigJsonSchema } = await import(pathToFileURL(lib).href);
await writeFile(out, JSON.stringify(nativraConfigJsonSchema(), null, 2) + "\n", "utf8");
console.log(`✅ nativra.json schema → ${out}`);
