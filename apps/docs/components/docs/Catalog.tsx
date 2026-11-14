"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";

export interface CatalogEntry {
  id: string;
  name: string;
  description: string;
  href: string;
  status: string;
  tags: string[];
  /** Optional color strip (themes) */
  swatches?: string[];
  /** Optional count line, e.g. "4 dependencies" */
  meta?: string;
}

/** Filterable card grid for one registry type. */
export function Catalog({ entries, noun }: { entries: CatalogEntry[]; noun: string }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const statuses = useMemo(() => ["all", ...Array.from(new Set(entries.map((e) => e.status))).sort()], [entries]);

  const q = query.trim().toLowerCase();
  const shown = entries.filter(
    (e) =>
      (status === "all" || e.status === status) &&
      (!q || e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.tags.some((t) => t.includes(q)))
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Filter ${noun}…`}
            aria-label={`Filter ${noun} by name, description or tag`}
            className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground"
          />
        </div>
        {statuses.length > 2 && (
          <div role="radiogroup" aria-label="Status" className="flex flex-wrap gap-1">
            {statuses.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={status === s}
                onClick={() => setStatus(s)}
                className={`rounded-md px-2.5 py-1 text-xs capitalize transition-colors ${
                  status === s ? "bg-foreground text-background" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <p className="ml-auto text-sm text-muted-foreground" aria-live="polite">
          {shown.length} of {entries.length}
        </p>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Nothing matches “{query}”.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((e) => (
            <li key={e.id}>
              <Link
                href={e.href}
                className="group flex h-full flex-col rounded-lg border border-border p-4 transition-colors hover:border-foreground/30 hover:bg-accent/40"
              >
                {e.swatches && (
                  <span className="mb-3 flex h-8 overflow-hidden rounded-md border border-border" aria-hidden="true">
                    {e.swatches.map((c, i) => (
                      <span key={i} className="flex-1" style={{ background: c }} />
                    ))}
                  </span>
                )}
                <span className="flex items-center justify-between gap-2">
                  <span className="font-medium">{e.name}</span>
                  <ArrowUpRight
                    className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </span>
                <span className="mt-1 line-clamp-2 text-sm text-muted-foreground">{e.description}</span>
                <span className="mt-auto flex flex-wrap items-center gap-1.5 pt-3 text-xs text-muted-foreground">
                  {e.status !== "stable" && (
                    <span className="rounded border border-border px-1.5 py-px capitalize">{e.status}</span>
                  )}
                  {e.meta && <span>{e.meta}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
