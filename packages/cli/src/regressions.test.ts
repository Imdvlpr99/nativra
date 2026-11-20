import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, resolve } from "node:path";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import type { RegistryItem } from "@nativra/registry-schema";
import { NativraConfigSchema, nativraConfigJsonSchema } from "./config.js";
import { backupDirFor, createBackup, crossDirectoryImports, discardBackup, findLatestBackup, isStrictlyInside, registryClash } from "./install.js";
import { windowsShellCommand } from "./installer.js";

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

  it("reports a malformed lock entry instead of crashing", () => {
    const cwd = project();
    const broken = JSON.stringify({ items: { button: { version: "1.0.0" } } });
    writeFileSync(join(cwd, "nativra.lock.json"), broken);
    const r = reg(cwd, "add", "card", "--yes", "--no-install");
    expect(r.status).not.toBe(0);
    expect(r.out).toContain('entry "button" is malformed');
    expect(r.out).not.toContain("TypeError");
    expect(readFileSync(join(cwd, "nativra.lock.json"), "utf8")).toBe(broken);
  });

  it("records components installed before a later one fails", () => {
    const cwd = project();
    // A file of the user's where card goes: with --on-conflict error it stops after button.
    mkdirSync(join(cwd, "components/ui"), { recursive: true });
    writeFileSync(join(cwd, "components/ui/Card.tsx"), "// mine\n");
    const r = reg(cwd, "add", "button", "card", "--yes", "--no-install", "--on-conflict", "error");
    expect(r.status).not.toBe(0);
    expect(lockOf(cwd).items.button).toBeDefined();
  });

  it("files identical to what add would write are not conflicts, and become tracked", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    const content = readFileSync(join(cwd, "components/ui/Badge.tsx"), "utf8");
    rmSync(join(cwd, "nativra.lock.json"));
    const r = reg(cwd, "add", "badge", "--yes", "--no-install", "--on-conflict", "error");
    expect(r.status).toBe(0);
    expect(r.out).toContain("Already up to date");
    expect(readFileSync(join(cwd, "components/ui/Badge.tsx"), "utf8")).toBe(content);
    expect(lockOf(cwd).items.badge).toBeDefined();
    expect(existsSync(join(cwd, ".nativra/backups/badge"))).toBe(false);
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
    const forced = cli(cwd, "init", "--yes", "--force");
    expect(forced.status).toBe(0);
    expect(forced.out).toContain("nativra rollback nativra-config");
    expect(readFileSync(join(cwd, "nativra.json"), "utf8")).not.toContain("acme");
    // The replaced config is a normal backup snapshot.
    expect(cli(cwd, "rollback", "nativra-config").status).toBe(0);
    expect(readFileSync(join(cwd, "nativra.json"), "utf8")).toBe(custom);
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
    const lock = lockOf(cwd) as { items: Record<string, { files: Record<string, string>; upstream?: Record<string, string> }> };
    const entry = lock.items["badge"]!;
    // An unedited install of an older source: the file differs from today's registry.
    const old = "export const Badge = () => null;\n";
    for (const key of Object.keys(entry.upstream!)) {
      entry.upstream![key] = "a".repeat(64);
      writeFileSync(join(cwd, key), old);
      entry.files[key] = createHash("sha256").update(old).digest("hex");
    }
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

describe("styles", () => {
  const styleFile = (cwd: string) => readFileSync(join(cwd, "lib/themes/style.ts"), "utf8");

  it("installs the default style with the first component", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    expect(styleFile(cwd)).toContain('id: "soft"');
    expect(Object.keys(lockOf(cwd).items)).toContain("soft");
  });

  it("installs the style chosen at init instead of the default", () => {
    const cwd = mkdtempSync(join(tmpdir(), "nativra-reg-"));
    dirs.push(cwd);
    writeFileSync(join(cwd, "package.json"), JSON.stringify({ name: "t", dependencies: { expo: "~52.0.0", "react-native": "0.76.0" } }));
    expect(cli(cwd, "init", "--yes", "--style", "ios").status).toBe(0);
    expect(JSON.parse(readFileSync(join(cwd, "nativra.json"), "utf8")).style).toBe("ios");
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    expect(styleFile(cwd)).toContain('id: "ios"');
    expect(Object.keys(lockOf(cwd).items)).not.toContain("soft");
  });

  it("init rejects an unknown style", () => {
    const cwd = mkdtempSync(join(tmpdir(), "nativra-reg-"));
    dirs.push(cwd);
    writeFileSync(join(cwd, "package.json"), "{}");
    const r = cli(cwd, "init", "--yes", "--style", "neon");
    expect(r.status).toBe(1);
    expect(r.out).toContain("Unknown style");
  });

  it("style add switches style.ts, remembers it, and rewrites the NativeWind classes", () => {
    const cwd = project();
    writeFileSync(join(cwd, "global.css"), "@tailwind base;\n");
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    expect(readFileSync(join(cwd, "global.css"), "utf8")).toContain("/* style: soft */");

    const r = reg(cwd, "style", "add", "crisp");
    expect(r.status).toBe(0);
    expect(styleFile(cwd)).toContain('id: "crisp"');
    expect(JSON.parse(readFileSync(join(cwd, "nativra.json"), "utf8")).style).toBe("crisp");
    const css = readFileSync(join(cwd, "global.css"), "utf8");
    expect(css).toContain("/* style: crisp */");
    expect(css).toContain(".type-base {");
    expect(css).toContain(".surface {");
    expect(Object.keys(lockOf(cwd).items)).toContain("crisp");
    expect(Object.keys(lockOf(cwd).items)).not.toContain("soft");

    // Components added later keep the chosen style.
    expect(reg(cwd, "add", "card", "--yes", "--overwrite", "--no-install").out).toContain("Kept installed style");
    expect(styleFile(cwd)).toContain('id: "crisp"');
  });

  it("style add rejects items that aren't styles", () => {
    const cwd = project();
    const r = reg(cwd, "style", "add", "button");
    expect(r.status).toBe(1);
    expect(r.out).toContain("not a style");
  });

  it("remove refuses to delete the active style while components need it", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    const r = cli(cwd, "remove", "soft", "--yes");
    expect(r.status).toBe(1);
    expect(existsSync(join(cwd, "lib/themes/style.ts"))).toBe(true);
  });

  it("update adds style.ts to projects installed before styles existed", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    rmSync(join(cwd, "lib/themes/style.ts"));
    const lock = lockOf(cwd);
    delete lock.items["soft"];
    writeFileSync(join(cwd, "nativra.lock.json"), JSON.stringify(lock));

    expect(reg(cwd, "update").status).toBe(0);
    expect(styleFile(cwd)).toContain('id: "soft"');
  });
});

