import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { nativraConfigJsonSchema } from "./config.js";
import { backupDirFor, createBackup, discardBackup, findLatestBackup } from "./install.js";

/**
 * Regression tests for the 2026-11 project review. Each test builds its own project in a temp
 * dir and runs the built CLI against the local registry (dist/registry).
 */
const CLI = resolve(__dirname, "../dist/cli.js");
const REGISTRY = resolve(__dirname, "../../../dist/registry");
const dirs: string[] = [];

beforeAll(() => {
  if (!existsSync(CLI) || !existsSync(join(REGISTRY, "registry.json"))) {
    throw new Error("Run `pnpm build` and `node scripts/build-registry.mjs` before the CLI tests.");
  }
});
afterEach(() => {
  for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true });
});

function project(opts: { src?: boolean; pkg?: Record<string, unknown> } = {}): string {
  const cwd = mkdtempSync(join(tmpdir(), "nativra-reg-"));
  dirs.push(cwd);
  writeFileSync(join(cwd, "package.json"), JSON.stringify(opts.pkg ?? { name: "t", dependencies: { nativewind: "4" } }));
  writeFileSync(join(cwd, "app.json"), "{}");
  if (opts.src) {
    mkdirSync(join(cwd, "src"));
    writeFileSync(join(cwd, "tsconfig.json"), JSON.stringify({ compilerOptions: { paths: { "@/*": ["./src/*"] } } }));
  }
  execFileSync("node", [CLI, "init", "--yes", "--cwd", cwd], { encoding: "utf8" });
  return cwd;
}

