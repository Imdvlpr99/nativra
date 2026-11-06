"use client";

import React, { useState } from "react";
import { Check, Copy, FileCode } from "lucide-react";
import type { SourceFile } from "@nativra/registry-schema";

interface CodeViewerProps {
  files: SourceFile[];
  defaultTarget?: "nativewind" | "stylesheet";
}

export function CodeViewer({ files, defaultTarget = "nativewind" }: CodeViewerProps) {
  const [selectedTarget, setSelectedTarget] = useState<"nativewind" | "stylesheet">(defaultTarget);
  const [copied, setCopied] = useState(false);

  // Find file matching selected target or fallback to first file
  const activeFile =
    files.find((f) => f.target === selectedTarget) ||
    files[0];

  const availableTargets = Array.from(new Set(files.map((f) => f.target).filter(Boolean))) as (
    | "nativewind"
    | "stylesheet"
  )[];

  const handleCopy = () => {
    if (!activeFile || !activeFile.content) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!activeFile) {
    return (
      <div className="rounded-xl border border-border p-6 text-center text-sm text-muted-foreground">
        No source code available for this component.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-zinc-950 text-zinc-100 shadow-sm">
      {/* Code Viewer Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-4 py-2.5">
        <div className="flex items-center gap-2">
          {/* Target Tabs */}
          {availableTargets.length > 0 && (
            <div className="flex rounded-lg bg-zinc-950 p-1">
              {availableTargets.map((target) => (
                <button
                  key={target}
                  onClick={() => setSelectedTarget(target)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                    selectedTarget === target
                      ? "bg-zinc-800 text-white shadow-sm font-semibold"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {target === "nativewind" ? "NativeWind" : "StyleSheet"}
                </button>
              ))}
            </div>
          )}

          <div className="hidden sm:flex items-center gap-1.5 pl-2 font-mono text-xs text-zinc-400">
            <FileCode className="h-3.5 w-3.5 text-zinc-500" />
            <span>{activeFile.path}</span>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
          aria-label="Copy source code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-zinc-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Display */}
      <div className="max-h-[500px] overflow-auto p-4 font-mono text-xs leading-relaxed">
        <pre className="text-zinc-200 whitespace-pre">
          <code>{activeFile.content || "// File content empty"}</code>
        </pre>
      </div>
    </div>
  );
}
