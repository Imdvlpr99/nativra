import { readFile, access } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

/** Every file name Tailwind loads its config from (shared with theme-css.ts). */
export const TAILWIND_CONFIG_NAMES = ["tailwind.config.js", "tailwind.config.ts", "tailwind.config.cjs", "tailwind.config.mjs"];

export interface ImportAlias {
  /** Import prefix including the trailing slash, e.g. "@/" */
  prefix: string;
  /** Project-relative directory the prefix maps to, "" for the project root */
  baseDir: string;
}

export interface ProjectEnvironment {
  hasPackageJson: boolean;
  framework: "expo" | "react-native" | "unknown";
  expoSdkVersion?: number | undefined;
  reactNativeVersion?: string | undefined;
  typescript: boolean;
  stylingTarget: "nativewind" | "stylesheet";
  packageManager: "pnpm" | "yarn" | "bun" | "npm";
  hasSrcDir: boolean;
  importAlias: ImportAlias | null;
  suggestedComponentsDir: string;
  suggestedHooksDir: string;
  suggestedUtilsDir: string;
  suggestedThemesDir: string;
}

async function fileOrDirExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Automatically inspects the target project root and detects framework,
 * dependencies, styling target, directory convention, and package manager.
 */
export async function detectProjectEnvironment(cwd: string): Promise<ProjectEnvironment> {
  let pkgDeps: Record<string, string> = {};
  let pkgPackageManager: string | undefined;
  let hasPackageJson = false;

  try {
    const pkgRaw = await readFile(join(cwd, "package.json"), "utf8");
    const pkg = JSON.parse(pkgRaw) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      packageManager?: unknown;
    };
    pkgDeps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
    pkgPackageManager = typeof pkg.packageManager === "string" ? pkg.packageManager : undefined;
    hasPackageJson = true;
  } catch {
    hasPackageJson = false;
  }

  // 1. Detect Framework. Only the `expo` dependency proves Expo: React Native CLI apps ship an
  // app.json too, and treating them as Expo would install dependencies with `expo install`.
  const isExpo = Boolean(pkgDeps["expo"]);
  const isRN = Boolean(pkgDeps["react-native"]);

  let framework: "expo" | "react-native" | "unknown" = "unknown";
  if (isExpo) {
    framework = "expo";
  } else if (isRN) {
    framework = "react-native";
  }

  let expoSdkVersion: number | undefined;
  if (pkgDeps["expo"]) {
    const match = pkgDeps["expo"].match(/(\d+)/);
    if (match) {
      expoSdkVersion = parseInt(match[1]!, 10);
    }
  }

  const reactNativeVersion = pkgDeps["react-native"];

  // 2. Detect TypeScript
  const hasTsConfig = await fileOrDirExists(join(cwd, "tsconfig.json"));
  const typescript = Boolean(pkgDeps["typescript"]) || hasTsConfig;

  // 3. Detect Styling Target
  let hasTailwindConfig = false;
  for (const name of TAILWIND_CONFIG_NAMES) {
    if (await fileOrDirExists(join(cwd, name))) hasTailwindConfig = true;
  }
  const hasNativeWindDep = Boolean(pkgDeps["nativewind"]) || Boolean(pkgDeps["tailwindcss"]);
  const stylingTarget: "nativewind" | "stylesheet" =
    hasNativeWindDep || hasTailwindConfig ? "nativewind" : "stylesheet";

  // 4. Detect Directory Convention (src/ vs root)
  const hasSrcDir = await fileOrDirExists(join(cwd, "src"));
  const suggestedComponentsDir = hasSrcDir ? "src/components/ui" : "components/ui";
  const suggestedHooksDir = hasSrcDir ? "src/hooks" : "hooks";
  const suggestedUtilsDir = hasSrcDir ? "src/lib/utils" : "lib/utils";
  const suggestedThemesDir = hasSrcDir ? "src/lib/themes" : "lib/themes";

  // 5. Detect the TypeScript path alias (e.g. "@/*": ["./src/*"])
  const importAlias = await detectImportAlias(cwd);

  // 6. Detect Package Manager
  const packageManager = await detectPackageManager(cwd, pkgPackageManager);

  return {
    hasPackageJson,
    framework,
    expoSdkVersion,
    reactNativeVersion,
    typescript,
    stylingTarget,
    packageManager,
    hasSrcDir,
    importAlias,
    suggestedComponentsDir,
    suggestedHooksDir,
    suggestedUtilsDir,
    suggestedThemesDir,
  };
}

