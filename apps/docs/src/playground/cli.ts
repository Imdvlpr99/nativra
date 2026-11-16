/**
 * nativra-cli in the browser, for the playground. It works on the in-memory project and reads the
 * docs site's own registry (/registry.json, /items/<id>.json). Import rewriting and the NativeWind
 * CSS come from the real CLI and theme engine, so installs here produce the same files as in a
 * real project. Only the file system and the npm install are simulated.
 */
import type { RegistryItem, RegistryItemType, RegistryManifest, SourceFile } from "@nativra/registry-schema";
import { STYLE_PRESETS, THEME_PRESETS, getStylePreset, toCssVariables, toStyleCss } from "@nativra/theme-engine";
import { filesForTarget, importBaseForType, importTargets, siblingImportMap, transformFileImports } from "../../../../packages/cli/src/transform";
import type { NativraConfig } from "../../../../packages/cli/src/config";
import { nativraJson, starterProject, type ProjectFiles, type Target } from "./project";

export type Tone = "plain" | "muted" | "info" | "success" | "warn" | "error" | "command" | "accent";
export interface Line {
  text: string;
  tone?: Tone;
}

export interface ShellHost {
  files(): ProjectFiles;
  setFiles(files: ProjectFiles): void;
  print(lines: Line | Line[]): void;
  clear(): void;
  setTarget(target: Target): void;
}

interface LockEntry {
  version: string;
  type?: RegistryItemType;
  files: Record<string, string>;
  dependencies?: string[];
}
interface LockFile {
  items: Record<string, LockEntry>;
}

const LOCK = "nativra.lock.json";
const SLOT_FILE: Partial<Record<RegistryItemType, string>> = { theme: "theme.ts", style: "style.ts" };

const line = (text: string, tone: Tone = "plain"): Line => ({ text, tone });

// ---------------------------------------------------------------------------
// Registry (same origin as the docs)
// ---------------------------------------------------------------------------

let manifestCache: Promise<RegistryManifest> | null = null;
const itemCache = new Map<string, Promise<RegistryItem>>();

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(res.status === 404 ? "not found in the registry" : `registry request failed (${res.status})`);
  return (await res.json()) as T;
}

function manifest(): Promise<RegistryManifest> {
  manifestCache ??= fetchJson<RegistryManifest>("/registry.json").catch((err: unknown) => {
    manifestCache = null;
    throw err;
  });
  return manifestCache;
}

function getItem(id: string): Promise<RegistryItem> {
  if (!/^[a-z][a-z0-9-]*$/.test(id)) return Promise.reject(new Error(`invalid item id "${id}"`));
  let cached = itemCache.get(id);
  if (!cached) {
    cached = fetchJson<RegistryItem>(`/items/${id}.json`);
    cached.catch(() => itemCache.delete(id));
    itemCache.set(id, cached);
  }
  return cached;
}

/** The item and its registry dependencies, dependencies first. */
async function resolveWithDependencies(id: string): Promise<RegistryItem[]> {
  const out: RegistryItem[] = [];
  const seen = new Set<string>();
  const visit = async (itemId: string, stack: string[]) => {
    if (seen.has(itemId)) return;
    if (stack.includes(itemId)) throw new Error(`dependency cycle: ${[...stack, itemId].join(" -> ")}`);
    const item = await getItem(itemId);
    for (const dep of item.registryDependencies ?? []) await visit(dep.id, [...stack, itemId]);
    seen.add(itemId);
    out.push(item);
  };
  await visit(id, []);
  return out;
}

// ---------------------------------------------------------------------------
// Project helpers
// ---------------------------------------------------------------------------

function readConfig(files: ProjectFiles): NativraConfig {
  const raw = files["nativra.json"];
  if (raw === undefined) throw new Error('No nativra.json found. Run "npx nativra-cli init" first.');
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw) as Record<string, unknown>;
  } catch (err) {
    throw new Error(`nativra.json is not valid JSON: ${(err as Error).message}`);
  }
  return {
    version: 4,
    registries: [{ name: "default", url: "https://nativra.vercel.app" }],
    componentsDir: "components/ui",
    hooksDir: "hooks",
    utilsDir: "lib/utils",
    themesDir: "lib/themes",
    stylingTarget: "stylesheet",
    ...parsed,
  } as NativraConfig;
}

