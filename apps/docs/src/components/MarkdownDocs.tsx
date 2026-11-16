import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { normalizeLang } from "@/lib/highlight";
import { Highlighted } from "./ui/Code";
import { CopyButton } from "./ui/CopyButton";

const components: Components = {
  // The page renders its own title.
  h1: () => null,
  h2: ({ children }) => <h3>{children}</h3>,
  h3: ({ children }) => <h4>{children}</h4>,
  pre: ({ children }) => <>{children}</>,
  code: ({ children, className }) => {
    const lang = /language-([\w-]+)/.exec(className ?? "")?.[1];
    const text = String(children ?? "");
    if (!lang && !text.includes("\n")) return <code>{children}</code>;
    return (
      <figure className="not-prose my-5 overflow-hidden rounded-xl border border-code-border bg-code text-code-fg">
        <figcaption className="flex h-10 items-center justify-between border-b border-code-border pl-4 pr-1.5">
          <span className="font-mono text-xs text-code-muted">{lang ?? "text"}</span>
          <CopyButton value={text.replace(/\n$/, "")} label="Copy code" onDark />
        </figcaption>
        <Highlighted code={text} lang={normalizeLang(lang)} className="px-4 py-3.5" />
      </figure>
    );
  },
  table: ({ children }) => (
    <div className="panel my-5 overflow-x-auto">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-b border-border bg-surface text-xs text-muted-foreground">{children}</thead>,
  th: ({ children }) => <th className="px-4 py-2 font-medium">{children}</th>,
  td: ({ children }) => <td className="border-t border-border px-4 py-2 align-top">{children}</td>,
};

/** YAML front matter at the top of a docs.mdx (title, description) is metadata, not content. */
const FRONT_MATTER = /^﻿?---\r?\n[\s\S]*?\r?\n---\r?\n/;

/** Renders registry docs.mdx and CHANGELOG.md. Raw HTML in the Markdown is never rendered. */
export function MarkdownDocs({ source }: { source: string }) {
  return (
    <div className="prose-docs space-y-4">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {source.replace(FRONT_MATTER, "")}
      </ReactMarkdown>
    </div>
  );
}
