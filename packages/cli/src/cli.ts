import { program } from "commander";
import { registerInitCommand } from "./commands/init.js";
import { registerAddCommand } from "./commands/add.js";
import { registerListCommand } from "./commands/list.js";
import { registerInfoCommand } from "./commands/info.js";
import { registerDiffCommand } from "./commands/diff.js";
import { registerDoctorCommand } from "./commands/doctor.js";
import { registerUpdateCommand } from "./commands/update.js";
import { registerSearchCommand } from "./commands/search.js";
import { registerThemeCommand, registerRegistryCommand } from "./commands/theme-registry.js";

program
  .name("nativra")
  .description("Nativra CLI — Native UI, built your way.")
  .version("0.0.1");

registerInitCommand(program);
registerAddCommand(program);
registerListCommand(program);
registerInfoCommand(program);
registerDiffCommand(program);
registerDoctorCommand(program);
registerUpdateCommand(program);
registerSearchCommand(program);
registerThemeCommand(program);
registerRegistryCommand(program);

program.parse(process.argv);
