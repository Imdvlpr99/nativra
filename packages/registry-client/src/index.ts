import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import type { RegistryItem, RegistryManifest } from "@nativra/registry-schema";
import { ITEM_ID_REGEX, RegistryItemSchema, RegistryManifestSchema } from "@nativra/registry-schema";
import { sha256 } from "@nativra/utils";

/** Upper bound for a single registry JSON document (items embed source, schema caps files at 512 KB × 50). */
export const MAX_RESPONSE_BYTES = 8 * 1024 * 1024;

async function readLimitedText(response: Response, limit: number, url: string): Promise<string> {
  const declared = Number(response.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > limit) {
    throw new Error(`Registry response too large (${declared} bytes > ${limit}): ${url}`);
  }
  if (!response.body) return response.text();

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > limit) {
      await reader.cancel();
      throw new Error(`Registry response too large (> ${limit} bytes): ${url}`);
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}

export const MAX_REDIRECTS = 5;

/** Plain HTTP is only ever allowed for a registry on this machine. */
function isLoopbackHttp(url: URL): boolean {
  return url.protocol === "http:" && isLoopbackHost(url);
}

function isLoopbackHost(url: URL): boolean {
  return url.hostname === "localhost" || url.hostname === "127.0.0.1";
}

/**
 * Follows redirects one hop at a time, so a hop from HTTPS to plain HTTP (or from a local HTTP
 * registry to a remote one) is refused before any request is sent to it.
 */
async function fetchWithSafeRedirects(url: string, signal: AbortSignal): Promise<Response> {
  let current = new URL(url);
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const response = await fetch(current, { signal, redirect: "manual" });
    const location = response.headers.get("location");
    if (response.status < 300 || response.status > 399 || response.status === 304 || !location) return response;
    await response.body?.cancel();
    const next = new URL(location, current);
    if (next.protocol !== "https:" && !isLoopbackHttp(next)) {
      throw new Error(`Registry redirect to insecure URL rejected: "${next.href}"`);
    }
    if (current.protocol === "https:" && next.protocol !== "https:") {
      throw new Error(`Registry redirect to insecure URL rejected: "${next.href}"`);
    }
    // A local development registry stays local: it may not send the CLI to a remote host.
    if (isLoopbackHttp(current) && !isLoopbackHost(next)) {
      throw new Error(`Registry redirect from a local registry to a remote host rejected: "${next.href}"`);
    }
    current = next;
  }
  throw new Error(`Registry request exceeded ${MAX_REDIRECTS} redirects: ${url}`);
}

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
  /** Requests in flight, so concurrent lookups of one item share a single fetch */
  private readonly inflight = new Map<string, Promise<RegistryItem>>();

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
    const pending = this.inflight.get(cacheKey);
    if (pending) return pending;
    const request = this.fetchItem(id, registryName, cacheKey).finally(() => this.inflight.delete(cacheKey));
    this.inflight.set(cacheKey, request);
    return request;
  }

  private async fetchItem(id: string, registryName: string, cacheKey: string): Promise<RegistryItem> {
    const source = this.findSource(registryName);
    const raw = await this.fetchJson<unknown>(source, `items/${id}.json`);
    const item = RegistryItemSchema.parse(raw);
    // The id decides lockfile keys and backup directories, so it must be the one that was asked for.
    if (item.id !== id) {
      throw new Error(`Registry returned item "${item.id}" when "${id}" was requested`);
    }

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
    return (await this.resolveWithSources(id, registryName)).map((r) => r.item);
  }

  /** Like resolveWithDependencies, but also names the registry each item came from. */
  async resolveWithSources(
    id: string,
    registryName = "default"
  ): Promise<Array<{ item: RegistryItem; registry: string }>> {
    const resolved: Array<{ item: RegistryItem; registry: string }> = [];
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

      // Start fetching every dependency at once; the walk below stays in order and finds them
      // cached. Failures are reported by that walk, in order, so they're ignored here.
      for (const dep of item.registryDependencies ?? []) {
        this.getItem(dep.id, dep.registry ?? "default").catch(() => undefined);
      }

      // Resolve dependencies first
      for (const dep of item.registryDependencies ?? []) {
        await resolve(dep.id, dep.registry ?? "default");
      }

      visitingStack.pop();
      resolvedKeys.add(key);
      resolved.push({ item, registry });
    };

    await resolve(id, registryName);
    return resolved;
  }

  // -------------------------------------------------------------------------
  // Cache management
  // -------------------------------------------------------------------------

  /** Names of the configured registry sources, in configuration order. */
  registryNames(): string[] {
    return this.sources.map((s) => s.name ?? "default");
  }

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
      const response = await fetchWithSafeRedirects(url, controller.signal);
      // Backstop for fetch implementations that follow redirects despite `redirect: "manual"`.
      if (url.startsWith("https:") && response.url && !response.url.startsWith("https:")) {
        throw new Error(`Registry redirect to insecure URL rejected: "${response.url}"`);
      }
      if (!response.ok) {
        throw new Error(
          `Failed to fetch registry resource "${url}": ${response.status} ${response.statusText}`
        );
      }
      return JSON.parse(await readLimitedText(response, MAX_RESPONSE_BYTES, url)) as T;
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
