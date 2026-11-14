"use client";

import React, { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { RUNNERS, forRunner, useRunner, type Runner } from "./runner";

/** Icon button that copies `value`; announces the result to screen readers. */
export function CopyButton({
  value,
  label = "Copy",
  className = "",
  tone = "default",
}: {
  value: string;
  label?: string;
  className?: string;
  /** "code" for use on dark code surfaces */
  tone?: "default" | "code";
}) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const t = setTimeout(() => setState("idle"), 1800);
    return () => clearTimeout(t);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
  };

  const toneClass =
    tone === "code"
      ? "text-code-muted hover:bg-white/10 hover:text-code-fg"
      : "text-muted-foreground hover:bg-accent hover:text-foreground";

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors ${toneClass} ${className}`}
      aria-label={label}
      title={label}
    >
      {state === "copied" ? (
        <Check className="h-4 w-4 text-green-400" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? "Copied to clipboard" : state === "failed" ? "Copy failed" : ""}
      </span>
    </button>
  );
}

/**
 * A copyable shell command on a dark surface. npm-style commands follow the shared
 * package-runner preference; pass `switcher` to show the npm/pnpm/yarn/bun selector.
 */
export function CommandLine({ command, switcher = false, prompt = "$" }: { command: string; switcher?: boolean; prompt?: string }) {
  const [runner, setRunner] = useRunner();
  const adaptable = /^(npx|npm install) /.test(command);
  const shown = adaptable ? forRunner(command, runner) : command;

  return (
    <div className="overflow-hidden rounded-lg border border-code-border bg-code text-code-fg">
      {switcher && adaptable && (
        <div role="radiogroup" aria-label="Package manager" className="flex gap-1 border-b border-code-border px-2 py-1.5">
          {(Object.keys(RUNNERS) as Runner[]).map((r) => (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={runner === r}
              onClick={() => setRunner(r)}
              className={`rounded px-2 py-0.5 font-mono text-xs transition-colors ${
                runner === r ? "bg-white/10 text-code-fg" : "text-code-muted hover:text-code-fg"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-3 py-1 pl-4 pr-1 font-mono text-[13px]">
        {prompt && (
          <span className="select-none text-green-400" aria-hidden="true">
            {prompt}
          </span>
        )}
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap py-2">{shown}</code>
        <CopyButton value={shown} label={`Copy command: ${shown}`} tone="code" />
      </div>
    </div>
  );
}
