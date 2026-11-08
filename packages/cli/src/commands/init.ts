import type { Command } from "commander";
import chalk from "chalk";
import prompts from "prompts";
import ora from "ora";
import { NativraConfigSchema, saveConfig } from "../config.js";
import { detectProjectEnvironment } from "../detect.js";

export function registerInitCommand(program: Command) {
  program
    .command("init")
    .description("Initialize Nativra in your React Native / Expo project with smart environment detection")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--yes", "Accept all detected defaults without prompting")
    .action(async (options: { cwd: string; yes?: boolean }) => {
      console.log(chalk.bold("\n🚀 Initializing Nativra...\n"));

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
        ]);

        stylingTarget = answers.stylingTarget ?? env.stylingTarget;
        componentsDir = answers.componentsDir ?? env.suggestedComponentsDir;
        hooksDir = answers.hooksDir ?? env.suggestedHooksDir;
        utilsDir = answers.utilsDir ?? env.suggestedUtilsDir;
      }

      const prefix = "@/";
      const config = NativraConfigSchema.parse({
        $schema: "https://nativra.dev/schemas/nativra.json",
        version: 4,
        registries: [{ name: "default", url: "https://registry.nativra.dev" }],
        stylingTarget,
        componentsDir,
        hooksDir,
        utilsDir,
        config: {
          v4: {
            components: `${prefix}${componentsDir}`,
            blocks: `${prefix}${componentsDir}`,
            hooks: `${prefix}${hooksDir}`,
            utils: `${prefix}${utilsDir}`,
            theme: `${prefix}theme`,
          },
        },
        aliases: {
          components: `${prefix}${componentsDir}`,
          utils: `${prefix}${utilsDir}`,
        },
      });

      const spinner = ora("Writing nativra.json...").start();
      try {
        await saveConfig(options.cwd, config);
        spinner.succeed(chalk.green("nativra.json created!"));
      } catch (err) {
        spinner.fail(chalk.red("Failed to write nativra.json"));
        throw err;
      }

      console.log(chalk.gray("\nConfiguration saved:"));
      console.log(chalk.gray(JSON.stringify(config, null, 2)));
      console.log(
        chalk.bold("\n✅ Done! Run ") +
          chalk.cyan("npx nativra add button") +
          chalk.bold(" to install your first component.\n")
      );
    });
}
