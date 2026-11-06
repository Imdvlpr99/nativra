import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { z } from "zod";

/** Location of the Nativra config file within a consumer project */
export const CONFIG_FILENAME = "nativra.json";

export const NativraConfigSchema = z.object({
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
  /** Where installed hooks are written, relative to project root */
  hooksDir: z.string().default("hooks"),
  /** Where installed utilities are written, relative to project root */
  utilsDir: z.string().default("lib/utils"),
  /** Default styling target */
  stylingTarget: z.enum(["nativewind", "stylesheet"]).default("nativewind"),
  /** TypeScript path alias prefix, e.g. "@/" */
  aliasPrefix: z.string().optional(),
});

export type NativraConfig = z.infer<typeof NativraConfigSchema>;

export async function loadConfig(projectRoot: string): Promise<NativraConfig> {
  const configPath = join(projectRoot, CONFIG_FILENAME);
  try {
    const raw = await readFile(configPath, "utf8");
    const parsed = NativraConfigSchema.safeParse(JSON.parse(raw));
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