function readLock(files: ProjectFiles): LockFile {
  try {
    const parsed = JSON.parse(files[LOCK] ?? '{"items":{}}') as LockFile;
    return parsed.items && typeof parsed.items === "object" ? parsed : { items: {} };
  } catch {
    throw new Error(`${LOCK} is not valid JSON. Fix or delete it.`);
  }
}

const writeLockTo = (files: ProjectFiles, lock: LockFile) => {
  files[LOCK] = `${JSON.stringify(lock, null, 2)}\n`;
};

function destDir(type: RegistryItemType, config: NativraConfig): string {
  const clean = (d: string) => d.replace(/\\/g, "/").replace(/^\.\//, "").replace(/\/+$/, "");
  switch (type) {
    case "hook":
      return clean(config.hooksDir);
    case "utility":
      return clean(config.utilsDir.replace(/\.(ts|js|tsx)$/, ""));
    case "theme":
    case "style":
      return clean(config.themesDir);
    case "block":
      return clean(config.blocksDir ?? config.componentsDir);
    default:
      return clean(config.componentsDir);
  }
}

const baseName = (path: string) => path.split(/[/\\]/).pop() ?? path;
const destPath = (item: RegistryItem, file: SourceFile, config: NativraConfig) => `${destDir(item.type, config)}/${baseName(file.path)}`;

/** Sibling imports that cross install folders (e.g. a block importing ./Card): the CLI's own rules. */
const crossImports = (item: RegistryItem, related: RegistryItem[], config: NativraConfig): Record<string, string> =>
  siblingImportMap(item, related, config, (i) => destDir(i.type, config));

async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function slotOwner(lock: LockFile, type: "theme" | "style"): string | undefined {
  const file = SLOT_FILE[type]!;
  return Object.entries(lock.items).find(
    ([, e]) => e.type === type && Object.keys(e.files).some((k) => k === file || k.endsWith(`/${file}`))
  )?.[0];
}

/** A file belongs to the item that wrote it last. */
function recordLock(lock: LockFile, item: RegistryItem, written: Record<string, string>) {
  const entry: LockEntry = lock.items[item.id] ?? { version: item.version, files: {} };
  for (const [path, hash] of Object.entries(written)) {
    for (const [otherId, other] of Object.entries(lock.items)) {
      if (otherId === item.id || !(path in other.files)) continue;
      delete other.files[path];
      if (Object.keys(other.files).length === 0) delete lock.items[otherId];
    }
    entry.files[path] = hash;
  }
  if (Object.keys(entry.files).length === 0) return;
  entry.version = item.version;
  entry.type = item.type;
  const deps = (item.registryDependencies ?? []).map((d) => d.id);
  if (deps.length > 0) entry.dependencies = deps;
  else delete entry.dependencies;
  lock.items[item.id] = entry;
}

const THEME_BLOCK = /\/\* NATIVRA THEME START: [\s\S]*?\/\* NATIVRA THEME END: .*?\*\//;

/** NativeWind: the theme's variables and the style's classes in global.css, like the real CLI. */
function writeThemeCss(files: ProjectFiles, lock: LockFile, print: (l: Line) => void) {
  const themeId = slotOwner(lock, "theme");
  const tokens = themeId ? THEME_PRESETS[themeId] : undefined;
  if (!themeId || !tokens) return;
  const style = getStylePreset(slotOwner(lock, "style"));
  const cssPath = ["global.css", "src/global.css", "app/global.css"].find((p) => files[p] !== undefined) ?? "global.css";
  const block = `/* NATIVRA THEME START: ${themeId} */\n@layer base {\n${toCssVariables(tokens)}\n}\n${toStyleCss(tokens, style)}\n/* NATIVRA THEME END: ${themeId} */`;
  const current = files[cssPath] ?? "";
  const next = THEME_BLOCK.test(current) ? current.replace(THEME_BLOCK, () => block) : `${current.trimEnd()}\n\n${block}\n`;
  if (next !== current) {
    files[cssPath] = next;
    print(line(`  ✓ Wrote the "${themeId}" theme with the "${style.id}" style into ${cssPath}`, "success"));
  }
}

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

function tokenize(input: string): string[] {
  const out: string[] = [];
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  for (const m of input.matchAll(re)) out.push(m[1] ?? m[2] ?? m[3]!);
  return out;
}

function parseArgs(args: string[]) {
  const positional: string[] = [];
  const flags: Record<string, string | true> = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i]!;
    if (a.startsWith("--")) {
      const [key, value] = a.slice(2).split("=", 2) as [string, string | undefined];
      if (value !== undefined) flags[key] = value;
      else if (args[i + 1] !== undefined && !args[i + 1]!.startsWith("-") && ["style", "target", "type", "on-conflict"].includes(key)) {
        flags[key] = args[++i]!;
      } else flags[key] = true;
    } else positional.push(a);
  }
  return { positional, flags };
}

