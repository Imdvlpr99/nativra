import type { Metadata } from "next";
import { Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "CLI Command Reference",
  description: "Complete command-line interface reference for Nativra",
};

const COMMANDS = [
  {
    cmd: "npx nativra init",
    desc: "Initialize Nativra in an Expo or React Native project. Detects TypeScript, dependencies, and prompts for your preferred styling target (NativeWind or StyleSheet).",
    flags: ["--yes (Accept defaults without prompting)", "--cwd <dir> (Explicit working directory)"],
  },
  {
    cmd: "npx nativra add <...components>",
    desc: "Install one or more components, blocks, or hooks into your project. Recursively resolves dependencies and records cryptographic file hashes in nativra.json.",
    flags: [
      "--yes (Skip overwrite confirmation)",
      "--dry-run (Preview changes without writing to disk)",
      "--registry <url-or-name> (Specify alternate registry)",
    ],
  },
  {
    cmd: "npx nativra list",
    desc: "List all items available in the configured registry (components, hooks, blocks, themes).",
    flags: ["--registry <name>"],
  },
  {
    cmd: "npx nativra search <query>",
    desc: "Search registry items by keyword, tag, or component name.",
    flags: [],
  },
  {
    cmd: "npx nativra info <id>",
    desc: "Display detailed metadata, version, styling targets, platform support, and file list for any registry item.",
    flags: [],
  },
  {
    cmd: "npx nativra diff [component]",
    desc: "Compare your installed local component files with the upstream registry source to inspect any modifications.",
    flags: [],
  },
  {
    cmd: "npx nativra update [component]",
    desc: "Safely update installed components to their latest registry version. Detects local modifications and warns before overwriting.",
    flags: ["--force (Overwrite local modifications)"],
  },
  {
    cmd: "npx nativra doctor",
    desc: "Diagnose your project environment: verifies package.json, Expo setup, TypeScript, and nativra.json integrity.",
    flags: [],
  },
  {
    cmd: "npx nativra theme list",
    desc: "List available theme token sets in the registry (zinc, dark-slate, midnight).",
    flags: [],
  },
  {
    cmd: "npx nativra theme add <theme-id>",
    desc: "Install a theme into your project (e.g. lib/themes/midnight.ts or CSS variables).",
    flags: [],
  },
  {
    cmd: "npx nativra registry add <name> <url>",
    desc: "Register a custom private or community registry URL.",
    flags: [],
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
