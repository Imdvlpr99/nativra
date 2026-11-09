import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import type { RegistryItem, RegistryManifest } from "@nativra/registry-schema";
import { ITEM_ID_REGEX, RegistryItemSchema, RegistryManifestSchema } from "@nativra/registry-schema";
import { sha256 } from "@nativra/utils";

function isSafeRelativePath(targetPath: string): boolean {
  if (!targetPath || typeof targetPath !== "string") return false;
  if (
    targetPath.includes("\0") ||
    /^[a-zA-Z]:/.test(targetPath) ||
    targetPath.startsWith("/") ||
    targetPath.startsWith("\\")
  ) {
    return false;
  }
  const segments = targetPath.split(/[/\\]/);
  return !segments.includes("..");
}

/**
 * @nativra/registry-client
 *
 * Resolves registry items from:
 *   1. A local directory path (e.g. `./registry`)
 *   2. A remote HTTP/HTTPS URL (static JSON files served from CDN or GitHub)
 *
 * No database required for MVP.
 */

// ---------------------------------------------------------------------------
// Registry source configuration
// ---------------------------------------------------------------------------

export type RegistrySourceKind = "local" | "remote";

export interface RegistrySource {
  kind: RegistrySourceKind;
  /**
   * For local: absolute path to the registry directory containing `registry.json`
   * For remote: base URL, e.g. "https://nativra.vercel.app" or a raw GitHub URL
   */
  location: string;
  /** Registry name, defaults to "default" */
  name?: string;
}

export interface RegistryClientOptions {
  timeoutMs?: number;
}

// ---------------------------------------------------------------------------
// Registry client class
// ---------------------------------------------------------------------------

export class RegistryClient {
  private readonly sources: RegistrySource[];
  private readonly timeoutMs: number;
  /** Simple in-memory cache: registryName -> manifest */
  private readonly manifestCache = new Map<string, RegistryManifest>();
  /** Simple in-memory cache: `registryName/itemId` -> item */
  private readonly itemCache = new Map<string, RegistryItem>();

  constructor(sources: RegistrySource[], options?: RegistryClientOptions) {
    if (sources.length === 0) {
      throw new Error("RegistryClient requires at least one source.");
    }
    this.sources = sources;
    this.timeoutMs = options?.timeoutMs ?? 15000;
  }

  // -------------------------------------------------------------------------
  // Manifest resolution
  // -------------------------------------------------------------------------

  async getManifest(registryName = "default"): Promise<RegistryManifest> {
    const cached = this.manifestCache.get(registryName);
    if (cached) return cached;

    const source = this.findSource(registryName);
    const raw = await this.fetchJson<unknown>(source, "registry.json");
    const manifest = RegistryManifestSchema.parse(raw);
    this.manifestCache.set(registryName, manifest);
    return manifest;
  }

  // -------------------------------------------------------------------------
  // Item resolution
  // -------------------------------------------------------------------------

  async getItem(id: string, registryName = "default"): Promise<RegistryItem> {
    if (!ITEM_ID_REGEX.test(id)) {
      throw new Error(
        `Invalid registry item ID "${id}". IDs must be lowercase letters, numbers, and hyphens.`
      );
    }

    const cacheKey = `${registryName}/${id}`;
    const cached = this.itemCache.get(cacheKey);
    if (cached) return cached;

    const source = this.findSource(registryName);
    const raw = await this.fetchJson<unknown>(source, `items/${id}.json`);
    const item = RegistryItemSchema.parse(raw);

    // Verify integrity hashes and safe relative file paths (Plan Section 2.5 & 2.6)
    for (const file of item.files) {
      if (!isSafeRelativePath(file.path)) {
        throw new Error(`Item "${item.id}" contains an unsafe file path: "${file.path}"`);
      }
      if (file.content !== undefined) {
        if (!file.hash) {
          throw new Error(
            `Integrity verification failed for "${file.path}" in "${item.id}": missing required SHA-256 hash`
          );
        }
        const computed = sha256(file.content);
        if (computed !== file.hash.toLowerCase()) {
          throw new Error(
            `Integrity verification failed for "${file.path}" in "${item.id}": expected hash ${file.hash}, got ${computed}`
          );
        }
      }
    }

    this.itemCache.set(cacheKey, item);
    return item;
  }

