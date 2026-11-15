import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Search } from "lucide-react";
import { THEME_PRESETS } from "@nativra/theme-engine";
import type { ItemSummary } from "@/lib/data";
import { itemHref } from "@/lib/item-types";

/** Filterable card grid for one item type. */
export function Catalog({ items, noun }: { items: ItemSummary[]; noun: string }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const shown = useMemo(
    () =>
      items.filter(
        (e) => !q || e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.tags.some((t) => t.includes(q))
      ),
    [items, q]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Filter ${noun}…`}
            aria-label={`Filter ${noun} by name, description or tag`}
            className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm placeholder:text-muted-foreground"
          />
        </div>
        <p className="ml-auto text-sm text-muted-foreground" aria-live="polite">
          {shown.length} of {items.length}
        </p>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">Nothing matches “{query}”.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((e) => {
            const theme = e.type === "theme" ? THEME_PRESETS[e.id] : undefined;
            return (
              <li key={e.id}>
                <Link
                  to={itemHref(e.type, e.id)}
                  className="panel group flex h-full flex-col p-4 transition-colors hover:border-brand/40 hover:bg-surface"
                >
                  {theme && (
                    <span className="mb-3 flex h-9 overflow-hidden rounded-lg border border-border" aria-hidden="true">
                      {[theme.light.background, theme.light.primary, theme.light.muted, theme.dark.background, theme.dark.primary].map((c, i) => (
                        <span key={i} className="flex-1" style={{ background: String(c) }} />
                      ))}
                    </span>
                  )}
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-medium">{e.name}</span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  </span>
                  <span className="mt-1 line-clamp-2 text-sm text-muted-foreground">{e.description}</span>
                  {(e.status !== "stable" || e.dependencies.length > 0) && (
                    <span className="mt-auto flex flex-wrap items-center gap-1.5 pt-3 text-xs text-muted-foreground">
                      {e.status !== "stable" && <span className="rounded-full border border-border px-2 capitalize">{e.status}</span>}
                      {e.dependencies.length > 0 && (
                        <span>
                          Uses {e.dependencies.length} registry {e.dependencies.length === 1 ? "item" : "items"}
                        </span>
                      )}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