describe("0.3.0 review fixes", () => {
  const lockItems = (cwd: string) => lockOf(cwd).items as Record<string, { files: Record<string, string>; registry?: string }>;

  it("add <theme> --overwrite rewrites the NativeWind CSS block for the new theme", () => {
    const cwd = project();
    writeFileSync(join(cwd, "global.css"), "@tailwind base;\n");
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    expect(readFileSync(join(cwd, "global.css"), "utf8")).toContain("NATIVRA THEME START: zinc");
    expect(reg(cwd, "add", "rose", "--yes", "--overwrite", "--no-install").status).toBe(0);
    const css = readFileSync(join(cwd, "global.css"), "utf8");
    expect(css).toContain("NATIVRA THEME START: rose");
    expect(css).not.toContain("NATIVRA THEME START: zinc");
  });

  it("rolling back the previous theme undoes a theme switch, file and tracking", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    const zinc = readFileSync(join(cwd, "lib/themes/theme.ts"), "utf8");
    const r = reg(cwd, "theme", "add", "rose", "--overwrite");
    expect(r.out).toContain("Undo with: nativra rollback zinc");
    expect(Object.keys(lockItems(cwd))).toContain("rose");

    expect(cli(cwd, "rollback", "zinc").status).toBe(0);
    expect(readFileSync(join(cwd, "lib/themes/theme.ts"), "utf8")).toBe(zinc);
    const items = Object.keys(lockItems(cwd));
    expect(items).toContain("zinc");
    expect(items).not.toContain("rose");
  });

  it("rollback refuses to replace a file another item now owns and was edited", () => {
    const cwd = project();
    expect(reg(cwd, "add", "zinc", "--yes", "--no-install").status).toBe(0);
    expect(cli(cwd, "remove", "zinc", "--yes").status).toBe(0);
    expect(reg(cwd, "theme", "add", "rose").status).toBe(0);
    writeFileSync(join(cwd, "lib/themes/theme.ts"), "// my edits to rose\n");
    const r = cli(cwd, "rollback", "zinc");
    expect(r.status).toBe(1);
    expect(r.out).toContain("changed after the operation");
    expect(readFileSync(join(cwd, "lib/themes/theme.ts"), "utf8")).toBe("// my edits to rose\n");
  });

  it("rollback removes files an update created", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    rmSync(join(cwd, "components/ui/Badge.tsx"));
    expect(reg(cwd, "update", "badge").status).toBe(0);
    expect(existsSync(join(cwd, "components/ui/Badge.tsx"))).toBe(true);
    expect(cli(cwd, "rollback", "badge").status).toBe(0);
    expect(existsSync(join(cwd, "components/ui/Badge.tsx"))).toBe(false);
  });

  it("a restored file the user owned stays untracked, so update won't overwrite it", () => {
    const cwd = project();
    mkdirSync(join(cwd, "components/ui"), { recursive: true });
    writeFileSync(join(cwd, "components/ui/Badge.tsx"), "// my own badge\n");
    expect(reg(cwd, "add", "badge", "--yes", "--overwrite", "--no-install").status).toBe(0);
    expect(cli(cwd, "rollback", "badge").status).toBe(0);
    expect(readFileSync(join(cwd, "components/ui/Badge.tsx"), "utf8")).toBe("// my own badge\n");

    reg(cwd, "update", "badge");
    expect(readFileSync(join(cwd, "components/ui/Badge.tsx"), "utf8")).toBe("// my own badge\n");
  });

  it("diff and update with --registry ignore the registry recorded in the lockfile", () => {
    const cwd = project();
    const config = JSON.parse(readFileSync(join(cwd, "nativra.json"), "utf8")) as Record<string, unknown>;
    writeFileSync(
      join(cwd, "nativra.json"),
      JSON.stringify({ ...config, registries: [{ name: "default", url: REGISTRY }, { name: "acme", url: REGISTRY }] })
    );
    expect(cli(cwd, "add", "acme/badge", "--yes", "--no-install").status).toBe(0);
    expect(lockItems(cwd)["badge"]?.registry).toBe("acme");
    expect(reg(cwd, "diff", "badge").status).toBe(0);
    expect(reg(cwd, "update", "--dry-run").status).toBe(0);
  });

  it("refuses an id that is already installed from another registry", () => {
    const cwd = project();
    const config = JSON.parse(readFileSync(join(cwd, "nativra.json"), "utf8")) as Record<string, unknown>;
    writeFileSync(
      join(cwd, "nativra.json"),
      JSON.stringify({ ...config, registries: [{ name: "default", url: REGISTRY }, { name: "acme", url: REGISTRY }] })
    );
    expect(cli(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    const r = cli(cwd, "add", "acme/badge", "--yes", "--no-install");
    expect(r.status).not.toBe(0);
    expect(r.out).toContain("clashes");
    expect(lockItems(cwd)["badge"]?.registry).toBeUndefined();
    expect(cli(cwd, "update", "acme/badge").status).not.toBe(0);
  });

  it("remove keeps the configured install folders even when they end up empty", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    const installed = Object.keys(lockItems(cwd));
    expect(cli(cwd, "remove", ...installed, "--yes", "--force").status).toBe(0);
    expect(Object.keys(lockItems(cwd))).toHaveLength(0);
    expect(existsSync(join(cwd, "components/ui"))).toBe(true);
  });

  it("doctor --json prints a parseable report and sets the exit code", () => {
    const cwd = project();
    const ok = cli(cwd, "doctor", "--json");
    const report = JSON.parse(ok.out) as { ok: boolean; checks: Array<{ name: string; status: string; detail?: string }> };
    expect(report.checks.length).toBeGreaterThan(0);
    expect(ok.status).toBe(report.ok ? 0 : 1);
    expect(ok.out).not.toMatch(/\u001b\[/);

    rmSync(join(cwd, "app.json"));
    const bad = cli(cwd, "doctor", "--json");
    expect(bad.status).toBe(1);
    expect((JSON.parse(bad.out) as { ok: boolean }).ok).toBe(false);
  });

  it("update --check fails only while something is out of date", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    expect(reg(cwd, "update", "--check").status).toBe(0);

    // A local edit with no registry change is not an available update.
    const file = join(cwd, "components/ui/Badge.tsx");
    writeFileSync(file, `${readFileSync(file, "utf8")}\n// my tweak\n`);
    expect(reg(cwd, "update", "--check").status).toBe(0);

    // A file that doesn't match the registry and isn't what was installed: the recorded hash is stale.
    const lock = lockOf(cwd) as { items: Record<string, { files: Record<string, string> }> };
    lock.items["badge"]!.files["components/ui/Badge.tsx"] = "0".repeat(64);
    writeFileSync(join(cwd, "nativra.lock.json"), JSON.stringify(lock));
    expect(reg(cwd, "update", "--check").status).toBe(1);
    expect(readFileSync(file, "utf8")).toContain("// my tweak");
  });

  it("registryClash allows one registry per id", () => {
    const item = (id: string) => ({ id }) as unknown as RegistryItem;
    const lock = { items: { badge: { version: "1.0.0", files: {} } } };
    expect(registryClash([{ item: item("badge"), registry: "default" }], lock)).toBeUndefined();
    expect(registryClash([{ item: item("badge"), registry: "acme" }], lock)).toMatch(/nativra remove badge/);
    const twice = [
      { item: item("card"), registry: "default" },
      { item: item("card"), registry: "acme" },
    ];
    expect(registryClash(twice, { items: {} })).toMatch(/clashes/);
  });

  it("an item's own sibling file isn't rewritten to a dependency with the same name", () => {
    const cfg = NativraConfigSchema.parse({ blocksDir: "blocks" });
    const file = (path: string) => ({ path, content: "" });
    const base = { name: "x", description: "x", status: "stable", version: "0.1.0", stylingTargets: ["stylesheet"], platforms: { android: true, ios: true } };
    const block = { ...base, id: "my-block", type: "block", files: [file("MyBlock.tsx"), file("Card.tsx")] } as unknown as RegistryItem;
    const card = { ...base, id: "card", type: "component", files: [file("Card.tsx"), file("Badge.tsx")] } as unknown as RegistryItem;
    const map = crossDirectoryImports("/p", block, [card, block], cfg);
    expect(map["Card"]).toBeUndefined();
    expect(map["Badge"]).toBe("@/components/ui/Badge");
  });
});

