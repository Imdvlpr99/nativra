import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";
import { NPM_PACKAGE_REGEX, SEMVER_RANGE_REGEX } from "@nativra/registry-schema";
import { detectProjectEnvironment } from "./detect.js";

export interface PackageDependency {
  package: string;
  version?: string;
}

/** A resolved install invocation. `args` are passed to the binary without a shell on POSIX. */
export interface InstallCommand {
  bin: string;
  args: string[];
}

/**
 * Re-validates registry-supplied dependencies right before they reach a package manager,
 * so a registry can never smuggle shell syntax into an install command.
 */
export function isSafeDependency(dep: PackageDependency): boolean {
  if (!NPM_PACKAGE_REGEX.test(dep.package) || dep.package.length > 214) return false;
  if (dep.version !== undefined && !SEMVER_RANGE_REGEX.test(dep.version)) return false;
  return true;
}

export async function getMissingDependencies(
  cwd: string,
  dependencies: PackageDependency[]
): Promise<PackageDependency[]> {
  if (!dependencies || dependencies.length === 0) return [];

  let pkgDeps: Record<string, string> = {};
  try {
    const raw = await readFile(join(cwd, "package.json"), "utf8");
    const parsed = JSON.parse(raw) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    pkgDeps = { ...(parsed.dependencies ?? {}), ...(parsed.devDependencies ?? {}) };
  } catch {
    return dependencies;
  }

  return dependencies.filter((d) => !pkgDeps[d.package]);
}

export async function getInstallCommand(
  cwd: string,
  missing: PackageDependency[]
): Promise<InstallCommand> {
  const unsafe = missing.filter((d) => !isSafeDependency(d));
  if (unsafe.length > 0) {
    throw new Error(
      `Refusing to install dependencies with unsafe names or version ranges: ${unsafe
        .map((d) => JSON.stringify(`${d.package}@${d.version ?? ""}`))
        .join(", ")}`
    );
  }

  const env = await detectProjectEnvironment(cwd);
  if (env.framework === "expo") {
    // Expo picks SDK-compatible versions itself, so ranges are dropped.
    return { bin: "npx", args: ["expo", "install", ...missing.map((m) => m.package)] };
  }

  const specs = missing.map((d) => (d.version ? `${d.package}@${d.version}` : d.package));
  switch (env.packageManager) {
    case "pnpm":
      return { bin: "pnpm", args: ["add", ...specs] };
    case "yarn":
      return { bin: "yarn", args: ["add", ...specs] };
    case "bun":
      return { bin: "bun", args: ["add", ...specs] };
    default:
      return { bin: "npm", args: ["install", ...specs] };
  }
}

/** Human-readable form of an install command, for display only. */
export function formatInstallCommand(cmd: InstallCommand): string {
  return [cmd.bin, ...cmd.args].join(" ");
}

/**
 * The single command line run through cmd.exe on Windows, where package managers are .cmd shims
 * that can't be spawned without a shell. It is one string because Node 24 deprecates passing an
 * argument array together with `shell: true` (DEP0190). Each argument is re-checked against the
 * allow-list and double-quoted, so cmd.exe treats `^`, `<`, `>` and `|` in a range as literals.
 */
export function windowsShellCommand(cmd: InstallCommand): string {
  if (!/^(npm|npx|pnpm|yarn|bun)$/.test(cmd.bin)) throw new Error(`Unexpected package manager "${cmd.bin}"`);
  for (const arg of cmd.args) {
    if (!/^[a-z0-9@/._~^>=<*+-]+$/i.test(arg)) throw new Error(`Refusing unsafe install argument ${JSON.stringify(arg)}`);
  }
  return [cmd.bin, ...cmd.args.map((a) => `"${a}"`)].join(" ");
}

export async function executeDependencyInstall(
  cwd: string,
  cmd: InstallCommand
): Promise<boolean> {
  const display = formatInstallCommand(cmd);
  console.log(chalk.cyan(`\n⚡ Installing dependencies: ${chalk.bold(display)}...`));

  const result =
    process.platform === "win32"
      ? spawnSync(windowsShellCommand(cmd), { cwd, stdio: "inherit", shell: true })
      : spawnSync(cmd.bin, cmd.args, { cwd, stdio: "inherit" });

  if (result.status === 0) {
    console.log(chalk.green(`  ✓ Dependencies successfully installed.\n`));
    return true;
  }
  const reason = result.error?.message ?? `exit code ${String(result.status)}`;
  console.warn(chalk.yellow(`  ⚠ Auto-install failed: ${reason}`));
  console.log(chalk.gray(`    You can install manually with: ${display}\n`));
  return false;
}
