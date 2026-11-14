import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createProjectConfig, ensureGitignored } from "./config.js";
import { aliasForDir, detectImportAlias } from "./detect.js";
import { transformFileImports } from "./transform.js";

const srcDirs = {
  stylingTarget: "nativewind" as const,
  componentsDir: "src/components/ui",
  hooksDir: "src/hooks",
  utilsDir: "src/lib/utils",
  themesDir: "src/lib/themes",
};

describe("project config", () => {
  let cwd: string;
  beforeEach(async () => {
    cwd = await mkdtemp(join(tmpdir(), "nativra-config-"));
  });
  afterEach(() => rm(cwd, { recursive: true, force: true }));

  it("detects a tsconfig alias that points into src/", async () => {
    await writeFile(join(cwd, "tsconfig.json"), JSON.stringify({ compilerOptions: { paths: { "@/*": ["./src/*"] } } }));
    expect(await detectImportAlias(cwd)).toEqual({ prefix: "@/", baseDir: "src" });
  });

  it("detects a root alias and tolerates a missing tsconfig", async () => {
    expect(await detectImportAlias(cwd)).toBeNull();
    await writeFile(join(cwd, "tsconfig.json"), JSON.stringify({ compilerOptions: { paths: { "~/*": ["./*"] } } }));
    expect(await detectImportAlias(cwd)).toEqual({ prefix: "~/", baseDir: "" });
  });

  it("maps src/ directories through a src-based alias", () => {
    const { config, warnings } = createProjectConfig(srcDirs, { prefix: "@/", baseDir: "src" });
    expect(warnings).toEqual([]);
    expect(config.aliases?.components).toBe("@/components/ui");
    expect(transformFileImports('import { cn } from "@/lib/utils";', config)).toBe('import { cn } from "@/lib/utils";');
    expect(aliasForDir({ prefix: "@/", baseDir: "src" }, "components/ui")).toBeNull();
  });

  it("writes each directory once (no nested v4 copy) for root aliases", () => {
    const { config } = createProjectConfig({ ...srcDirs, componentsDir: "components/ui" }, null);
    expect(config.config).toBeUndefined();
    expect(config.aliases).toBeUndefined();
    expect(config.componentsDir).toBe("components/ui");
  });

  it("adds .nativra/ to .gitignore exactly once", async () => {
    await writeFile(join(cwd, ".gitignore"), "node_modules");
    expect(await ensureGitignored(cwd)).toBe(true);
    expect(await ensureGitignored(cwd)).toBe(false);
    const content = await readFile(join(cwd, ".gitignore"), "utf8");
    expect(content.match(/\.nativra\//g)).toHaveLength(1);
    expect(content.startsWith("node_modules\n")).toBe(true);
  });
});
