import { readFile, access } from "node:fs/promises";
import { join } from "node:path";

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
  let hasPackageJson = false;

  try {
    const pkgRaw = await readFile(join(cwd, "package.json"), "utf8");
    const pkg = JSON.parse(pkgRaw) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    pkgDeps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
    hasPackageJson = true;
  } catch {
    hasPackageJson = false;
  }

  // 1. Detect Framework
  const hasAppJson = await fileOrDirExists(join(cwd, "app.json"));
  const hasAppConfig =
    (await fileOrDirExists(join(cwd, "app.config.js"))) ||
    (await fileOrDirExists(join(cwd, "app.config.ts")));
  const isExpo = Boolean(pkgDeps["expo"]) || hasAppJson || hasAppConfig;
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
  const hasTailwindConfig =
    (await fileOrDirExists(join(cwd, "tailwind.config.js"))) ||
    (await fileOrDirExists(join(cwd, "tailwind.config.ts")));
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
  let packageManager: "pnpm" | "yarn" | "bun" | "npm" = "npm";
  if (await fileOrDirExists(join(cwd, "pnpm-lock.yaml"))) {
    packageManager = "pnpm";
  } else if (await fileOrDirExists(join(cwd, "yarn.lock"))) {
    packageManager = "yarn";
  } else if (
    (await fileOrDirExists(join(cwd, "bun.lockb"))) ||
    (await fileOrDirExists(join(cwd, "bun.lock")))
  ) {
    packageManager = "bun";
  }

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

/**
 * Reads the first wildcard path alias from tsconfig.json, e.g. `"@/*": ["./src/*"]`
 * becomes `{ prefix: "@/", baseDir: "src" }`. Returns null when none is configured or
 * the file is not plain JSON.
 */
export async function detectImportAlias(cwd: string): Promise<ImportAlias | null> {
  let tsconfig: { compilerOptions?: { baseUrl?: string; paths?: Record<string, string[]> } };
  try {
    tsconfig = JSON.parse(await readFile(join(cwd, "tsconfig.json"), "utf8")) as typeof tsconfig;
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
