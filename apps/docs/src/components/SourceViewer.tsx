import React, { useId, useState } from "react";
import type { StylingTarget } from "@/lib/data";
import { langFromPath } from "@/lib/highlight";
import { CodeBlock } from "./ui/Code";

const LABEL: Record<StylingTarget, string> = { nativewind: "NativeWind", stylesheet: "StyleSheet" };

/** An item's source files, tabbed by styling target. */
export function SourceViewer({ files }: { files: Array<{ path: string; target?: StylingTarget; content?: string }> }) {
  const targets = Array.from(new Set(files.map((f) => f.target).filter((t): t is StylingTarget => Boolean(t))));
  const [target, setTarget] = useState<StylingTarget | undefined>(targets[0]);
  const baseId = useId();
  const visible = target ? files.filter((f) => !f.target || f.target === target) : files;

  if (files.length === 0) return <p className="text-sm text-muted-foreground">No source files.</p>;

  return (
    <div className="space-y-3">
      {targets.length > 1 && (
        <TargetTabs targets={targets} value={target} onChange={setTarget} baseId={baseId} />
      )}
      <div id={`${baseId}-panel`} role={targets.length > 1 ? "tabpanel" : undefined} className="space-y-3">
        {visible.map((f) => (
          <CodeBlock
            key={`${f.target ?? "all"}-${f.path}`}
            code={f.content ?? ""}
            lang={langFromPath(f.path)}
            title={f.path.split("/").pop() ?? f.path}
            maxHeight="34rem"
          />
        ))}
      </div>
    </div>
  );
}

export function TargetTabs({
  targets,
  value,
  onChange,
  baseId,
}: {
  targets: StylingTarget[];
  value: StylingTarget | undefined;
  onChange: (t: StylingTarget) => void;
  baseId: string;
}) {
  return (
    <div role="tablist" aria-label="Styling target" className="inline-flex rounded-lg border border-border bg-surface p-0.5">
      {targets.map((t) => (
        <button
          key={t}
          type="button"
          role="tab"
          id={`${baseId}-${t}`}
          aria-selected={value === t}
          aria-controls={`${baseId}-panel`}
          onClick={() => onChange(t)}
          className={`rounded-md px-3 py-1 text-sm transition-colors ${
            value === t ? "bg-background font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {LABEL[t]}
        </button>
      ))}
    </div>
  );
}
