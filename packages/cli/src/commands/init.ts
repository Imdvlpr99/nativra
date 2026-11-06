import type { Command } from "commander";
import chalk from "chalk";
import prompts from "prompts";
import ora from "ora";
import { NativraConfigSchema, saveConfig } from "../config.js";

export function registerInitCommand(program: Command) {
  program
    .command("init")
    .description("Initialize Nativra in your React Native / Expo project")
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--yes", "Accept all defaults without prompting")
    .action(async (options: { cwd: string; yes?: boolean }) => {
      console.log(chalk.bold("\n🚀 Initializing Nativra...\n"));

      let stylingTarget: "nativewind" | "stylesheet" = "nativewind";
      let componentsDir = "components/ui";
      let hooksDir = "hooks";
      let utilsDir = "lib/utils";

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
          },
          {
            type: "text",
            name: "componentsDir",
            message: "Where should components be installed?",
            initial: "components/ui",
          },
          {
            type: "text",
            name: "hooksDir",
            message: "Where should hooks be installed?",
            initial: "hooks",
          },
          {
            type: "text",
            name: "utilsDir",
            message: "Where should utilities be installed?",
            initial: "lib/utils",
          },
        ]);

        stylingTarget = answers.stylingTarget ?? "nativewind";
        componentsDir = answers.componentsDir ?? "components/ui";
        hooksDir = answers.hooksDir ?? "hooks";
        utilsDir = answers.utilsDir ?? "lib/utils";
      }

      const config = NativraConfigSchema.parse({
        registries: [{ name: "default", url: "https://registry.nativra.dev" }],
        stylingTarget,
        componentsDir,
        hooksDir,
        utilsDir,
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
          chalk.cyan("nativra add button") +
          chalk.bold(" to install your first component.\n")
      );
    });
}

