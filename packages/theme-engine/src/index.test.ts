import { describe, expect, it } from "vitest";
import {
  defaultTheme,
  toCssVariables,
  toStyleSheetTokens,
  toTailwindPreset,
  getThemePreset,
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
    const themeObj = preset["theme"] as Record<string, any>;
    expect(themeObj["extend"]["colors"]["primary"]["DEFAULT"]).toBe("var(--color-primary)");
    expect(themeObj["extend"]["borderRadius"]["md"]).toBe("8px");
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
