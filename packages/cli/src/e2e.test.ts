import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const CLI = resolve(__dirname, "../dist/cli.js");
const REGISTRY = resolve(__dirname, "../../../dist/registry");

let cwd: string;
const run = (...args: string[]) =>
  execFileSync("node", [CLI, ...args, "--cwd", cwd], { encoding: "utf8" });
const runReg = (...args: string[]) => run(...args, "--registry", REGISTRY);

beforeAll(() => {
  if (!existsSync(CLI) || !existsSync(join(REGISTRY, "registry.json"))) {
    throw new Error("Run `pnpm build` and `node scripts/build-registry.mjs` before the CLI tests.");
  }
  cwd = mkdtempSync(join(tmpdir(), "nativra-e2e-"));
  writeFileSync(join(cwd, "package.json"), JSON.stringify({ name: "t", dependencies: { nativewind: "4" } }));
  writeFileSync(join(cwd, "app.json"), "{}");
});

afterAll(() => rmSync(cwd, { recursive: true, force: true }));

describe("nativra CLI (local registry)", () => {
  it("init --yes writes nativra.json", () => {
    run("init", "--yes");
    expect(JSON.parse(readFileSync(join(cwd, "nativra.json"), "utf8")).stylingTarget).toBe("nativewind");
  });

  it("list and search find items", () => {
    expect(runReg("list")).toContain("button");
    expect(runReg("search", "badge")).toContain("badge");
  });

  it("add installs the NativeWind file and records a lock entry", () => {
    runReg("add", "button", "--yes");
    const file = join(cwd, "components/ui/Button.tsx");
    expect(readFileSync(file, "utf8")).toContain("className");
    expect(JSON.parse(readFileSync(join(cwd, "nativra.lock.json"), "utf8")).items.button).toBeDefined();
  });

  it("add never silently overwrites existing files with --yes", () => {
    const file = join(cwd, "components/ui/Button.tsx");
    writeFileSync(file, "// mine");
    runReg("add", "button", "--yes");
    expect(readFileSync(file, "utf8")).toBe("// mine");
  });

  it("add aborts when --on-conflict error is set and file exists", () => {
    expect(() => runReg("add", "button", "--yes", "--on-conflict", "error")).toThrow();
  });

  it("add overwrites existing files when --overwrite is set", () => {
    const file = join(cwd, "components/ui/Button.tsx");
    writeFileSync(file, "// mine");
    runReg("add", "button", "--yes", "--overwrite");
    expect(readFileSync(file, "utf8")).toContain("className");
  });

  it("update skips locally modified files, --force overwrites", () => {
    const file = join(cwd, "components/ui/Button.tsx");
    writeFileSync(file, "// mine");
    expect(runReg("update", "button")).toContain("local changes");
    expect(readFileSync(file, "utf8")).toBe("// mine");
    runReg("update", "button", "--force");
    expect(readFileSync(file, "utf8")).toContain("className");
  });

  it("add empty-state resolves and installs dependencies", () => {
    runReg("add", "empty-state", "--yes");
    expect(existsSync(join(cwd, "components/ui/EmptyState.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "components/ui/Card.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "components/ui/Text.tsx"))).toBe(true);
  });

  it("add multiple items simultaneously", () => {
    runReg("add", "input", "badge", "--yes");
    expect(existsSync(join(cwd, "components/ui/Input.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "components/ui/Badge.tsx"))).toBe(true);
  });

  it("add full template flow", () => {
    runReg("add", "auth-flow", "--yes");
    expect(existsSync(join(cwd, "components/ui/AuthFlow.tsx"))).toBe(true);
  });

  it("diff command inspects differences against upstream registry", () => {
    const file = join(cwd, "components/ui/Button.tsx");
    writeFileSync(file, "// custom diff change");
    const out = runReg("diff", "button");
    expect(out).toContain("Button.tsx");
  });

  it("rollback command safely reports or restores", () => {
    const out = run("rollback", "button");
    expect(out).toMatch(/backup/i);
  });


  it("theme add writes the theme file", () => {
    runReg("theme", "add", "dark-slate");
    expect(existsSync(join(cwd, "lib/themes/theme.ts"))).toBe(true);
  });

  it("registry add / list round-trips", () => {
    run("registry", "add", "extra", "https://example.com/registry");
    expect(run("registry", "list")).toContain("extra");
  });

  it("doctor passes", () => {
    expect(run("doctor")).toContain("All checks passed");
  });
});

