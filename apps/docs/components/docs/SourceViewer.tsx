"use client";

import React, { useId, useState } from "react";
import { CopyButton } from "./CopyButton";

export interface HighlightedFile {
  path: string;
  target?: "nativewind" | "stylesheet";
  code: string;
  /** shiki HTML produced at build time */
  html: string;
}

const LABEL = { nativewind: "NativeWind", stylesheet: "StyleSheet" } as const;

/** Source files of an item, tabbed by styling target. Highlighting happens on the server. */
export function SourceViewer({ files }: { files: HighlightedFile[] }) {
  const targets = Array.from(new Set(files.map((f) => f.target).filter(Boolean))) as Array<"nativewind" | "stylesheet">;
  const [target, setTarget] = useState(targets[0]);
  const baseId = useId();
  const visible = target ? files.filter((f) => !f.target || f.target === target) : files;

  if (files.length === 0) return <p className="text-sm text-muted-foreground">No source files.</p>;

  return (
    <div className="space-y-3">
      {targets.length > 1 && (
        <div role="tablist" aria-label="Styling target" className="inline-flex rounded-md border border-border p-0.5">
          {targets.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              id={`${baseId}-${t}`}
              aria-selected={target === t}
              aria-controls={`${baseId}-panel`}
              onClick={() => setTarget(t)}
              className={`rounded px-3 py-1 text-sm transition-colors ${
                target === t ? "bg-foreground font-medium text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {LABEL[t]}
            </button>
          ))}
        </div>
      )}
      <div id={`${baseId}-panel`} role={targets.length > 1 ? "tabpanel" : undefined} aria-labelledby={target ? `${baseId}-${target}` : undefined} className="space-y-3">
        {visible.map((f) => (
          <figure key={`${f.target}-${f.path}`} className="overflow-hidden rounded-lg border border-code-border bg-code text-code-fg">
            <figcaption className="flex items-center justify-between border-b border-code-border py-1 pl-4 pr-1">
              <span className="font-mono text-xs text-code-muted">{f.path.split("/").pop()}</span>
              <CopyButton value={f.code} label={`Copy ${f.path.split("/").pop()}`} tone="code" />
            </figcaption>
            <div
              className="max-h-[32rem] overflow-auto p-4 font-mono text-[13px] leading-relaxed [&_pre]:!bg-transparent"
              dangerouslySetInnerHTML={{ __html: f.html }}
            />
          </figure>
        ))}
      </div>
    </div>
  );
}