describe("2026-11 full review", () => {
  const sha = (s: string) => createHash("sha256").update(s).digest("hex");
  type Lock = { items: Record<string, { version: string; files: Record<string, string>; upstream?: Record<string, string> }> };

  it("ids that name Object.prototype members are just unknown items", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    for (const id of ["constructor", "toString", "__proto__"]) {
      const r = cli(cwd, "remove", id, "--yes");
      expect(r.status).not.toBe(0);
      expect(r.out).toContain("not registered");
      expect(r.out).not.toContain("Cannot convert");
    }
    expect(cli(cwd, "rollback", "constructor").out).toContain("No backups");
  });

  it("rollback verifies every backup file before restoring any of them", async () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "button", "--yes", "--no-install").status).toBe(0);
    const badge = join(cwd, "components/ui/Badge.tsx");
    const button = join(cwd, "components/ui/Button.tsx");
    const current = readFileSync(badge, "utf8");
    writeFileSync(badge, "// old badge");
    await createBackup(cwd, "badge", [
      { destPath: badge, exists: true },
      { destPath: button, exists: true },
    ]);
    writeFileSync(badge, current);
    const snapshot = (await findLatestBackup(cwd, "badge"))!;
    const second = readdirSync(snapshot).find((f) => f.startsWith("1-"))!;
    writeFileSync(join(snapshot, second), "// tampered");

    const r = cli(cwd, "rollback", "badge", "--force");
    expect(r.status).not.toBe(0);
    expect(r.out).toContain("Nothing was changed");
    expect(readFileSync(badge, "utf8")).toBe(current);
  });

  it("update removes files a new version dropped, keeps edited ones, and rollback brings them back", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    const lock = lockOf(cwd) as Lock;
    const stale = "export const Old = 1;\n";
    writeFileSync(join(cwd, "components/ui/BadgeOld.tsx"), stale);
    writeFileSync(join(cwd, "components/ui/BadgeEdited.tsx"), "// my edits");
    lock.items["badge"]!.files["components/ui/BadgeOld.tsx"] = sha(stale);
    lock.items["badge"]!.files["components/ui/BadgeEdited.tsx"] = sha("// as installed");
    writeFileSync(join(cwd, "nativra.lock.json"), JSON.stringify(lock));

    const dry = reg(cwd, "update", "badge", "--check");
    expect(dry.status).toBe(1);
    expect(dry.out).toContain("would remove");
    expect(existsSync(join(cwd, "components/ui/BadgeOld.tsx"))).toBe(true);

    expect(reg(cwd, "update", "badge").status).toBe(0);
    expect(existsSync(join(cwd, "components/ui/BadgeOld.tsx"))).toBe(false);
    expect(readFileSync(join(cwd, "components/ui/BadgeEdited.tsx"), "utf8")).toBe("// my edits");
    const files = (lockOf(cwd) as Lock).items["badge"]!.files;
    expect(Object.keys(files)).toEqual(["components/ui/Badge.tsx"]);

    expect(cli(cwd, "rollback", "badge").status).toBe(0);
    expect(readFileSync(join(cwd, "components/ui/BadgeOld.tsx"), "utf8")).toBe(stale);
    expect((lockOf(cwd) as Lock).items["badge"]!.files["components/ui/BadgeOld.tsx"]).toBe(sha(stale));
  });

  it("diff --exit-code fails while installed files differ", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    expect(reg(cwd, "diff", "badge", "--exit-code").status).toBe(0);
    writeFileSync(join(cwd, "components/ui/Badge.tsx"), "// changed");
    expect(reg(cwd, "diff", "badge").status).toBe(0);
    expect(reg(cwd, "diff", "badge", "--exit-code").status).toBe(1);
  });

  it("add --dry-run strips control characters from registry item names", () => {
    const cwd = project();
    const registry = mkdtempSync(join(tmpdir(), "nativra-reg-registry-"));
    dirs.push(registry);
    cpSync(REGISTRY, registry, { recursive: true });
    const itemPath = join(registry, "items", "badge.json");
    const item = JSON.parse(readFileSync(itemPath, "utf8")) as { name: string; npmDependencies?: unknown[] };
    item.name = "Badge\u001b]52;c;ZXZpbA==\u0007";
    item.npmDependencies = [{ package: "clsx", version: "^2.0.0" }];
    writeFileSync(itemPath, JSON.stringify(item));
    const r = cli(cwd, "add", "badge", "--dry-run", "--registry", registry);
    expect(r.out).toContain("Badge]52;c;ZXZpbA==");
    expect(r.out).not.toContain("\u001b]52");
  });

  it("path containment works when the root is a filesystem root", () => {
    const root = resolve("/");
    expect(isStrictlyInside(root, join(root, "project"))).toBe(true);
    expect(isStrictlyInside(root, root)).toBe(false);
    const p = resolve("/srv/app");
    expect(isStrictlyInside(p, join(p, "a", "b"))).toBe(true);
    expect(isStrictlyInside(p, resolve("/srv/app-evil/x"))).toBe(false);
    expect(isStrictlyInside(p, resolve("/srv"))).toBe(false);
  });

  it("windowsShellCommand quotes every argument and refuses anything outside the allow-list", () => {
    expect(windowsShellCommand({ bin: "npm", args: ["install", "clsx@^2.1.0", "react@>=18<20"] })).toBe(
      'npm "install" "clsx@^2.1.0" "react@>=18<20"'
    );
    expect(() => windowsShellCommand({ bin: "cmd", args: [] })).toThrow(/Unexpected package manager/);
    expect(() => windowsShellCommand({ bin: "npm", args: ["install", "a&calc"] })).toThrow(/unsafe/);
    expect(() => windowsShellCommand({ bin: "npm", args: ['a"b'] })).toThrow(/unsafe/);
  });
});

