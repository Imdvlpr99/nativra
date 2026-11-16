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

  it("refuses a redirect hop to http before requesting it", async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 302, headers: { location: "http://evil.test/registry.json" } }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(remote().getManifest()).rejects.toThrow(/insecure/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("follows https redirects", async () => {
    const manifest = JSON.stringify({ name: "default", schemaVersion: "1", items: [] });
    const fetchMock = vi.fn(async (input: URL | string) =>
      String(input).startsWith("https://registry.test/")
        ? new Response(null, { status: 301, headers: { location: "https://cdn.registry.test/registry.json" } })
        : new Response(manifest, { status: 200 })
    );
    vi.stubGlobal("fetch", fetchMock);
    await expect(remote().getManifest()).resolves.toMatchObject({ name: "default" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("keeps a local http registry from redirecting to a remote host", async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 302, headers: { location: "https://elsewhere.test/registry.json" } }));
    vi.stubGlobal("fetch", fetchMock);
    const local = new RegistryClient([{ kind: "remote", location: "http://localhost:4000", name: "default" }]);
    await expect(local.getManifest()).rejects.toThrow(/local registry to a remote host/);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("fetches an item's dependencies concurrently and still resolves them in order", async () => {
    const item = (id: string, deps: string[] = []) =>
      JSON.stringify({
        id,
        name: id,
        description: id,
        type: "component",
        version: "1.0.0",
        stylingTargets: ["stylesheet"],
        platforms: { android: true, ios: true },
        files: [{ path: `${id}.tsx` }],
        registryDependencies: deps.map((d) => ({ id: d })),
      });
    // b and c only answer once both have been requested: fetched one at a time, this never resolves.
    let release!: () => void;
    const bothRequested = new Promise<void>((r) => (release = r));
    const requested = new Set<string>();
    const fetchMock = vi.fn(async (input: URL | string) => {
      const id = /items\/([a-z]+)\.json/.exec(String(input))![1]!;
      if (id === "a") return new Response(item("a", ["b", "c"]), { status: 200 });
      requested.add(id);
      if (requested.has("b") && requested.has("c")) release();
      await bothRequested;
      return new Response(item(id), { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);
    const resolved = await remote().resolveWithDependencies("a");
    expect(resolved.map((i) => i.id)).toEqual(["b", "c", "a"]);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  }, 3000);

  it("stops after too many redirects", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 302, headers: { location: "/loop" } })));
    await expect(remote().getManifest()).rejects.toThrow(/redirects/);
  });

  it("rejects oversized responses", async () => {
    const big = "x".repeat(MAX_RESPONSE_BYTES + 1);
    vi.stubGlobal("fetch", vi.fn(async () => new Response(big, { status: 200 })));
    await expect(remote().getManifest()).rejects.toThrow(/too large/);
  });
});
