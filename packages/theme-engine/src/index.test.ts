import { describe, expect, it } from "vitest";
import {
  defaultTheme,
  toCssVariables,
  toStyleSheetTokens,
  toTailwindPreset,
  getThemePreset,
  THEME_PRESETS,
  zincTheme,
  emeraldTheme,
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
    expect(preset.theme.extend.colors.primary.DEFAULT).toBe("var(--color-primary)");
    expect(preset.theme.extend.borderRadius.md).toBe("8px");
  });
});