describe("2026-11 third review", () => {
  it("info shows the installed version and whether an update is available", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    expect(reg(cwd, "info", "badge").out).toContain("(up to date)");

    const lock = lockOf(cwd) as { items: Record<string, { version: string }> };
    lock.items["badge"]!.version = "0.0.1";
    writeFileSync(join(cwd, "nativra.lock.json"), JSON.stringify(lock));
    expect(reg(cwd, "info", "badge").out).toMatch(/Installed:\s+v0\.0\.1 \(update available: nativra update badge\)/);
    const json = JSON.parse(reg(cwd, "info", "badge", "--json").out) as { installedVersion?: string; updateAvailable?: boolean };
    expect(json).toMatchObject({ installedVersion: "0.0.1", updateAvailable: true });

    expect(reg(cwd, "info", "card").out).not.toContain("Installed:");
  });

  it("a CRLF checkout of installed files (Git for Windows' core.autocrlf) is not an edit", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    const file = join(cwd, "components/ui/Badge.tsx");
    const crlf = () => writeFileSync(file, readFileSync(file, "utf8").replace(/\r?\n/g, "\r\n"));
    crlf();

    const check = reg(cwd, "update", "--check");
    expect(check.status).toBe(0);
    expect(check.out).not.toContain("local changes");
    expect(reg(cwd, "diff", "badge", "--exit-code").status).toBe(0);
    expect(reg(cwd, "add", "badge", "--yes", "--no-install", "--on-conflict", "error").status).toBe(0);

    crlf();
    const removed = cli(cwd, "remove", "badge", "--yes");
    expect(removed.status).toBe(0);
    expect(removed.out).not.toContain("Local modifications");
  });

  it("update doesn't warn about a version bump when the file already matches the registry", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    const lock = lockOf(cwd) as { items: Record<string, { upstream?: Record<string, string> }> };
    for (const key of Object.keys(lock.items["badge"]!.upstream!)) lock.items["badge"]!.upstream![key] = "a".repeat(64);
    writeFileSync(join(cwd, "nativra.lock.json"), JSON.stringify(lock));
    const r = reg(cwd, "update", "badge", "--dry-run");
    expect(r.out).toContain("(up to date)");
    expect(r.out).not.toContain("without bumping");
  });

  it("list --installed shows installed items next to the registry's version", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    const lock = lockOf(cwd) as { items: Record<string, { version: string }> };
    lock.items["badge"]!.version = "0.0.1";
    writeFileSync(join(cwd, "nativra.lock.json"), JSON.stringify(lock));

    const out = reg(cwd, "list", "--installed").out;
    expect(out).toContain("badge");
    expect(out).toContain("update available");
    expect(out).toContain("nativra update");

    const rows = JSON.parse(reg(cwd, "list", "--installed", "--json").out) as Array<{ ref: string; status: string; installed: string }>;
    expect(rows.find((r) => r.ref === "badge")).toMatchObject({ installed: "0.0.1", status: "update-available" });
    expect(rows.find((r) => r.ref === "use-theme-colors")).toMatchObject({ status: "up-to-date" });
  });

  it("list --installed says a registry is unavailable rather than that the item is gone", () => {
    const cwd = project();
    const config = JSON.parse(readFileSync(join(cwd, "nativra.json"), "utf8")) as Record<string, unknown>;
    const missing = join(cwd, "no-such-registry");
    writeFileSync(
      join(cwd, "nativra.json"),
      JSON.stringify({ ...config, registries: [{ name: "default", url: REGISTRY }, { name: "acme", url: missing }] })
    );
    expect(cli(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    const lock = lockOf(cwd) as { items: Record<string, { registry?: string }> };
    lock.items["badge"]!.registry = "acme";
    writeFileSync(join(cwd, "nativra.lock.json"), JSON.stringify(lock));

    // Output is stdout then stderr (the "Skipped registry" warning): keep just the JSON array.
    const out = cli(cwd, "list", "--installed", "--json").out;
    expect(out).toContain("Skipped registry acme");
    const rows = JSON.parse(out.slice(out.indexOf("["), out.lastIndexOf("]") + 1)) as Array<{ ref: string; status: string }>;
    expect(rows.find((r) => r.ref === "acme/badge")?.status).toBe("registry-unavailable");
    expect(rows.find((r) => r.ref === "use-theme-colors")?.status).toBe("up-to-date");
  });
});


