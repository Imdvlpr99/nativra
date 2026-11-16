import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { PlaygroundShell, type Line } from "./cli";
import { starterProject, type ProjectFiles, type Target } from "./project";

// The shell fetches /registry.json and /items/<id>.json; serve them from the built registry.
const REGISTRY = resolve(__dirname, "../../../../dist/registry");

beforeAll(() => {
  vi.stubGlobal("fetch", async (url: string) => {
    try {
      const body = readFileSync(resolve(REGISTRY, `.${url}`), "utf8");
      return { ok: true, status: 200, json: async () => JSON.parse(body) as unknown };
    } catch {
      return { ok: false, status: 404, json: async () => ({}) };
    }
  });
});

function session(target: Target = "stylesheet") {
  let files: ProjectFiles = starterProject(target);
  const output: string[] = [];
  let currentTarget = target;
  const shell = new PlaygroundShell({
    files: () => files,
    setFiles: (next) => {
      files = next;
    },
    print: (l: Line | Line[]) => output.push(...(Array.isArray(l) ? l : [l]).map((x) => x.text)),
    clear: () => (output.length = 0),
    setTarget: (t) => (currentTarget = t),
  });
  return { shell, files: () => files, output, target: () => currentTarget };
}

describe("playground CLI", () => {
  it("add installs the item and its dependencies with project aliases", async () => {
    const s = session();
    await s.shell.run("npx nativra-cli add button");
    const files = s.files();
    expect(files["components/ui/Button.tsx"]).toContain('from "@/hooks/use-theme-colors"');
    expect(files["hooks/use-theme-colors.ts"]).toBeDefined();
    expect(files["lib/themes/theme.ts"]).toBeDefined();
    expect(files["lib/themes/style.ts"]).toContain('id: "soft"');
    expect(Object.keys(JSON.parse(files["nativra.lock.json"]!).items)).toEqual(
      expect.arrayContaining(["button", "use-theme-colors", "zinc", "soft"])
    );
    expect(s.output.join("\n")).toContain('import { Button } from "@/components/ui/Button";');
  });

  it("writes the theme block into global.css for NativeWind projects", async () => {
    const s = session("nativewind");
    await s.shell.run("nativra add card");
    const css = s.files()["global.css"]!;
    expect(css).toContain("NATIVRA THEME START: zinc");
    expect(css).toContain("/* style: soft */");
    expect(s.files()["components/ui/Card.tsx"]).toContain("className");
  });

  it("style add switches the style, remembers it, and refreshes the CSS", async () => {
    const s = session("nativewind");
    await s.shell.run("nativra add badge");
    await s.shell.run("nativra style add ios");
    expect(s.files()["lib/themes/style.ts"]).toContain('id: "ios"');
    expect(JSON.parse(s.files()["nativra.json"]!).style).toBe("ios");
    expect(s.files()["global.css"]).toContain("/* style: ios */");
  });

  it("refuses to remove the active theme while components need it", async () => {
    const s = session();
    await s.shell.run("nativra add badge");
    await s.shell.run("nativra remove zinc");
    expect(s.output.join("\n")).toContain('Refusing to remove "zinc"');
    expect(s.files()["lib/themes/theme.ts"]).toBeDefined();
  });

  it("keeps existing files unless --overwrite", async () => {
    const s = session();
    await s.shell.run("nativra add badge");
    const edited = { ...s.files(), "components/ui/Badge.tsx": "// mine" };
    (s.shell as unknown as { host: { setFiles(f: ProjectFiles): void } }).host.setFiles(edited);
    await s.shell.run("nativra add badge");
    expect(s.files()["components/ui/Badge.tsx"]).toBe("// mine");
    await s.shell.run("nativra add badge --overwrite");
    expect(s.files()["components/ui/Badge.tsx"]).not.toBe("// mine");
  });

  it("reports unknown items and commands without throwing", async () => {
    const s = session();
    await s.shell.run("nativra add does-not-exist");
    await s.shell.run("rmdir x");
    await s.shell.run("nativra doctor");
    const out = s.output.join("\n");
    expect(out).toContain('Failed to fetch "does-not-exist"');
    expect(out).toContain("command not found");
    expect(out).toContain("isn't available in the playground");
  });

  it("init switches the target and rejects unknown styles", async () => {
    const s = session();
    await s.shell.run("nativra init --target nativewind --force");
    expect(s.target()).toBe("nativewind");
    expect(s.files()["global.css"]).toBeDefined();
    await s.shell.run("nativra init --force --style neon");
    expect(s.output.join("\n")).toContain('Unknown style "neon"');
  });
});