type PackageManager = ProjectEnvironment["packageManager"];

const LOCKFILES: Array<[string, PackageManager]> = [
  ["pnpm-lock.yaml", "pnpm"],
  ["yarn.lock", "yarn"],
  ["bun.lockb", "bun"],
  ["bun.lock", "bun"],
  ["package-lock.json", "npm"],
];

/**
 * The project's package manager: package.json's `packageManager` field ("pnpm@9.15.0"), else
 * the nearest lockfile in the project or a parent folder (a monorepo keeps it at the root),
 * else npm.
 */
export async function detectPackageManager(cwd: string, packageManagerField?: string): Promise<PackageManager> {
  const declared = /^(pnpm|yarn|bun|npm)@/.exec(packageManagerField ?? "")?.[1];
  if (declared) return declared as PackageManager;
  let dir = resolve(cwd);
  for (;;) {
    for (const [file, manager] of LOCKFILES) {
      if (await fileOrDirExists(join(dir, file))) return manager;
    }
    const parent = dirname(dir);
    if (parent === dir) return "npm";
    dir = parent;
  }
}

/**
 * Parses JSON that may contain comments and trailing commas (tsconfig.json is JSONC).
 * Comment markers inside strings, such as "https://", are left alone.
 */
export function parseJsonc(text: string): unknown {
  let out = "";
  let inString = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i]!;
    if (inString) {
      out += c;
      if (c === "\\") out += text[++i] ?? "";
      else if (c === '"') inString = false;
    } else if (c === '"') {
      inString = true;
      out += c;
    } else if (c === "/" && text[i + 1] === "/") {
      while (i < text.length && text[i] !== "\n") i++;
      out += "\n";
    } else if (c === "/" && text[i + 1] === "*") {
      i += 2;
      while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++;
      i++;
    } else {
      out += c;
    }
  }
  // Second pass: drop trailing commas, again only outside strings.
  let json = "";
  inString = false;
  for (let i = 0; i < out.length; i++) {
    const c = out[i]!;
    if (inString) {
      json += c;
      if (c === "\\") json += out[++i] ?? "";
      else if (c === '"') inString = false;
    } else if (c === '"') {
      inString = true;
      json += c;
    } else if (c === "," && /^\s*[}\]]/.test(out.slice(i + 1))) {
      continue;
    } else {
      json += c;
    }
  }
  return JSON.parse(json);
}

/**
 * Reads the first wildcard path alias from tsconfig.json, e.g. `"@/*": ["./src/*"]`
 * becomes `{ prefix: "@/", baseDir: "src" }`. Comments and trailing commas are allowed.
 * Returns null when none is configured or the file can't be parsed.
 */
export async function detectImportAlias(cwd: string): Promise<ImportAlias | null> {
  let tsconfig: { compilerOptions?: { baseUrl?: string; paths?: Record<string, string[]> } };
  try {
    tsconfig = parseJsonc(await readFile(join(cwd, "tsconfig.json"), "utf8")) as typeof tsconfig;
  } catch {
    return null;
  }
  const paths = tsconfig.compilerOptions?.paths ?? {};
  for (const [key, targets] of Object.entries(paths)) {
    const target = targets?.[0];
    if (!key.endsWith("/*") || !target?.endsWith("*")) continue;
    const base = join(tsconfig.compilerOptions?.baseUrl ?? ".", target.slice(0, -1))
      .replace(/\\/g, "/")
      .replace(/^\.\/?/, "")
      .replace(/\/+$/, "");
    if (base.startsWith("..")) continue;
    return { prefix: key.slice(0, -1), baseDir: base };
  }
  return null;
}

/**
 * Import specifier for a project-relative directory under the given alias, or null if the
 * directory is outside the alias base (it cannot be imported through that alias).
 */
export function aliasForDir(alias: ImportAlias, dir: string): string | null {
  const clean = dir.replace(/\\/g, "/").replace(/^\.\//, "").replace(/\/+$/, "");
  if (!alias.baseDir) return `${alias.prefix}${clean}`;
  if (!clean.startsWith(`${alias.baseDir}/`)) return null;
  return `${alias.prefix}${clean.slice(alias.baseDir.length + 1)}`;
}