describe("2026-11 full review", () => {
  type Lock = { items: Record<string, { version: string; files: Record<string, string>; upstream?: Record<string, string> }> };
  const hashOf = (text: string) => createHash("sha256").update(text.replace(/\r\n/g, "\n")).digest("hex");

  it("update --check ignores a dropped file that is already gone, and update forgets its lock key", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    const lock = lockOf(cwd) as Lock;
    lock.items["badge"]!.files["components/ui/Gone.tsx"] = "b".repeat(64);
    writeFileSync(join(cwd, "nativra.lock.json"), JSON.stringify(lock));

    const check = reg(cwd, "update", "badge", "--check");
    expect(check.out).not.toContain("would remove");
    expect(check.status).toBe(0);
    expect(reg(cwd, "update", "badge").status).toBe(0);
    expect((lockOf(cwd) as Lock).items["badge"]!.files["components/ui/Gone.tsx"]).toBeUndefined();
  });

  it("update keeps tracking a dropped file it could not remove", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    // A dropped, unedited file behind a symlinked folder: removal is refused.
    const outside = mkdtempSync(join(tmpdir(), "nativra-out-"));
    dirs.push(outside);
    const old = "export const Old = 1;\n";
    writeFileSync(join(outside, "Old.tsx"), old);
    symlinkSync(outside, join(cwd, "linked"), "junction");
    const lock = lockOf(cwd) as Lock;
    lock.items["badge"]!.files["linked/Old.tsx"] = hashOf(old);
    writeFileSync(join(cwd, "nativra.lock.json"), JSON.stringify(lock));

    const r = reg(cwd, "update", "badge");
    expect(r.out).toContain("Could not remove");
    expect(existsSync(join(outside, "Old.tsx"))).toBe(true);
    expect((lockOf(cwd) as Lock).items["badge"]!.files["linked/Old.tsx"]).toBe(hashOf(old));
  });

  it("rollback nativra-config refuses to discard edits made after init, unless --force", () => {
    const cwd = project();
    const original = readFileSync(join(cwd, "nativra.json"), "utf8");
    expect(cli(cwd, "init", "--yes", "--force").status).toBe(0);
    const edited = JSON.stringify({ ...JSON.parse(readFileSync(join(cwd, "nativra.json"), "utf8")), componentsDir: "src/ui" }, null, 2);
    writeFileSync(join(cwd, "nativra.json"), edited);

    const refused = cli(cwd, "rollback", "nativra-config");
    expect(refused.status).toBe(1);
    expect(refused.out).toContain("nativra.json");
    expect(readFileSync(join(cwd, "nativra.json"), "utf8")).toBe(edited);
    expect(cli(cwd, "rollback", "nativra-config", "--force").status).toBe(0);
    expect(readFileSync(join(cwd, "nativra.json"), "utf8")).toBe(original);
  });

  it("add keeps CRLF line endings in a file that is already up to date", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    const [key] = Object.keys((lockOf(cwd) as Lock).items["badge"]!.files);
    const path = join(cwd, key!);
    const crlf = readFileSync(path, "utf8").replace(/\r?\n/g, "\r\n");
    writeFileSync(path, crlf);
    const r = reg(cwd, "add", "badge", "--yes", "--no-install");
    expect(r.out).toContain("Already up to date");
    expect(readFileSync(path, "utf8")).toBe(crlf);
  });

  it("init succeeds with a warning when .gitignore is a symlink", () => {
    const cwd = mkdtempSync(join(tmpdir(), "nativra-reg-"));
    dirs.push(cwd);
    writeFileSync(join(cwd, "package.json"), JSON.stringify({ name: "t", dependencies: { expo: "~52.0.0", "react-native": "0.76.0" } }));
    writeFileSync(join(cwd, "shared.gitignore"), "node_modules\n");
    try {
      symlinkSync(join(cwd, "shared.gitignore"), join(cwd, ".gitignore"), "file");
    } catch {
      return; // file symlinks need extra privileges on Windows
    }
    const r = cli(cwd, "init", "--yes");
    expect(r.status).toBe(0);
    expect(r.out).toContain("Could not add .nativra/ to .gitignore");
    expect(r.out).not.toContain("Failed to write nativra.json");
    expect(existsSync(join(cwd, "nativra.json"))).toBe(true);
  });

  it("diff --summary prints a count instead of the patch", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    const [key] = Object.keys((lockOf(cwd) as Lock).items["badge"]!.files);
    writeFileSync(join(cwd, key!), `${readFileSync(join(cwd, key!), "utf8")}\n// local edit\n`);
    const r = reg(cwd, "diff", "badge", "--summary", "--exit-code");
    expect(r.status).toBe(1);
    expect(r.out).toContain("1 file differ, 0 files match");
    expect(r.out).not.toContain("@@");
  });

  it("list --outdated shows only items with updates and exits 1 when there are any", () => {
    const cwd = project();
    expect(reg(cwd, "add", "badge", "--yes", "--no-install").status).toBe(0);
    const clean = reg(cwd, "list", "--outdated");
    expect(clean.status).toBe(0);
    expect(clean.out).toContain("up to date");

    const lock = lockOf(cwd) as Lock;
    lock.items["badge"]!.version = "0.0.1";
    writeFileSync(join(cwd, "nativra.lock.json"), JSON.stringify(lock));
    const r = reg(cwd, "list", "--outdated", "--json");
    expect(r.status).toBe(1);
    const rows = JSON.parse(r.out) as Array<{ ref: string }>;
    expect(rows.map((row) => row.ref)).toEqual(["badge"]);
  });
});
