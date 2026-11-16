import React from "react";
import { Link } from "react-router";
import { AlertTriangle, ArrowRight, Info, Lightbulb } from "lucide-react";

/** Building blocks for hand-written pages. */

export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  meta?: string[];
}) {
  return (
    <header className="mb-14 space-y-4 border-b border-border pb-10">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="text-[2.125rem] font-bold leading-tight sm:text-[2.75rem]">{title}</h1>
      {description && <p className="max-w-[44rem] text-lg leading-relaxed text-muted-foreground">{description}</p>}
      {meta && meta.length > 0 && (
        <ul className="flex flex-wrap gap-2 pt-1">
          {meta.map((m) => (
            <li key={m} className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
              {m}
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

export function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-16 space-y-5 first:mt-0">
      <h2 id={id} data-title={title} className="group flex items-baseline gap-2 text-2xl font-semibold">
        {title}
        <a
          href={`#${id}`}
          className="text-base font-normal text-muted-foreground opacity-0 transition-opacity hover:text-brand focus-visible:opacity-100 group-hover:opacity-100"
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

/** Inline code. */
export function C({ children }: { children: React.ReactNode }) {
  return <code className="code-inline">{children}</code>;
}

/** Internal link styled for prose. */
export function A({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="link">
      {children}
    </Link>
  );
}

const CALLOUTS = {
  note: { icon: Info, label: "Note", cls: "border-border bg-surface", iconCls: "text-muted-foreground" },
  tip: { icon: Lightbulb, label: "Tip", cls: "border-brand/30 bg-brand/[0.05]", iconCls: "text-brand" },
  warning: { icon: AlertTriangle, label: "Warning", cls: "border-amber-500/40 bg-amber-500/[0.06]", iconCls: "text-amber-700 dark:text-amber-400" },
} as const;

export function Callout({ type = "note", title, children }: { type?: keyof typeof CALLOUTS; title?: string; children: React.ReactNode }) {
  const c = CALLOUTS[type];
  const Icon = c.icon;
  return (
    <aside role="note" className={`flex gap-3 rounded-xl border p-4 text-[15px] ${c.cls}`}>
      <Icon className={`mt-[3px] h-4 w-4 shrink-0 ${c.iconCls}`} aria-hidden="true" />
      <div className="min-w-0 space-y-1 leading-relaxed text-foreground/80 [&_code]:code-inline">
        <p className="font-semibold text-foreground">{title ?? c.label}</p>
        <div>{children}</div>
      </div>
    </aside>
  );
}

/** Numbered steps. Children must be <Step> elements. */
export function Steps({ children }: { children: React.ReactNode }) {
  return <ol data-toc-skip className="space-y-10 [counter-reset:step]">{children}</ol>;
}

export function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="relative grid gap-3 pl-11 [counter-increment:step] before:absolute before:left-0 before:top-0 before:flex before:h-7 before:w-7 before:items-center before:justify-center before:rounded-lg before:bg-muted before:text-xs before:font-semibold before:text-foreground before:content-[counter(step)] after:absolute after:bottom-[-2rem] after:left-[13px] after:top-9 after:w-px after:bg-border last:after:hidden">
      <h3 className="text-base font-semibold leading-7">{title}</h3>
      {children}
    </li>
  );
}

/** Term / description list for flags, keys and checks. */
export function Defs({ items }: { items: Array<{ term: React.ReactNode; desc: React.ReactNode }> }) {
  return (
    <dl className="panel divide-y divide-border overflow-hidden">
      {items.map((it, i) => (
        <div key={i} className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(0,13rem)_1fr] sm:gap-6">
          <dt className="font-mono text-[13px] leading-6 text-foreground">{it.term}</dt>
          <dd className="text-[15px] leading-relaxed text-muted-foreground [&_code]:code-inline">{it.desc}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Grid of link cards. */
export function LinkCards({ items }: { items: Array<{ to: string; title: string; body: string; meta?: string }> }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((it) => (
        <li key={it.to}>
          <Link to={it.to} className="panel group flex h-full flex-col gap-1.5 p-5 transition-colors hover:border-brand/40 hover:bg-surface">
            <span className="flex items-center justify-between gap-3 font-semibold">
              {it.title}
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-brand" aria-hidden="true" />
            </span>
            <span className="text-[15px] text-muted-foreground">{it.body}</span>
            {it.meta && <span className="mt-auto pt-2 text-xs text-muted-foreground">{it.meta}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
