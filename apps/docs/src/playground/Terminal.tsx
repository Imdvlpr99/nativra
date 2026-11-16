import React, { useEffect, useRef, useState } from "react";
import { CornerDownLeft } from "lucide-react";
import type { Line, Tone } from "./cli";

/** Tones on the dark code panel; every one is >= 4.5:1 against it. */
export const TONE: Record<Tone, string> = {
  plain: "text-code-fg",
  muted: "text-code-muted",
  info: "text-sky-300",
  success: "text-emerald-400",
  warn: "text-amber-300",
  error: "text-red-400",
  command: "text-code-fg font-semibold",
  accent: "text-cyan-300",
};

const COMPLETIONS = [
  "npx nativra-cli add ",
  "npx nativra-cli remove ",
  "npx nativra-cli list",
  "npx nativra-cli search ",
  "npx nativra-cli info ",
  "npx nativra-cli theme add ",
  "npx nativra-cli theme list",
  "npx nativra-cli style add ",
  "npx nativra-cli style list",
  "npx nativra-cli init --force --target ",
  "help",
  "clear",
  "tree",
  "reset",
];

/**
 * The playground shell's terminal: command history (↑/↓), Tab completion, Ctrl+L to clear, and
 * clickable suggestions while it's still quiet.
 */
export function Terminal({
  lines,
  busy,
  suggestions,
  onCommand,
}: {
  lines: Array<Line & { id: number }>;
  busy: boolean;
  suggestions: string[];
  onCommand: (command: string) => void;
}) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [lines, busy]);

  const run = (command: string) => {
    if (!command || busy) return;
    setHistory((h) => [...h.filter((c) => c !== command), command].slice(-50));
    setCursor(null);
    setInput("");
    onCommand(command);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      run(input.trim());
    } else if (e.key === "ArrowUp" && history.length > 0) {
      e.preventDefault();
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setInput(history[next]!);
    } else if (e.key === "ArrowDown" && cursor !== null) {
      e.preventDefault();
      const next = cursor + 1;
      setCursor(next >= history.length ? null : next);
      setInput(next >= history.length ? "" : history[next]!);
    } else if (e.key === "Tab" && input) {
      // Only complete when there's something to complete, so Tab still moves focus otherwise.
      const match = COMPLETIONS.find((c) => c.startsWith(input) && c !== input);
      if (match) {
        e.preventDefault();
        setInput(match);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      onCommand("clear");
    }
  };

  return (
    <div
      className="flex h-full min-h-0 flex-col bg-code font-mono text-[12.5px] leading-relaxed"
      // Focus the prompt on click, but not when the click ends a text selection (copying output).
      onClick={() => {
        if (!window.getSelection()?.toString()) field.current?.focus();
      }}
    >
      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto px-4 py-3" role="log" aria-live="polite" aria-label="Terminal output">
        {lines.map((l) => (
          <div key={l.id} className={`whitespace-pre-wrap break-words ${TONE[l.tone ?? "plain"]}`}>
            {l.text || " "}
          </div>
        ))}
        {busy && (
          <div className="mt-1 flex items-center gap-2 text-code-muted">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 motion-reduce:animate-none" aria-hidden="true" />
            Working…
          </div>
        )}
        {!busy && suggestions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Suggested commands">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  run(s);
                }}
                className="cursor-pointer rounded-md border border-code-border bg-white/[0.03] px-2 py-1 text-[11.5px] text-code-fg transition-colors duration-150 hover:border-cyan-300/50 hover:bg-cyan-300/10"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 border-t border-code-border px-4 py-2 focus-within:bg-white/[0.02] focus-within:ring-2 focus-within:ring-inset focus-within:ring-cyan-300/60">
        <span className="select-none text-emerald-400" aria-hidden="true">
          ~/app $
        </span>
        <input
          ref={field}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          // readOnly rather than disabled: a disabled input drops keyboard focus to <body>.
          readOnly={busy}
          aria-busy={busy}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          aria-label="Terminal command"
          placeholder="Type a command, or try: npx nativra-cli add button"
          className="min-w-0 flex-1 bg-transparent text-code-fg outline-none placeholder:text-code-muted/80 focus-visible:ring-0 focus-visible:ring-offset-0 read-only:opacity-60"
        />
        <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-code-muted" aria-hidden="true" />
      </div>
    </div>
  );
}
