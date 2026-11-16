import { describe, expect, it } from "vitest";
import {
  defaultTheme,
  toStyleCss,
  toCssVariables,
  toStyleSheetTokens,
  toTailwindPreset,
  hexToRgbChannels,
  getThemePreset,
  getStylePreset,
  STYLE_PRESETS,
  THEME_PRESETS,
  emeraldTheme,
  getTypographyScale,
  applyHighContrast,
  resolveThemeTokens,
} from "./index.js";

describe("theme-engine", () => {
  it("emits stylesheet tokens per color scheme", () => {
    expect(toStyleSheetTokens(defaultTheme, "dark").colors.background).toBe("#09090b");
    expect(toStyleSheetTokens(defaultTheme).colors.background).toBe("#ffffff");
  });

  it("emits css variables", () => {
    const css = toCssVariables(defaultTheme);
    expect(css).toContain("--color-primary:");
    expect(css).toContain("--radius-md: 8px;");
  });

  it("emits RGB channels so Tailwind opacity modifiers work", () => {
    expect(hexToRgbChannels("#18181b")).toBe("24 24 27");
    expect(hexToRgbChannels("#fff")).toBe("255 255 255");
    expect(toCssVariables(defaultTheme)).toMatch(/--color-primary: \d+ \d+ \d+;/);
  });

  it("wraps dark tokens in a valid media block", () => {
    const css = toCssVariables(defaultTheme);
    expect(css).toContain("@media (prefers-color-scheme: dark) {\n  :root {");
    expect(css).not.toMatch(/@media \([^)]*\) :root/);
    // braces balance
    expect(css.split("{").length).toBe(css.split("}").length);
  });

  it("provides all 8 official theme presets", () => {
    const expected = ["zinc", "slate", "emerald", "violet", "rose", "amber", "orange", "cyan"];
    for (const id of expected) {
      expect(THEME_PRESETS[id]).toBeDefined();
      expect(THEME_PRESETS[id]?.name).toBeTruthy();
      expect(THEME_PRESETS[id]?.light.primary).toBeTruthy();
      expect(THEME_PRESETS[id]?.dark.primary).toBeTruthy();
    }
  });

  it("resolves presets safely with fallback", () => {
    expect(getThemePreset("emerald").id).toBe("emerald");
    expect(getThemePreset("EMERALD").id).toBe("emerald");
    expect(getThemePreset("unknown-theme").id).toBe("zinc");
  });

  it("generates tailwind theme.extend configuration object", () => {
    const preset = toTailwindPreset(emeraldTheme);
    const themeObj = preset["theme"] as {
      extend: {
        colors: { primary: { DEFAULT: string } };
        borderRadius: { md: string };
      };
    };
    expect(themeObj.extend.colors.primary.DEFAULT).toBe("rgb(var(--color-primary) / <alpha-value>)");
    expect(themeObj.extend.borderRadius.md).toBe("8px");
  });

  it("scales typography and spacing by density and fontScale presets", () => {
    const regularScale = getTypographyScale("regular", "md");
    const compactScale = getTypographyScale("compact", "sm");
    const largeScale = getTypographyScale("comfortable", "xl");

    expect(compactScale.h1.fontSize).toBeLessThan(regularScale.h1.fontSize);
    expect(largeScale.h1.fontSize).toBeGreaterThan(regularScale.h1.fontSize);
    expect(regularScale.displayLarge.tabularNums).toBe(true);
  });

  it("applies high-contrast accessibility overrides and resolves full theme tokens", () => {
    const highContrastLight = applyHighContrast(defaultTheme.light, "light");
    expect(highContrastLight.foreground).toBe("#000000");

    const resolved = resolveThemeTokens(defaultTheme, {
      colorScheme: "dark",
      density: "compact",
      fontScale: "lg",
      highContrast: true,
    });

    expect(resolved.colors.background).toBe("#000000");
    expect(resolved.colors.foreground).toBe("#ffffff");
    expect(resolved.space["4"]).toBe(Math.round(defaultTheme.space["4"] * 0.85));
    expect(resolved.typography.body.fontSize).toBeGreaterThan(15);
  });
});

