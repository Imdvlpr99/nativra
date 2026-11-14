"use client";

import React, { useEffect, useId, useState } from "react";
import Link from "next/link";
import { CommandLine } from "./CopyButton";

const RUNNERS = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  bun: "bunx",
} as const;
type Runner = keyof typeof RUNNERS;
const RUNNER_KEY = "nativra-docs-runner";

export interface InstallInfo {
  id: string;
  /** Destination folder in a default project, e.g. "components/ui" */
  destination: string;
  files: Array<{ name: string; target?: string }>;
  registryDeps: Array<{ id: string; name: string; href: string }>;
  npmDeps: Array<{ package: string; version: string; peer?: boolean }>;
  importSnippet?: string;
  isTheme: boolean;
}

/** Install instructions: CLI (with package-runner choice) or manual copy steps. */
export function InstallTabs({ info }: { info: InstallInfo }) {
  const [tab, setTab] = useState<"cli" | "manual">("cli");
  const [runner, setRunner] = useState<Runner>("npm");
  const baseId = useId();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RUNNER_KEY);
      if (saved && saved in RUNNERS) setRunner(saved as Runner);
    } catch {
      // Storage unavailable: keep npm.
    }
  }, []);

  const chooseRunner = (r: Runner) => {
    setRunner(r);
    try {
      localStorage.setItem(RUNNER_KEY, r);
    } catch {
      // Ignore: preference just won't persist.
    }
  };

  const cliCommand = info.isTheme
    ? `${RUNNERS[runner]} nativra-cli theme add ${info.id}`
    : `${RUNNERS[runner]} nativra-cli add ${info.id}`;
  const npmInstall = info.npmDeps.length
    ? `npx expo install ${info.npmDeps.map((d) => d.package).join(" ")}`
    : "";

  const tabs = [
    { key: "cli" as const, label: "CLI" },
    { key: "manual" as const, label: "Manual" },
  ];

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Installation method" className="inline-flex rounded-lg border border-border p-0.5">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            id={`${baseId}-${t.key}`}
            aria-selected={tab === t.key}
            aria-controls={`${baseId}-${t.key}-panel`}
            onClick={() => setTab(t.key)}
            className={`rounded-md px-3 py-1 text-sm transition-colors ${
              tab === t.key ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "cli" ? (
        <div role="tabpanel" id={`${baseId}-cli-panel`} aria-labelledby={`${baseId}-cli`} className="space-y-3">
          <div className="flex flex-wrap gap-1" role="radiogroup" aria-label="Package runner">
            {(Object.keys(RUNNERS) as Runner[]).map((r) => (
              <button
                key={r}
                type="button"
                role="radio"
                aria-checked={runner === r}
                onClick={() => chooseRunner(r)}
                className={`rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
                  runner === r ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <CommandLine command={cliCommand} />
          <p className="text-sm text-muted-foreground">
            Writes the {info.files.length > 1 ? "files" : "file"} to <code className="font-mono text-foreground">{info.destination}</code>,
            rewrites imports to your aliases, records hashes in <code className="font-mono text-foreground">nativra.lock.json</code>
            {info.registryDeps.length > 0 && <> and installs {info.registryDeps.length} registry {info.registryDeps.length === 1 ? "dependency" : "dependencies"}</>}.
            Existing files are never overwritten without asking.
          </p>
        </div>
      ) : (
        <div role="tabpanel" id={`${baseId}-manual-panel`} aria-labelledby={`${baseId}-manual`}>
          <ol className="space-y-5">
            {npmInstall && (
              <Step n={1} title="Install npm dependencies">
                <CommandLine command={npmInstall} />
              </Step>
            )}
            {info.registryDeps.length > 0 && (
              <Step n={npmInstall ? 2 : 1} title="Add the registry dependencies first">
                <p className="text-sm text-muted-foreground">
                  {info.registryDeps.map((d, i) => (
                    <React.Fragment key={d.id}>
                      {i > 0 && ", "}
                      <Link href={d.href} className="link">
                        {d.name}
                      </Link>
                    </React.Fragment>
                  ))}
                </p>
              </Step>
            )}
            <Step n={(npmInstall ? 1 : 0) + (info.registryDeps.length ? 1 : 0) + 1} title="Copy the source into your project">
              <p className="text-sm text-muted-foreground">
                Copy {info.files.map((f) => f.name).filter((v, i, a) => a.indexOf(v) === i).join(", ")} from the Source
                section below into <code className="font-mono text-foreground">{info.destination}</code>, choosing the
                NativeWind or StyleSheet version.
              </p>
            </Step>
            {info.importSnippet && (
              <Step n={(npmInstall ? 1 : 0) + (info.registryDeps.length ? 1 : 0) + 2} title="Import it">
                <CommandLine command={info.importSnippet} prompt="" />
              </Step>
            )}
          </ol>
        </div>
      )}
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="relative pl-9">
      <span
        className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full border border-border font-mono text-xs text-muted-foreground"
        aria-hidden="true"
      >
        {n}
      </span>
      <p className="mb-2 text-sm font-medium">{title}</p>
      {children}
    </li>
  );
}
