import { afterEach, describe, expect, it } from "vitest";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { detectImportAlias, detectPackageManager, detectProjectEnvironment, parseJsonc } from "./detect.js";
import { isSafeDependency } from "./installer.js";
import { printable } from "./commands/shared.js";

const dirs: string[] = [];
async function tempDir(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "nativra-detect-"));
  dirs.push(dir);
  return dir;
}
afterEach(async () => {
  for (const d of dirs.splice(0)) await rm(d, { recursive: true, force: true });
});

describe("detectProjectEnvironment", () => {
  it("treats a React Native CLI app with app.json as React Native, not Expo", async () => {
    const dir = await tempDir();
    await writeFile(join(dir, "package.json"), JSON.stringify({ dependencies: { "react-native": "0.76.0" } }));
    await writeFile(join(dir, "app.json"), JSON.stringify({ name: "t", displayName: "t" }));
    expect((await detectProjectEnvironment(dir)).framework).toBe("react-native");
  });

  it("detects Expo from the expo dependency", async () => {
    const dir = await tempDir();
    await writeFile(join(dir, "package.json"), JSON.stringify({ dependencies: { expo: "~52.0.0", "react-native": "0.76.0" } }));
    const env = await detectProjectEnvironment(dir);
    expect(env.framework).toBe("expo");
    expect(env.expoSdkVersion).toBe(52);
  });

  it("recognises tailwind.config.cjs as a NativeWind project", async () => {
    const dir = await tempDir();
    await writeFile(join(dir, "package.json"), "{}");
    await writeFile(join(dir, "tailwind.config.cjs"), "module.exports = {};");
    expect((await detectProjectEnvironment(dir)).stylingTarget).toBe("nativewind");
  });
});

describe("detectPackageManager", () => {
  it("prefers package.json's packageManager field", async () => {
    const dir = await tempDir();
    await writeFile(join(dir, "package-lock.json"), "{}");
    expect(await detectPackageManager(dir, "pnpm@9.15.9")).toBe("pnpm");
  });

  it("finds the lockfile at a monorepo root", async () => {
    const root = await tempDir();
    const app = join(root, "apps", "mobile");
    await mkdir(app, { recursive: true });
    await writeFile(join(root, "pnpm-lock.yaml"), "");
    expect(await detectPackageManager(app)).toBe("pnpm");
  });
});

describe("tsconfig parsing", () => {
  it("reads aliases from tsconfig.json with comments and trailing commas", async () => {
    const dir = await tempDir();
    await writeFile(
      join(dir, "tsconfig.json"),
      `{
  // Expo's template
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    /* path alias */
    "paths": { "~/*": ["./src/*"], },
  },
}`
    );
    expect(await detectImportAlias(dir)).toEqual({ prefix: "~/", baseDir: "src" });
  });

  it("leaves comment markers and trailing-comma lookalikes inside strings alone", () => {
    expect(parseJsonc('{ "url": "https://x.dev/*a*/", "s": "a,}", }')).toEqual({ url: "https://x.dev/*a*/", s: "a,}" });
  });
});

describe("registry input safety", () => {
  it("rejects dependency names and versions that look like command-line flags", () => {
    expect(isSafeDependency({ package: "--global", version: "^1.0.0" })).toBe(false);
    expect(isSafeDependency({ package: "-g", version: "^1.0.0" })).toBe(false);
    expect(isSafeDependency({ package: "clsx", version: "--force" })).toBe(false);
    expect(isSafeDependency({ package: "@scope/pkg", version: "^1.0.0" })).toBe(true);
  });

  it("strips terminal control sequences from registry text", () => {
    expect(printable("Button\u001b]52;c;ZXZpbA==\u0007 \u001b[2Jok")).toBe("Button]52;c;ZXZpbA== [2Jok");
    expect(printable("line 1\n\tline 2")).toBe("line 1\n\tline 2");
  });
});