  async listItems(registryName = "default"): Promise<RegistryManifest["items"]> {
    const manifest = await this.getManifest(registryName);
    return manifest.items;
  }

  /**
   * Resolve an item and all its transitive registry dependencies.
   * Returns items in dependency order (dependencies first).
   * Detects and reports cyclic dependencies with clear stack diagnostics.
   */
  async resolveWithDependencies(id: string, registryName = "default"): Promise<RegistryItem[]> {
    const resolved: RegistryItem[] = [];
    const resolvedKeys = new Set<string>();
    const visitingStack: string[] = [];

    const resolve = async (itemId: string, registry: string) => {
      const key = `${registry}/${itemId}`;
      if (resolvedKeys.has(key)) return;

      if (visitingStack.includes(key)) {
        const cycle = [...visitingStack, key].map((k) => k.split("/")[1] ?? k).join(" -> ");
        throw new Error(`Dependency cycle detected:\n${cycle}`);
      }

      visitingStack.push(key);
      const item = await this.getItem(itemId, registry);

      // Resolve dependencies first
      for (const dep of item.registryDependencies ?? []) {
        await resolve(dep.id, dep.registry ?? "default");
      }

      visitingStack.pop();
      resolvedKeys.add(key);
      resolved.push(item);
    };

    await resolve(id, registryName);
    return resolved;
  }

  // -------------------------------------------------------------------------
  // Cache management
  // -------------------------------------------------------------------------

  clearCache(): void {
    this.manifestCache.clear();
    this.itemCache.clear();
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  private findSource(registryName: string): RegistrySource {
    const source = this.sources.find((s) => (s.name ?? "default") === registryName);
    if (!source) {
      throw new Error(
        `No registry source configured for registry "${registryName}". ` +
          `Configured registries: ${this.sources.map((s) => s.name ?? "default").join(", ")}`
      );
    }
    return source;
  }

  private async fetchJson<T>(source: RegistrySource, relativePath: string): Promise<T> {
    if (!isSafeRelativePath(relativePath)) {
      throw new Error(`Unsafe registry relative path rejected: "${relativePath}"`);
    }

    if (source.kind === "local") {
      const normalizedRoot = resolve(source.location);
      const filePath = resolve(normalizedRoot, relativePath);
      if (!filePath.startsWith(normalizedRoot + sep)) {
        throw new Error(`Registry path traversal rejected: "${relativePath}"`);
      }
      const content = await readFile(filePath, "utf8");
      return JSON.parse(content) as T;
    }

    // Remote fetch with timeout and cancellation (Plan Section 3.1)
    const url = `${source.location.replace(/\/$/, "")}/${relativePath}`;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort(new Error(`Registry request timed out after ${this.timeoutMs}ms: ${url}`));
    }, this.timeoutMs);

    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch registry resource "${url}": ${response.status} ${response.statusText}`
        );
      }
      return (await response.json()) as T;
    } catch (err) {
      if (controller.signal.aborted) {
        throw new Error(`Registry request timed out after ${this.timeoutMs}ms: ${url}`);
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }
}

// ---------------------------------------------------------------------------
// Convenience factory
// ---------------------------------------------------------------------------

/** Create a client targeting the local registry directory */
export function createLocalRegistryClient(
  registryDir: string,
  options?: RegistryClientOptions
): RegistryClient {
  return new RegistryClient(
    [{ kind: "local", location: registryDir, name: "default" }],
    options
  );
}

/** Create a client targeting a remote registry URL */
export function createRemoteRegistryClient(
  baseUrl: string,
  options?: RegistryClientOptions
): RegistryClient {
  return new RegistryClient(
    [{ kind: "remote", location: baseUrl, name: "default" }],
    options
  );
}


