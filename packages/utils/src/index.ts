import { createHash } from "node:crypto";
import { extname } from "node:path";

// ---------------------------------------------------------------------------
// String utilities
// ---------------------------------------------------------------------------

/** Convert a string to kebab-case */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

/** Convert a string to PascalCase */
export function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

/** Convert a string to camelCase */
export function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/** Truncate a string to a maximum length, appending ellipsis */
export function truncate(str: string, maxLength: number, ellipsis = "…"): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - ellipsis.length) + ellipsis;
}

// ---------------------------------------------------------------------------
// Hash utilities
// ---------------------------------------------------------------------------

/** Compute a SHA-256 hash of arbitrary content */
export function sha256(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

// ---------------------------------------------------------------------------
// File path utilities
// ---------------------------------------------------------------------------

/** Check whether a file path refers to a TypeScript/TSX file */
export function isTypeScriptFile(filePath: string): boolean {
  const ext = extname(filePath).toLowerCase();
  return ext === ".ts" || ext === ".tsx";
}

/** Check whether a file path refers to a JavaScript file */
export function isJavaScriptFile(filePath: string): boolean {
  const ext = extname(filePath).toLowerCase();
  return ext === ".js" || ext === ".jsx" || ext === ".mjs" || ext === ".cjs";
}

// ---------------------------------------------------------------------------
// Array utilities
// ---------------------------------------------------------------------------

/** Remove duplicate values from an array (shallow equality) */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/** Group an array of objects by a key */
export function groupBy<T, K extends PropertyKey>(
  arr: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return arr.reduce<Record<K, T[]>>((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key]!.push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

// ---------------------------------------------------------------------------
// Object utilities
// ---------------------------------------------------------------------------

/** Remove undefined values from an object (shallow) */
export function compactObject<T extends Record<string, unknown>>(
  obj: T
): { [K in keyof T]: NonNullable<T[K]> } {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as { [K in keyof T]: NonNullable<T[K]> };
}

// ---------------------------------------------------------------------------
// Semver utilities (lightweight, no semver package dependency)
// ---------------------------------------------------------------------------

/** Parse a semver string into major/minor/patch numbers */
export function parseSemver(version: string): { major: number; minor: number; patch: number } | null {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return {
    major: parseInt(match[1]!, 10),
    minor: parseInt(match[2]!, 10),
    patch: parseInt(match[3]!, 10),
  };
}

