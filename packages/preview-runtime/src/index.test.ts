import { describe, expect, it } from "vitest";
import { PREVIEW_FIXTURES, getFixtures } from "./index.js";

describe("preview-runtime", () => {
  it("returns fixtures per item and [] for unknown", () => {
    expect(getFixtures("button").length).toBeGreaterThan(0);
    expect(getFixtures("nope")).toEqual([]);
  });
  it("has uniquely named fixtures per item", () => {
    for (const list of Object.values(PREVIEW_FIXTURES)) {
      const names = list.map((f) => f.name);
      expect(new Set(names).size).toBe(names.length);
    }
  });
});

