import React, { useMemo, useState } from "react";
import { Check, Plus, Search } from "lucide-react";
import { ITEMS, type ItemType } from "@/lib/data";
import { TYPE_META } from "@/lib/item-types";

const ADDABLE: ItemType[] = ["component", "block", "template", "hook"];

/**
 * Browse the registry and install with one click. Each click runs the real
 * `npx nativra-cli add <id>` in the terminal, so the panel also teaches the command.
 */
export function AddPanel({
  installed,
  busy,
  onAdd,
}: {
  installed: ReadonlySet<string>;
  busy: boolean;
  onAdd: (id: string) => void;
}) {
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ADDABLE.map((type) => ({
      type,
      items: ITEMS.filter(
        (i) =>
          i.type === type &&
          (!q || [i.id, i.name, i.description, ...i.tags].some((s) => s.toLowerCase().includes(q)))
      ),
    })).filter((g) => g.items.length > 0);
  }, [query]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-border p-2">
        <label htmlFor="pg-add-search" className="sr-only">
          Search components, blocks, templates and hooks
        </label>
        <div className="flex items-center gap-2 rounded-md border border-input bg-background px-2 focus-within:ring-2 focus-within:ring-ring">
          <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            id="pg-add-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the registry"
            autoComplete="off"
            spellCheck={false}
            className="h-8 min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pb-2">
        {groups.length === 0 ? (
          <p className="px-3 py-6 text-center text-[13px] text-muted-foreground">
            Nothing matches “{query}”.
            <br />
            Try a broader word such as “form” or “card”.
          </p>
        ) : (
          groups.map((g) => (
            <section key={g.type} aria-labelledby={`pg-add-${g.type}`}>
              <h3
                id={`pg-add-${g.type}`}
                className="sticky top-0 z-10 bg-surface/95 px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur"
              >
                {TYPE_META[g.type].plural} <span className="font-normal normal-case tracking-normal">· {g.items.length}</span>
              </h3>
              <ul className="px-1.5">
                {g.items.map((item) => {
                  const done = installed.has(item.id);
                  return (
                    <li key={item.id} className="group flex items-start gap-2 rounded-md px-1.5 py-1.5 hover:bg-accent">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-foreground">{item.name}</p>
                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">{item.description}</p>
                      </div>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => onAdd(item.id)}
                        aria-label={done ? `${item.name} is installed. Add again` : `Add ${item.name}`}
                        title={done ? "Installed (click to re-run add)" : `npx nativra-cli add ${item.id}`}
                        className={`mt-0.5 inline-flex h-7 shrink-0 cursor-pointer items-center gap-1 rounded-md border px-2 text-xs font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
                          done
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                            : "border-border bg-background text-foreground hover:border-brand hover:text-brand"
                        }`}
                      >
                        {done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Plus className="h-3.5 w-3.5" aria-hidden="true" />}
                        {done ? "Added" : "Add"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
