#!/usr/bin/env node
/**
 * Every npm range a registry item declares must accept the version the preview app installs. The
 * preview app type-checks every item, so that version is the one the sources are known to work
 * with; a range that excludes it (lucide-react-native "^0.460.0" while the code uses 1.x) tells
 * users to install something older than what was tested.
 *
 *   node scripts/check-registry-deps.mjs
 */
import { readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(import.meta.url), "../..");
const registry = join(root, "registry/default");
const preview = join(root, "apps/native-preview");

const parse = (v) => {
  const m = /^(\d+)(?:\.(\d+))?(?:\.(\d+))?/.exec(v);
  return m ? [Number(m[1]), Number(m[2] ?? 0), Number(m[3] ?? 0)] : null;
};
const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

/** The single-token ranges the registry schema allows: ^x, ~x, >=x, >x, <=x, <x, x, *. */
export function satisfies(version, range) {
  const v = parse(version);
  if (!v) return false;
  if (range === "*" || range === "x" || range === "latest") return true;
  const m = /^(\^|~|>=|>|<=|<|=)?(.+)$/.exec(range);
  const base = m && parse(m[2]);
  if (!base) return false;
  const c = cmp(v, base);
  switch (m[1]) {
    case "^":
      // ^1.2.3 := <2.0.0, ^0.7.1 := <0.8.0, ^0.0.3 := <0.0.4
      if (c < 0) return false;
      if (base[0] > 0) return v[0] === base[0];
      if (base[1] > 0) return v[0] === 0 && v[1] === base[1];
      return v[0] === 0 && v[1] === 0 && v[2] === base[2];
    case "~":
      return c >= 0 && v[0] === base[0] && v[1] === base[1];
    case ">=":
      return c >= 0;
    case ">":
      return c > 0;
    case "<=":
      return c <= 0;
    case "<":
      return c < 0;
    default:
      return c === 0;
  }
}

async function installedVersion(pkg) {
  try {
    const raw = await readFile(join(preview, "node_modules", pkg, "package.json"), "utf8");
    return JSON.parse(raw).version;
  } catch {
    return null;
  }
}

const problems = [];
let checked = 0;
for (const kind of await readdir(registry)) {
  let ids;
  try {
    ids = await readdir(join(registry, kind));
  } catch {
    continue;
  }
  for (const id of ids) {
    let item;
    try {
      item = JSON.parse(await readFile(join(registry, kind, id, "item.json"), "utf8"));
    } catch {
      continue;
    }
    for (const dep of item.npmDependencies ?? []) {
      checked++;
      const version = await installedVersion(dep.package);
      if (!version) {
        problems.push(`${id}: ${dep.package} is not installed in apps/native-preview, so nothing type-checks the item against it`);
      } else if (!satisfies(version, dep.version)) {
        problems.push(`${id}: ${dep.package} "${dep.version}" excludes ${version}, the version apps/native-preview tests with`);
      }
    }
  }
}

if (problems.length > 0) {
  console.error(`❌ Registry npm ranges out of date:\n${problems.map((p) => `   - ${p}`).join("\n")}`);
  process.exit(1);
}
console.log(`✅ ${checked} registry npm range(s) accept the versions apps/native-preview tests with.`);
