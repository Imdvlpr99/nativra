import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { ITEM_REF, resolveProjectRoot, runCli, type CliResult } from "./run-cli.js";

declare const __NATIVRA_VERSION__: string;
const VERSION = typeof __NATIVRA_VERSION__ === "string" ? __NATIVRA_VERSION__ : "0.0.0-dev";

const ITEM_TYPES = ["component", "block", "template", "hook", "utility", "theme", "style"] as const;

const cwd = z
  .string()
  .optional()
  .describe("Absolute path of the React Native / Expo project. Defaults to the directory the server was started in.");
const itemRef = z.string().regex(ITEM_REF, 'An item id like "button", or "<registry>/<id>"');

const text = (body: string, isError = false): CallToolResult => ({ content: [{ type: "text", text: body }], ...(isError ? { isError } : {}) });

/** The CLI's output as a tool result; a non-zero exit is an error result, not a thrown error. */
function fromCli(r: CliResult, { okOnExit1 = false } = {}): CallToolResult {
  const out = [r.stdout.trim(), r.stderr.trim()].filter(Boolean).join("\n\n");
  const ok = r.code === 0 || (okOnExit1 && r.code === 1);
  return text(out || (ok ? "Done." : `nativra-cli exited with code ${r.code}.`), !ok);
}

/** JSON output, parsed and re-printed compactly; falls back to the raw text. */
function fromJson(r: CliResult, { okOnExit1 = false } = {}): CallToolResult {
  const ok = r.code === 0 || (okOnExit1 && r.code === 1);
  const start = r.stdout.search(/[[{]/);
  if (ok && start >= 0) {
    try {
      return text(JSON.stringify(JSON.parse(r.stdout.slice(start))));
    } catch {
      // not JSON after all: report the text below
    }
  }
  return fromCli(r, { okOnExit1 });
}

/** Runs a tool body, turning a thrown error (bad cwd) into an error result. */
async function guarded(body: () => Promise<CallToolResult>): Promise<CallToolResult> {
  try {
    return await body();
  } catch (err) {
    return text((err as Error).message, true);
  }
}

export function createServer(): McpServer {
  const server = new McpServer(
    { name: "nativra", version: VERSION },
    {
      instructions:
        "Nativra copies React Native UI source into the user's project (like shadcn/ui). Search or list to find items, " +
        "read nativra_info with includeDocs for usage, then nativra_add. Run nativra_init once if the project has no nativra.json. " +
        "Installed files belong to the user: never pass overwrite unless they asked, and use nativra_diff before updating edited files.",
    }
  );

  server.registerTool(
    "nativra_search",
    {
      title: "Search Nativra",
      description: "Search every configured registry by id, name, description or tag. Returns matching items with their type and status.",
      inputSchema: { query: z.string().min(1).max(100), cwd },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    ({ query, cwd: dir }) => guarded(async () => fromJson(await runCli(["search", query, "--json"], await resolveProjectRoot(dir))))
  );

  server.registerTool(
    "nativra_list",
    {
      title: "List Nativra items",
      description:
        "List registry items, optionally of one type. With installed, list what this project has installed and whether updates exist; outdated narrows that to items with updates.",
      inputSchema: {
        type: z.enum(ITEM_TYPES).optional(),
        installed: z.boolean().optional(),
        outdated: z.boolean().optional(),
        cwd,
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    ({ type, installed, outdated, cwd: dir }) =>
      guarded(async () => {
        const args = ["list", "--json"];
        if (type) args.push("--type", type);
        if (outdated) args.push("--outdated");
        else if (installed) args.push("--installed");
        // list --outdated exits 1 when it finds updates: that is a result, not a failure.
        return fromJson(await runCli(args, await resolveProjectRoot(dir)), { okOnExit1: Boolean(outdated) });
      })
  );

  server.registerTool(
    "nativra_info",
    {
      title: "Nativra item details",
      description:
        "Metadata for one item: description, files, dependencies, platforms, installed version. includeDocs adds its Markdown usage docs (props, examples).",
      inputSchema: { item: itemRef, includeDocs: z.boolean().optional(), cwd },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    ({ item, includeDocs, cwd: dir }) =>
      guarded(async () => fromJson(await runCli(["info", item, "--json", ...(includeDocs ? ["--docs"] : [])], await resolveProjectRoot(dir))))
  );

  server.registerTool(
    "nativra_init",
    {
      title: "Initialize Nativra",
      description: "Create nativra.json in a React Native / Expo project, with detected defaults. Fails if one already exists.",
      inputSchema: { style: z.string().regex(/^[a-z][a-z0-9-]*$/).optional().describe("UI style id, e.g. soft"), cwd },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
    },
    ({ style, cwd: dir }) =>
      guarded(async () => fromCli(await runCli(["init", "--yes", ...(style ? ["--style", style] : [])], await resolveProjectRoot(dir))))
  );

  server.registerTool(
    "nativra_add",
    {
      title: "Add Nativra items",
      description:
        "Copy items (and their registry dependencies) into the project, rewriting imports to its aliases. Existing files are kept unless overwrite is true. " +
        "installDependencies runs the project's package manager for npm dependencies.",
      inputSchema: {
        items: z.array(itemRef).min(1).max(20),
        dryRun: z.boolean().optional().describe("Show the plan without writing anything"),
        overwrite: z.boolean().optional().describe("Replace existing files (they are backed up first). Only when the user asked."),
        installDependencies: z.boolean().optional().describe("Install npm dependencies (default true)"),
        cwd,
      },
      annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: true },
    },
    ({ items, dryRun, overwrite, installDependencies = true, cwd: dir }) =>
      guarded(async () => {
        const args = ["add", ...items, "--yes", installDependencies ? "--install" : "--no-install"];
        if (dryRun) args.push("--dry-run");
        if (overwrite) args.push("--overwrite");
        return fromCli(await runCli(args, await resolveProjectRoot(dir), 600_000));
      })
  );

  server.registerTool(
    "nativra_diff",
    {
      title: "Diff an installed item",
      description: "Compare an installed item's files with the registry's current version (unified diff). summary gives one line per file.",
      inputSchema: { item: itemRef, summary: z.boolean().optional(), cwd },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    ({ item, summary, cwd: dir }) =>
      guarded(async () => fromCli(await runCli(["diff", item, ...(summary ? ["--summary"] : [])], await resolveProjectRoot(dir))))
  );

  server.registerTool(
    "nativra_update",
    {
      title: "Update installed items",
      description:
        "Update installed items (all when none are given) to the registry's version. Files the user edited are skipped and reported, never overwritten.",
      inputSchema: { items: z.array(itemRef).max(50).optional(), dryRun: z.boolean().optional(), cwd },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
    },
    ({ items = [], dryRun, cwd: dir }) =>
      guarded(async () => fromCli(await runCli(["update", ...items, ...(dryRun ? ["--dry-run"] : [])], await resolveProjectRoot(dir), 600_000)))
  );

  server.registerTool(
    "nativra_doctor",
    {
      title: "Check the Nativra setup",
      description: "Check the project's Nativra setup (config, aliases, NativeWind, dependencies) and report problems.",
      inputSchema: { cwd },
      annotations: { readOnlyHint: true },
    },
    ({ cwd: dir }) => guarded(async () => fromJson(await runCli(["doctor", "--json"], await resolveProjectRoot(dir)), { okOnExit1: true }))
  );

  return server;
}
