import { readFile, readdir, writeFile, mkdir, rm } from "node:fs/promises";
import { join, resolve, sep } from "node:path";
import type { RegistryItem, RegistryManifest } from "@nativra/registry-schema";
import { RegistryItemSchema } from "@nativra/registry-schema";
import { sha256 } from "@nativra/utils";

function isSafeRelativePath(targetPath: string): boolean {
  if (!targetPath || typeof targetPath !== "string") return false;
  // Disallow null bytes, absolute paths, drive letters, UNC paths
  if (
    targetPath.includes("\0") ||
    /^[a-zA-Z]:/.test(targetPath) ||
    targetPath.startsWith("/") ||
    targetPath.startsWith("\\")
  ) {
    return false;
  }
  // Disallow traversal segments
  const segments = targetPath.split(/[/\\]/);
  if (segments.includes("..")) {
    return false;
  }
  return true;
}

/**
 * @nativra/registry-builder
 *
 * Reads authored item definition JSON files from the registry source directory,
 * hydrates source file content, computes integrity hashes, validates against schema,
 * and writes the deployable manifest + per-item JSON files.
 *
 * Directory convention:
 *   registry/
 *     default/
 *       components/
 *         button/
 *           item.json         ← item definition (without file content)
 *           nativewind/
 *             Button.tsx      ← source file for NativeWind target
 *           stylesheet/
 *             Button.tsx      ← source file for StyleSheet target
 *       hooks/
 *       utilities/
 *       blocks/
 *       templates/
 *       themes/
 *     registry.json           ← generated manifest (do not hand-edit)
 *
 * Output (written to outDir):
 *   registry.json             ← manifest with item summaries
 *   items/<id>.json           ← full item with hydrated source content
 */

// ---------------------------------------------------------------------------
// Build configuration
// ---------------------------------------------------------------------------

export interface BuildConfig {
  /** Absolute path to the registry source root (contains `default/` subdir) */
  sourceDir: string;
  /** Absolute path to write the built registry output */
  outDir: string;
  /** Registry name */
  registryName?: string;
  /** Base URL where the registry will be served (written into manifest) */
  baseUrl?: string;
  /** If true, write pretty-printed JSON */
  pretty?: boolean;
}

// ---------------------------------------------------------------------------
// Builder
// ---------------------------------------------------------------------------

export interface BuildResult {
  manifest: RegistryManifest;
  items: RegistryItem[];
  errors: string[];
}

