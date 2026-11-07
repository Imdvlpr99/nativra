import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildRegistry } from "./index.js";

const item = (extra: Record<string, unknown> = {}) => ({
  id: "thing",
  name: "Thing",
  description: "d",
  type: "component",
  version: "1.0.0",
  stylingTargets: ["stylesheet"],
  platforms: { android: true, ios: true },
  files: [{ path: "Thing.tsx" }],
  ...extra,
});

async function setup(def: unknown, withSource = true) {
  const root = await mkdtemp(join(tmpdir(), "reg-"));
  const dir = join(root, "src", "default", "components", "thing");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "item.json"), JSON.stringify(def));
  if (withSource) await writeFile(join(dir, "Thing.tsx"), "export const x = 1;");
  return { src: join(root, "src"), out: join(root, "out") };
}

describe("buildRegistry", () => {
  it("hydrates content, hashes and writes output", async () => {
    const { src, out } = await setup(item());
    const r = await buildRegistry({ sourceDir: src, outDir: out });
    expect(r.errors).toEqual([]);
    const built = JSON.parse(await readFile(join(out, "items", "thing.json"), "utf8"));
    expect(built.files[0].content).toBe("export const x = 1;");
    expect(built.files[0].hash).toHaveLength(64);
  });

  it("reports schema errors", async () => {
    const { src, out } = await setup(item({ id: "Bad Id" }));
    const r = await buildRegistry({ sourceDir: src, outDir: out });
    expect(r.errors.length).toBeGreaterThan(0);
  });

  it("reports missing source files and prevents emitting invalid registry", async () => {
    const { src, out } = await setup(item(), false);
    const r = await buildRegistry({ sourceDir: src, outDir: out });
    expect(r.errors.join()).toContain("Could not read source file");
    expect(r.items).toHaveLength(0);
  });

  it("rejects path traversal attempts", async () => {
    const { src, out } = await setup(item({ files: [{ path: "../secret.txt" }] }));
    const r = await buildRegistry({ sourceDir: src, outDir: out });
    expect(r.errors.join()).toContain("Unsafe file path rejected");
  });

  it("cleans stale items from output directory", async () => {
    const { src, out } = await setup(item());
    const itemsDir = join(out, "items");
    await mkdir(itemsDir, { recursive: true });
    await writeFile(join(itemsDir, "old-stale-item.json"), "{}");

    const r = await buildRegistry({ sourceDir: src, outDir: out });
    expect(r.errors).toEqual([]);
    const { existsSync } = await import("node:fs");
    expect(existsSync(join(itemsDir, "old-stale-item.json"))).toBe(false);
    expect(existsSync(join(itemsDir, "thing.json"))).toBe(true);
  });
});


