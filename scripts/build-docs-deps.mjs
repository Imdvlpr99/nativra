#!/usr/bin/env node
/**
 * scripts/build-docs-deps.mjs
 *
 * Builds every workspace package the docs depend on (the CLI, registry builder, theme engine, ...)
 * through Turbo. The docs' predev step runs the built CLI, so `pnpm --filter @nativra/docs dev`
 * would otherwise fail on a fresh clone or after `pnpm clean`. Turbo's cache makes repeat runs
 * take seconds, and a changed package is rebuilt so the generated CLI reference stays current.
 */
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = ["exec", "turbo", "run", "build", "--filter=@nativra/docs^...", "--output-logs=errors-only"];

// Run pnpm through node when pnpm started us (npm_execpath), so no shell is needed on Windows.
const pnpmJs = process.env.npm_execpath;
const result = pnpmJs?.endsWith(".js") || pnpmJs?.endsWith(".cjs")
  ? spawnSync(process.execPath, [pnpmJs, ...args], { cwd: root, stdio: "inherit" })
  : spawnSync("pnpm", args, { cwd: root, stdio: "inherit", shell: process.platform === "win32" });

if (result.status !== 0) {
  console.error(`❌ Building the docs' workspace dependencies failed${result.error ? `: ${result.error.message}` : ""}.`);
  process.exit(result.status ?? 1);
}
