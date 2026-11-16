import React, { useEffect, useRef } from "react";
import { AlertTriangle, Info, XCircle } from "lucide-react";

export interface ConsoleEntry {
  id: number;
  level: "log" | "warn" | "error";
  text: string;
  count: number;
}

const LEVEL = {
  log: { Icon: Info, cls: "text-code-fg", label: "Log" },
  warn: { Icon: AlertTriangle, cls: "text-amber-300", label: "Warning" },
  error: { Icon: XCircle, cls: "text-red-400", label: "Error" },
} as const;

/** The app's console output, kept apart from CLI output. Repeated messages are grouped. */
export function Console({ entries }: { entries: ConsoleEntry[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="flex h-full items-center justify-center bg-code px-6 text-center font-mono text-[12.5px] text-code-muted">
        Nothing logged yet. Add <span className="mx-1 text-code-fg">console.log(&quot;hi&quot;)</span> to App.tsx to see it here.
      </div>
    );
  }
  return (
    <div ref={scroller} className="h-full overflow-y-auto bg-code py-1 font-mono text-[12.5px]" role="log" aria-live="polite" aria-label="App console">
      {entries.map((e) => {
        const { Icon, cls, label } = LEVEL[e.level];
        return (
          <div
            key={e.id}
            className={`flex items-start gap-2 border-b border-code-border/60 px-4 py-1.5 ${e.level === "error" ? "bg-red-500/[0.06]" : e.level === "warn" ? "bg-amber-400/[0.05]" : ""}`}
          >
            <Icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${cls}`} aria-label={label} />
            <span className={`min-w-0 flex-1 whitespace-pre-wrap break-words ${cls}`}>{e.text}</span>
            {e.count > 1 && (
              <span className="shrink-0 rounded-full bg-white/10 px-1.5 text-[11px] text-code-fg" aria-label={`repeated ${e.count} times`}>
                {e.count}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
