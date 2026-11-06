import type { Command } from "commander";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";

interface Check {
  name: string;
  pass: boolean;
  detail?: string | undefined;
}

export function registerDoctorCommand(program: Command) {
  program
    .command("doctor")
    .description("Inspect project setup and diagnose common configuration problems")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .action(async (options: { cwd: string }) => {
      console.log(chalk.bold("\n🩺 Nativra Doctor\n"));

      const checks: Check[] = [];

      // Check 1: nativra.json exists
      try {
        const raw = await readFile(join(options.cwd, "nativra.json"), "utf8");
        const cfg = JSON.parse(raw) as Record<string, unknown>;
        checks.push({
          name: "nativra.json",
          pass: true,
          detail: `stylingTarget: ${String(cfg["stylingTarget"])}`,
        });
      } catch {
        checks.push({ name: "nativra.json", pass: false, detail: "File not found — run nativra init" });
      }

      // Check 2: package.json exists
      try {
        await readFile(join(options.cwd, "package.json"), "utf8");
        checks.push({ name: "package.json", pass: true });
      } catch {
        checks.push({ name: "package.json", pass: false, detail: "Not in a Node.js project root?" });
      }

      // Check 3: app.json / app.config.ts (Expo project)
      try {
        await readFile(join(options.cwd, "app.json"), "utf8");
        checks.push({ name: "app.json (Expo)", pass: true });
      } catch {
        try {
          await readFile(join(options.cwd, "app.config.ts"), "utf8");
          checks.push({ name: "app.config.ts (Expo)", pass: true });
        } catch {
          checks.push({
            name: "Expo project",
            pass: false,
            detail: "No app.json or app.config.ts found — Expo project required for MVP",
          });
        }
      }

      // Check 4: NativeWind installed (if configured)
      let nativraConfig: Record<string, unknown> = {};
      try {
        const raw = await readFile(join(options.cwd, "nativra.json"), "utf8");
        nativraConfig = JSON.parse(raw) as Record<string, unknown>;
      } catch { /* ignore */ }

      if (nativraConfig["stylingTarget"] === "nativewind") {
        try {
          const pkgRaw = await readFile(join(options.cwd, "package.json"), "utf8");
          const pkg = JSON.parse(pkgRaw) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
          const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
          const hasNativeWind = "nativewind" in allDeps;
          checks.push({
            name: "nativewind package",
            pass: hasNativeWind,
            detail: hasNativeWind ? undefined : "Run: npx expo install nativewind tailwindcss",
          });
        } catch { /* ignore */ }
      }

      // Print results
      for (const check of checks) {
        const icon = check.pass ? chalk.green("✓") : chalk.red("✗");
        const name = check.pass ? chalk.bold(check.name) : chalk.bold.red(check.name);
        const detail = check.detail ? chalk.gray(` — ${check.detail}`) : "";
        console.log(`  ${icon} ${name}${detail}`);
      }

      const failed = checks.filter((c) => !c.pass);
      if (failed.length === 0) {
        console.log(chalk.bold.green("\n✅ All checks passed!\n"));
      } else {
        console.log(
          chalk.yellow(`\n⚠ ${failed.length} check(s) failed. See details above.\n`)
        );
      }
    });
}