// ---------------------------------------------------------------------------
// The shell
// ---------------------------------------------------------------------------

export const HELP: Line[] = [
  line("Nativra playground: a real nativra-cli working on this in-browser project.", "accent"),
  line(""),
  line("  npx nativra-cli add <items...> [--overwrite]   install components, blocks, templates, hooks"),
  line("  npx nativra-cli remove <item> [--force]        remove an installed item"),
  line("  npx nativra-cli list [--type component]        browse the registry"),
  line("  npx nativra-cli search <query>                 search the registry"),
  line("  npx nativra-cli info <item>                    item details"),
  line("  npx nativra-cli theme list | add <id> [--overwrite]"),
  line("  npx nativra-cli style list | add <id>          soft, crisp, tailwind, material, ios"),
  line("  npx nativra-cli init --target <stylesheet|nativewind> [--style <id>] --force"),
  line(""),
  line("  ls [dir] · tree · cat <file> · touch <file> · rm <file> · clear · reset [stylesheet|nativewind] · help", "muted"),
  line('  "nativra" and "nativra-cli" work as short forms of "npx nativra-cli".', "muted"),
];

const NOT_HERE = new Set(["update", "diff", "rollback", "doctor", "audit", "registry"]);

export class PlaygroundShell {
  constructor(private readonly host: ShellHost) {}

  private print = (lines: Line | Line[]) => this.host.print(lines);

  async run(input: string): Promise<void> {
    const tokens = tokenize(input.trim());
    if (tokens.length === 0) return;
    let [cmd, ...rest] = tokens as [string, ...string[]];
    if (cmd === "npx" && (rest[0] === "nativra-cli" || rest[0] === "nativra")) {
      [cmd, ...rest] = ["nativra", ...rest.slice(1)];
    }
    if (cmd === "nativra-cli") cmd = "nativra";

    try {
      switch (cmd) {
        case "help":
          return this.print(HELP);
        case "clear":
          return this.host.clear();
        case "ls":
          return this.ls(rest[0] ?? "");
        case "tree":
          return this.tree();
        case "cat":
          return this.cat(rest[0]);
        case "rm":
          return this.rm(rest[0]);
        case "touch":
          return this.touch(rest[0]);
        case "reset":
          return this.reset(rest[0]);
        case "pnpm":
        case "npm":
        case "yarn":
        case "bun":
          return this.print(line("The playground already provides every package Nativra items use; no install needed.", "muted"));
        case "nativra":
          return await this.nativra(rest);
        default:
          return this.print(line(`${cmd}: command not found. Type "help".`, "error"));
      }
    } catch (err) {
      this.print(line(`✗ ${(err as Error).message}`, "error"));
    }
  }

  private async nativra(args: string[]) {
    const [sub, ...rest] = args;
    const { positional, flags } = parseArgs(rest);
    if (!sub || sub === "--help" || sub === "help") return this.print(HELP);
    if (sub === "--version" || sub === "-V") return this.print(line("nativra-cli (playground)"));
    if (NOT_HERE.has(sub)) {
      return this.print(line(`"nativra ${sub}" works on a real project on disk; it isn't available in the playground.`, "warn"));
    }
    switch (sub) {
      case "init":
        return this.init(flags);
      case "add":
        return this.add(positional, flags);
      case "remove":
        return this.remove(positional, flags);
      case "list":
        return this.list(flags);
      case "search":
        return this.search(positional.join(" "));
      case "info":
        return this.info(positional[0]);
      case "theme":
      case "style":
        return this.slotCommand(sub, positional, flags);
      default:
        return this.print(line(`error: unknown command '${sub}'. Type "help".`, "error"));
    }
  }

  // -- shell commands -------------------------------------------------------

