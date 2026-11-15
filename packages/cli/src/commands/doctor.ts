import type { Command } from "commander";
import { readFile, writeFile, access } from "node:fs/promises";
import { join, relative } from "node:path";
import chalk from "chalk";
import { checkProjectCompatibility } from "@nativra/registry-schema";
import { sha256 } from "@nativra/utils";
import { createClient } from "../client.js";
import {
  CONFIG_FILENAME,
  createProjectConfig,
  ensureGitignored,
  loadConfig,
  saveConfig,
  type NativraConfig,
} from "../config.js";
import { assertSafeWriteTarget, readLock, resolveLockFilePath } from "../install.js";
import { detectProjectEnvironment } from "../detect.js";
import { printable } from "./shared.js";
import {
  TAILWIND_COLORS_SNIPPET,
  findGlobalCss,
  findTailwindConfig,
  hasThemeCss,
  outdatedThemeCss,
  tailwindMapsThemeColors,
} from "../theme-css.js";

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
    .option("--fix", "Automatically resolve or scaffold missing configurations")
    .action(async (options: { cwd: string; fix?: boolean }) => {
      console.log(chalk.bold("\n🩺 Nativra Doctor — Project Diagnostic\n"));

      const checks: Check[] = [];

      // 1. Check nativra.json & Configuration
      let stylingTarget = "nativewind";
      let config: NativraConfig | undefined;
      try {
        config = await loadConfig(options.cwd);
        stylingTarget = config.stylingTarget;
        checks.push({
          name: "nativra.json configuration",
          pass: true,
          detail: `styling: ${chalk.cyan(config.stylingTarget)}, components: ${chalk.cyan(config.componentsDir)}`,
        });
      } catch (configErr) {
        const configMissing = !(await fileExists(join(options.cwd, CONFIG_FILENAME)));
        if (options.fix && !configMissing) {
          // Never replace a config the user wrote; report why it is invalid instead.
          checks.push({
            name: "nativra.json configuration",
            pass: false,
            detail: `Invalid (not auto-fixed, fix it by hand): ${(configErr as Error).message}`,
          });
        } else if (options.fix) {
          try {
            const env = await detectProjectEnvironment(options.cwd);
            stylingTarget = env.stylingTarget;
            const { config: newConfig } = createProjectConfig(
              {
                stylingTarget: env.stylingTarget,
                componentsDir: env.suggestedComponentsDir,
                hooksDir: env.suggestedHooksDir,
                utilsDir: env.suggestedUtilsDir,
                themesDir: env.suggestedThemesDir,
              },
              env.importAlias
            );
            await saveConfig(options.cwd, newConfig);
            config = newConfig;
            await ensureGitignored(options.cwd);
            checks.push({
              name: "nativra.json configuration",
              pass: true,
              detail: chalk.green("⚡ Auto-fixed: Scaffolded v4 nativra.json based on environment"),
            });
          } catch (fixErr) {
            checks.push({
              name: "nativra.json configuration",
              pass: false,
              detail: `Auto-fix failed: ${(fixErr as Error).message}`,
            });
          }
        } else {
          checks.push({
            name: "nativra.json configuration",
            pass: false,
            detail: `Missing or invalid — run ${chalk.cyan("nativra init")} or ${chalk.cyan("nativra doctor --fix")}`,
          });
        }
      }

      // 2. Check package.json & Ecosystem Compatibility
      let allDeps: Record<string, string> = {};
      let pkgJson: { type?: string } | undefined;
      try {
        const pkgRaw = await readFile(join(options.cwd, "package.json"), "utf8");
        const pkg = JSON.parse(pkgRaw) as {
          dependencies?: Record<string, string>;
          devDependencies?: Record<string, string>;
          type?: string;
        };
        pkgJson = pkg;
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

      // 3. Project type: Expo needs an app config; a React Native CLI app is fine without one.
      if (allDeps["expo"]) {
        let found: string | undefined;
        for (const name of ["app.json", "app.config.ts", "app.config.js"]) {
          if (!found && (await fileExists(join(options.cwd, name)))) found = name;
        }
        checks.push({
          name: "Expo project structure",
          pass: Boolean(found),
          detail: found ? `${found} detected` : "Expo is installed but there is no app.json or app.config",
        });
      } else if (allDeps["react-native"]) {
        checks.push({ name: "React Native project", pass: true, detail: "React Native CLI (no Expo)" });
      } else {
        checks.push({
          name: "React Native project",
          pass: false,
          detail: "Neither expo nor react-native is in package.json",
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
        let hasTailwindConfig = (await findTailwindConfig(options.cwd)) !== null;

        if (!hasTailwindConfig && options.fix) {
          const colors = TAILWIND_COLORS_SNIPPET.split("\n").map((l) => `      ${l}`).join("\n");
          // Scan the app plus wherever Nativra installs components and blocks.
          const contentDirs = [
            ...new Set(
              ["app", "src", config?.componentsDir, config?.blocksDir]
                .filter((d): d is string => Boolean(d))
                .map((d) => d.replace(/\\/g, "/").replace(/\/+$/, ""))
            ),
          ];
          const content = contentDirs.map((d) => JSON.stringify(`./${d}/**/*.{js,jsx,ts,tsx}`)).join(", ");
          const defaultTailwind = [
            "/** @type {import('tailwindcss').Config} */",
            "module.exports = {",
            `  content: [${content}],`,
            '  presets: [require("nativewind/preset")],',
            "  theme: {",
            "    extend: {",
            colors,
            "    },",
            "  },",
            "  plugins: [],",
            "};",
            "",
          ].join("\n");
          // module.exports only loads from a .js file when the package isn't ESM.
          const isEsm = pkgJson?.type === "module";
          const configName = isEsm ? "tailwind.config.cjs" : "tailwind.config.js";
          const configPath = await assertSafeWriteTarget(options.cwd, join(options.cwd, configName));
          await writeFile(configPath, defaultTailwind, "utf8");
          hasTailwindConfig = true;
          checks.push({
            name: "Tailwind CSS configuration",
            pass: true,
            detail: chalk.green(`⚡ Auto-fixed: Scaffolded ${configName}`),
          });
        }

        checks.push({
          name: "NativeWind v4 package",
          pass: hasNativeWindPkg,
          detail: hasNativeWindPkg
            ? undefined
            : `Run: ${chalk.cyan("npx expo install nativewind tailwindcss")}`,
        });

        if (hasNativeWindPkg && !options.fix) {
          checks.push({
            name: "Tailwind CSS configuration",
            pass: true,
            warn: !hasTailwindConfig,
            detail: hasTailwindConfig
              ? "tailwind.config detected"
              : "Consider running npx tailwindcss init or pass --fix",
          });
        }

        if (hasTailwindConfig) {
          const mapped = await tailwindMapsThemeColors(options.cwd);
          checks.push({
            name: "Theme colors mapped in Tailwind",
            pass: true,
            warn: mapped === false,
            detail:
              mapped === false
                ? "Components use bg-primary, text-muted-foreground, … — map them to var(--color-*) (see /docs/styling/nativewind)"
                : "rgb(var(--color-*)) colors configured",
          });
        }
      }

      // 5b. NativeWind v4 build wiring: Metro must wrap the config and Babel needs the preset.
      if (stylingTarget === "nativewind" && allDeps["nativewind"]) {
        const firstFile = async (names: string[]) => {
          for (const name of names) {
            const text = await readFile(join(options.cwd, name), "utf8").catch(() => null);
            if (text !== null) return { name, text };
          }
          return null;
        };
        const metro = await firstFile(["metro.config.js", "metro.config.cjs", "metro.config.mjs", "metro.config.ts"]);
        checks.push({
          name: "Metro configured for NativeWind",
          pass: true,
          warn: !metro?.text.includes("withNativeWind"),
          detail: metro?.text.includes("withNativeWind")
            ? `${metro.name} uses withNativeWind`
            : `${metro ? metro.name : "metro.config.js"} should export withNativeWind(config, { input: "./global.css" })`,
        });
        const babel = await firstFile(["babel.config.js", "babel.config.cjs", "babel.config.mjs", ".babelrc"]);
        checks.push({
          name: "Babel configured for NativeWind",
          pass: true,
          warn: !babel?.text.includes("nativewind"),
          detail: babel?.text.includes("nativewind")
            ? `${babel.name} includes the NativeWind preset`
            : `${babel ? babel.name : "babel.config.js"} should include "nativewind/babel" (and jsxImportSource: "nativewind")`,
        });
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

        // Tracked files that are gone or edited since Nativra wrote them.
        const missingFiles: string[] = [];
        let modified = 0;
        for (const entry of Object.values(lock.items)) {
          for (const [key, hash] of Object.entries(entry.files)) {
            let path: string;
            try {
              path = resolveLockFilePath(options.cwd, key);
            } catch {
              missingFiles.push(key);
              continue;
            }
            const content = await readFile(path, "utf8").catch(() => null);
            if (content === null) missingFiles.push(key);
            else if (sha256(content) !== hash) modified++;
          }
        }
        if (itemCount > 0) {
          checks.push({
            name: "Installed files",
            pass: missingFiles.length === 0,
            warn: modified > 0,
            detail:
              missingFiles.length > 0
                ? `Missing: ${missingFiles.slice(0, 5).join(", ")}${missingFiles.length > 5 ? ", …" : ""} (re-add them or 'nativra remove' the item)`
                : modified > 0
                  ? `${modified} file(s) edited locally ('nativra update' will skip them)`
                  : "All tracked files present and unmodified",
          });
        }

        // NativeWind components read their colors and shapes from the theme block in global.css.
        if (stylingTarget === "nativewind" && itemCount > 0) {
          const css = await findGlobalCss(options.cwd);
          const outdated = css ? await outdatedThemeCss(css) : null;
          const present = css ? await hasThemeCss(css) : false;
          // A warning, not a failure: the variables can also be wired by hand.
          checks.push({
            name: "Theme CSS in global.css",
            pass: true,
            warn: !present || Boolean(outdated),
            detail: !css
              ? "No global.css found"
              : !present
                ? `No Nativra theme block in ${relative(options.cwd, css)}; run 'nativra theme add <id>'`
                : outdated
                  ? "Theme block predates the current tokens; 'nativra update' refreshes it"
                  : "Theme block present",
          });
        }

        // npm packages the installed items need but package.json doesn't list.
        if (itemCount > 0 && Object.keys(allDeps).length > 0) {
          const needed = new Set<string>();
          const client = config ? createClient(config, undefined, options.cwd) : null;
          for (const [id, entry] of Object.entries(lock.items)) {
            try {
              const item = await client?.getItem(id, entry.registry ?? "default");
              for (const dep of item?.npmDependencies ?? []) if (!allDeps[dep.package]) needed.add(dep.package);
            } catch {
              // Offline or removed from the registry: nothing to compare against.
            }
          }
          // A warning: in a monorepo they may be declared in the workspace root's package.json.
          checks.push({
            name: "npm dependencies of installed items",
            pass: true,
            warn: needed.size > 0,
            detail: needed.size === 0 ? "All declared" : `Not in package.json: ${[...needed].map(printable).join(", ")}`,
          });
        }
      } catch (err) {
        // readLock only throws for a lockfile that exists but can't be used (a missing one is empty).
        checks.push({
          name: "nativra.lock.json integrity",
          pass: false,
          detail: (err as Error).message,
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
            `\n⚠ ${failed.length} check(s) failed. Run ${chalk.cyan("nativra doctor --fix")} or see diagnostic details above to resolve.\n`
          )
        );
        // Lets CI gate on `nativra doctor`.
        process.exitCode = 1;
      }
    });
}