describe("style tokens and status colors", () => {
  it("gives every preset status colors in both palettes", () => {
    for (const theme of Object.values(THEME_PRESETS)) {
      for (const palette of [theme.light, theme.dark]) {
        expect(palette.success).toMatch(/^#[0-9a-f]{6}$/i);
        expect(palette["warning-foreground"]).toMatch(/^#[0-9a-f]{6}$/i);
        expect(palette.info).toMatch(/^#[0-9a-f]{6}$/i);
      }
    }
    expect(toCssVariables(defaultTheme)).toContain("--color-success:");
  });

  it("emits semantic radius classes from the style tokens", () => {
    const css = toStyleCss(defaultTheme);
    expect(css).toContain(`.rounded-button { border-radius: ${defaultTheme.style.radius.button}px; }`);
    expect(css).toContain(".rounded-t-surface { border-top-left-radius:");
  });

  it("ships five distinct style presets", () => {
    expect(Object.keys(STYLE_PRESETS)).toEqual(["soft", "crisp", "tailwind", "material", "ios"]);
    const fingerprints = Object.values(STYLE_PRESETS).map((s) =>
      JSON.stringify([s.radius.button, s.surface, s.field, s.press, s.typeScale, s.control.height])
    );
    expect(new Set(fingerprints).size).toBe(5);
    for (const s of Object.values(STYLE_PRESETS)) expect(getStylePreset(s.id)).toBe(s);
    expect(getStylePreset("unknown").id).toBe("soft");
  });

  it("generates the installed style's type, control, surface and field classes", () => {
    const crisp = toStyleCss(defaultTheme, STYLE_PRESETS.crisp);
    expect(crisp).toContain("/* style: crisp */");
    expect(crisp).toContain(`.type-base { font-size: ${Math.round(16 * STYLE_PRESETS.crisp!.typeScale)}px;`);
    expect(crisp).toContain(`.h-control { height: ${STYLE_PRESETS.crisp!.control.height}px; }`);
    expect(crisp).toContain(".surface { background-color: rgb(var(--color-card)); border-width: 1px; border-color: rgb(var(--color-border)); }");

    // Density twins of Tailwind's spacing: crisp (0.9) is tighter than Tailwind's p-4 (1rem).
    expect(crisp).toContain(".sp-p-4 { padding: 0.9rem; }");
    expect(crisp).toContain(".sp-gap-2\\.5 { gap: 0.5625rem; }");
    expect(toStyleCss(defaultTheme, STYLE_PRESETS.soft)).toContain(".sp-px-4 { padding-left: 1rem; padding-right: 1rem; }");

    const material = toStyleCss(defaultTheme, STYLE_PRESETS.material);
    expect(material).toContain(".surface { background-color: rgb(var(--color-primary) / 0.07); border-width: 0px; }");
    expect(material).toContain(".field { background-color: rgb(var(--color-foreground) / 0.06); border-width: 0px; }");
    expect(material).toContain(".weight-heading { font-weight: 400;");
  });

  it("emits a dark scrim class that stays black in both color schemes", () => {
    expect(toStyleCss(defaultTheme)).toContain(
      `.bg-scrim { background-color: rgba(0, 0, 0, ${defaultTheme.style.scrimOpacity}); }`
    );
  });

  it("preset lookups ignore Object.prototype members", () => {
    expect(STYLE_PRESETS["constructor"]).toBeUndefined();
    expect(THEME_PRESETS["toString"]).toBeUndefined();
    expect(getStylePreset("constructor")).toBe(STYLE_PRESETS.soft);
    expect(getThemePreset("constructor")).toBe(THEME_PRESETS.zinc);
  });
});
