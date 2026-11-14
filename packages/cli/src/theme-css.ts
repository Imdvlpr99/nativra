import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";
import { THEME_PRESETS, toCssVariables } from "@nativra/theme-engine";
import { fileExists } from "./install.js";

const THEME_BLOCK = /\/\* NATIVRA THEME START: [\s\S]*?\/\* NATIVRA THEME END: .*?\*\//;

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
 * Writes (or replaces) the theme's CSS variables in global.css between marker comments.
 * Returns false when nothing was written.
 */
export async function applyThemeCss(cwd: string, id: string): Promise<boolean> {
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
    const block = `/* NATIVRA THEME START: ${id} */\n@layer base {\n${toCssVariables(tokens)}\n}\n/* NATIVRA THEME END: ${id} */`;
    const updatedCss = THEME_BLOCK.test(existingCss)
      ? existingCss.replace(THEME_BLOCK, block)
      : `${existingCss.trimEnd()}\n\n${block}\n`;
    await writeFile(targetCss, updatedCss, "utf8");
    console.log(chalk.green(`  ✓ Wrote "${id}" theme variables into ${targetCss}`));
    return true;
  } catch (err) {
    console.warn(chalk.yellow(`  ⚠ Could not wire CSS variables: ${(err as Error).message}`));
    return false;
  }
}

/** True when a tailwind config in the project maps colors to Nativra's CSS variables. */
export async function tailwindMapsThemeColors(cwd: string): Promise<boolean | null> {
  for (const name of ["tailwind.config.js", "tailwind.config.ts", "tailwind.config.cjs", "tailwind.config.mjs"]) {
    const path = join(cwd, name);
    if (await fileExists(path)) return (await readFile(path, "utf8")).includes("--color-");
  }
  return null;
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
  card: { DEFAULT: "rgb(var(--color-card) / <alpha-value>)", foreground: "rgb(var(--color-card-foreground) / <alpha-value>)" },
  popover: { DEFAULT: "rgb(var(--color-popover) / <alpha-value>)", foreground: "rgb(var(--color-popover-foreground) / <alpha-value>)" },
},`;