/** Runs the CLI without throwing, returning its exit status and output. */
function cli(cwd: string, ...args: string[]) {
  const r = spawnSync("node", [CLI, ...args, "--cwd", cwd], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  return { status: r.status, out: `${r.stdout}${r.stderr}` };
}
const reg = (cwd: string, ...args: string[]) => cli(cwd, ...args, "--registry", REGISTRY);
const lockOf = (cwd: string) => JSON.parse(readFileSync(join(cwd, "nativra.lock.json"), "utf8")) as { items: Record<string, unknown> };

describe("src/ projects", () => {
  it("rewrites the theme import through the src alias", () => {
    const cwd = project({ src: true });
    expect(reg(cwd, "add", "use-theme-colors", "--yes", "--no-install").status).toBe(0);
    const hook = readFileSync(join(cwd, "src/hooks/use-theme-colors.ts"), "utf8");
    expect(hook).toContain('from "@/lib/themes/theme"');
    expect(JSON.parse(readFileSync(join(cwd, "nativra.json"), "utf8")).aliases.themes).toBe("@/lib/themes");
  });
});

describe("exit codes", () => {
  it("add and update exit non-zero when an item can't be resolved", () => {
    const cwd = project();
    expect(reg(cwd, "add", "does-not-exist", "--yes", "--no-install").status).not.toBe(0);
    expect(reg(cwd, "update", "does-not-exist").status).not.toBe(0);
  });

  it("theme add reports an unknown theme without a stack trace", () => {
    const cwd = project();
    const r = reg(cwd, "theme", "add", "does-not-exist");
    expect(r.status).not.toBe(0);
    expect(r.out).toContain('Could not load theme "does-not-exist"');
    expect(r.out).not.toMatch(/\n\s+at /);
  });
});

describe("lockfile safety", () => {
  it("refuses to overwrite an unreadable lockfile", () => {
    const cwd = project();
    const broken = '{\n<<<<<<< HEAD\n  "items": {}\n=======\n>>>>>>> theirs\n}';
    writeFileSync(join(cwd, "nativra.lock.json"), broken);
    const r = reg(cwd, "add", "button", "--yes", "--no-install");
    expect(r.status).not.toBe(0);
    expect(r.out).toContain("not valid JSON");
    expect(readFileSync(join(cwd, "nativra.lock.json"), "utf8")).toBe(broken);
  });

  it("records components installed before a later one fails", () => {
    const cwd = project();
    // card shares dependencies with button, so with --on-conflict error it stops after button.
    const r = reg(cwd, "add", "button", "card", "--yes", "--no-install", "--on-conflict", "error");
    expect(r.status).not.toBe(0);
    expect(lockOf(cwd).items.button).toBeDefined();
  });
});

describe("symlinks", () => {
  it("add refuses to write through a symlinked directory", () => {
    const cwd = project();
    const outside = mkdtempSync(join(tmpdir(), "nativra-outside-"));
    dirs.push(outside);
    mkdirSync(join(cwd, "components"));
    // A junction needs no admin rights on Windows and is a symlink everywhere else.
    symlinkSync(outside, join(cwd, "components", "ui"), "junction");
    const r = reg(cwd, "add", "button", "--yes", "--no-install");
    expect(r.status).not.toBe(0);
    expect(r.out).toMatch(/symbolic link/);
    expect(existsSync(join(outside, "Button.tsx"))).toBe(false);
  });
});

describe("backups and rollback", () => {
  it("add --overwrite backs up the replaced file", () => {
    const cwd = project();
    reg(cwd, "add", "button", "--yes", "--no-install");
    const file = join(cwd, "components/ui/Button.tsx");
    writeFileSync(file, "// mine");
    expect(reg(cwd, "add", "button", "--yes", "--no-install", "--overwrite").status).toBe(0);
    expect(cli(cwd, "rollback", "button").status).toBe(0);
    expect(readFileSync(file, "utf8")).toBe("// mine");
  });

  it("rollback refuses to discard edits made after the operation, unless --force", () => {
    const cwd = project();
    reg(cwd, "add", "button", "--yes", "--no-install");
    const file = join(cwd, "components/ui/Button.tsx");
    writeFileSync(file, "// v1");
    reg(cwd, "add", "button", "--yes", "--no-install", "--overwrite");
    writeFileSync(file, "// edited after overwrite");

    const refused = cli(cwd, "rollback", "button");
    expect(refused.status).not.toBe(0);
    expect(readFileSync(file, "utf8")).toBe("// edited after overwrite");

    expect(cli(cwd, "rollback", "button", "--force").status).toBe(0);
    expect(readFileSync(file, "utf8")).toBe("// v1");
  });

  it("rollback after remove restores the files and their lock entry", () => {
    const cwd = project();
    reg(cwd, "add", "badge", "--yes", "--no-install");
    const file = join(cwd, "components/ui/Badge.tsx");
    const original = readFileSync(file, "utf8");
    expect(cli(cwd, "remove", "badge", "--yes").status).toBe(0);
    expect(existsSync(file)).toBe(false);

    expect(cli(cwd, "rollback", "badge").status).toBe(0);
    expect(readFileSync(file, "utf8")).toBe(original);
    expect(lockOf(cwd).items.badge).toBeDefined();
  });

  it("discardBackup removes only the given snapshot and rejects unsafe ids", async () => {
    const cwd = project();
    const file = join(cwd, "a.tsx");
    writeFileSync(file, "// a");
    const older = await createBackup(cwd, "button", [{ destPath: file, exists: true }]);
    await new Promise((r) => setTimeout(r, 5)); // snapshot names sort by timestamp
    const newer = await createBackup(cwd, "button", [{ destPath: file, exists: true }]);

    await discardBackup(cwd, newer);
    expect(await findLatestBackup(cwd, "button")).toBe(join(backupDirFor(cwd, "button"), older.split("/")[1]!));

    for (const bad of ["button/../../outside", "../x/1700000000000-abcdef", "button", "button/1700000000000-abcdef/x"]) {
      await expect(discardBackup(cwd, bad)).rejects.toThrow();
    }
    expect(existsSync(join(backupDirFor(cwd, "button"), older.split("/")[1]!))).toBe(true);
  });

  it("remove of an unknown item exits non-zero", () => {
    const cwd = project();
    reg(cwd, "add", "badge", "--yes", "--no-install");
    expect(cli(cwd, "remove", "not-installed", "--yes").status).not.toBe(0);
  });
});

describe("doctor, registry and audit", () => {
  it("doctor --fix recognises tailwind.config.cjs instead of scaffolding a second config", () => {
    const cwd = project();
    writeFileSync(join(cwd, "tailwind.config.cjs"), "module.exports = { theme: { extend: { colors: { x: 'var(--color-x)' } } } };");
    cli(cwd, "doctor", "--fix");
    expect(existsSync(join(cwd, "tailwind.config.js"))).toBe(false);
  });

  it("registry add rejects insecure URLs and leaves nativra.json unchanged", () => {
    const cwd = project();
    const before = readFileSync(join(cwd, "nativra.json"), "utf8");
    expect(cli(cwd, "registry", "add", "evil", "http://example.com").status).not.toBe(0);
    expect(readFileSync(join(cwd, "nativra.json"), "utf8")).toBe(before);
  });

  it("audit --min-score fails the run below the threshold", () => {
    const cwd = project();
    writeFileSync(
      join(cwd, "Screen.tsx"),
      'import { TouchableOpacity, Text } from "react-native";\nexport const S = () => <TouchableOpacity><Text allowFontScaling={false}>x</Text></TouchableOpacity>;\n'
    );
    expect(cli(cwd, "audit", "--min-score", "100").status).not.toBe(0);
    expect(cli(cwd, "audit", "--min-score", "0").status).toBe(0);
    expect(cli(cwd, "audit", "--min-score", "abc").status).not.toBe(0);
  });
});

describe("NativeWind theme CSS", () => {
  it("add refreshes an outdated theme block and keeps the installed theme", () => {
    const cwd = project();
    const oldBlock = "/* NATIVRA THEME START: midnight */\n@layer base {\n:root { --color-primary: 1 2 3; }\n}\n/* NATIVRA THEME END: midnight */";
    writeFileSync(join(cwd, "global.css"), `@tailwind base;\n\n${oldBlock}\n`);
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    const css = readFileSync(join(cwd, "global.css"), "utf8");
    expect(css).toContain("NATIVRA THEME START: midnight");
    expect(css).toContain("--color-success:");
    expect(css).toContain(".rounded-card {");
    expect(css.match(/NATIVRA THEME START/g)).toHaveLength(1);
  });
});

describe("nativra.json schema", () => {
  it("describes the config keys and treats defaulted keys as optional", () => {
    const schema = nativraConfigJsonSchema() as { properties: Record<string, unknown>; required?: string[] };
    expect(Object.keys(schema.properties)).toEqual(expect.arrayContaining(["stylingTarget", "componentsDir", "registries", "aliases"]));
    expect(schema.required ?? []).not.toContain("componentsDir");
  });
});
