import type { Metadata } from "next";
import { Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "CLI Command Reference (nativra-cli) — Init, Add, Diff & Doctor",
  description:
    "Complete CLI reference for `nativra-cli`: initialize projects, add React Native components, inspect SHA-256 diffs, run doctor checks, and manage themes.",
  alternates: {
    canonical: "/docs/cli",
  },
};

const COMMANDS = [
  {
    cmd: "npx nativra-cli init",
    desc: "Initialize Nativra in an Expo or React Native project with intelligent environment auto-detection. Detects Expo SDK vs bare React Native, TypeScript, NativeWind vs StyleSheet, package managers (pnpm/yarn/bun/npm), and src/ directory structure.",
    flags: [
      "--yes (Accept detected defaults without prompting)",
      "--cwd <dir> (Explicit working directory)",
    ],
  },
  {
    cmd: "npx nativra-cli add <...components>",
    desc: "Install one or more components, blocks, or hooks into your project. Recursively resolves dependencies, verifies SHA-256 integrity, supports atomic rollback on failure, and records exact file locations in nativra.lock.json.",
    flags: [
      "--yes (Skip interactive prompts; preserves existing files unless --overwrite is set)",
      "--overwrite (Overwrite existing files without prompting)",
      "--on-conflict <skip|overwrite|error> (Explicit conflict strategy; defaults to skip)",
      "--dry-run (Simulate installation and preview files and dependencies without writing to disk)",
      "--registry <url-or-name> (Specify alternate registry URL or local directory)",
      "--cwd <dir> (Explicit working directory)",
    ],
  },
  {
    cmd: "npx nativra-cli remove <...components>",
    desc: "Safely remove installed components, blocks, or hooks. Checks local file modifications against the lockfile, removes component files, prunes empty directories, and updates nativra.lock.json.",
    flags: [
      "--yes (Skip interactive prompts)",
      "--force (Force removal even if local modifications are detected)",
      "--cwd <dir> (Explicit working directory)",
    ],
  },
  {
    cmd: "npx nativra-cli list",
    desc: "List all items available in the configured registry (components, hooks, blocks, themes, utilities).",
    flags: [
      "--type <type> (Filter by item type: component/primitive, hook, utility, block, template, theme)",
      "--registry <url-or-name> (Override registry URL)",
      "--cwd <dir> (Explicit working directory)",
    ],
  },
  {
    cmd: "npx nativra-cli search <query>",
    desc: "Search registry items by keyword, tag, or component name.",
    flags: [
      "--registry <url-or-name> (Override registry URL)",
      "--cwd <dir> (Explicit working directory)",
    ],
  },
  {
    cmd: "npx nativra-cli info <id>",
    desc: "Display detailed metadata, version, styling targets, platform support, and file list for any registry item.",
    flags: [
      "--registry <url-or-name> (Override registry URL)",
      "--cwd <dir> (Explicit working directory)",
    ],
  },
  {
    cmd: "npx nativra-cli diff [component]",
    desc: "Compare your installed local component files with the upstream registry source to inspect any modifications.",
    flags: [
      "--registry <url-or-name> (Override registry URL)",
      "--cwd <dir> (Explicit working directory)",
    ],
  },
  {
    cmd: "npx nativra-cli update [component]",
    desc: "Safely update installed components to their latest registry version. Automatically creates a verified backup manifest before modifying files.",
    flags: [
      "--force (Overwrite local modifications)",
      "--registry <url-or-name> (Override registry URL)",
      "--cwd <dir> (Explicit working directory)",
    ],
  },
  {
    cmd: "npx nativra-cli rollback <component>",
    desc: "Restore an updated component to its previous state using the manifest-driven backup system.",
    flags: [
      "--cwd <dir> (Explicit working directory)",
    ],
  },
  {
    cmd: "npx nativra-cli doctor",
    desc: "Diagnose your project environment: verifies package.json, Expo setup, TypeScript, and nativra.json integrity. Supports automated configuration recovery with --fix.",
    flags: [
      "--fix (Automatically resolve or scaffold missing configurations and files)",
      "--cwd <dir> (Explicit working directory)",
    ],
  },
  {
    cmd: "npx nativra-cli audit",
    desc: "Scan your React Native or Expo codebase for Nativra component adoption, hardcoded hex colors, legacy <Touchable*> primitives, and screen-reader accessibility coverage. Outputs a 0–100% Design System & Accessibility Health Score.",
    flags: [
      "--json (Output structured JSON audit report for CI pipelines)",
      "--cwd <dir> (Explicit working directory)",
    ],
  },
  {
    cmd: "npx nativra-cli theme list",
    desc: "List available theme token sets in the registry (zinc, dark-slate, midnight, cyberpunk, emerald, etc.).",
    flags: [
      "--registry <url-or-name> (Override registry URL)",
      "--cwd <dir> (Explicit working directory)",
    ],
  },
  {
    cmd: "npx nativra-cli theme add <theme-id>",
    desc: "Install a theme into your project (e.g. lib/themes/midnight.ts or CSS variables).",
    flags: [
      "--registry <url-or-name> (Override registry URL)",
      "--cwd <dir> (Explicit working directory)",
    ],
  },
  {
    cmd: "npx nativra-cli registry add <name> <url>",
    desc: "Register a custom private or community registry URL.",
    flags: [
      "--cwd <dir> (Explicit working directory)",
    ],
  },
  {
    cmd: "npx nativra-cli registry list",
    desc: "List all configured registries.",
    flags: [
      "--cwd <dir> (Explicit working directory)",
    ],
  },
  {
    cmd: "npx nativra-cli registry remove <name>",
    desc: "Remove a configured registry source.",
    flags: [
      "--cwd <dir> (Explicit working directory)",
    ],
  },
];

export default function CliReferencePage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-border pb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">
          Developer Tooling
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          CLI Command Reference
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          The Nativra CLI provides non-destructive, source-first commands to install, diff, update, and diagnose components in your project.
        </p>
      </div>

      <div className="space-y-6">
        {COMMANDS.map((c) => (
          <div
            key={c.cmd}
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-zinc-400 dark:hover:border-zinc-700"
          >
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              <pre className="font-mono text-sm font-semibold text-foreground">
                {c.cmd}
              </pre>
            </div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
            {c.flags.length > 0 && (
              <div className="mt-3 border-t border-border pt-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Flags:
                </span>
                <ul className="mt-1 space-y-1">
                  {c.flags.map((f) => (
                    <li key={f} className="font-mono text-[11px] text-muted-foreground">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
