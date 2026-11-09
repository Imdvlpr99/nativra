import { execSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";
import { detectProjectEnvironment } from "./detect.js";

export interface PackageDependency {
  package: string;
  version?: string;
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
): Promise<string> {
  const env = await detectProjectEnvironment(cwd);
  const pkgList = missing
    .map((d) => (d.version && env.framework !== "expo" ? `${d.package}@${d.version}` : d.package))
    .join(" ");

  if (env.framework === "expo") {
    return `npx expo install ${missing.map((m) => m.package).join(" ")}`;
  }
  switch (env.packageManager) {
    case "pnpm":
      return `pnpm add ${pkgList}`;
    case "yarn":
      return `yarn add ${pkgList}`;
    case "bun":
      return `bun add ${pkgList}`;
    default:
      return `npm install ${pkgList}`;
  }
}

export async function executeDependencyInstall(
  cwd: string,
  cmd: string
): Promise<boolean> {
  try {
    console.log(chalk.cyan(`\n⚡ Installing dependencies: ${chalk.bold(cmd)}...`));
    execSync(cmd, { cwd, stdio: "inherit" });
    console.log(chalk.green(`  ✓ Dependencies successfully installed.\n`));
    return true;
  } catch (err) {
    console.warn(chalk.yellow(`  ⚠ Auto-install failed: ${(err as Error).message}`));
    console.log(chalk.gray(`    You can install manually with: ${cmd}\n`));
    return false;
  }
}

