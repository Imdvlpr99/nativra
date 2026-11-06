import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { RegistryItem, RegistryManifest } from "@nativra/registry-schema";
import { RegistryItemSchema, RegistryManifestSchema } from "@nativra/registry-schema";

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
   * For remote: base URL, e.g. "https://registry.nativra.dev" or a raw GitHub URL
   */
  location: string;
  /** Registry name, defaults to "default" */
  name?: string;
}

// ---------------------------------------------------------------------------
// Registry client class
// ---------------------------------------------------------------------------

export class RegistryClient {
  private readonly sources: RegistrySource[];
  /** Simple in-memory cache: registryName -> manifest */
  private readonly manifestCache = new Map<string, RegistryManifest>();
  /** Simple in-memory cache: `registryName/itemId` -> item */
  private readonly itemCache = new Map<string, RegistryItem>();

  constructor(sources: RegistrySource[]) {
    if (sources.length === 0) {
      throw new Error("RegistryClient requires at least one source.");
    }
    this.sources = sources;
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
    const cacheKey = `${registryName}/${id}`;
    const cached = this.itemCache.get(cacheKey);
    if (cached) return cached;

    const source = this.findSource(registryName);
    const raw = await this.fetchJson<unknown>(source, `items/${id}.json`);
    const item = RegistryItemSchema.parse(raw);
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
   */
  async resolveWithDependencies(id: string, registryName = "default"): Promise<RegistryItem[]> {
    const resolved: RegistryItem[] = [];
    const seen = new Set<string>();

    const resolve = async (itemId: string, registry: string) => {
      const key = `${registry}/${itemId}`;
      if (seen.has(key)) return;
      seen.add(key);

      const item = await this.getItem(itemId, registry);

      // Resolve dependencies first
      for (const dep of item.registryDependencies ?? []) {
        await resolve(dep.id, dep.registry ?? "default");
      }

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
    if (source.kind === "local") {
      const filePath = join(source.location, relativePath);
      const content = await readFile(filePath, "utf8");
      return JSON.parse(content) as T;
    }

    // Remote fetch
    const url = `${source.location.replace(/\/$/, "")}/${relativePath}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch registry resource "${url}": ${response.status} ${response.statusText}`
      );
    }
    return response.json() as Promise<T>;
  }
}

// ---------------------------------------------------------------------------
// Convenience factory
// ---------------------------------------------------------------------------

/** Create a client targeting the local registry directory */
export function createLocalRegistryClient(registryDir: string): RegistryClient {
  return new RegistryClient([
    { kind: "local", location: registryDir, name: "default" },
  ]);
}

/** Create a client targeting a remote registry URL */
export function createRemoteRegistryClient(baseUrl: string): RegistryClient {
  return new RegistryClient([
    { kind: "remote", location: baseUrl, name: "default" },
  ]);
}

