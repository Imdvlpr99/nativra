#!/usr/bin/env node
/**
 * Builds the live component previews: syncs the registry's StyleSheet sources into
 * apps/native-preview and exports it as a static web app into apps/docs/public/preview/,
 * which item pages embed in an iframe (/preview/index.html?item=<id>...).
 *
 * Usage:
 *   node scripts/build-preview.mjs              # always rebuild (production builds)
 *   node scripts/build-preview.mjs --if-missing # skip when an export exists (dev startup)
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Windows: a lowercase drive letter makes Metro load some modules twice.
const fixDrive = (p) => p.replace(/^[a-z]:/, (d) => d.toUpperCase());
const docsRoot = fixDrive(resolve(dirname(fileURLToPath(import.meta.url)), ".."));
const previewApp = fixDrive(resolve(docsRoot, "../native-preview"));
const out = join(docsRoot, "public", "preview");

if (process.argv.includes("--if-missing") && existsSync(join(out, "index.html"))) {
  console.log("✅ Live previews already exported (run without --if-missing to rebuild)");
  process.exit(0);
}

function run(command, args) {
  const r = spawnSync(command, args, {
    cwd: previewApp,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...process.env, NODE_OPTIONS: "--max-old-space-size=4096", EXPO_NO_TELEMETRY: "1" },
  });
  if (r.status !== 0) {
    console.error(`❌ ${command} ${args.join(" ")} failed`);
    process.exit(r.status ?? 1);
  }
}

const started = Date.now();
run("node", ["scripts/sync-components.mjs"]);
await rm(out, { recursive: true, force: true });
run("npx", ["expo", "export", "--platform", "web", "--output-dir", out]);
console.log(`✅ Live previews exported to public/preview in ${((Date.now() - started) / 1000).toFixed(0)}s`);
