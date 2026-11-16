import React, { use } from "react";
import { getHighlighter, toHtml, type CodeLang } from "@/lib/highlight";
import { CopyButton } from "./CopyButton";

/** Highlighted code only (no frame). Suspends until the highlighter is ready. */
export function Highlighted({ code, lang, className = "" }: { code: string; lang: CodeLang; className?: string }) {
  const highlighter = use(getHighlighter());
  return (
    <div
      className={`overflow-x-auto font-mono text-[13px] leading-[1.7] [&_pre]:!bg-transparent ${className}`}
      // Shiki escapes the code; the HTML is generated from trusted source in this repo and the registry.
      dangerouslySetInnerHTML={{ __html: toHtml(highlighter, code, lang) }}
    />
  );
}

/** Editor-style code panel with a file name and a copy button. */
export function CodeBlock({
  code,
  lang = "tsx",
  title,
  maxHeight,
}: {
  code: string;
  lang?: CodeLang;
  title?: string;
  /** Scroll long files instead of growing, e.g. "32rem" */
  maxHeight?: string;
}) {
  return (
    <figure className="overflow-hidden rounded-xl border border-code-border bg-code text-code-fg">
      <figcaption className="flex h-10 items-center justify-between border-b border-code-border pl-4 pr-1.5">
        <span className="font-mono text-xs text-code-muted">{title ?? lang}</span>
        <CopyButton value={code} label={title ? `Copy ${title}` : "Copy code"} onDark />
      </figcaption>
      <div className="overflow-auto px-4 py-3.5" style={maxHeight ? { maxHeight } : undefined}>
        <Highlighted code={code} lang={lang} />
      </div>
    </figure>
  );
}
