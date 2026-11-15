import React, { useId, useState } from "react";
import { Link } from "react-router";
import type { ItemSummary } from "@/lib/data";
import { findItem } from "@/lib/data";
import { TYPE_META, installCommand, itemHref } from "@/lib/item-types";
import { CommandLine } from "./ui/CopyButton";

function baseName(path: string) {
  return (path.split("/").pop() ?? path).replace(/\.(tsx?|jsx?)$/, "");
}

const camel = (s: string) => s.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

/** The import line for an item, using the canonical aliases the CLI rewrites to yours. */
export function importSnippet(item: ItemSummary): string | undefined {
  const file = item.files[0];
  if (!file) return undefined;
  const name = baseName(file.path);
  switch (item.type) {
    case "hook":
      return `import { ${camel(name)} } from "@/hooks/${name}";`;
    case "utility":
      return `import { ${item.id} } from "@/lib/utils";`;
    case "theme":
      return `import { themeColors } from "@/lib/themes/theme";`;
    default:
      return `import { ${name} } from "@/components/ui/${name}";`;
  }
}

/** Install instructions: the CLI command, or manual copy steps. */
export function InstallTabs({ item }: { item: ItemSummary }) {
  const [tab, setTab] = useState<"cli" | "manual">("cli");
  const baseId = useId();
  const dir = TYPE_META[item.type].dir;
  const deps = item.dependencies.map((id) => findItem(id)).filter((d): d is ItemSummary => Boolean(d));
  const npm = item.npmDependencies.filter((d) => !d.peer);
  const snippet = importSnippet(item);
  const fileNames = Array.from(new Set(item.files.map((f) => f.path.split("/").pop() ?? f.path)));

  let n = 0;
  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Installation method" className="inline-flex rounded-lg border border-border bg-surface p-0.5">
        {(["cli", "manual"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            id={`${baseId}-${t}`}
            aria-selected={tab === t}
            aria-controls={`${baseId}-${t}-panel`}
            onClick={() => setTab(t)}
            className={`rounded-md px-3 py-1 text-sm transition-colors ${
              tab === t ? "bg-background font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "cli" ? "CLI" : "Manual"}
          </button>
        ))}
      </div>

      {tab === "cli" ? (
        <div role="tabpanel" id={`${baseId}-cli-panel`} aria-labelledby={`${baseId}-cli`} className="space-y-3">
          <CommandLine command={installCommand(item.type, item.id)} switcher />
          <p className="text-sm text-muted-foreground">
            Writes {fileNames.length > 1 ? "the files" : <code className="code-inline">{fileNames[0]}</code>} to{" "}
            <code className="code-inline">{dir}</code>, rewrites imports to your aliases and records hashes in{" "}
            <code className="code-inline">nativra.lock.json</code>
            {deps.length > 0 && (
              <>
                , along with {deps.length} registry {deps.length === 1 ? "dependency" : "dependencies"}
              </>
            )}
            . Existing files are never overwritten without asking.
          </p>
        </div>
      ) : (
        <ol role="tabpanel" id={`${baseId}-manual-panel`} aria-labelledby={`${baseId}-manual`} className="space-y-5">
          {npm.length > 0 && (
            <ManualStep n={++n} title="Install the npm packages">
              <CommandLine command={`npx expo install ${npm.map((d) => d.package).join(" ")}`} />
            </ManualStep>
          )}
          {deps.length > 0 && (
            <ManualStep n={++n} title="Add the registry dependencies first">
              <p className="text-sm text-muted-foreground">
                {deps.map((d, i) => (
                  <React.Fragment key={d.id}>
                    {i > 0 && ", "}
                    <Link to={itemHref(d.type, d.id)} className="link">
                      {d.name}
                    </Link>
                  </React.Fragment>
                ))}
              </p>
            </ManualStep>
          )}
          <ManualStep n={++n} title="Copy the source">
            <p className="text-sm text-muted-foreground">
              Copy {fileNames.join(", ")} from <strong className="font-medium text-foreground">Source</strong> below into{" "}
              <code className="code-inline">{dir}</code>, picking the NativeWind or StyleSheet version.
            </p>
          </ManualStep>
          {snippet && (
            <ManualStep n={++n} title="Import it">
              <CommandLine command={snippet} prompt="" />
            </ManualStep>
          )}
        </ol>
      )}
    </div>
  );
}

function ManualStep({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="relative pl-10">
      <span className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs font-semibold" aria-hidden="true">
        {n}
      </span>
      <p className="mb-2 text-sm font-medium">{title}</p>
      {children}
    </li>
  );
}
