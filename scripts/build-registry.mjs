#!/usr/bin/env node
/**
 * scripts/build-registry.mjs
 *
 * CLI script that runs the registry builder to produce deployable
 * registry.json + per-item JSON output.
 *
 * Usage: node scripts/build-registry.mjs [--out ./dist/registry] [--pretty]
 */
import { buildRegistry } from "@nativra/registry-builder";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const args = process.argv.slice(2);
const outFlag = args.indexOf("--out");
const outDir = outFlag !== -1 ? resolve(args[outFlag + 1]) : resolve(root, "dist/registry");
const pretty = args.includes("--pretty");

console.log(`Building registry...`);
console.log(`  Source: ${resolve(root, "registry")}`);
console.log(`  Output: ${outDir}`);

const result = await buildRegistry({
  sourceDir: resolve(root, "registry"),
  outDir,
  registryName: "default",
  baseUrl: "https://registry.nativra.dev",
  pretty,
});

if (result.errors.length > 0) {
  console.error("\n❌ Build completed with errors:");
  for (const err of result.errors) {
    console.error(`   - ${err}`);
  }
  process.exit(1);
}

console.log(`\n✅ Registry built successfully!`);
console.log(`   ${result.items.length} item(s) published`);
console.log(`   Manifest: ${outDir}/registry.json`);

