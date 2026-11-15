import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { ChevronRight, Search } from "lucide-react";
import { NAV, type NavSection } from "@/lib/site";

function linkClass(current: boolean) {
  return `relative flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-[14px] leading-6 transition-colors ${
    current
      ? "bg-brand/10 font-medium text-foreground before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:rounded-full before:bg-brand"
      : "text-muted-foreground hover:bg-accent hover:text-foreground"
  }`;
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const [filter, setFilter] = useState("");
  const navRef = useRef<HTMLElement>(null);
  const handleNavigate = onNavigate ?? (() => undefined);

  // Keep the current page visible in a long sidebar.
  useEffect(() => {
    navRef.current?.querySelector<HTMLElement>('[aria-current="page"]')?.scrollIntoView({ block: "nearest" });
  }, [pathname]);

  const q = filter.trim().toLowerCase();
  const visible = useMemo(
    () =>
      NAV.map((s) => ({ ...s, links: q ? s.links.filter((l) => l.title.toLowerCase().includes(q)) : s.links })).filter(
        (s) => !q || s.links.length > 0
      ),
    [q]
  );

  const renderLinks = (section: NavSection) => (
    <ul className="space-y-0.5">
      {section.links.map((link) => {
        const current = pathname === link.href;
        return (
          <li key={link.href}>
            <Link to={link.href} onClick={handleNavigate} aria-current={current ? "page" : undefined} className={linkClass(current)}>
              <span className="truncate">{link.title}</span>
              {link.tag && <span className="shrink-0 rounded-full border border-border px-1.5 text-[10px] uppercase">{link.tag}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const guides = visible.filter((s) => !s.library);
  const library = visible.filter((s) => s.library);

  return (
    <nav ref={navRef} aria-label="Documentation" className="space-y-7">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter pages"
          aria-label="Filter documentation pages"
          className="h-9 w-full rounded-lg border border-border bg-surface pl-8 pr-2 text-sm placeholder:text-muted-foreground"
        />
      </div>

      {visible.length === 0 && <p className="px-3 text-sm text-muted-foreground">No pages match “{filter}”.</p>}

      {guides.map((section) => (
        <div key={section.title} className="space-y-1.5">
          <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{section.title}</h2>
          {renderLinks(section)}
        </div>
      ))}

      {library.length > 0 && (
        <div className="space-y-1.5">
          <h2 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Library</h2>
          {library.map((section) => {
            const containsActive = section.links.some((l) => l.href === pathname) || section.href === pathname;
            return (
              <details key={section.title} open={Boolean(q) || containsActive || undefined} className="group">
                <summary className="flex min-h-9 cursor-pointer list-none items-center gap-2 rounded-lg px-3 text-[14px] font-medium transition-colors hover:bg-accent [&::-webkit-details-marker]:hidden">
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-open:rotate-90" aria-hidden="true" />
                  {section.title}
                  <span className="ml-auto rounded-full bg-muted px-1.5 font-mono text-[11px] font-normal text-muted-foreground">
                    {section.links.length}
                  </span>
                </summary>
                <div className="mb-2 ml-[18px] mt-0.5 border-l border-border pl-2">
                  {section.href && (
                    <Link
                      to={section.href}
                      onClick={handleNavigate}
                      aria-current={pathname === section.href ? "page" : undefined}
                      className={linkClass(pathname === section.href)}
                    >
                      All {section.title.toLowerCase()}
                    </Link>
                  )}
                  {renderLinks(section)}
                </div>
              </details>
            );
          })}
        </div>
      )}
    </nav>
  );
}
