"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Search } from "lucide-react";
import type { NavSection } from "@/lib/docs-nav";

function isCurrent(pathname: string, href: string) {
  return pathname === href;
}

export function DocsSidebar({ sections, onNavigate }: { sections: NavSection[]; onNavigate?: () => void }) {
  const pathname = usePathname() ?? "";
  const handleNavigate = onNavigate ?? (() => undefined);
  const [filter, setFilter] = useState("");
  const navRef = useRef<HTMLElement>(null);

  // Keep the current page visible in a long sidebar (e.g. a component deep in the list).
  useEffect(() => {
    const el = navRef.current?.querySelector<HTMLElement>('[aria-current="page"]');
    el?.scrollIntoView({ block: "nearest" });
  }, [pathname]);
  const q = filter.trim().toLowerCase();

  const visible = useMemo(
    () =>
      sections
        .map((s) => ({
          ...s,
          links: q ? s.links.filter((l) => l.title.toLowerCase().includes(q)) : s.links,
        }))
        .filter((s) => !q || s.links.length > 0),
    [sections, q]
  );

  return (
    <nav ref={navRef} aria-label="Documentation" className="space-y-7 text-sm">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter pages"
          aria-label="Filter documentation pages"
          className="h-8 w-full rounded-md border border-border bg-background pl-8 pr-2 text-sm placeholder:text-muted-foreground"
        />
      </div>

      {visible.length === 0 && <p className="px-2 text-muted-foreground">No pages match “{filter}”.</p>}

      {(["guides", "library"] as const).map((group) => {
        const groupSections = visible.filter((s) => (group === "library") === s.collapsible);
        if (groupSections.length === 0) return null;
        return (
          <div key={group} className={group === "library" ? "space-y-1" : "space-y-7"}>
            {group === "library" && <h2 className="eyebrow pb-1">Library</h2>}
            {groupSections.map((section) => {
        const containsActive =
          section.links.some((l) => isCurrent(pathname, l.href)) || (section.href && isCurrent(pathname, section.href));
        const list = (
          <ul>
            {section.links.map((link) => {
              const current = isCurrent(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={handleNavigate}
                    aria-current={current ? "page" : undefined}
                    className={`flex items-center justify-between gap-2 rounded-r-md border-l py-1 pl-3 pr-2 text-[14px] transition-colors ${
                      current
                        ? "border-brand font-medium text-foreground"
                        : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                    }`}
                  >
                    <span className="truncate">{link.title}</span>
                    {link.tag && (
                      <span className="shrink-0 rounded border border-border px-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {link.tag}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        );

        if (!section.collapsible) {
          return (
            <div key={section.title} className="space-y-1">
              <h2 className="eyebrow pb-1">{section.title}</h2>
              {list}
            </div>
          );
        }

        return (
          <details key={section.title} open={Boolean(q) || containsActive || undefined} className="group">
            <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-md py-1 text-xs hover:text-foreground [&::-webkit-details-marker]:hidden">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-open:rotate-90" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">{section.title}</span>
              {section.count !== undefined && (
                <span className="ml-auto font-mono text-[11px] font-normal text-muted-foreground">{section.count}</span>
              )}
            </summary>
            {section.href && (
              <Link
                href={section.href}
                onClick={handleNavigate}
                aria-current={isCurrent(pathname, section.href) ? "page" : undefined}
                className={`block rounded-r-md border-l py-1 pl-3 pr-2 text-[14px] transition-colors ${
                  isCurrent(pathname, section.href)
                    ? "border-brand font-medium text-foreground"
                    : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                }`}
              >
                Overview
              </Link>
            )}
            {list}
          </details>
        );
            })}
          </div>
        );
      })}
    </nav>
  );
}
