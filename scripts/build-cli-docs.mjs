#!/usr/bin/env node
/**
 * scripts/build-cli-docs.mjs
 *
 * Generates apps/docs/lib/generated/cli.json from the built CLI's own `--help` output,
 * so the docs CLI reference can never drift from the real commands and flags.
 *
 * Requires packages/cli/dist/cli.js (run the CLI build first).
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cli = join(root, "packages/cli/dist/cli.js");
const out = join(root, "apps/docs/lib/generated/cli.json");

if (!existsSync(cli)) {
  console.error(`❌ ${cli} not found. Build the CLI first (pnpm --filter nativra-cli build).`);
  process.exit(1);
}

function help(args) {
  const r = spawnSync(process.execPath, [cli, ...args, "--help"], {
    encoding: "utf8",
    // Wide output so descriptions are not wrapped; neutral cwd so defaults don't leak local paths.
    env: { ...process.env, COLUMNS: "400" },
    cwd: root,
  });
  if (r.status !== 0) throw new Error(`nativra ${args.join(" ")} --help failed: ${r.stderr}`);
  return r.stdout;
}

/** Parses a commander "Options:" or "Commands:" block into [term, description] pairs. */
function section(text, title) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((l) => l.trim() === `${title}:`);
  if (start === -1) return [];
  const entries = [];
  for (const line of lines.slice(start + 1)) {
    if (!line.trim()) break;
    const m = line.match(/^ {2}(\S.*?)(?: {2,}(.*))?$/);
    if (m) entries.push([m[1].trim(), (m[2] ?? "").trim()]);
    else if (entries.length) entries[entries.length - 1][1] += ` ${line.trim()}`;
  }
  return entries;
}

function parse(args) {
  const text = help(args);
  const usage = text.match(/^Usage: (.+)$/m)?.[1]?.trim() ?? "";
  const description = text.split(/\r?\n\r?\n/)[1]?.trim() ?? "";
  const options = section(text, "Options")
    .filter(([flags]) => !/^-h, --help/.test(flags))
    .map(([flags, desc]) => ({
      flags,
      // The --cwd default is the machine's current directory: not meaningful in docs.
      description: desc.replace(/\s*\(default: "[^"]*[\\/][^"]*"\)/, "").trim(),
    }));
  const subcommands = section(text, "Commands")
    .map(([term]) => term.split(" ")[0])
    .filter((name) => name !== "help")
    .map((name) => parse([...args, name]));
  return { name: args.join(" "), usage: usage.replace(/^nativra /, "nativra-cli "), description, options, subcommands };
}

const program = parse([]);
const commands = program.subcommands.flatMap((c) => (c.subcommands.length ? c.subcommands : [c]));

await mkdir(dirname(out), { recursive: true });
await writeFile(out, `${JSON.stringify({ commands }, null, 2)}\n`, "utf8");
console.log(`✅ CLI reference: ${commands.length} commands → ${out}`);
