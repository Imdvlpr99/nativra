import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders a registry item's Markdown docs (hydrated from its docs.mdx at registry build time).
 * Raw HTML is not rendered (react-markdown escapes it by default).
 */
const components: Components = {
  // The page already renders the item title and description.
  h1: () => null,
  h2: ({ children }) => (
    <h3 className="pt-4 text-base font-semibold tracking-tight text-foreground">{children}</h3>
  ),
  h3: ({ children }) => <h4 className="pt-2 text-sm font-semibold text-foreground">{children}</h4>,
  p: ({ children }) => <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>,
  ul: ({ children }) => <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">{children}</ol>,
  a: ({ children, href }) => (
    <a href={href} className="font-medium text-foreground underline underline-offset-4 hover:text-sky-500">
      {children}
    </a>
  ),
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-xl border border-border bg-muted/40 p-4 text-xs leading-relaxed">
      {children}
    </pre>
  ),
  code: ({ children, className }) =>
    className ? (
      <code className={`${className} font-mono text-foreground`}>{children}</code>
    ) : (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">{children}</code>
    ),
  table: ({ children }) => (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-border bg-muted/50 font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </thead>
  ),
  th: ({ children }) => <th className="px-4 py-2.5">{children}</th>,
  td: ({ children }) => <td className="border-t border-border px-4 py-2.5 text-muted-foreground">{children}</td>,
};

export function MarkdownDocs({ source }: { source: string }) {
  return (
    <div className="space-y-3">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
