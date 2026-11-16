import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";
import { STYLE_PRESETS, THEME_PRESETS, getStylePreset, toCssVariables, toStyleCss } from "@nativra/theme-engine";
import { TAILWIND_CONFIG_NAMES } from "./detect.js";
import { assertSafeWriteTarget, fileExists, type LockFile } from "./install.js";

const THEME_BLOCK = /\/\* NATIVRA THEME START: [\s\S]*?\/\* NATIVRA THEME END: .*?\*\//;

/**
 * A slot is a file that exactly one item of a kind fills: the colors in theme.ts and the style in
 * style.ts. Components depend on a default ("zinc", "soft"), but any installed item of the same
 * kind satisfies that dependency.
 */
export type SlotKind = "theme" | "style";

const SLOT_FILES: Record<SlotKind, string> = { theme: "theme.ts", style: "style.ts" };
const BUILT_IN: Record<SlotKind, Record<string, unknown>> = { theme: THEME_PRESETS, style: STYLE_PRESETS };

/** True for items of the kind: by recorded type, or by built-in id for lockfiles written before 0.3. */
export function isSlotItem(lock: LockFile, id: string, kind: SlotKind): boolean {
  const recorded = lock.items[id]?.type;
  return recorded ? recorded === kind : Object.prototype.hasOwnProperty.call(BUILT_IN[kind], id);
}

/** True for theme items. */
export function isThemeId(lock: LockFile, id: string): boolean {
  return isSlotItem(lock, id, "theme");
}

/** Whether a lock entry tracks the slot's file (`<themesDir>/theme.ts` or `style.ts`). */
function ownsSlot(lock: LockFile, id: string, kind: SlotKind): boolean {
  const file = SLOT_FILES[kind];
  return Object.keys(lock.items[id]?.files ?? {}).some((key) => key === file || key.endsWith(`/${file}`));
}

function installedSlotId(lock: LockFile, kind: SlotKind): string | undefined {
  const ids = Object.keys(lock.items).filter((id) => isSlotItem(lock, id, kind));
  return ids.find((id) => ownsSlot(lock, id, kind)) ?? ids[0];
}

/** Id of the theme in theme.ts, if the lockfile tracks one. */
export function installedThemeId(lock: LockFile): string | undefined {
  return installedSlotId(lock, "theme");
}

/** Id of the style in style.ts, if the lockfile tracks one. */
export function installedStyleId(lock: LockFile): string | undefined {
  return installedSlotId(lock, "style");
}

/**
 * Installed items that need the theme or style that `id` provides. Removing whichever item fills
 * theme.ts or style.ts breaks every component that imports it.
 */
export function themeSlotDependents(lock: LockFile, id: string): string[] {
  const kind = (["theme", "style"] as const).find((k) => isSlotItem(lock, id, k) && ownsSlot(lock, id, k));
  if (!kind) return [];
  return Object.entries(lock.items)
    .filter(([otherId, entry]) => otherId !== id && (entry.dependencies ?? []).some((dep) => isSlotItem(lock, dep, kind)))
    .map(([otherId]) => otherId);
}

/** First existing global stylesheet in the conventional NativeWind locations. */
export async function findGlobalCss(cwd: string): Promise<string | null> {
  for (const candidate of [join(cwd, "global.css"), join(cwd, "src", "global.css"), join(cwd, "app", "global.css")]) {
    if (await fileExists(candidate)) return candidate;
  }
  return null;
}

export async function hasThemeCss(cssPath: string): Promise<boolean> {
  return THEME_BLOCK.test(await readFile(cssPath, "utf8"));
}

/**
 * The installed theme block's id when it needs rewriting, so the CLI can refresh it while keeping
 * the theme: the block predates the current classes (status colors, shape, scrim, type scale),
 * or it was written for a different style than `styleId`. Null when it's current or absent.
 */
export async function outdatedThemeCss(cssPath: string, styleId?: string): Promise<string | null> {
  const block = THEME_BLOCK.exec(await readFile(cssPath, "utf8"))?.[0];
  if (!block) return null;
  const current =
    block.includes("--color-success") &&
    block.includes(".rounded-card") &&
    block.includes(".bg-scrim") &&
    block.includes(".type-base") &&
    block.includes(".sp-p-4") &&
    (!styleId || block.includes(`/* style: ${styleId} */`));
  return current ? null : (/NATIVRA THEME START: ([a-z0-9-]+)/.exec(block)?.[1] ?? null);
}

/**
 * Writes (or replaces) the theme's CSS variables and the style's classes in global.css between
 * marker comments. Returns false when nothing was written.
 */
