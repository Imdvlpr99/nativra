import type { Command } from "commander";
import { readFile, access } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";
import {
  checkProjectCompatibility,
  DEFAULT_COMPATIBILITY_MATRIX,
  type CompatibilityMatrix,
} from "@nativra/registry-schema";
import { loadConfig } from "../config.js";
import { readLock } from "../install.js";

interface Check {
  name: string;
  pass: boolean;
  warn?: boolean;
  detail?: string | undefined;
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export function registerDoctorCommand(program: Command) {
  program
    .command("doctor")
    .description("Inspect project setup, dependencies, and diagnose configuration problems")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .action(async (options: { cwd: string }) => {
      console.log(chalk.bold("\n🩺 Nativra Doctor — Project Diagnostic\n"));

      const checks: Check[] = [];

      // 1. Check nativra.json & Configuration
      let stylingTarget = "nativewind";
      let hasV4Config = false;
      try {
        const config = await loadConfig(options.cwd);
        stylingTarget = config.stylingTarget;
        hasV4Config = Boolean(config.config?.v4);
        checks.push({
          name: "nativra.json configuration",
          pass: true,
          detail: `styling: ${chalk.cyan(config.stylingTarget)}, schema: ${
            hasV4Config ? chalk.green("v4-nested") : chalk.yellow("v1-flat")
          }`,
        });
      } catch (err) {
        checks.push({
          name: "nativra.json configuration",
          pass: false,
          detail: `Missing or invalid — run ${chalk.cyan("nativra init")}`,
        });
      }

      // 2. Check package.json & Ecosystem Compatibility
      let allDeps: Record<string, string> = {};
      try {
        const pkgRaw = await readFile(join(options.cwd, "package.json"), "utf8");
        const pkg = JSON.parse(pkgRaw) as {
          dependencies?: Record<string, string>;
          devDependencies?: Record<string, string>;
        };
        allDeps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
        checks.push({ name: "package.json found", pass: true });

        // Compatibility Matrix Analysis
        const reactNativeVer = allDeps["react-native"];
        const expoVer = allDeps["expo"];
        const reactVer = allDeps["react"];
        const tsVer = allDeps["typescript"];
        const nativewindVer = allDeps["nativewind"];

        let expoSdkNum: number | undefined;
        if (expoVer) {
          const match = expoVer.match(/(\d+)/);
          if (match) expoSdkNum = parseInt(match[1]!, 10);
        }

        const compatResult = checkProjectCompatibility({
          reactNative: reactNativeVer,
          expoSdk: expoSdkNum,
          react: reactVer,
          typescript: tsVer,
          nativewind: nativewindVer,
        });

        if (compatResult.compatible) {
          checks.push({
            name: "Ecosystem Compatibility Matrix",
            pass: true,
            detail: `RN ${reactNativeVer ?? "detected"}, Expo SDK ${expoSdkNum ?? "detected"}`,
          });
        } else {
          checks.push({
            name: "Ecosystem Compatibility Matrix",
            pass: false,
            detail: compatResult.errors.join("; "),
          });
        }

        for (const warn of compatResult.warnings) {
          checks.push({
            name: "Compatibility Notice",
            pass: true,
            warn: true,
            detail: warn,
          });
        }
      } catch {
        checks.push({
          name: "package.json",
          pass: false,
          detail: "Not inside a valid Node.js project root",
        });
      }

      // 3. Expo Project Configuration
      const hasAppJson = await fileExists(join(options.cwd, "app.json"));
      const hasAppConfigTs = await fileExists(join(options.cwd, "app.config.ts"));
      const hasAppConfigJs = await fileExists(join(options.cwd, "app.config.js"));
      if (hasAppJson || hasAppConfigTs || hasAppConfigJs) {
        checks.push({
          name: "Expo Project Structure",
          pass: true,
          detail: hasAppJson ? "app.json detected" : "app.config detected",
        });
      } else {
        checks.push({
          name: "Expo Project Structure",
          pass: false,
          detail: "No app.json or app.config found — Expo project required",
        });
      }

      // 4. TypeScript & Path Aliases (tsconfig.json)
      try {
        const tsRaw = await readFile(join(options.cwd, "tsconfig.json"), "utf8");
        const hasPaths = tsRaw.includes('"paths"') || tsRaw.includes('"@/*"');
        checks.push({
          name: "TypeScript configuration",
          pass: true,
          detail: hasPaths ? "Path alias `@/*` configured" : "No path aliases detected in tsconfig.json",
        });
      } catch {
        checks.push({
          name: "TypeScript configuration",
          pass: true,
          warn: true,
          detail: "tsconfig.json not found",
        });
      }

      // 5. NativeWind v4 Configuration (if active)
      if (stylingTarget === "nativewind") {
        const hasNativeWindPkg = Boolean(allDeps["nativewind"]);
        const hasTailwindConfig =
          (await fileExists(join(options.cwd, "tailwind.config.js"))) ||
          (await fileExists(join(options.cwd, "tailwind.config.ts")));

        checks.push({
          name: "NativeWind v4 package",
          pass: hasNativeWindPkg,
          detail: hasNativeWindPkg
            ? undefined
            : `Run: ${chalk.cyan("npx expo install nativewind tailwindcss")}`,
        });

        if (hasNativeWindPkg) {
          checks.push({
            name: "Tailwind CSS configuration",
            pass: true,
            warn: !hasTailwindConfig,
            detail: hasTailwindConfig
              ? "tailwind.config detected"
              : "Consider running npx tailwindcss init",
          });
        }
      }

      // 6. Lockfile & Installed Components Integrity
      try {
        const lock = await readLock(options.cwd);
        const itemCount = Object.keys(lock.items ?? {}).length;
        checks.push({
          name: "nativra.lock.json integrity",
          pass: true,
          detail: `${itemCount} component(s) tracked`,
        });
      } catch {
        checks.push({
          name: "nativra.lock.json",
          pass: true,
          detail: "No components tracked yet",
        });
      }

      // Print Diagnostic Results
      for (const check of checks) {
        let icon: string;
        let name: string;
        if (!check.pass) {
          icon = chalk.red("✗");
          name = chalk.bold.red(check.name);
        } else if (check.warn) {
          icon = chalk.yellow("⚠");
          name = chalk.bold.yellow(check.name);
        } else {
          icon = chalk.green("✓");
          name = chalk.bold(check.name);
        }
        const detail = check.detail ? chalk.gray(` — ${check.detail}`) : "";
        console.log(`  ${icon} ${name}${detail}`);
      }

      const failed = checks.filter((c) => !c.pass);
      const warnings = checks.filter((c) => c.pass && c.warn);

      if (failed.length === 0) {
        console.log(
          chalk.bold.green(
            `\n✅ All checks passed! ${
              warnings.length > 0 ? `(${warnings.length} warning(s))` : "Project is healthy."
            }\n`
          )
        );
      } else {
        console.log(
          chalk.yellow(
            `\n⚠ ${failed.length} check(s) failed. See diagnostic details above to resolve.\n`
          )
        );
      }
    });
}
