#!/usr/bin/env node
/**
 * scripts/generate-themes.mjs
 *
 * @nativra/theme-engine is the single source of truth for theme tokens. This script writes
 * registry/default/themes/<id>/theme.ts from THEME_PRESETS and registry/default/styles/<id>/style.ts
 * from STYLE_PRESETS (plus a starter item.json for new presets), so the installable files can
 * never drift from the engine.
 *
 * Usage:
 *   node scripts/generate-themes.mjs          # write files
 *   node scripts/generate-themes.mjs --check  # exit 1 if any file is out of date (CI)
 */
import { STYLE_PRESETS, THEME_PRESETS } from "@nativra/theme-engine";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const themesDir = join(root, "registry", "default", "themes");
const stylesDir = join(root, "registry", "default", "styles");
const check = process.argv.includes("--check");

const camel = (id) => id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const pascal = (id) => camel(id).replace(/^./, (c) => c.toUpperCase());
const block = (colors) =>
  Object.entries(colors)
    .map(([k, v]) => `  ${/^[a-z]+$/i.test(k) ? k : JSON.stringify(k)}: ${JSON.stringify(v)},`)
    .join("\n");

function renderTheme(theme) {
  const name = camel(theme.id);
  return `/**
 * Nativra theme — ${theme.name}. Edit freely; you own this file.
 * Generated from @nativra/theme-engine by scripts/generate-themes.mjs — do not edit in the registry.
 */
export const ${name} = {
${block(theme.light)}
} as const;

export const ${name}Dark = {
${block(theme.dark)}
} as const;

export type ${pascal(theme.id)}Theme = typeof ${name};

/**
 * The active palette pair. Components read this through the use-theme-colors hook, so
 * installing a different theme over this file restyles every component. Shape, type and
 * density live separately in style.ts (npx nativra-cli style add <id>).
 */
export const themeColors = { light: ${name}, dark: ${name}Dark } as const;
`;
}

function renderStyleFile(style) {
  return `/**
 * Nativra style — ${style.name}. Edit freely; you own this file.
 * Generated from @nativra/theme-engine by scripts/generate-themes.mjs — do not edit in the registry.
 *
 * The UI's character, independent of its colors: radii by role, shadows, type scale, density,
 * surfaces, input fields and press feedback. Every component reads it through use-theme-colors,
 * so installing another style (npx nativra-cli style add <id>) restyles the whole app.
 */
export const themeStyle = ${renderStyle(style)} as const;
`;
}

const STYLE_DESCRIPTIONS = {
  soft: "Pill buttons, generous rounding and soft layered shadows. The default.",
  crisp: "Small radii, hairline borders instead of shadows, compact and neutral, in the spirit of shadcn/ui.",
  tailwind: "Medium radii, faint rings with layered shadows and roomy spacing, in the spirit of Tailwind UI.",
  material: "Large radii, tonal surfaces, filled fields and lighter headings, in the spirit of Material 3.",
  ios: "Grey grouped surfaces, hairlines, larger type and dimming press feedback, in the spirit of iOS.",
};

function renderStyleItem(style) {
  return `${JSON.stringify(
    {
      id: style.id,
      name: `${style.name} style`,
      description: STYLE_DESCRIPTIONS[style.id] ?? `The ${style.name} style.`,
      type: "style",
      version: "0.1.0",
      stylingTargets: ["nativewind", "stylesheet"],
      platforms: { android: true, ios: true },
      files: [{ path: "style.ts" }],
      tags: ["style", style.id, "tokens"],
    },
    null,
    2
  )}\n`;
}

/** Pretty-prints the style tokens as a TypeScript object literal. */
function renderStyle(style) {
  const lit = (value, indent) => {
    if (typeof value !== "object") return JSON.stringify(value);
    const pad = "  ".repeat(indent + 1);
    const entries = Object.entries(value).map(([k, v]) => `${pad}${k}: ${lit(v, indent + 1)},`);
    return `{\n${entries.join("\n")}\n${"  ".repeat(indent)}}`;
  };
  return lit(style, 0);
}

function renderItem(theme) {
  return `${JSON.stringify(
    {
      id: theme.id,
      name: theme.name.replace(/\s*\(.*\)$/, ""),
      description: `The ${theme.name.replace(/\s*\(.*\)$/, "").toLowerCase()} theme token set (light and dark).`,
      type: "theme",
      version: "0.1.0",
      stylingTargets: ["nativewind", "stylesheet"],
      platforms: { android: true, ios: true },
      files: [{ path: "theme.ts" }],
      tags: ["theme", theme.id, "tokens"],
    },
    null,
    2
  )}\n`;
}

async function readOrNull(path) {
  try {
    return await readFile(path, "utf8");
  } catch {
    return null;
  }
}

const themes = [...new Map(Object.values(THEME_PRESETS).map((t) => [t.id, t])).values()];
const stale = [];

for (const theme of themes) {
  const dir = join(themesDir, theme.id);
  const outputs = [[join(dir, "theme.ts"), renderTheme(theme), true]];
  // item.json is authored metadata: only created when missing, never overwritten.
  outputs.push([join(dir, "item.json"), renderItem(theme), false]);

  await emit(dir, outputs);
}

for (const style of Object.values(STYLE_PRESETS)) {
  const dir = join(stylesDir, style.id);
  await emit(dir, [
    [join(dir, "style.ts"), renderStyleFile(style), true],
    [join(dir, "item.json"), renderStyleItem(style), false],
  ]);
}

async function emit(dir, outputs) {
  for (const [path, content, owned] of outputs) {
    const current = await readOrNull(path);
    if (current !== null && (!owned || current.replace(/\r\n/g, "\n") === content)) continue;
    stale.push(path);
    if (!check) {
      await mkdir(dir, { recursive: true });
      await writeFile(path, content, "utf8");
    }
  }
}

if (check && stale.length > 0) {
  console.error("❌ Registry theme and style files are out of date with @nativra/theme-engine:");
  for (const p of stale) console.error(`   - ${p}`);
  console.error("   Run: node scripts/generate-themes.mjs");
  process.exit(1);
}
console.log(check ? "✅ Registry themes match @nativra/theme-engine." : `✅ Wrote ${stale.length} theme file(s).`);
