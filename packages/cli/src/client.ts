import { isAbsolute, resolve } from "node:path";
import { RegistryClient, type RegistrySource } from "@nativra/registry-client";
import { ITEM_ID_REGEX } from "@nativra/registry-schema";
import type { NativraConfig } from "./config.js";

const REGISTRY_NAME_REGEX = /^[a-z0-9][a-z0-9-]*$/;

/**
 * A registry location is remote if it starts with http(s)://, otherwise a local directory.
 * Relative directories resolve against `baseDir`: the project root for paths stored in
 * nativra.json, the shell's directory for a --registry flag.
 */
export function toSource(location: string, name = "default", baseDir = process.cwd()): RegistrySource {
  if (/^https:\/\//i.test(location)) {
    return { kind: "remote", location, name };
  }
  if (/^http:\/\//i.test(location)) {
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(location)) {
      return { kind: "remote", location, name };
    }
    throw new Error(
      `Insecure HTTP registry URL rejected: "${location}". Use HTTPS (or http://localhost for local development).`
    );
  }
  return { kind: "local", location: isAbsolute(location) ? location : resolve(baseDir, location), name };
}

/**
 * @param projectRoot  resolves relative local registries listed in nativra.json, so `--cwd`
 *   reads the project's registry rather than one relative to wherever the shell is.
 */
export function createClient(config: NativraConfig, override?: string, projectRoot = process.cwd()): RegistryClient {
  if (override) return new RegistryClient([toSource(override)]);
  return new RegistryClient(config.registries.map((r) => toSource(r.url, r.name, projectRoot)));
}

export interface ItemRef {
  registry: string;
  id: string;
}

/** Parses "button" or "acme/button" (an item from the registry configured as "acme"). */
export function parseItemRef(ref: string): ItemRef {
  const parts = ref.split("/");
  const [registry, id] = parts.length === 2 ? [parts[0]!, parts[1]!] : ["default", ref];
  if (parts.length > 2 || !REGISTRY_NAME_REGEX.test(registry) || !ITEM_ID_REGEX.test(id)) {
    throw new Error(`Invalid item "${ref}". Use an id like "button", or "<registry>/<id>" for another registry.`);
  }
  return { registry, id };
}

/** "acme/button" for items outside the default registry, else just the id. */
export function formatItemRef(id: string, registry = "default"): string {
  return registry === "default" ? id : `${registry}/${id}`;
}
