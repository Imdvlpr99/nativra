"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import searchCatalog from "./searchItems.json";

interface SearchItem {
  id: string;
  name: string;
  category: string;
  href: string;
  description: string;
}

const ITEMS = searchCatalog as SearchItem[];
const CATEGORY_ORDER = ["Documentation", "Component", "Block", "Template", "Hook", "Utility", "Theme"];

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function score(item: SearchItem, q: string): number {
  const name = item.name.toLowerCase();
  if (name === q || item.id === q) return 0;
  if (name.startsWith(q) || item.id.startsWith(q)) return 1;
  if (name.includes(q) || item.id.includes(q)) return 2;
  if (item.description.toLowerCase().includes(q)) return 3;
  return item.category.toLowerCase().includes(q) ? 4 : -1;
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const listId = `${baseId}-list`;
  const optionId = (i: number) => `${baseId}-opt-${i}`;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return ITEMS.filter((i) => i.category === "Documentation").concat(
        ITEMS.filter((i) => i.category === "Component").slice(0, 8)
      );
    }
    return ITEMS.map((item) => ({ item, s: score(item, q) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => a.s - b.s || a.item.name.localeCompare(b.item.name))
      .slice(0, 40)
      .map((r) => r.item);
  }, [query]);

  // Group while keeping a flat index for keyboard navigation.
  const groups = useMemo(() => {
    const rank = (cat: string) => {
      const i = CATEGORY_ORDER.indexOf(cat);
      return i === -1 ? CATEGORY_ORDER.length : i;
    };
    const ordered = [...new Set(results.map((r) => r.category))].sort((a, b) => rank(a) - rank(b));
    let index = 0;
    const flat: SearchItem[] = [];
    const out = ordered.map((cat) => {
      const entries = results.filter((r) => r.category === cat).map((item) => {
        flat.push(item);
        return { item, index: index++ };
      });
      return { cat, entries };
    });
    return { out, flat };
  }, [results]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen]);

  useEffect(() => {
    document.getElementById(`${baseId}-opt-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active, baseId]);

  if (!isOpen) return null;

  const go = (item: SearchItem | undefined) => {
    if (!item) return;
    onClose();
    router.push(item.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const count = groups.flat.length;
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
      go(groups.flat[active]);
    } else if (e.key === "Tab") {
      // Keep focus inside the dialog: input <-> close button.
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
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" aria-hidden="true" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl"
      >
        <h2 id={titleId} className="sr-only">
          Search documentation
        </h2>
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={groups.flat.length > 0 ? optionId(active) : undefined}
            aria-label="Search components, blocks, hooks and guides"
            placeholder="Search components, blocks, hooks, guides…"
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
          {groups.flat.length === 0 ? (
            <p className="px-3 py-10 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;. Try a component name such as &ldquo;button&rdquo;.
            </p>
          ) : (
            groups.out.map(({ cat, entries }) => (
              <div key={cat} role="group" aria-label={cat} className="pb-1">
                <div className="eyebrow px-3 pb-1 pt-2">{cat === "Documentation" ? "Guides" : `${cat}s`}</div>
                {entries.map(({ item, index }) => {
                  const selected = index === active;
                  return (
                    <div
                      key={`${item.category}-${item.id}`}
                      id={optionId(index)}
                      role="option"
                      aria-selected={selected}
                      onMouseMove={() => setActive(index)}
                      onClick={() => go(item)}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 ${
                        selected ? "bg-accent text-accent-foreground" : "text-foreground"
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{item.name}</div>
                        <div className="truncate text-xs text-muted-foreground">{item.description}</div>
                      </div>
                      <ArrowRight
                        className={`h-3.5 w-3.5 shrink-0 text-muted-foreground ${selected ? "opacity-100" : "opacity-0"}`}
                        aria-hidden="true"
                      />
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
