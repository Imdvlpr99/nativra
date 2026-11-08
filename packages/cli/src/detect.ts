import { readFile, access } from "node:fs/promises";
import { join } from "node:path";

export interface ProjectEnvironment {
  hasPackageJson: boolean;
  framework: "expo" | "react-native" | "unknown";
  expoSdkVersion?: number | undefined;
  reactNativeVersion?: string | undefined;
  typescript: boolean;
  stylingTarget: "nativewind" | "stylesheet";
  packageManager: "pnpm" | "yarn" | "bun" | "npm";
  hasSrcDir: boolean;
  suggestedComponentsDir: string;
  suggestedHooksDir: string;
  suggestedUtilsDir: string;
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

  // 5. Detect Package Manager
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
    suggestedComponentsDir,
    suggestedHooksDir,
    suggestedUtilsDir,
  };
}
