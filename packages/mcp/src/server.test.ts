import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { createServer } from "./server.js";

const CLI = resolve(__dirname, "../../cli/dist/cli.js");
const REGISTRY = resolve(__dirname, "../../../dist/registry");
const SERVER = resolve(__dirname, "../dist/index.js");
const dirs: string[] = [];
let client: Client;

beforeAll(async () => {
  if (!existsSync(CLI) || !existsSync(join(REGISTRY, "registry.json"))) {
    throw new Error("Run `pnpm build` and `node scripts/build-registry.mjs` before the MCP tests.");
  }
  process.env["NATIVRA_CLI"] = CLI;
  process.env["NATIVRA_REGISTRY"] = REGISTRY;
  const [clientSide, serverSide] = InMemoryTransport.createLinkedPair();
  await createServer().connect(serverSide);
  client = new Client({ name: "test", version: "0.0.0" });
  await client.connect(clientSide);
});
afterAll(async () => {
  await client?.close();
});
afterEach(() => {
  for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true });
});

function project(): string {
  const cwd = mkdtempSync(join(tmpdir(), "nativra-mcp-"));
  dirs.push(cwd);
  writeFileSync(join(cwd, "package.json"), JSON.stringify({ name: "t", dependencies: { expo: "~52.0.0", "react-native": "0.76.0" } }));
  writeFileSync(join(cwd, "app.json"), "{}");
  return cwd;
}

async function call(name: string, args: Record<string, unknown>) {
  const r = (await client.callTool({ name, arguments: args })) as CallToolResult;
  const body = r.content.map((c) => (c.type === "text" ? c.text : "")).join("\n");
  return { isError: Boolean(r.isError), body };
}

describe("nativra MCP server", () => {
  it("lists its tools", async () => {
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual(
      ["nativra_add", "nativra_diff", "nativra_doctor", "nativra_info", "nativra_init", "nativra_list", "nativra_search", "nativra_update"]
    );
    expect(tools.find((t) => t.name === "nativra_search")?.annotations?.readOnlyHint).toBe(true);
  });

  it("searches the registry and returns JSON", async () => {
    const r = await call("nativra_search", { query: "badge", cwd: project() });
    expect(r.isError).toBe(false);
    const hits = JSON.parse(r.body) as Array<{ id: string }>;
    expect(hits.some((h) => h.id === "badge")).toBe(true);
  });

  it("returns an item's docs on request", async () => {
    const cwd = project();
    const plain = JSON.parse((await call("nativra_info", { item: "button", cwd })).body) as { docs?: string };
    expect(plain.docs).toBeUndefined();
    const withDocs = JSON.parse((await call("nativra_info", { item: "button", includeDocs: true, cwd })).body) as { docs?: string };
    expect(withDocs.docs).toContain("# Button");
  });

  it("initializes a project and adds an item", async () => {
    const cwd = project();
    expect((await call("nativra_init", { cwd })).isError).toBe(false);
    const add = await call("nativra_add", { items: ["badge"], installDependencies: false, cwd });
    expect(add.isError).toBe(false);
    const lock = JSON.parse(readFileSync(join(cwd, "nativra.lock.json"), "utf8")) as { items: Record<string, { files: Record<string, string> }> };
    const [file] = Object.keys(lock.items["badge"]!.files);
    expect(existsSync(join(cwd, file!))).toBe(true);

    const outdated = await call("nativra_list", { outdated: true, cwd });
    expect(outdated.isError).toBe(false);
    expect(JSON.parse(outdated.body)).toEqual([]);
  });

  it("rejects item refs that could be read as CLI options", async () => {
    const r = await call("nativra_add", { items: ["--registry=https://evil.example"], cwd: project() });
    expect(r.isError).toBe(true);
    expect(r.body).toMatch(/item id/i);
  });

  it("rejects a relative cwd", async () => {
    const r = await call("nativra_search", { query: "badge", cwd: "relative/path" });
    expect(r.isError).toBe(true);
    expect(r.body).toContain("absolute path");
  });

  it("runs over stdio from the built bin", async () => {
    if (!existsSync(SERVER)) throw new Error("Run `pnpm --filter @nativra/mcp build` first.");
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [SERVER],
      env: { ...process.env, NATIVRA_CLI: CLI, NATIVRA_REGISTRY: REGISTRY } as Record<string, string>,
      stderr: "ignore",
    });
    const stdio = new Client({ name: "stdio-test", version: "0.0.0" });
    await stdio.connect(transport);
    try {
      const { tools } = await stdio.listTools();
      expect(tools.length).toBe(8);
    } finally {
      await stdio.close();
    }
  });
});
