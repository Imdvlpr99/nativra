#!/usr/bin/env node
/**
 * The example apps are real installs (nativra.json + nativra.lock.json + installed files). This
 * runs `nativra update --check` in each against the freshly built registry, so CI fails when a
 * registry change leaves them behind. Refresh them with `--fix`.
 *
 *   node scripts/check-examples.mjs          # needs packages/cli/dist and dist/registry
 *   node scripts/check-examples.mjs --fix    # run `nativra update` in each instead
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(import.meta.url), "../..");
const cli = join(root, "packages/cli/dist/cli.js");
const registry = join(root, "dist/registry");
const fix = process.argv.includes("--fix");

if (!existsSync(cli) || !existsSync(join(registry, "registry.json"))) {
  console.error("Build the CLI and the registry first: pnpm turbo run build --filter=nativra-cli... && node scripts/build-registry.mjs");
  process.exit(1);
}

let failed = false;
for (const name of readdirSync(join(root, "examples"))) {
  const cwd = join(root, "examples", name);
  if (!existsSync(join(cwd, "nativra.json"))) continue;
  const args = [cli, "update", "--cwd", cwd, "--registry", registry, ...(fix ? [] : ["--check"])];
  const r = spawnSync(process.execPath, args, { encoding: "utf8" });
  const ok = r.status === 0;
  console.log(`${ok ? "✅" : "❌"} examples/${name}${ok ? "" : ` is out of date:\n${r.stdout}${r.stderr}`}`);
  failed ||= !ok;
}
if (failed) {
  console.error("Refresh with: node scripts/check-examples.mjs --fix");
  process.exit(1);
}
