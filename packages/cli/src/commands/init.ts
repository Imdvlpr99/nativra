import type { Command } from "commander";
import chalk from "chalk";
import prompts from "prompts";
import ora from "ora";
import { join } from "node:path";
import { CONFIG_FILENAME, createProjectConfig, ensureGitignored, saveConfig, serializeConfig } from "../config.js";
import { detectProjectEnvironment } from "../detect.js";
import { createBackup, fileExists } from "../install.js";
import { STYLE_PRESETS } from "@nativra/theme-engine";

/** Backup id for the nativra.json that `init` replaces (`nativra rollback nativra-config`). */
export const CONFIG_BACKUP_ID = "nativra-config";

const STYLE_HINTS: Record<string, string> = {
  soft: "Pill buttons, generous rounding, soft shadows",
  crisp: "shadcn/ui-like: small radii, hairline borders, compact",
  tailwind: "Tailwind UI-like: rings, layered shadows, roomy",
  material: "Material 3-like: tonal surfaces, filled fields",
  ios: "iOS-like: grey grouped surfaces, larger type",
};

/** prompts() resolves with partial answers on Ctrl+C; this makes cancelling stop init instead. */
const onCancel = (): never => {
  console.log(chalk.yellow("\n  Init cancelled. Nothing was written.\n"));
  process.exit(1);
};

