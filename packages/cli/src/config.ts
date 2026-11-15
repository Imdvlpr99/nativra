import { access, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";
import { aliasForDir, type ImportAlias } from "./detect.js";

/** Location of the Nativra config file within a consumer project */
export const CONFIG_FILENAME = "nativra.json";

function cleanPath(p: unknown): string | undefined {
  if (typeof p !== "string" || !p.trim()) return undefined;
  return p.trim().replace(/^[@~]\//, "").replace(/^\.\//, "");
}

function isSafeRelativeConfigDir(dir: string): boolean {
  if (!dir || typeof dir !== "string") return false;
  if (
    dir.includes("\0") ||
    /^[a-zA-Z]:/.test(dir) ||
    dir.startsWith("/") ||
    dir.startsWith("\\")
  ) {
    return false;
  }
  const segments = dir.split(/[/\\]/);
  return !segments.includes("..");
}

const SafeRelativeDirSchema = z.string().min(1).refine(isSafeRelativeConfigDir, {
  message: "Directory must be a safe relative path within the project root (no '..' or absolute paths)",
});

export const NativraConfigSchema = z.object({
  /** Schema specification version */
  version: z.number().optional().default(4),
  $schema: z.string().optional(),
  /** Registry sources configured for this project */
  registries: z
    .array(
      z.object({
        name: z.string().default("default"),
        url: z.string(),
      })
    )
    .default([{ name: "default", url: "https://nativra.vercel.app" }]),
  /** Where installed components are written, relative to project root */
  componentsDir: SafeRelativeDirSchema.default("components/ui"),
  /** Where installed blocks are written, relative to project root */
  blocksDir: SafeRelativeDirSchema.optional(),
  /** Where installed hooks are written, relative to project root */
  hooksDir: SafeRelativeDirSchema.default("hooks"),
  /** Where installed utilities are written, relative to project root */
  utilsDir: SafeRelativeDirSchema.default("lib/utils"),
  /** Where installed themes are written, relative to project root */
  themesDir: SafeRelativeDirSchema.default("lib/themes"),
  /** Default styling target */
  stylingTarget: z.enum(["nativewind", "stylesheet"]).default("nativewind"),
  /**
   * Style preset installed with the first component ("soft", "crisp", "tailwind", "material",
   * "ios"). Switch later with `nativra style add <id>`.
   */
  style: z
    .string()
    .regex(/^[a-z][a-z0-9-]*$/, { message: "Style must be a registry item id, e.g. \"ios\"" })
    .optional(),
  /** TypeScript path alias prefix, e.g. "@/" */
  aliasPrefix: z.string().optional(),
  /** Modern nested V4 configuration object (Blueprint §6.2) */
  config: z
    .object({
      v4: z
        .object({
          components: z.string().optional(),
          blocks: z.string().optional(),
          hooks: z.string().optional(),
          utils: z.string().optional(),
          theme: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
  /** Custom path aliases */
  aliases: z.record(z.string(), z.string()).optional(),
});

export type NativraConfig = z.infer<typeof NativraConfigSchema>;

/**
 * JSON Schema for nativra.json, published at https://nativra.vercel.app/schema.json (the file's
 * "$schema") so editors validate and autocomplete it. "input" mode: keys with defaults are optional.
 */
export function nativraConfigJsonSchema(): Record<string, unknown> {
  return {
    ...(z.toJSONSchema(NativraConfigSchema, { io: "input", unrepresentable: "any" }) as Record<string, unknown>),
    $id: "https://nativra.vercel.app/schema.json",
    title: "nativra.json",
    description: "Configuration for nativra-cli: where items are installed, the styling target and import aliases.",
  };
}

/** One-line summary of schema problems: "componentsDir: Directory must be ...; hooksDir: ...". */
export function formatConfigIssues(error: z.ZodError): string {
  return error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`).join("; ");
}

export async function loadConfig(projectRoot: string): Promise<NativraConfig> {
  const configPath = join(projectRoot, CONFIG_FILENAME);
  try {
    const text = await readFile(configPath, "utf8");
    let raw: Record<string, unknown>;
    try {
      raw = JSON.parse(text) as Record<string, unknown>;
    } catch (err) {
      throw new Error(`${CONFIG_FILENAME} is not valid JSON: ${(err as Error).message}`);
    }
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      throw new Error(`${CONFIG_FILENAME} must contain a JSON object`);
    }

    // 1. Normalize V4 nested schema (Blueprint §6.2)
    if (raw["config"] && typeof raw["config"] === "object") {
      const cfg = raw["config"] as Record<string, unknown>;
      const v4 = cfg["v4"] as Record<string, unknown> | undefined;
      if (v4 && typeof v4 === "object") {
        if (v4["components"] && !raw["componentsDir"]) {
          raw["componentsDir"] = cleanPath(v4["components"]);
        }
        if (v4["blocks"] && !raw["blocksDir"]) {
          raw["blocksDir"] = cleanPath(v4["blocks"]);
        }
        if (v4["hooks"] && !raw["hooksDir"]) {
          raw["hooksDir"] = cleanPath(v4["hooks"]);
        }
        if (v4["utils"] && !raw["utilsDir"]) {
          raw["utilsDir"] = cleanPath(v4["utils"]);
        }
      }
    }

    // 2. Normalize aliases if present
    if (raw["aliases"] && typeof raw["aliases"] === "object") {
      const aliases = raw["aliases"] as Record<string, unknown>;
      if (aliases["components"] && !raw["componentsDir"]) {
        raw["componentsDir"] = cleanPath(aliases["components"]);
      }
      if (aliases["blocks"] && !raw["blocksDir"]) {
        raw["blocksDir"] = cleanPath(aliases["blocks"]);
      }
      if (aliases["hooks"] && !raw["hooksDir"]) {
        raw["hooksDir"] = cleanPath(aliases["hooks"]);
      }
      if (aliases["utils"] && !raw["utilsDir"]) {
        raw["utilsDir"] = cleanPath(aliases["utils"]);
      }
    }

    // 3. Normalize V4 component object format (V4 §5)
    if (raw["components"] && typeof raw["components"] === "object") {
      const comp = raw["components"] as Record<string, unknown>;
      if (comp["directory"] && !raw["componentsDir"]) {
        raw["componentsDir"] = cleanPath(comp["directory"]);
      }
    }
    if (raw["styling"] && !raw["stylingTarget"]) {
      raw["stylingTarget"] = raw["styling"];
    }
    if (
      raw["registries"] &&
      typeof raw["registries"] === "object" &&
      !Array.isArray(raw["registries"])
    ) {
      raw["registries"] = Object.entries(raw["registries"] as Record<string, string>).map(
        ([name, url]) => ({
          name,
          url,
        })
      );
    }
    if (raw["registry"] && typeof raw["registry"] === "object" && !raw["registries"]) {
      raw["registries"] = Object.entries(raw["registry"] as Record<string, string>).map(
        ([name, url]) => ({
          name,
          url,
        })
      );
    }

    const parsed = NativraConfigSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`Invalid ${CONFIG_FILENAME}: ${formatConfigIssues(parsed.error)}`);
    }
    return parsed.data;
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(
        `No ${CONFIG_FILENAME} found in ${projectRoot}. Run "nativra init" first.`
      );
    }
    throw err;
  }
}

/**
 * For commands that only read the registry (list, search, info): the project's config, or the
 * defaults when there is no nativra.json yet. An invalid nativra.json is still an error.
 */
export async function loadConfigOrDefault(projectRoot: string): Promise<NativraConfig> {
  try {
    await access(join(projectRoot, CONFIG_FILENAME));
  } catch {
    return NativraConfigSchema.parse({});
  }
  return loadConfig(projectRoot);
}

export interface ProjectDirs {
  stylingTarget: "nativewind" | "stylesheet";
  componentsDir: string;
  hooksDir: string;
  utilsDir: string;
  themesDir: string;
  /** Style preset id; omitted means the default ("soft") */
  style?: string;
}

/**
 * Builds a fresh nativra.json. Directories are stored once (flat fields); `aliases` are only
 * written when the project's tsconfig alias base differs from the project root, because the
 * default `aliasPrefix + dir` derivation would otherwise produce wrong imports.
 */
export function createProjectConfig(
  dirs: ProjectDirs,
  alias: ImportAlias | null
): { config: NativraConfig; warnings: string[] } {
  const effectiveAlias = alias ?? { prefix: "@/", baseDir: "" };
  const warnings: string[] = [];
  const aliases: Record<string, string> = {};

  if (effectiveAlias.baseDir) {
    const entries: Array<[string, string]> = [
      ["components", dirs.componentsDir],
      ["blocks", dirs.componentsDir],
      ["hooks", dirs.hooksDir],
      ["utils", dirs.utilsDir],
      ["themes", dirs.themesDir],
    ];
    for (const [key, dir] of entries) {
      const spec = aliasForDir(effectiveAlias, dir);
      if (spec) aliases[key] = spec;
      else
        warnings.push(
          `"${dir}" is outside "${effectiveAlias.baseDir}/" (where ${effectiveAlias.prefix}* points), so installed imports of it may not resolve.`
        );
    }
  }

  const parsed = NativraConfigSchema.safeParse({
    $schema: "https://nativra.vercel.app/schema.json",
    version: 4,
    registries: [{ name: "default", url: "https://nativra.vercel.app" }],
    ...dirs,
    aliasPrefix: effectiveAlias.prefix,
    ...(Object.keys(aliases).length > 0 ? { aliases } : {}),
  });
  if (!parsed.success) throw new Error(`Invalid configuration: ${formatConfigIssues(parsed.error)}`);
  return { config: parsed.data, warnings };
}

/** Ensures `.nativra/` (backups) is git-ignored. Returns true if .gitignore was changed. */
export async function ensureGitignored(projectRoot: string, entry = ".nativra/"): Promise<boolean> {
  const path = join(projectRoot, ".gitignore");
  let current = "";
  try {
    current = await readFile(path, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }
  const lines = current.split(/\r?\n/).map((l) => l.trim());
  if (lines.includes(entry) || lines.includes(entry.replace(/\/$/, ""))) return false;
  const prefix = current.length > 0 && !current.endsWith("\n") ? "\n" : "";
  await writeFile(path, `${current}${prefix}\n# Nativra backups\n${entry}\n`, "utf8");
  return true;
}

export async function saveConfig(projectRoot: string, config: NativraConfig): Promise<void> {
  const configPath = join(projectRoot, CONFIG_FILENAME);
  await writeFile(configPath, JSON.stringify(config, null, 2), "utf8");
}
