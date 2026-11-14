import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Info, Lightbulb } from "lucide-react";
import { highlight, type CodeLang } from "@/lib/highlight";
import { CopyButton } from "./CopyButton";

/** Building blocks for hand-written guide pages. All server components except the copy button. */

export function DocsHeader({
  eyebrow,
  title,
  description,
  meta,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  meta?: string;
}) {
  return (
    <header className="mb-10 space-y-3 border-b border-border pb-8">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="text-3xl font-semibold sm:text-[2.25rem]">{title}</h1>
      {description && <p className="max-w-[46rem] text-lg leading-relaxed text-muted-foreground">{description}</p>}
      {meta && <p className="font-mono text-xs text-muted-foreground">{meta}</p>}
    </header>
  );
}

/** A titled section with an anchor link on hover. */
export function DocsSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-12 space-y-4 first:mt-0">
      <h2 id={id} data-title={title} className="group flex items-center gap-2 text-xl font-semibold sm:text-2xl">
        {title}
        <a
          href={`#${id}`}
          className="text-base font-normal text-muted-foreground opacity-0 transition-opacity hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
          aria-label={`Link to section: ${title}`}
        >
          #
        </a>
      </h2>
      {children}
    </section>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <div className="prose-docs">{children}</div>;
}

/** Syntax-highlighted code block with an optional filename and a copy button. */
export async function CodeBlock({ code, lang = "tsx", title }: { code: string; lang?: CodeLang; title?: string }) {
  const html = await highlight(code, lang);
  return (
    <figure className="overflow-hidden rounded-lg border border-code-border bg-code text-code-fg">
      <figcaption className="flex items-center justify-between border-b border-code-border py-1 pl-4 pr-1">
        <span className="font-mono text-xs text-code-muted">{title ?? lang}</span>
        <CopyButton value={code} label={title ? `Copy ${title}` : "Copy code"} tone="code" />
      </figcaption>
      <div
        className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed [&_pre]:!bg-transparent"
        // shiki output: code is escaped by the highlighter at build time
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}

const CALLOUTS = {
  note: { icon: Info, label: "Note", cls: "border-border bg-muted/40" },
  tip: { icon: Lightbulb, label: "Tip", cls: "border-brand/30 bg-brand/5" },
  warning: { icon: AlertTriangle, label: "Warning", cls: "border-amber-500/40 bg-amber-500/5" },
} as const;

export function Callout({ type = "note", title, children }: { type?: keyof typeof CALLOUTS; title?: string; children: React.ReactNode }) {
  const c = CALLOUTS[type];
  const Icon = c.icon;
  return (
    <aside role="note" className={`flex gap-3 rounded-lg border p-4 text-[15px] ${c.cls}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-foreground" aria-hidden="true" />
      <div className="min-w-0 space-y-1 leading-relaxed text-muted-foreground">
        <p className="font-medium text-foreground">{title ?? c.label}</p>
        <div className="[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-foreground">
          {children}
        </div>
      </div>
    </aside>
  );
}

/** Numbered steps with a connecting rail. Children should be <Step> elements. */
export function Steps({ children }: { children: React.ReactNode }) {
  return <ol data-toc-skip className="relative space-y-10 border-l border-border pl-8 [counter-reset:step]">{children}</ol>;
}

export function Step({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    <li className="relative space-y-3 [counter-increment:step] before:absolute before:-left-[45px] before:top-0 before:flex before:h-7 before:w-7 before:items-center before:justify-center before:rounded-full before:border before:border-border before:bg-background before:font-mono before:text-xs before:text-muted-foreground before:content-[counter(step)]">
      <h3 id={id} className="text-lg font-semibold leading-7">
        {title}
      </h3>
      {children}
    </li>
  );
}

/** Two-column definition grid for options, flags and config keys. */
export function Defs({ items }: { items: Array<{ term: React.ReactNode; desc: React.ReactNode }> }) {
  return (
    <dl className="divide-y divide-border rounded-lg border border-border">
      {items.map((it, i) => (
        <div key={i} className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-6">
          <dt className="font-mono text-[13px] text-foreground">{it.term}</dt>
          <dd className="text-[15px] text-muted-foreground">{it.desc}</dd>
        </div>
      ))}
    </dl>
  );
}

/** "Next" card that ends every guide, to make the docs read like a course. */
export function NextStep({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="group mt-14 flex items-center justify-between gap-6 rounded-lg border border-border p-5 transition-colors hover:border-foreground/30"
    >
      <span>
        <span className="eyebrow">Next</span>
        <span className="mt-1 block text-lg font-semibold text-foreground">{title}</span>
        <span className="block text-[15px] text-muted-foreground">{description}</span>
      </span>
      <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden="true" />
    </Link>
  );
}