  private ls(dir: string) {
    const prefix = dir.replace(/^\.?\/?/, "").replace(/\/+$/, "");
    const entries = new Set<string>();
    for (const path of Object.keys(this.host.files())) {
      if (prefix && !path.startsWith(`${prefix}/`)) continue;
      const rest = prefix ? path.slice(prefix.length + 1) : path;
      const [head, ...tail] = rest.split("/");
      entries.add(tail.length ? `${head}/` : head!);
    }
    if (entries.size === 0) return this.print(line(`ls: ${dir}: no such directory`, "error"));
    this.print([...entries].sort().map((e) => line(e, e.endsWith("/") ? "info" : "plain")));
  }

  private tree() {
    this.print(Object.keys(this.host.files()).sort().map((p) => line(p)));
  }

  private cat(path?: string) {
    if (!path) return this.print(line("usage: cat <file>", "error"));
    const content = this.host.files()[path.replace(/^\.\//, "")];
    if (content === undefined) return this.print(line(`cat: ${path}: no such file`, "error"));
    this.print(content.replace(/\n$/, "").split("\n").map((l) => line(l)));
  }

  private rm(path?: string) {
    if (!path) return this.print(line("usage: rm <file>", "error"));
    const key = path.replace(/^\.\//, "");
    const files = { ...this.host.files() };
    if (files[key] === undefined) return this.print(line(`rm: ${path}: no such file`, "error"));
    delete files[key];
    this.host.setFiles(files);
  }

  private touch(path?: string) {
    if (!path) return this.print(line("usage: touch <file>", "error"));
    const key = path.replace(/^\.\//, "");
    if (!/^[\w.-]+(\/[\w.-]+)*$/.test(key) || key.split("/").includes("..")) {
      return this.print(line(`touch: ${path}: invalid path`, "error"));
    }
    const files = this.host.files();
    if (files[key] === undefined) this.host.setFiles({ ...files, [key]: "" });
  }

  private reset(target?: string) {
    const next: Target = target === "nativewind" || target === "stylesheet" ? target : readConfigSafe(this.host.files());
    this.host.setFiles(starterProject(next));
    this.host.setTarget(next);
    this.print(line(`Project reset (${next}).`, "success"));
  }

  // -- nativra commands -----------------------------------------------------

  private init(flags: Record<string, string | true>) {
    const files = { ...this.host.files() };
    if (files["nativra.json"] !== undefined && !flags.force) {
      throw new Error("nativra.json already exists. Re-run with --force to replace it.");
    }
    const target = typeof flags.target === "string" ? flags.target : readConfigSafe(files);
    if (target !== "stylesheet" && target !== "nativewind") throw new Error(`Unknown --target "${target}". Use stylesheet or nativewind.`);
    const style = typeof flags.style === "string" ? flags.style : "soft";
    if (!STYLE_PRESETS[style]) throw new Error(`Unknown style "${style}". Use one of: ${Object.keys(STYLE_PRESETS).join(", ")}.`);

    files["nativra.json"] = nativraJson(target, style);
    if (target === "nativewind") {
      const starter = starterProject("nativewind");
      files["global.css"] ??= starter["global.css"]!;
      files["tailwind.config.js"] ??= starter["tailwind.config.js"]!;
    }
    this.host.setFiles(files);
    this.host.setTarget(target);
    this.print([
      line("✔ nativra.json created!", "success"),
      line(`  styling: ${target}, style: ${style}`, "muted"),
      line("\n✅ Done! Run npx nativra-cli add button to install your first component.", "success"),
    ]);
  }

  private async add(ids: string[], flags: Record<string, string | true>) {
    if (ids.length === 0) throw new Error("No components specified. Usage: npx nativra-cli add <components...>");
    const overwrite = flags.overwrite === true || flags["on-conflict"] === "overwrite";
    const files = { ...this.host.files() };
    const config = readConfig(files);
    const lock = readLock(files);
    const npm = new Map<string, string>();
    let wroteSlot = false;

    for (const id of ids) {
      this.print(line(`\n📦 Resolving ${id}...`, "command"));
      let items: RegistryItem[];
      try {
        items = await resolveWithDependencies(id);
      } catch (err) {
        this.print(line(`✖ Failed to fetch "${id}": ${(err as Error).message}`, "error"));
        continue;
      }
      // The default style dependency becomes the project's configured style.
      if (config.style) {
        items = await Promise.all(
          items.map((item) => (item.type === "style" && item.id !== id && item.id !== config.style ? getItem(config.style!) : item))
        );
      }
      this.print(line(`✔ Resolved ${items.length} item(s)`, "success"));

      for (const item of items) {
        if (item.status === "deprecated") this.print(line(`  ⚠ ${item.id} is deprecated${item.deprecationMessage ? `: ${item.deprecationMessage}` : "."}`, "warn"));
        const written: Record<string, string> = {};
        for (const file of filesForTarget(item, config)) {
          const dest = destPath(item, file, config);
          if (files[dest] !== undefined) {
            if ((item.type === "theme" || item.type === "style") && item.id !== id) {
              this.print(line(`  → Kept installed ${item.type}: ${dest}`, "muted"));
              continue;
            }
            if (!overwrite) {
              this.print(line(`  → Skipped (existing file): ${dest}. Use --overwrite to replace it.`, "muted"));
              continue;
            }
          }
          const content = transformFileImports(file.content ?? "", config, crossImports(item, items, config));
          files[dest] = content;
          written[dest] = await sha256(content);
          this.print(line(`  ✓ Written: ${dest}`, "success"));
          if (item.type === "theme" || item.type === "style") wroteSlot = true;
        }
        recordLock(lock, item, written);
        for (const dep of item.npmDependencies ?? []) npm.set(dep.package, dep.version);
      }
    }

    writeLockTo(files, lock);
    if (config.stylingTarget === "nativewind" && (wroteSlot || !/NATIVRA THEME START/.test(files["global.css"] ?? ""))) {
      writeThemeCss(files, lock, this.print);
    }
    this.host.setFiles(files);

    if (npm.size > 0) {
      this.print([
        line(`\n  In your project this also runs: npx expo install ${[...npm.keys()].join(" ")}`, "muted"),
        line("  (The playground already provides these packages.)", "muted"),
      ]);
    }
    const added = ids.filter((i) => Object.keys(lock.items).includes(i));
    if (added.length > 0) {
      const hint = await importHint(added[0]!, config);
      this.print([line("\n✅ Done!", "success"), ...(hint ? [line(`   Use it in App.tsx: ${hint}`, "accent")] : [])]);
    }
  }

  private remove(ids: string[], flags: Record<string, string | true>) {
    if (ids.length === 0) throw new Error("usage: npx nativra-cli remove <item>");
    const files = { ...this.host.files() };
    const lock = readLock(files);
    for (const id of ids) {
      const entry = lock.items[id];
      if (!entry) {
        this.print(line(`  ⚠ "${id}" is not registered in ${LOCK}. Skipping.`, "warn"));
        continue;
      }
      const slotType = entry.type === "theme" || entry.type === "style" ? entry.type : undefined;
      const ownsSlot = slotType ? slotOwner(lock, slotType) === id : false;
      const dependents = Object.entries(lock.items)
        .filter(([other, e]) => {
          if (other === id || ids.includes(other)) return false;
          const deps = e.dependencies ?? [];
          return deps.includes(id) || (ownsSlot && deps.some((d) => lock.items[d]?.type === slotType || (slotType === "theme" ? THEME_PRESETS[d] : STYLE_PRESETS[d])));
        })
        .map(([other]) => other);
      if (dependents.length > 0 && !flags.force) {
        this.print(line(`✗ Refusing to remove "${id}" while ${dependents.join(", ")} depend on it. Use --force to override.`, "error"));
        continue;
      }
      for (const path of Object.keys(entry.files)) {
        if (files[path] !== undefined) {
          delete files[path];
          this.print(line(`  - Deleted: ${path}`, "warn"));
        }
      }
      delete lock.items[id];
      this.print(line(`  ✓ Removed "${id}"`, "success"));
    }
    writeLockTo(files, lock);
    this.host.setFiles(files);
  }

  private async list(flags: Record<string, string | true>) {
    const items = (await manifest()).items;
    const type = typeof flags.type === "string" ? flags.type : undefined;
    const filtered = type ? items.filter((i) => i.type === type) : items;
    if (filtered.length === 0) return this.print(line("No items found.", "warn"));
    const groups = new Map<string, typeof filtered>();
    for (const item of filtered) groups.set(item.type, [...(groups.get(item.type) ?? []), item]);
    for (const [t, group] of groups) {
      this.print(line(`\n${t.toUpperCase()}S`, "info"));
      this.print(group.map((i) => line(`  ${i.id.padEnd(26)} ${i.description}`)));
    }
  }

  private async search(query: string) {
    if (!query) throw new Error("usage: npx nativra-cli search <query>");
    const q = query.toLowerCase();
    const hits = (await manifest()).items.filter((i) =>
      [i.id, i.name, i.description, ...(i.tags ?? [])].some((s) => s.toLowerCase().includes(q))
    );
    if (hits.length === 0) return this.print(line(`No results for "${query}".`, "warn"));
    this.print(hits.map((i) => line(`  ${i.id.padEnd(24)} [${i.type}] ${i.description}`)));
  }

  private async info(id?: string) {
    if (!id) throw new Error("usage: npx nativra-cli info <item>");
    const item = await getItem(id);
    this.print([
      line(`\n${item.name} v${item.version}`, "accent"),
      line(item.description, "muted"),
      line(`  Type:            ${item.type}`),
      line(`  Styling targets: ${item.stylingTargets.join(", ")}`),
      ...(item.registryDependencies?.length ? [line(`  Registry deps:   ${item.registryDependencies.map((d) => d.id).join(", ")}`)] : []),
      ...(item.npmDependencies?.length ? [line(`  npm deps:        ${item.npmDependencies.map((d) => `${d.package}@${d.version}`).join(", ")}`)] : []),
      line(`  Install:         npx nativra-cli ${item.type === "theme" || item.type === "style" ? `${item.type} add` : "add"} ${item.id}`, "accent"),
    ]);
  }

  private async slotCommand(kind: "theme" | "style", positional: string[], flags: Record<string, string | true>) {
    const [action, id] = positional;
    if (action === "list" || !action) {
      const items = (await manifest()).items.filter((i) => i.type === kind);
      return this.print(items.map((i) => line(`  ${i.id.padEnd(14)} ${i.description}`)));
    }
    if (action !== "add" || !id) throw new Error(`usage: npx nativra-cli ${kind} add <id>`);
    const item = await getItem(id);
    if (item.type !== kind) throw new Error(`"${id}" is a ${item.type}, not a ${kind}.`);

    const files = { ...this.host.files() };
    const config = readConfig(files);
    const lock = readLock(files);
    const written: Record<string, string> = {};
    for (const file of filesForTarget(item, config)) {
      const dest = destPath(item, file, config);
      // Switching styles is the point of `style add`; a theme replaces theme.ts only when asked.
      if (kind === "theme" && files[dest] !== undefined && !flags.overwrite) {
        this.print(line(`  → Skipped (existing file): ${dest}. Use --overwrite to switch themes.`, "warn"));
        continue;
      }
      const content = transformFileImports(file.content ?? "", config);
      files[dest] = content;
      written[dest] = await sha256(content);
      this.print(line(`  ✓ Written: ${dest}`, "success"));
    }
    recordLock(lock, item, written);
    writeLockTo(files, lock);
    if (kind === "style" && Object.keys(written).length > 0) {
      const json = JSON.parse(files["nativra.json"]!) as Record<string, unknown>;
      files["nativra.json"] = `${JSON.stringify({ ...json, style: id }, null, 2)}\n`;
    }
    if (config.stylingTarget === "nativewind" && Object.keys(written).length > 0) writeThemeCss(files, lock, this.print);
    this.host.setFiles(files);
    if (Object.keys(written).length > 0) this.print(line(`\n✅ ${kind === "theme" ? "Theme" : "Style"} "${id}" installed.`, "success"));
  }
}

function readConfigSafe(files: ProjectFiles): Target {
  try {
    return readConfig(files).stylingTarget;
  } catch {
    return "stylesheet";
  }
}

/** `import { Button } from "@/components/ui/Button";` for an installed item, when it exports one. */
async function importHint(id: string, config: NativraConfig): Promise<string | null> {
  const item = await getItem(id);
  const file = filesForTarget(item, config).find((f) => /\.tsx$/.test(f.path));
  if (!file || !["component", "block", "template"].includes(item.type)) return null;
  const name = baseName(file.path).replace(/\.tsx$/, "");
  const base = importBaseForType(item.type, importTargets(config));
  return `import { ${name} } from "${base}/${name}";`;
}
