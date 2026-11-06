import { describe, expect, it } from "vitest";
import { groupBy, parseSemver, sha256, toCamelCase, toKebabCase, toPascalCase, truncate } from "./index.js";

describe("utils", () => {
  it("converts casing", () => {
    expect(toKebabCase("BottomSheet")).toBe("bottom-sheet");
    expect(toPascalCase("bottom-sheet")).toBe("BottomSheet");
    expect(toCamelCase("bottom-sheet")).toBe("bottomSheet");
  });
  it("truncates", () => expect(truncate("abcdef", 4)).toBe("abc…"));
  it("hashes deterministically", () => expect(sha256("a")).toBe(sha256("a")));
  it("parses semver", () => {
    expect(parseSemver("1.2.3")).toEqual({ major: 1, minor: 2, patch: 3 });
    expect(parseSemver("nope")).toBeNull();
  });
  it("groups", () => expect(groupBy([1, 2, 3], (n) => (n % 2 ? "odd" : "even"))).toEqual({ odd: [1, 3], even: [2] }));
});

