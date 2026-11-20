import { describe, expect, it } from "vitest";
import {
  advanceLength,
  cardStatus,
  detectBrand,
  expiryValid,
  formatCardNumber,
  formatExpiry,
  luhnValid,
} from "../../../registry/default/components/credit-card-input/card-utils";

// Card numbers below are the payment industry's public test numbers.
const NOW = new Date(2026, 10, 20); // 20 Nov 2026

describe("detectBrand", () => {
  it.each([
    ["4242424242424242", "visa"],
    ["5555555555554444", "mastercard"],
    ["2223003122003222", "mastercard"],
    ["378282246310005", "amex"],
    ["6011111111111117", "discover"],
    ["3530111333300000", "jcb"],
    ["36227206271667", "diners"],
    ["6200000000000005", "unionpay"],
    ["9999", "unknown"],
  ])("%s is %s", (number, brand) => {
    expect(detectBrand(number)).toBe(brand);
  });
});

describe("formatCardNumber", () => {
  it("groups Amex 4-6-5 and Visa 4-4-4-4", () => {
    expect(formatCardNumber("378282246310005")).toBe("3782 822463 10005");
    expect(formatCardNumber("4242424242424242")).toBe("4242 4242 4242 4242");
  });
  it("drops non-digits and stops at the brand's longest length", () => {
    expect(formatCardNumber("4242-4242 4242.4242 4242 9")).toBe("4242 4242 4242 4242 424");
    expect(formatCardNumber("3782822463100059999")).toBe("3782 822463 10005");
  });
});

describe("luhnValid", () => {
  it("accepts valid numbers and rejects a changed digit", () => {
    expect(luhnValid("4242 4242 4242 4242")).toBe(true);
    expect(luhnValid("4242 4242 4242 4241")).toBe(false);
  });
  it("rejects anything too short to be a card", () => {
    expect(luhnValid("0")).toBe(false);
  });
});

describe("advanceLength", () => {
  it("moves on at 16 digits for brands that also allow 19", () => {
    expect(advanceLength("4242")).toBe(16);
    expect(advanceLength("6011")).toBe(16);
  });
  it("uses the only length for single-length brands", () => {
    expect(advanceLength("3782")).toBe(15);
    expect(advanceLength("3622")).toBe(14);
  });
});

describe("formatExpiry", () => {
  it.each([
    ["1", "", "1"],
    ["3", "", "03/"],
    ["12", "", "12/"],
    ["1230", "", "12/30"],
    ["12/301", "", "12/30"],
    // Deleting the slash deletes the digit before it.
    ["12", "12/", "1"],
  ])("%s (after %s) gives %s", (text, previous, expected) => {
    expect(formatExpiry(text, previous)).toBe(expected);
  });
});

describe("expiryValid", () => {
  it("accepts this month and later, rejects the past and impossible months", () => {
    expect(expiryValid("11/26", NOW)).toBe(true);
    expect(expiryValid("01/27", NOW)).toBe(true);
    expect(expiryValid("10/26", NOW)).toBe(false);
    expect(expiryValid("13/27", NOW)).toBe(false);
    expect(expiryValid("00/27", NOW)).toBe(false);
    expect(expiryValid("1/27", NOW)).toBe(false);
  });
});

describe("cardStatus", () => {
  it("is complete only when every field is valid", () => {
    const amex = { number: "3782 822463 10005", expiry: "12/30", cvc: "1234" };
    expect(cardStatus(amex, NOW)).toMatchObject({ brand: "amex", complete: true });
    expect(cardStatus({ ...amex, cvc: "123" }, NOW).cvcValid).toBe(false);
    expect(cardStatus({ ...amex, expiry: "10/26" }, NOW).complete).toBe(false);
  });
  it("accepts a 16-digit Visa", () => {
    expect(cardStatus({ number: "4242424242424242", expiry: "12/30", cvc: "123" }, NOW).complete).toBe(true);
  });
});
