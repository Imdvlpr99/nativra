/** Nativra — card number helpers for CreditCardInput. Install: npx nativra-cli add credit-card-input */

export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "jcb" | "diners" | "unionpay" | "unknown";

interface BrandRule {
  brand: CardBrand;
  pattern: RegExp;
  /** Digit groups for display, e.g. [4, 6, 5] for Amex. */
  groups: number[];
  lengths: number[];
  cvc: number;
}

const RULES: BrandRule[] = [
  { brand: "amex", pattern: /^3[47]/, groups: [4, 6, 5], lengths: [15], cvc: 4 },
  { brand: "diners", pattern: /^3(?:0[0-5]|[689])/, groups: [4, 6, 4], lengths: [14], cvc: 3 },
  { brand: "jcb", pattern: /^35(?:2[89]|[3-8])/, groups: [4, 4, 4, 4], lengths: [16, 17, 18, 19], cvc: 3 },
  { brand: "visa", pattern: /^4/, groups: [4, 4, 4, 4, 3], lengths: [13, 16, 19], cvc: 3 },
  { brand: "mastercard", pattern: /^(?:5[1-5]|2(?:2[2-9]|[3-6]\d|7[01]|720))/, groups: [4, 4, 4, 4], lengths: [16], cvc: 3 },
  { brand: "discover", pattern: /^(?:6011|64[4-9]|65)/, groups: [4, 4, 4, 4, 3], lengths: [16, 19], cvc: 3 },
  { brand: "unionpay", pattern: /^62/, groups: [4, 4, 4, 4, 3], lengths: [16, 17, 18, 19], cvc: 3 },
];
const UNKNOWN: BrandRule = { brand: "unknown", pattern: /$^/, groups: [4, 4, 4, 4, 3], lengths: [16], cvc: 3 };

export const BRAND_LABEL: Record<CardBrand, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  discover: "Discover",
  jcb: "JCB",
  diners: "Diners Club",
  unionpay: "UnionPay",
  unknown: "Card",
};

const digitsOf = (s: string) => s.replace(/\D/g, "");

export function ruleFor(number: string): BrandRule {
  const d = digitsOf(number);
  return RULES.find((r) => r.pattern.test(d)) ?? UNKNOWN;
}

export const detectBrand = (number: string): CardBrand => ruleFor(number).brand;

/** Most digits the brand allows. */
export const maxLength = (number: string) => Math.max(...ruleFor(number).lengths);

/** "4242424242424242" -> "4242 4242 4242 4242" (Amex: "3782 822463 10005"). */
export function formatCardNumber(number: string): string {
  const rule = ruleFor(number);
  const d = digitsOf(number).slice(0, Math.max(...rule.lengths));
  const parts: string[] = [];
  let at = 0;
  for (const size of rule.groups) {
    if (at >= d.length) break;
    parts.push(d.slice(at, at + size));
    at += size;
  }
  return parts.join(" ");
}

/** The Luhn checksum every card number carries. */
export function luhnValid(number: string): boolean {
  const d = digitsOf(number);
  if (d.length < 12) return false;
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  return sum % 10 === 0;
}

/** "1", "12" -> "12", "125" -> "12/5": typed digits as MM/YY. A leading 2-9 becomes "0X". */
export function formatExpiry(text: string, previous = ""): string {
  let d = digitsOf(text).slice(0, 4);
  if (d.length === 1 && Number(d) > 1) d = `0${d}`;
  // Deleting the slash deletes the digit before it.
  if (previous.endsWith("/") && text.length < previous.length) return d.slice(0, 1);
  return d.length >= 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

/** An MM/YY expiry that is a real month and not in the past. */
export function expiryValid(expiry: string, now = new Date()): boolean {
  const m = /^(\d{2})\/(\d{2})$/.exec(expiry);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

export interface CardValue {
  number: string;
  expiry: string;
  cvc: string;
}

export interface CardStatus {
  brand: CardBrand;
  numberValid: boolean;
  expiryValid: boolean;
  cvcValid: boolean;
  /** Every field is filled and valid. */
  complete: boolean;
}

export function cardStatus(value: CardValue, now = new Date()): CardStatus {
  const rule = ruleFor(value.number);
  const digits = digitsOf(value.number);
  const numberValid = rule.lengths.includes(digits.length) && luhnValid(digits);
  const exp = expiryValid(value.expiry, now);
  const cvcValid = digitsOf(value.cvc).length === rule.cvc;
  return { brand: rule.brand, numberValid, expiryValid: exp, cvcValid, complete: numberValid && exp && cvcValid };
}
