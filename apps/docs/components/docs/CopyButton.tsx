"use client";

import React, { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

/** Icon button that copies `value`; announces success to screen readers. */
export function CopyButton({ value, label = "Copy", className = "" }: { value: string; label?: string; className?: string }) {
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

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground ${className}`}
      aria-label={label}
      title={label}
    >
      {state === "copied" ? (
        <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4" aria-hidden="true" />
      )}
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? "Copied to clipboard" : state === "failed" ? "Copy failed" : ""}
      </span>
    </button>
  );
}

/** A single shell/code line with a copy button. */
export function CommandLine({ command, prompt = "$" }: { command: string; prompt?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 py-1 pl-4 pr-1 font-mono text-[13px]">
      {prompt && (
        <span className="select-none text-muted-foreground" aria-hidden="true">
          {prompt}
        </span>
      )}
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap py-1.5">{command}</code>
      <CopyButton value={command} label={`Copy: ${command}`} />
    </div>
  );
}