export function registerInitCommand(program: Command) {
  program
    .command("init")
    .description("Initialize Nativra in your React Native / Expo project with smart environment detection")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--yes", "Accept all detected defaults without prompting")
    .option("--force", "Replace an existing nativra.json without asking")
    .option("--style <id>", `UI style: ${Object.keys(STYLE_PRESETS).join(", ")} (default: soft)`)
    .action(async (options: { cwd: string; yes?: boolean; force?: boolean; style?: string }) => {
      console.log(chalk.bold("\n🚀 Initializing Nativra...\n"));

      if (options.style !== undefined && !Object.prototype.hasOwnProperty.call(STYLE_PRESETS, options.style)) {
        console.error(chalk.red(`✗ Unknown style "${options.style}". Use one of: ${Object.keys(STYLE_PRESETS).join(", ")}.\n`));
        process.exit(1);
      }

      if (!options.force && (await fileExists(join(options.cwd, CONFIG_FILENAME)))) {
        if (options.yes || !process.stdin.isTTY) {
          console.error(chalk.red(`✗ ${CONFIG_FILENAME} already exists. Re-run with --force to replace it.\n`));
          process.exit(1);
        }
        const { replace } = await prompts(
          {
            type: "confirm",
            name: "replace",
            message: `${CONFIG_FILENAME} already exists. Replace it? Custom registries and aliases in it will be lost.`,
            initial: false,
          },
          { onCancel }
        );
        if (!replace) {
          console.log(chalk.yellow("\n  Kept the existing configuration.\n"));
          return;
        }
      }

      // 1. Inspect environment and detect project configurations
      const env = await detectProjectEnvironment(options.cwd);

      if (env.hasPackageJson) {
        console.log(chalk.gray("🔍 Detected project environment:"));
        const fwLabel =
          env.framework === "expo"
            ? `Expo ${env.expoSdkVersion ? `(SDK ${env.expoSdkVersion})` : ""}`
            : env.framework === "react-native"
            ? `React Native ${env.reactNativeVersion ? `(${env.reactNativeVersion})` : ""}`
            : "Generic React Native";
        console.log(`  • Framework:       ${chalk.cyan(fwLabel)}`);
        console.log(`  • Language:        ${chalk.cyan(env.typescript ? "TypeScript" : "JavaScript")}`);
        console.log(`  • Styling Target:  ${chalk.cyan(env.stylingTarget === "nativewind" ? "NativeWind" : "StyleSheet")}`);
        console.log(`  • Package Manager: ${chalk.cyan(env.packageManager)}`);
        console.log(`  • Structure:       ${chalk.cyan(env.hasSrcDir ? "src/ directory" : "root directory")}\n`);
      }

      let stylingTarget: "nativewind" | "stylesheet" = env.stylingTarget;
      let componentsDir = env.suggestedComponentsDir;
      let hooksDir = env.suggestedHooksDir;
      let utilsDir = env.suggestedUtilsDir;
      let style = options.style ?? "soft";

      if (!options.yes) {
        const answers = await prompts([
          {
            type: "select",
            name: "stylingTarget",
            message: "Which styling target does your project use?",
            choices: [
              { title: "NativeWind (Tailwind for React Native)", value: "nativewind" },
              { title: "React Native StyleSheet", value: "stylesheet" },
            ],
            initial: env.stylingTarget === "stylesheet" ? 1 : 0,
          },
          {
            type: options.style ? null : "select",
            name: "style",
            message: "Which style should components have? (switch later with `nativra style add <id>`)",
            choices: Object.values(STYLE_PRESETS).map((s) => ({ title: s.name, value: s.id, description: STYLE_HINTS[s.id] })),
            initial: 0,
          },
          {
            type: "text",
            name: "componentsDir",
            message: "Where should components be installed?",
            initial: env.suggestedComponentsDir,
          },
          {
            type: "text",
            name: "hooksDir",
            message: "Where should hooks be installed?",
            initial: env.suggestedHooksDir,
          },
          {
            type: "text",
            name: "utilsDir",
            message: "Where should utilities be installed?",
            initial: env.suggestedUtilsDir,
          },
        ], { onCancel });

        stylingTarget = answers.stylingTarget ?? env.stylingTarget;
        componentsDir = answers.componentsDir ?? env.suggestedComponentsDir;
        hooksDir = answers.hooksDir ?? env.suggestedHooksDir;
        utilsDir = answers.utilsDir ?? env.suggestedUtilsDir;
        style = answers.style ?? style;
      }

      const { config, warnings } = createProjectConfig(
        { stylingTarget, componentsDir, hooksDir, utilsDir, themesDir: env.suggestedThemesDir, style },
        env.importAlias
      );
      for (const w of warnings) console.log(chalk.yellow(`  ⚠ ${w}`));

      // Replacing a config loses its custom registries and aliases: keep the old one restorable.
      const configPath = join(options.cwd, CONFIG_FILENAME);
      let backedUp = false;
      if (await fileExists(configPath)) {
        // hashAfter lets `rollback nativra-config` notice hand edits made after this init.
        await createBackup(options.cwd, CONFIG_BACKUP_ID, [{ destPath: configPath, exists: true, contentAfter: serializeConfig(config) }]);
        backedUp = true;
      }

      const spinner = ora("Writing nativra.json...").start();
      try {
        await saveConfig(options.cwd, config);
        if (backedUp) {
          console.log(chalk.gray(`  The previous ${CONFIG_FILENAME} was backed up. Restore it with: nativra rollback ${CONFIG_BACKUP_ID}`));
        }
        spinner.succeed(chalk.green("nativra.json created!"));
      } catch (err) {
        spinner.fail(chalk.red("Failed to write nativra.json"));
        throw err;
      }
      // nativra.json is already saved: a .gitignore we can't touch (e.g. a symlink) is only a warning.
      try {
        if (await ensureGitignored(options.cwd)) {
          console.log(chalk.gray("  Added .nativra/ (local backups) to .gitignore"));
        }
      } catch (err) {
        console.log(chalk.yellow(`  ⚠ Could not add .nativra/ to .gitignore: ${(err as Error).message}. Add it by hand.`));
      }

      console.log(chalk.gray("\nConfiguration saved:"));
      console.log(chalk.gray(JSON.stringify(config, null, 2)));
      console.log(
        chalk.bold("\n✅ Done! Run ") +
          chalk.cyan("npx nativra-cli add button") +
          chalk.bold(" to install your first component.\n")
      );
    });
}
