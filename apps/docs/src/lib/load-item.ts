import type { ItemType, StylingTarget } from "./data";

/** A full registry item: what `nativra add` downloads, including file contents and docs. */
export interface FullItem {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  version: string;
  status: string;
  files: Array<{ path: string; target?: StylingTarget; content?: string }>;
  docs?: string;
}

const cache = new Map<string, Promise<FullItem>>();

/**
 * Loads public/items/<id>.json, the same file the CLI installs from. Read from disk while
 * prerendering and fetched in the browser. Promises are cached so React's `use()` can suspend on them.
 */
export function loadItem(id: string): Promise<FullItem> {
  let p = cache.get(id);
  if (!p) {
    p = import.meta.env.SSR ? readFromDisk(id) : fetchItem(id);
    cache.set(id, p);
    // Forget failures so "Try again" refetches instead of replaying the same rejection.
    p.catch(() => cache.delete(id));
  }
  return p;
}

async function fetchItem(id: string): Promise<FullItem> {
  const res = await fetch(`/items/${encodeURIComponent(id)}.json`);
  if (!res.ok) throw new Error(`Could not load ${id} (${res.status})`);
  return (await res.json()) as FullItem;
}

async function readFromDisk(id: string): Promise<FullItem> {
  if (!/^[a-z0-9-]+$/.test(id)) throw new Error(`Invalid item id: ${id}`);
  const { readFile } = await import(/* @vite-ignore */ "node:fs/promises");
  const { resolve } = await import(/* @vite-ignore */ "node:path");
  const raw = await readFile(resolve(process.cwd(), "public/items", `${id}.json`), "utf8");
  return JSON.parse(raw) as FullItem;
}
