import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";

/** Location of the Nativra config file within a consumer project */
export const CONFIG_FILENAME = "nativra.json";

function cleanPath(p: unknown): string | undefined {
  if (typeof p !== "string" || !p.trim()) return undefined;
  return p.trim().replace(/^[@~]\//, "").replace(/^\.\//, "");
}

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
    .default([{ name: "default", url: "https://registry.nativra.dev" }]),
  /** Where installed components are written, relative to project root */
  componentsDir: z.string().default("components/ui"),
  /** Where installed blocks are written, relative to project root */
  blocksDir: z.string().optional(),
  /** Where installed hooks are written, relative to project root */
  hooksDir: z.string().default("hooks"),
  /** Where installed utilities are written, relative to project root */
  utilsDir: z.string().default("lib/utils"),
  /** Default styling target */
  stylingTarget: z.enum(["nativewind", "stylesheet"]).default("nativewind"),
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

export async function loadConfig(projectRoot: string): Promise<NativraConfig> {
  const configPath = join(projectRoot, CONFIG_FILENAME);
  try {
    const raw = JSON.parse(await readFile(configPath, "utf8")) as Record<string, unknown>;

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
      throw new Error(
        `Invalid ${CONFIG_FILENAME}: ${parsed.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("; ")}`
      );
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

export async function saveConfig(projectRoot: string, config: NativraConfig): Promise<void> {
  const configPath = join(projectRoot, CONFIG_FILENAME);
  await writeFile(configPath, JSON.stringify(config, null, 2), "utf8");
}
