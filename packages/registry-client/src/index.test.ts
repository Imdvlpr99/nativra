import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { createLocalRegistryClient } from "./index.js";

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

  it("rejects path traversal and malformed item IDs", async () => {
    await expect(client.getItem("../registry")).rejects.toThrow(/Invalid registry item ID/);
    await expect(client.getItem("../../package")).rejects.toThrow(/Invalid registry item ID/);
    await expect(client.getItem("button/../../etc/passwd")).rejects.toThrow(/Invalid registry item ID/);
  });
});


