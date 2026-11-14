import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { loadHighlight } from "@/lib/highlight";
import { CopyButton } from "@/components/docs/CopyButton";

/**
 * Renders Markdown (registry docs.mdx, CHANGELOG.md) with the docs typography.
 * Code fences are syntax-highlighted at build time; raw HTML is never rendered.
 */
export async function MarkdownDocs({ source }: { source: string }) {
  const highlight = await loadHighlight();

  const components: Components = {
    // The page already renders its own title.
    h1: () => null,
    h2: ({ children }) => <h3 className="pt-4 text-lg font-semibold text-foreground">{children}</h3>,
    h3: ({ children }) => <h4 className="pt-2 text-base font-semibold text-foreground">{children}</h4>,
    p: ({ children }) => <p>{children}</p>,
    a: ({ children, href }) => <a href={href}>{children}</a>,
    pre: ({ children }) => <>{children}</>,
    code: ({ children, className }) => {
      const lang = /language-([\w-]+)/.exec(className ?? "")?.[1];
      const text = String(children ?? "");
      if (!lang && !text.includes("\n")) return <code>{children}</code>;
      return (
        <figure className="not-prose my-4 overflow-hidden rounded-lg border border-code-border bg-code text-code-fg">
          <figcaption className="flex items-center justify-between border-b border-code-border py-1 pl-4 pr-1">
            <span className="font-mono text-xs text-code-muted">{lang ?? "text"}</span>
            <CopyButton value={text.replace(/\n$/, "")} label="Copy code" tone="code" />
          </figcaption>
          <div
            className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed [&_pre]:!bg-transparent"
            dangerouslySetInnerHTML={{ __html: highlight(text, lang ?? "text") }}
          />
        </figure>
      );
    },
    table: ({ children }) => (
      <div className="my-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="border-b border-border bg-muted/40 text-xs text-muted-foreground">{children}</thead>,
    th: ({ children }) => <th className="px-4 py-2 font-medium">{children}</th>,
    td: ({ children }) => <td className="border-t border-border px-4 py-2 align-top">{children}</td>,
  };

  return (
    <div className="prose-docs space-y-4">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
