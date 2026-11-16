import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Search, X } from "lucide-react";
import { NAV } from "@/lib/site";

interface SearchEntry {
  key: string;
  title: string;
  description: string;
  href: string;
  group: string;
}

/** Search index built from the sidebar itself, so search and navigation never disagree. */
const ENTRIES: SearchEntry[] = NAV.flatMap((section) =>
  section.links.map((l) => ({
    key: l.href,
    title: l.title,
    description: l.description ?? "",
    href: l.href,
    group: section.library ? section.title : "Guides",
  }))
);
const GROUP_ORDER = ["Guides", ...NAV.filter((s) => s.library).map((s) => s.title)];

function score(e: SearchEntry, q: string): number {
  const title = e.title.toLowerCase();
  const slug = e.href.split("/").pop() ?? "";
  if (title === q || slug === q) return 0;
  if (title.startsWith(q) || slug.startsWith(q)) return 1;
  if (title.includes(q) || slug.includes(q)) return 2;
  if (e.description.toLowerCase().includes(q)) return 3;
  return e.group.toLowerCase().includes(q) ? 4 : -1;
}

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const baseId = useId();
  const listId = `${baseId}-list`;
  const optionId = (i: number) => `${baseId}-opt-${i}`;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ENTRIES.filter((e) => e.group === "Guides");
    return ENTRIES.map((e) => ({ e, s: score(e, q) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => a.s - b.s || a.e.title.localeCompare(b.e.title))
      .slice(0, 40)
      .map((r) => r.e);
  }, [query]);

  // Grouped for display, with a flat index for keyboard navigation.
  const { groups, flat } = useMemo(() => {
    const present = GROUP_ORDER.filter((g) => results.some((r) => r.group === g));
    const flatList: SearchEntry[] = [];
    const grouped = present.map((g) => ({
      group: g,
      entries: results
        .filter((r) => r.group === g)
        .map((entry) => {
          flatList.push(entry);
          return { entry, index: flatList.length - 1 };
        }),
    }));
    return { groups: grouped, flat: flatList };
  }, [results]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setQuery("");
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
      returnFocusRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    document.getElementById(`${baseId}-opt-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, baseId]);

  if (!open) return null;

  const go = (entry: SearchEntry | undefined) => {
    if (!entry) return;
    onClose();
    navigate(entry.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const count = flat.length;
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown" && count > 0) {
      e.preventDefault();
      setActive((a) => (a + 1) % count);
    } else if (e.key === "ArrowUp" && count > 0) {
      e.preventDefault();
      setActive((a) => (a - 1 + count) % count);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(flat[active]);
    } else if (e.key === "Tab") {
      // Keep focus inside the dialog.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>("input, button");
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[12vh]" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" aria-hidden="true" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
        className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={flat.length > 0 ? optionId(active) : undefined}
            aria-label="Search guides, components, blocks and hooks"
            placeholder="Search guides, components, hooks…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Close search"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div id={listId} role="listbox" aria-label="Results" className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
          {flat.length === 0 ? (
            <p className="px-3 py-10 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;. Try a component name such as &ldquo;button&rdquo;.
            </p>
          ) : (
            groups.map(({ group, entries }) => (
              <div key={group} role="group" aria-label={group} className="pb-1">
                <div className="px-3 pb-1 pt-2 text-xs font-medium text-muted-foreground">{group}</div>
                {entries.map(({ entry, index }) => {
                  const selected = index === active;
                  return (
                    <div
                      key={entry.key}
                      id={optionId(index)}
                      role="option"
                      aria-selected={selected}
                      onMouseMove={() => setActive(index)}
                      onClick={() => go(entry)}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 ${selected ? "bg-accent" : ""}`}
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{entry.title}</div>
                        {entry.description && <div className="truncate text-xs text-muted-foreground">{entry.description}</div>}
                      </div>
                      <ArrowRight className={`h-3.5 w-3.5 shrink-0 text-brand ${selected ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="kbd">↑</kbd>
            <kbd className="kbd">↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="kbd">↵</kbd> open
          </span>
          <span className="ml-auto flex items-center gap-1">
            <kbd className="kbd">esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