export async function applyThemeCss(cwd: string, id: string, styleId?: string): Promise<boolean> {
  const tokens = THEME_PRESETS[id];
  if (!tokens) {
    console.warn(
      chalk.yellow(`  ⚠ No built-in CSS token preset for "${id}"; global.css was not changed. Wire its variables manually.`)
    );
    return false;
  }

  const targetCss = await findGlobalCss(cwd);
  if (!targetCss) {
    console.log(chalk.yellow(`  ⚠ No global.css found. Create global.css to wire CSS variables automatically.`));
    return false;
  }

  try {
    const existingCss = await readFile(targetCss, "utf8");
    const style = getStylePreset(styleId);
    // Style classes sit outside @layer so Tailwind emits them as written (never purged).
    const block = `/* NATIVRA THEME START: ${id} */\n@layer base {\n${toCssVariables(tokens)}\n}\n${toStyleCss(tokens, style)}\n/* NATIVRA THEME END: ${id} */`;
    const updatedCss = THEME_BLOCK.test(existingCss)
      ? existingCss.replace(THEME_BLOCK, () => block)
      : `${existingCss.trimEnd()}\n\n${block}\n`;
    await writeFile(await assertSafeWriteTarget(cwd, targetCss), updatedCss, "utf8");
    console.log(chalk.green(`  ✓ Wrote the "${id}" theme with the "${style.id}" style into ${targetCss}`));
    return true;
  } catch (err) {
    console.warn(chalk.yellow(`  ⚠ Could not wire CSS variables: ${(err as Error).message}`));
    return false;
  }
}

export { TAILWIND_CONFIG_NAMES };

/** Path of the project's Tailwind config, whichever extension it uses, or null. */
export async function findTailwindConfig(cwd: string): Promise<string | null> {
  for (const name of TAILWIND_CONFIG_NAMES) {
    const path = join(cwd, name);
    if (await fileExists(path)) return path;
  }
  return null;
}

/** True when the project's tailwind config maps Nativra's colors, including the status colors. */
export async function tailwindMapsThemeColors(cwd: string): Promise<boolean | null> {
  const path = await findTailwindConfig(cwd);
  return path ? (await readFile(path, "utf8")).includes("--color-success") : null;
}

/**
 * NativeWind components use semantic classes (bg-primary, rounded-card, ...) backed by the theme
 * block in global.css. Writes the block when it's missing, refreshes it when it predates the
 * current tokens (keeping the installed theme), and says so when Tailwind doesn't map the colors.
 */
export async function ensureNativeWindTheme(cwd: string, themeId: string, styleId?: string): Promise<void> {
  const css = await findGlobalCss(cwd);
  if (css) {
    if (!(await hasThemeCss(css))) {
      await applyThemeCss(cwd, themeId, styleId);
    } else {
      const outdated = await outdatedThemeCss(css, styleId);
      if (outdated) await applyThemeCss(cwd, outdated, styleId);
    }
  }
  if ((await tailwindMapsThemeColors(cwd)) === false) {
    console.log(
      chalk.yellow("\n  ⚠ tailwind.config doesn't map all of Nativra's theme colors yet. Put this in theme.extend:\n") +
        chalk.gray(TAILWIND_COLORS_SNIPPET.replace(/^/gm, "    "))
    );
  }
}

/** The colors block to paste into tailwind.config.js (shown by add/doctor when it's missing). */
export const TAILWIND_COLORS_SNIPPET = `colors: {
  border: "rgb(var(--color-border) / <alpha-value>)",
  input: "rgb(var(--color-input) / <alpha-value>)",
  ring: "rgb(var(--color-ring) / <alpha-value>)",
  background: "rgb(var(--color-background) / <alpha-value>)",
  foreground: "rgb(var(--color-foreground) / <alpha-value>)",
  primary: { DEFAULT: "rgb(var(--color-primary) / <alpha-value>)", foreground: "rgb(var(--color-primary-foreground) / <alpha-value>)" },
  secondary: { DEFAULT: "rgb(var(--color-secondary) / <alpha-value>)", foreground: "rgb(var(--color-secondary-foreground) / <alpha-value>)" },
  muted: { DEFAULT: "rgb(var(--color-muted) / <alpha-value>)", foreground: "rgb(var(--color-muted-foreground) / <alpha-value>)" },
  accent: { DEFAULT: "rgb(var(--color-accent) / <alpha-value>)", foreground: "rgb(var(--color-accent-foreground) / <alpha-value>)" },
  destructive: { DEFAULT: "rgb(var(--color-destructive) / <alpha-value>)", foreground: "rgb(var(--color-destructive-foreground) / <alpha-value>)" },
  success: { DEFAULT: "rgb(var(--color-success) / <alpha-value>)", foreground: "rgb(var(--color-success-foreground) / <alpha-value>)" },
  warning: { DEFAULT: "rgb(var(--color-warning) / <alpha-value>)", foreground: "rgb(var(--color-warning-foreground) / <alpha-value>)" },
  info: { DEFAULT: "rgb(var(--color-info) / <alpha-value>)", foreground: "rgb(var(--color-info-foreground) / <alpha-value>)" },
  card: { DEFAULT: "rgb(var(--color-card) / <alpha-value>)", foreground: "rgb(var(--color-card-foreground) / <alpha-value>)" },
  popover: { DEFAULT: "rgb(var(--color-popover) / <alpha-value>)", foreground: "rgb(var(--color-popover-foreground) / <alpha-value>)" },
},`;
