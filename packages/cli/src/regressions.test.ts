import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
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
  writeFileSync(join(cwd, "package.json"), JSON.stringify(opts.pkg ?? { name: "t", dependencies: { expo: "~52.0.0", "react-native": "0.76.0", nativewind: "4" } }));
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

describe("2026-11 second review", () => {
  const sha = (s: string) => createHash("sha256").update(s).digest("hex");

  it("add --overwrite keeps the installed theme when a dependency pulls in the default one", () => {
    const cwd = project();
    expect(reg(cwd, "add", "rose", "--yes", "--no-install").status).toBe(0);
    const theme = join(cwd, "lib/themes/theme.ts");
    const rose = readFileSync(theme, "utf8");
    const r = reg(cwd, "add", "use-theme-colors", "--yes", "--overwrite", "--no-install");
    expect(r.status).toBe(0);
    expect(r.out).toContain("Kept installed theme");
    expect(readFileSync(theme, "utf8")).toBe(rose);
    expect(Object.keys(lockOf(cwd).items)).not.toContain("zinc");
  });

  it("--on-conflict error doesn't fail just because a theme is installed", () => {
    const cwd = project();
    expect(reg(cwd, "add", "rose", "--yes", "--no-install").status).toBe(0);
    expect(reg(cwd, "add", "use-theme-colors", "--yes", "--on-conflict", "error", "--no-install").status).toBe(0);
  });

  it("an explicitly added theme takes over theme.ts in the lockfile", () => {
    const cwd = project();
    expect(reg(cwd, "add", "rose", "--yes", "--no-install").status).toBe(0);
    expect(reg(cwd, "add", "zinc", "--yes", "--overwrite", "--no-install").status).toBe(0);
    const items = Object.keys(lockOf(cwd).items);
    expect(items).toContain("zinc");
    expect(items).not.toContain("rose");
  });

  it("rejects --overwrite combined with a different --on-conflict mode", () => {
    const cwd = project();
    const r = reg(cwd, "add", "badge", "--yes", "--overwrite", "--on-conflict", "error", "--no-install");
    expect(r.status).toBe(1);
    expect(r.out).toContain("contradicts");
  });

  it("reports unexpected errors in one line, without a stack trace", () => {
    const cwd = project();
    const r = cli(cwd, "list", "--registry", "http://insecure.example");
    expect(r.status).toBe(1);
    expect(r.out).toContain("Insecure HTTP registry URL rejected");
    expect(r.out).not.toMatch(/\n\s+at /);
  });

  it("names nativra.json when it isn't valid JSON", () => {
    const cwd = project();
    writeFileSync(join(cwd, "nativra.json"), '{"componentsDir":');
    const r = reg(cwd, "list");
    expect(r.status).toBe(1);
    expect(r.out).toContain("nativra.json is not valid JSON");
  });

  it("init refuses to replace an existing nativra.json unless --force", () => {
    const cwd = project();
    const custom = JSON.stringify({ componentsDir: "src/ui", registries: [{ name: "acme", url: "https://acme.dev" }] });
    writeFileSync(join(cwd, "nativra.json"), custom);
    const r = cli(cwd, "init", "--yes");
    expect(r.status).toBe(1);
    expect(r.out).toContain("--force");
    expect(readFileSync(join(cwd, "nativra.json"), "utf8")).toBe(custom);
    expect(cli(cwd, "init", "--yes", "--force").status).toBe(0);
    expect(readFileSync(join(cwd, "nativra.json"), "utf8")).not.toContain("acme");
  });

  it("update doesn't write a theme into global.css when none is installed", () => {
    const cwd = project();
    expect(reg(cwd, "add", "cn", "--yes", "--no-install").status).toBe(0);
    writeFileSync(join(cwd, "global.css"), "@tailwind base;\n");
    expect(reg(cwd, "update").status).toBe(0);
    expect(readFileSync(join(cwd, "global.css"), "utf8")).toBe("@tailwind base;\n");
  });

  it("rollback of an update restores the recorded version", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    const lock = lockOf(cwd) as { items: Record<string, { version: string; files: Record<string, string> }> };
    const entry = lock.items["badge"]!;
    const [key] = Object.keys(entry.files);
    const old = "export const Badge = () => null;\n";
    writeFileSync(join(cwd, key!), old);
    entry.files[key!] = sha(old);
    entry.version = "0.0.1";
    writeFileSync(join(cwd, "nativra.lock.json"), JSON.stringify(lock));

    expect(reg(cwd, "update", "badge").status).toBe(0);
    expect((lockOf(cwd).items["badge"] as { version: string }).version).not.toBe("0.0.1");
    expect(cli(cwd, "rollback", "badge").status).toBe(0);
    expect(readFileSync(join(cwd, key!), "utf8")).toBe(old);
    expect((lockOf(cwd).items["badge"] as { version: string }).version).toBe("0.0.1");
  });
});

