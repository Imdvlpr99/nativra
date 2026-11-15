#!/usr/bin/env node
/**
 * Builds src/generated/docs-index.json: the compact, build-time data every page renders from.
 *
 * - Registry metadata (no file contents) from dist/registry/items/*.json
 * - The CLI version from packages/cli/package.json
 * - The compatibility matrix `nativra doctor` checks against
 *
 * Full items (source + docs) are not inlined: pages load them from public/items/<id>.json,
 * the same files the CLI installs from. Run after scripts/build-registry.mjs.
 */
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DEFAULT_COMPATIBILITY_MATRIX } from "@nativra/registry-schema";

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(docsRoot, "../..");
const itemsDir = join(repoRoot, "dist/registry/items");
const out = join(docsRoot, "src/generated/docs-index.json");

if (!existsSync(itemsDir)) {
  console.error(`❌ ${itemsDir} not found. Run node scripts/build-registry.mjs first.`);
  process.exit(1);
}

const cli = JSON.parse(await readFile(join(repoRoot, "packages/cli/package.json"), "utf8"));

const items = [];
for (const file of (await readdir(itemsDir)).filter((f) => f.endsWith(".json")).sort()) {
  const item = JSON.parse(await readFile(join(itemsDir, file), "utf8"));
  items.push({
    id: item.id,
    name: item.name,
    type: item.type,
    description: item.description,
    status: item.status,
    version: item.version,
    tags: item.tags ?? [],
    stylingTargets: item.stylingTargets ?? [],
    platforms: item.platforms ?? {},
    dependencies: (item.registryDependencies ?? []).map((d) => d.id),
    npmDependencies: (item.npmDependencies ?? []).map((d) => ({
      package: d.package,
      version: d.version,
      ...(d.peer ? { peer: true } : {}),
    })),
    files: item.files.map((f) => ({ path: f.path, ...(f.target ? { target: f.target } : {}) })),
    hasDocs: Boolean(item.docs),
    ...(item.deprecationMessage ? { deprecationMessage: item.deprecationMessage } : {}),
  });
}

await mkdir(dirname(out), { recursive: true });
await writeFile(
  out,
  JSON.stringify({ cliVersion: cli.version ?? "0.0.0", matrix: DEFAULT_COMPATIBILITY_MATRIX, items }, null, 2) + "\n",
  "utf8"
);
console.log(`✅ docs-index.json: ${items.length} items, nativra-cli v${cli.version}`);
