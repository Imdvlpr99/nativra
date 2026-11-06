import { describe, expect, it } from "vitest";
import { generateInstallCommand, generateUsage } from "./index.js";

describe("codegen", () => {
  it("generates usage with children", () => {
    expect(generateUsage("button", { variant: "primary", disabled: true, loading: false, children: "Go" })).toBe(
      '<Button variant="primary" disabled>Go</Button>'
    );
  });
  it("self-closes without children and handles numbers", () => {
    expect(generateUsage("separator", { orientation: "vertical", gap: 4 })).toBe(
      '<Separator orientation="vertical" gap={4} />'
    );
  });
  it("generates install commands", () => {
    expect(generateInstallCommand(["button", "badge"])).toBe("npx nativra add button badge");
    expect(generateInstallCommand("card", "./reg")).toBe("npx nativra add card --registry ./reg");
  });
});

