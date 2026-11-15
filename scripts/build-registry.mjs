#!/usr/bin/env node
/**
 * scripts/build-registry.mjs
 *
 * CLI script that runs the registry builder to produce deployable
 * registry.json + per-item JSON output, and syncs static registry
 * artifacts into apps/docs/public for zero-config CDN hosting.
 *
 * Usage: node scripts/build-registry.mjs [--out ./dist/registry] [--pretty]
 */
import { buildRegistry } from "@nativra/registry-builder";
import { cp, mkdir } from "node:fs/promises";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const args = process.argv.slice(2);
const outFlag = args.indexOf("--out");
if (outFlag !== -1 && (!args[outFlag + 1] || args[outFlag + 1].startsWith("--"))) {
  console.error("❌ Error: --out flag requires a destination directory argument.");
  process.exit(1);
}
const outDir = outFlag !== -1 ? resolve(args[outFlag + 1]) : resolve(root, "dist/registry");
const pretty = args.includes("--pretty");

console.log(`Building registry...`);
console.log(`  Source: ${resolve(root, "registry")}`);
console.log(`  Output: ${outDir}`);

const result = await buildRegistry({
  sourceDir: resolve(root, "registry"),
  outDir,
  registryName: "default",
  baseUrl: "https://nativra.vercel.app",
  pretty,
});

if (result.errors.length > 0) {
  console.error("\n❌ Build completed with errors:");
  for (const err of result.errors) {
    console.error(`   - ${err}`);
  }
  process.exit(1);
}

// Mirror static registry files into apps/docs/public when using default output
if (outFlag === -1) {
  const docsPublicDir = resolve(root, "apps/docs/public");
  await mkdir(join(docsPublicDir, "items"), { recursive: true });
  await cp(join(outDir, "registry.json"), join(docsPublicDir, "registry.json"));
  await cp(join(outDir, "items"), join(docsPublicDir, "items"), { recursive: true });
}

console.log(`\n✅ Registry built successfully!`);
console.log(`   ${result.items.length} item(s) published`);
console.log(`   Manifest: ${outDir}/registry.json`);
