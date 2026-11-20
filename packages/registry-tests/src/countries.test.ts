import { describe, expect, it } from "vitest";
import { COUNTRIES, countryByCode, flagOf, searchCountries } from "../../../registry/default/components/country-picker/countries";

describe("COUNTRIES", () => {
  it("has unique, well-formed entries", () => {
    const codes = new Set<string>();
    for (const c of COUNTRIES) {
      expect(c.code, c.name).toMatch(/^[A-Z]{2}$/);
      expect(c.dial, c.name).toMatch(/^[1-9]\d{0,3}$/);
      expect(c.name.length, c.code).toBeGreaterThan(1);
      expect(codes.has(c.code), `duplicate ${c.code}`).toBe(false);
      codes.add(c.code);
    }
    expect(COUNTRIES.length).toBeGreaterThan(200);
  });

  it("is sorted by name", () => {
    const names = COUNTRIES.map((c) => c.name);
    const sorted = [...names].sort((a, b) => a.localeCompare(b, "en"));
    expect(names).toEqual(sorted);
  });

  it("has the dial codes people check first", () => {
    expect(countryByCode("US")?.dial).toBe("1");
    expect(countryByCode("GB")?.dial).toBe("44");
    expect(countryByCode("ID")?.dial).toBe("62");
    expect(countryByCode("IN")?.dial).toBe("91");
    expect(countryByCode("DE")?.dial).toBe("49");
  });
});

describe("flagOf", () => {
  it("builds the regional-indicator pair", () => {
    expect(flagOf("id")).toBe("\u{1F1EE}\u{1F1E9}");
    expect(flagOf("US")).toBe("\u{1F1FA}\u{1F1F8}");
  });
});

describe("countryByCode", () => {
  it("ignores case and returns undefined for unknown or empty codes", () => {
    expect(countryByCode("id")?.name).toBe("Indonesia");
    expect(countryByCode("ZZ")).toBeUndefined();
    expect(countryByCode(undefined)).toBeUndefined();
  });
});

describe("searchCountries", () => {
  it("matches names, exact codes and dial-code prefixes", () => {
    expect(searchCountries("indo").map((c) => c.code)).toContain("ID");
    expect(searchCountries("id").map((c) => c.code)).toContain("ID");
    expect(searchCountries("+44").map((c) => c.code)).toEqual(expect.arrayContaining(["GB", "GG", "IM", "JE"]));
  });
  it("returns the whole list for an empty query", () => {
    expect(searchCountries("  ")).toHaveLength(COUNTRIES.length);
  });
});
