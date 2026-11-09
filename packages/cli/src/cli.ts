import { program } from "commander";
import { registerInitCommand } from "./commands/init.js";
import { registerAddCommand } from "./commands/add.js";
import { registerRemoveCommand } from "./commands/remove.js";
import { registerListCommand } from "./commands/list.js";
import { registerInfoCommand } from "./commands/info.js";
import { registerDiffCommand } from "./commands/diff.js";
import { registerDoctorCommand } from "./commands/doctor.js";
import { registerUpdateCommand } from "./commands/update.js";
import { registerRollbackCommand } from "./commands/rollback.js";
import { registerSearchCommand } from "./commands/search.js";
import { registerThemeCommand, registerRegistryCommand } from "./commands/theme-registry.js";
import { registerAuditCommand } from "./commands/audit.js";

program
  .name("nativra")
  .description("Nativra CLI — Native UI, built your way.")
  .version("0.2.1");

registerInitCommand(program);
registerAddCommand(program);
registerRemoveCommand(program);
registerListCommand(program);
registerInfoCommand(program);
registerDiffCommand(program);
registerDoctorCommand(program);
registerUpdateCommand(program);
registerRollbackCommand(program);
registerSearchCommand(program);
registerThemeCommand(program);
registerRegistryCommand(program);
registerAuditCommand(program);

program.parse(process.argv);
