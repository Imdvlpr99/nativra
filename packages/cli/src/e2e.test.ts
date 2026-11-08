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

  it("add enterprise Metronic block (transaction-row)", () => {
    runReg("add", "transaction-row", "--yes");
    expect(existsSync(join(cwd, "components/ui/TransactionRow.tsx"))).toBe(true);
  });

  it("add Metronic-grade analytics-dashboard template with dependencies", () => {
    runReg("add", "analytics-dashboard", "--yes");
    expect(existsSync(join(cwd, "components/ui/AnalyticsDashboard.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "components/ui/MetricCard.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "components/ui/Separator.tsx"))).toBe(true);
  });

  it("add Wave 2 enterprise primitives (segmented-control and data-table)", () => {
    runReg("add", "segmented-control", "data-table", "--yes");
    expect(existsSync(join(cwd, "components/ui/SegmentedControl.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "components/ui/DataTable.tsx"))).toBe(true);
  });

  it("add Metronic-grade account-settings-flow template with dependencies", () => {
    runReg("add", "account-settings-flow", "--yes");
    expect(existsSync(join(cwd, "components/ui/AccountSettingsFlow.tsx"))).toBe(true);
  });

  it("add Metronic-grade chat-flow template and payment-method-card block", () => {
    runReg("add", "chat-flow", "payment-method-card", "rating-stars", "--yes");
    expect(existsSync(join(cwd, "components/ui/ChatFlow.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "components/ui/PaymentMethodCard.tsx"))).toBe(true);
    expect(existsSync(join(cwd, "components/ui/RatingStars.tsx"))).toBe(true);
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

  it("add with --dry-run simulates installation without writing files", () => {
    const dryRunOutput = runReg("add", "toast", "--dry-run");
    expect(dryRunOutput).toContain("[Dry Run]");
    expect(existsSync(join(cwd, "components/ui/Toast.tsx"))).toBe(false);
  });

  it("remove deletes tracked files and updates nativra.lock.json", () => {
    expect(existsSync(join(cwd, "components/ui/RatingStars.tsx"))).toBe(true);
    const removeOutput = run("remove", "rating-stars", "--yes");
    expect(removeOutput).toContain("Removed \"rating-stars\" successfully");
    expect(existsSync(join(cwd, "components/ui/RatingStars.tsx"))).toBe(false);
    const lock = JSON.parse(readFileSync(join(cwd, "nativra.lock.json"), "utf8"));
    expect(lock.items["rating-stars"]).toBeUndefined();
  });

  it("remove requires --force when local modifications exist", () => {
    // Install a component, modify it, try to remove without --force
    runReg("add", "rating-stars", "--yes");
    const file = join(cwd, "components/ui/RatingStars.tsx");
    expect(existsSync(file)).toBe(true);
    writeFileSync(file, "// custom user modification");
    expect(() => run("remove", "rating-stars", "--yes")).toThrow();
    // Succeeds with --force
    const forcedOut = run("remove", "rating-stars", "--yes", "--force");
    expect(forcedOut).toContain("Removed \"rating-stars\" successfully");
    expect(existsSync(file)).toBe(false);
  });

  it("list filters properly with --type (including primitive alias and utility)", () => {
    const componentList = runReg("list", "--type", "component");
    expect(componentList).toContain("button");
    expect(componentList).not.toContain("use-debounced-value");

    const primitiveList = runReg("list", "--type", "primitive");
    expect(primitiveList).toContain("button");

    const utilityList = runReg("list", "--type", "utility");
    expect(utilityList).toContain("cn");
  });

  it("doctor passes and doctor --fix recovers missing configuration", () => {
    expect(run("doctor")).toContain("All checks passed");

    const fixDir = mkdtempSync(join(tmpdir(), "nativra-fix-test-"));
    writeFileSync(join(fixDir, "package.json"), JSON.stringify({ name: "fix-test", dependencies: { nativewind: "4" } }));
    writeFileSync(join(fixDir, "app.json"), "{}");
    const fixRun = (...args: string[]) => execFileSync("node", [CLI, ...args, "--cwd", fixDir], { encoding: "utf8" });

    const fixOut = fixRun("doctor", "--fix");
    expect(fixOut).toContain("Auto-fixed");
    expect(existsSync(join(fixDir, "nativra.json"))).toBe(true);
    expect(existsSync(join(fixDir, "tailwind.config.js"))).toBe(true);
    rmSync(fixDir, { recursive: true, force: true });
  });
});

