import { copyFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MAX_RESPONSE_BYTES, RegistryClient, createLocalRegistryClient } from "./index.js";

const REGISTRY = resolve(__dirname, "../../../dist/registry");

describe("RegistryClient (local)", () => {
  const client = createLocalRegistryClient(REGISTRY);

  it("lists items", async () => {
    const items = await client.listItems();
    expect(items.map((i) => i.id)).toContain("button");
  });

  it("resolves an item with hydrated content", async () => {
    const item = await client.getItem("button");
    expect(item.files[0]?.content).toBeTruthy();
  });

  it("resolves dependencies once, dependencies first", async () => {
    const resolved = await client.resolveWithDependencies("badge");
    expect(resolved.at(-1)?.id).toBe("badge");
  });

  it("errors for unknown registries", async () => {
    await expect(client.getItem("button", "nope")).rejects.toThrow(/No registry source/);
  });

  it("verifies file integrity hashes on item load", async () => {
    const item = await client.getItem("button");
    expect(item.files[0]?.hash).toBeDefined();
  });

  it("rejects an item whose id differs from the one requested", async () => {
    const dir = mkdtempSync(join(tmpdir(), "nativra-client-"));
    try {
      mkdirSync(join(dir, "items"));
      copyFileSync(join(REGISTRY, "items", "button.json"), join(dir, "items", "badge.json"));
      await expect(createLocalRegistryClient(dir).getItem("badge")).rejects.toThrow(/returned item "button"/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("rejects path traversal and malformed item IDs", async () => {
    await expect(client.getItem("../registry")).rejects.toThrow(/Invalid registry item ID/);
    await expect(client.getItem("../../package")).rejects.toThrow(/Invalid registry item ID/);
    await expect(client.getItem("button/../../etc/passwd")).rejects.toThrow(/Invalid registry item ID/);
  });
});



describe("RegistryClient (remote)", () => {
  const remote = () => new RegistryClient([{ kind: "remote", location: "https://registry.test", name: "default" }]);

  afterEach(() => vi.unstubAllGlobals());

  it("rejects a redirect from https to http", async () => {
    const res = new Response("{}", { status: 200 });
    Object.defineProperty(res, "url", { value: "http://evil.test/registry.json" });
    vi.stubGlobal("fetch", vi.fn(async () => res));
    await expect(remote().getManifest()).rejects.toThrow(/insecure/);
  });

  it("rejects oversized responses", async () => {
    const big = "x".repeat(MAX_RESPONSE_BYTES + 1);
    vi.stubGlobal("fetch", vi.fn(async () => new Response(big, { status: 200 })));
    await expect(remote().getManifest()).rejects.toThrow(/too large/);
  });
});
