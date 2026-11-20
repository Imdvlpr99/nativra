import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildRegistry, checkAccessibility, findDependencyCycles, findFileCollisions } from "./index.js";
import type { RegistryItem } from "@nativra/registry-schema";

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

  it("rejects an id that does not match its directory", async () => {
    const { src, out } = await setup(item({ id: "other" }));
    const r = await buildRegistry({ sourceDir: src, outDir: out });
    expect(r.errors.join()).toMatch(/must match its directory/);
  });

  it("rejects unknown registry dependencies", async () => {
    const { src, out } = await setup(item({ registryDependencies: [{ id: "missing" }] }));
    const r = await buildRegistry({ sourceDir: src, outDir: out });
    expect(r.errors.join()).toMatch(/Unknown registry dependency "missing"/);
  });

  it("rejects files whose target is not a declared styling target", async () => {
    const { src, out } = await setup(item({ files: [{ path: "Thing.tsx", target: "nativewind" }] }));
    const r = await buildRegistry({ sourceDir: src, outDir: out });
    expect(r.errors.join()).toMatch(/not listed in stylingTargets/);
  });

  it("rejects two files that would install under the same name", async () => {
    const { src, out } = await setup(item({ files: [{ path: "Thing.tsx" }, { path: "./Thing.tsx", target: "stylesheet" }] }));
    const r = await buildRegistry({ sourceDir: src, outDir: out });
    expect(r.errors.join()).toMatch(/both install as Thing\.tsx for stylesheet/);
  });

  it("allows the same name once per styling target", async () => {
    const def = item({
      stylingTargets: ["stylesheet", "nativewind"],
      files: [
        { path: "Thing.tsx", target: "stylesheet" },
        { path: "Thing.tsx", target: "nativewind" },
      ],
    });
    const { src, out } = await setup(def);
    const r = await buildRegistry({ sourceDir: src, outDir: out });
    expect(r.errors).toEqual([]);
  });

  it("hydrates docs from docsPath and reports a missing docs file", async () => {
    const ok = await setup(item({ docsPath: "docs.mdx" }));
    await writeFile(join(ok.src, "default", "components", "thing", "docs.mdx"), "# Thing");
    const r = await buildRegistry({ sourceDir: ok.src, outDir: ok.out });
    expect(r.errors).toEqual([]);
    expect(r.items[0]?.docs).toBe("# Thing");

    const missing = await setup(item({ docsPath: "nope.mdx" }));
    const r2 = await buildRegistry({ sourceDir: missing.src, outDir: missing.out });
    expect(r2.errors.join()).toMatch(/Could not read docs file/);
  });

  it("produces identical output for identical sources (no build timestamp)", async () => {
    const { src, out } = await setup(item());
    await buildRegistry({ sourceDir: src, outDir: out });
    const first = await readFile(join(out, "items", "thing.json"), "utf8");
    await buildRegistry({ sourceDir: src, outDir: out });
    expect(await readFile(join(out, "items", "thing.json"), "utf8")).toBe(first);
    expect(JSON.parse(first).updatedAt).toBeUndefined();
  });

  it("requires a deprecationMessage on deprecated items", async () => {
    const { src, out } = await setup(item({ status: "deprecated" }));
    const r = await buildRegistry({ sourceDir: src, outDir: out });
    expect(r.errors.join()).toMatch(/deprecationMessage/);
    const ok = await setup(item({ status: "deprecated", deprecationMessage: "Use other-thing." }));
    expect((await buildRegistry({ sourceDir: ok.src, outDir: ok.out })).errors).toEqual([]);
  });
});

describe("findDependencyCycles", () => {
  const node = (id: string, ...deps: string[]) =>
    ({ id, registryDependencies: deps.map((d) => ({ id: d, registry: "default" })) }) as unknown as RegistryItem;

  it("reports each cycle once", () => {
    expect(findDependencyCycles([node("a", "b"), node("b", "a"), node("c", "a")], "default")).toEqual([
      "[a] Dependency cycle: a -> b -> a",
    ]);
  });

  it("accepts an acyclic graph and ignores other registries", () => {
    const external = { id: "x", registryDependencies: [{ id: "x", registry: "acme" }] } as unknown as RegistryItem;
    expect(findDependencyCycles([node("a", "b"), node("b"), external], "default")).toEqual([]);
  });
});

describe("findFileCollisions", () => {
  const it_ = (id: string, type: string, ...paths: string[]) =>
    ({ id, type, stylingTargets: ["stylesheet"], files: paths.map((path) => ({ path })) }) as unknown as RegistryItem;

  it("reports two items installing the same file name into the same folder", () => {
    const errors = findFileCollisions([it_("card", "component", "Card.tsx"), it_("promo", "block", "Promo.tsx", "Card.tsx")]);
    expect(errors).toEqual(['[promo] Card.tsx would overwrite the file of the same name from "card" (stylesheet)']);
  });

  it("allows the same name in different folders, and themes sharing theme.ts", () => {
    expect(
      findFileCollisions([
        it_("button", "component", "Button.tsx"),
        it_("use-button", "hook", "Button.tsx"),
        it_("zinc", "theme", "theme.ts"),
        it_("rose", "theme", "theme.ts"),
      ])
    ).toEqual([]);
  });
});

describe("checkAccessibility", () => {
  const withSource = (content: string) => ({ files: [{ path: "nativewind/Thing.tsx", content }] }) as unknown as RegistryItem;

  it("requires adjustable elements to handle increment and decrement", () => {
    expect(checkAccessibility(withSource('<View accessibilityRole="adjustable" />'))).toEqual([
      'nativewind/Thing.tsx: accessibilityRole "adjustable" needs onAccessibilityAction (increment/decrement)',
    ]);
    expect(checkAccessibility(withSource('<View accessibilityRole={x ? "adjustable" : undefined} />'))).toHaveLength(1);
    expect(checkAccessibility(withSource('<View accessibilityRole="adjustable" onAccessibilityAction={f} />'))).toEqual([]);
    expect(checkAccessibility(withSource('<View accessibilityRole="button" />'))).toEqual([]);
  });

  it("requires Pressable over Touchable* and a role or label on every Pressable", () => {
    expect(checkAccessibility(withSource("<TouchableOpacity onPress={f} />"))).toEqual([
      "nativewind/Thing.tsx:1: use Pressable instead of <TouchableOpacity>",
    ]);
    expect(checkAccessibility(withSource("<Pressable onPress={f} style={({ pressed }) => [s, pressed && o]}>"))).toEqual([
      "nativewind/Thing.tsx:1: <Pressable> needs an accessibilityRole or accessibilityLabel",
    ]);
    expect(checkAccessibility(withSource('<Pressable style={({ pressed }) => [s]} accessibilityRole="button">'))).toEqual([]);
    expect(checkAccessibility(withSource('<Pressable accessibilityLabel="Close" />'))).toEqual([]);
    expect(checkAccessibility(withSource("<Pressable {...rest} />"))).toEqual([]);
  });
});
