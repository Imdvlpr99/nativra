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

  it("reports missing source files", async () => {
    const { src, out } = await setup(item(), false);
    const r = await buildRegistry({ sourceDir: src, outDir: out });
    expect(r.errors.join()).toContain("Could not read source file");
  });
});

