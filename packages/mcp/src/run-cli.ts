import { execFile } from "node:child_process";
import { stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, isAbsolute, join, resolve } from "node:path";

export interface CliResult {
  code: number;
  stdout: string;
  stderr: string;
}

/**
 * Item references the CLI accepts: "button" or "acme/button" (registry-schema's REGISTRY_NAME_REGEX
 * and ITEM_ID_REGEX). Anything else, such as "--registry=...", never reaches argv.
 */
export const ITEM_REF = /^(?:[a-z0-9][a-z0-9-]*\/)?[a-z][a-z0-9-]*$/;

/**
 * Path to the CLI entry point: `NATIVRA_CLI` if set (tests), else the `nativra-cli` dependency.
 * The package only exports ".", whose CJS build sits next to `cli.js` in dist/.
 */
export function resolveCliPath(): string {
  const fromEnv = process.env["NATIVRA_CLI"];
  if (fromEnv) return resolve(fromEnv);
  const require = createRequire(import.meta.url);
  return join(dirname(require.resolve("nativra-cli")), "cli.js");
}

/** The project the tools act on: the `cwd` argument, else NATIVRA_PROJECT_ROOT, else the server's cwd. */
export async function resolveProjectRoot(cwd: string | undefined): Promise<string> {
  const root = cwd ?? process.env["NATIVRA_PROJECT_ROOT"] ?? process.cwd();
  if (!isAbsolute(root)) throw new Error(`cwd must be an absolute path, got "${root}"`);
  const info = await stat(root).catch(() => null);
  if (!info?.isDirectory()) throw new Error(`cwd "${root}" is not a directory`);
  return resolve(root);
}

const REGISTRY_COMMANDS = new Set(["add", "diff", "info", "list", "search", "update"]);

/**
 * Runs the CLI with an argument array (never a shell), without a TTY so it never prompts, and
 * without colors so the output reads cleanly. Never throws for a non-zero exit: the caller reports it.
 */
export function runCli(args: string[], cwd: string, timeoutMs = 180_000): Promise<CliResult> {
  // NATIVRA_REGISTRY replaces the project's registries, for the commands that take --registry.
  const registry = process.env["NATIVRA_REGISTRY"];
  const takesRegistry = REGISTRY_COMMANDS.has(args[0] ?? "");
  const full = [resolveCliPath(), ...args, "--cwd", cwd, ...(registry && takesRegistry ? ["--registry", registry] : [])];
  return new Promise((done) => {
    const child = execFile(
      process.execPath,
      full,
      {
        cwd,
        timeout: timeoutMs,
        maxBuffer: 16 * 1024 * 1024,
        windowsHide: true,
        env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0", CI: "1" },
      },
      (error, stdout, stderr) => {
        const code = error ? (typeof error.code === "number" ? error.code : 1) : 0;
        const killed = error && "killed" in error && error.killed ? `\nThe command timed out after ${timeoutMs / 1000}s.` : "";
        done({ code, stdout: String(stdout), stderr: `${String(stderr)}${killed}` });
      }
    );
    child.stdin?.end();
  });
}