export async function buildRegistry(config: BuildConfig): Promise<BuildResult> {
  const registryName = config.registryName ?? "default";
  const registrySourceDir = join(config.sourceDir, registryName);
  const itemTypes = ["components", "hooks", "utilities", "blocks", "templates", "themes", "styles"] as const;

  const items: RegistryItem[] = [];
  const errors: string[] = [];

  for (const itemType of itemTypes) {
    const typeDir = join(registrySourceDir, itemType);
    let entries: string[];

    try {
      entries = await readdir(typeDir);
    } catch {
      // directory may not exist yet — skip silently
      continue;
    }

    for (const entry of entries) {
      const itemDir = join(typeDir, entry);
      const definitionPath = join(itemDir, "item.json");

      try {
        const rawDef = await readFile(definitionPath, "utf8");
        const def = JSON.parse(rawDef) as Record<string, unknown>;

        // Hydrate source file content
        const files = def["files"] as Array<{ path: string; target?: string }> | undefined;
        if (Array.isArray(files)) {
          for (const file of files) {
            if (!isSafeRelativePath(file.path)) {
              errors.push(`[${entry}] Unsafe file path rejected: ${file.path}`);
              continue;
            }
            const normalizedItemDir = resolve(itemDir);
            const sourcePath = resolve(itemDir, file.path);
            if (!sourcePath.startsWith(normalizedItemDir + sep)) {
              errors.push(`[${entry}] Path traversal detected: ${file.path}`);
              continue;
            }

            try {
              const content = await readFile(sourcePath, "utf8");
              (file as Record<string, unknown>)["content"] = content;
              (file as Record<string, unknown>)["hash"] = sha256(content);
            } catch {
              errors.push(`[${entry}] Could not read source file: ${file.path}`);
            }
          }
        }

        // Hydrate Markdown documentation
        const docsPath = def["docsPath"];
        if (typeof docsPath === "string") {
          const docsSource = resolve(itemDir, docsPath);
          if (!isSafeRelativePath(docsPath) || !docsSource.startsWith(resolve(itemDir) + sep)) {
            errors.push(`[${entry}] Unsafe docsPath rejected: ${docsPath}`);
          } else {
            try {
              def["docs"] = await readFile(docsSource, "utf8");
            } catch {
              errors.push(`[${entry}] Could not read docs file: ${docsPath}`);
            }
          }
        }

        // Set updatedAt to now if not present
        if (!def["updatedAt"]) {
          def["updatedAt"] = new Date().toISOString();
        }

        const parsed = RegistryItemSchema.safeParse(def);
        if (!parsed.success) {
          errors.push(
            `[${entry}] Schema validation failed: ${parsed.error.issues
              .map((i) => `${i.path.join(".")}: ${i.message}`)
              .join("; ")}`
          );
          continue;
        }

        if (parsed.data.id !== entry) {
          errors.push(`[${entry}] Item id "${parsed.data.id}" must match its directory name`);
          continue;
        }
        for (const file of parsed.data.files) {
          if (file.target && !parsed.data.stylingTargets.includes(file.target)) {
            errors.push(`[${entry}] File "${file.path}" targets "${file.target}", which is not listed in stylingTargets`);
          }
        }
        items.push(parsed.data);
      } catch (err) {
        errors.push(`[${entry}] Failed to process item: ${String(err)}`);
      }
    }
  }

  // Cross-item validation: unique ids and resolvable same-registry dependencies
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) errors.push(`[${item.id}] Duplicate item id`);
    seen.add(item.id);
  }
  for (const item of items) {
    for (const dep of item.registryDependencies ?? []) {
      if ((dep.registry ?? "default") === registryName && !seen.has(dep.id)) {
        errors.push(`[${item.id}] Unknown registry dependency "${dep.id}"`);
      }
    }
  }

  // If errors were encountered, fail without modifying output files (Plan Section 2.7 & 3.4)
  if (errors.length > 0) {
    return {
      manifest: {
        name: registryName,
        schemaVersion: "1.0.0",
        items: [],
      },
      items: [],
      errors,
    };
  }

  // Build manifest
  const manifest: RegistryManifest = {
    name: registryName,
    schemaVersion: "1.0.0",
    ...(config.baseUrl ? { baseUrl: config.baseUrl } : {}),
    items: items.map((item) => ({
      id: item.id,
      name: item.name,
      ...(item.title ? { title: item.title } : {}),
      description: item.description,
      type: item.type,
      ...(item.category ? { category: item.category } : {}),
      status: item.status,
      version: item.version,
      stylingTargets: item.stylingTargets,
      tags: item.tags,
    })),
  };

  // Write output
  const indent = config.pretty ? 2 : 0;
  const itemsOutDir = join(config.outDir, "items");
  await mkdir(itemsOutDir, { recursive: true });

  // Clean stale artifacts (Plan Section 3.4)
  try {
    const existing = await readdir(itemsOutDir);
    const validFileNames = new Set(items.map((i) => `${i.id}.json`));
    for (const file of existing) {
      if (!validFileNames.has(file)) {
        await rm(join(itemsOutDir, file), { force: true });
      }
    }
  } catch {
    // itemsOutDir was just created
  }

  await writeFile(
    join(config.outDir, "registry.json"),
    JSON.stringify(manifest, null, indent),
    "utf8"
  );

  for (const item of items) {
    await writeFile(
      join(itemsOutDir, `${item.id}.json`),
      JSON.stringify(item, null, indent),
      "utf8"
    );
  }

  return { manifest, items, errors };
}