describe("2026-11 third review", () => {
  const setRegistries = (cwd: string, registries: Array<{ name: string; url: string }>) => {
    const config = JSON.parse(readFileSync(join(cwd, "nativra.json"), "utf8")) as Record<string, unknown>;
    writeFileSync(join(cwd, "nativra.json"), JSON.stringify({ ...config, registries }));
  };

  it("installs from a second registry by name, resolving its relative path against the project", () => {
    const cwd = project();
    // Relative to the project, not to the directory the CLI is started from.
    setRegistries(cwd, [
      { name: "default", url: REGISTRY },
      { name: "acme", url: relative(cwd, REGISTRY) },
    ]);
    const r = cli(cwd, "add", "acme/badge", "--yes", "--no-install");
    expect(r.status).toBe(0);
    expect((lockOf(cwd).items["badge"] as { registry?: string }).registry).toBe("acme");

    const listed = JSON.parse(cli(cwd, "list", "--json").out) as Array<{ ref: string }>;
    expect(listed.map((i) => i.ref)).toEqual(expect.arrayContaining(["badge", "acme/badge"]));
    expect(cli(cwd, "info", "acme/badge").status).toBe(0);
    expect(cli(cwd, "update", "--dry-run").status).toBe(0);
  });

  it("remove refuses to delete the active theme while installed components need it", () => {
    const cwd = project();
    expect(reg(cwd, "add", "rose", "--yes", "--no-install").status).toBe(0);
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    const r = cli(cwd, "remove", "rose", "--yes");
    expect(r.status).toBe(1);
    expect(r.out).toContain("Refusing");
    expect(existsSync(join(cwd, "lib/themes/theme.ts"))).toBe(true);
  });

  it("update uses the installed theme instead of warning about the default one", () => {
    const cwd = project();
    expect(reg(cwd, "add", "rose", "--yes", "--no-install").status).toBe(0);
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    const r = reg(cwd, "update");
    expect(r.out).toContain('using the installed theme "rose"');
    expect(r.out).not.toContain("not tracked");
  });

  it("theme add --apply-css leaves global.css alone when theme.ts was kept", () => {
    const cwd = project();
    writeFileSync(join(cwd, "global.css"), "@tailwind base;\n");
    expect(reg(cwd, "theme", "add", "zinc").status).toBe(0);
    expect(readFileSync(join(cwd, "global.css"), "utf8")).toContain("NATIVRA THEME START: zinc");

    const r = reg(cwd, "theme", "add", "rose", "--apply-css");
    expect(r.out).toContain("global.css was not changed");
    const css = readFileSync(join(cwd, "global.css"), "utf8");
    expect(css).toContain("NATIVRA THEME START: zinc");
    expect(css).not.toContain("NATIVRA THEME START: rose");
  });

  it("React Native CLI projects install dependencies with their own package manager, not expo", () => {
    const cwd = project({ pkg: { name: "t", dependencies: { "react-native": "0.76.0" } } });
    writeFileSync(join(cwd, "yarn.lock"), "");
    const r = reg(cwd, "add", "cn", "--yes", "--no-install");
    expect(r.out).toContain("yarn add clsx");
    expect(r.out).not.toContain("expo install");
  });

  it("doctor exits 1 when a check fails, and accepts React Native CLI projects", () => {
    const rn = project({ pkg: { name: "t", dependencies: { "react-native": "0.76.0", react: "18.3.1" } } });
    const ok = cli(rn, "doctor");
    expect(ok.out).toContain("React Native CLI");
    expect(ok.out).not.toContain("Expo project required");

    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    const [key] = Object.keys((lockOf(cwd).items["badge"] as { files: Record<string, string> }).files);
    rmSync(join(cwd, key!));
    const r = cli(cwd, "doctor");
    expect(r.status).toBe(1);
    expect(r.out).toContain("Missing:");
  });

  it("list rejects unknown types and works before init", () => {
    const cwd = project();
    expect(reg(cwd, "list", "--type", "widget").status).toBe(1);

    const fresh = mkdtempSync(join(tmpdir(), "nativra-reg-"));
    dirs.push(fresh);
    const r = cli(fresh, "list", "--registry", REGISTRY);
    expect(r.status).toBe(0);
    expect(r.out).toContain("button");
  });

  it("update warns when the registry changes a file without bumping the version", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    const lock = lockOf(cwd) as { items: Record<string, { upstream?: Record<string, string> }> };
    const upstream = lock.items["badge"]!.upstream!;
    for (const key of Object.keys(upstream)) upstream[key] = "a".repeat(64);
    writeFileSync(join(cwd, "nativra.lock.json"), JSON.stringify(lock));
    expect(reg(cwd, "update", "badge").out).toContain("without bumping");
  });

  it("update --dry-run reports changes and writes nothing", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    const [key] = Object.keys((lockOf(cwd).items["badge"] as { files: Record<string, string> }).files);
    rmSync(join(cwd, key!));
    const r = reg(cwd, "update", "badge", "--dry-run");
    expect(r.out).toContain("would create");
    expect(existsSync(join(cwd, key!))).toBe(false);
  });

  it("audit checks installed Nativra files like any other code", () => {
    const cwd = project();
    mkdirSync(join(cwd, "components/ui"), { recursive: true });
    writeFileSync(join(cwd, "components/ui/Tap.tsx"), 'import { Pressable } from "react-native";\nexport const Tap = () => <Pressable onPress={() => {}} />;\n');
    const report = JSON.parse(cli(cwd, "audit", "--json").out) as { findings: Array<{ file: string }> };
    expect(report.findings.map((f) => f.file)).toContain("components/ui/Tap.tsx");
  });
});
