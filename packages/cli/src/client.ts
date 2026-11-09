import { resolve } from "node:path";
import { RegistryClient, type RegistrySource } from "@nativra/registry-client";
import type { NativraConfig } from "./config.js";

/** A registry location is remote if it starts with http(s)://, otherwise a local directory. */
export function toSource(location: string, name = "default"): RegistrySource {
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
  return { kind: "local", location: resolve(location), name };
}

export function createClient(config: NativraConfig, override?: string): RegistryClient {
  if (override) return new RegistryClient([toSource(override)]);
  return new RegistryClient(config.registries.map((r) => toSource(r.url, r.name)));
}

