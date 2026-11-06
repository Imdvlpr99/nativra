import { describe, expect, it } from "vitest";
import { defaultTheme, toCssVariables, toStyleSheetTokens } from "./index.js";

describe("theme-engine", () => {
  it("emits stylesheet tokens per color scheme", () => {
    expect(toStyleSheetTokens(defaultTheme, "dark").colors.background).toBe("#0a0a0a");
    expect(toStyleSheetTokens(defaultTheme).colors.background).toBe("#ffffff");
  });
  it("emits css variables", () => {
    const css = toCssVariables(defaultTheme);
    expect(css).toContain("--color-primary:");
    expect(css).toContain("--radius-md: 8px;");
  });
});

