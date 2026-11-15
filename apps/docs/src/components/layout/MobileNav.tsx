import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { PanelLeft, X } from "lucide-react";
import { READING_ORDER } from "@/lib/site";
import { Sidebar } from "./Sidebar";

/** Below lg: a sticky bar naming the current page that opens the sidebar as a drawer. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const current = READING_ORDER.find((l) => l.href === pathname);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const trigger = triggerRef.current;
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <div className="sticky top-[var(--header-height)] z-40 -mx-4 border-b border-border bg-background/90 px-4 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="docs-drawer"
          className="flex min-h-11 w-full items-center gap-2 text-sm text-muted-foreground"
        >
          <PanelLeft className="h-4 w-4" aria-hidden="true" />
          <span>{current?.section ?? "Menu"}</span>
          {current && (
            <>
              <span aria-hidden="true">/</span>
              <span className="truncate font-medium text-foreground">{current.title}</span>
            </>
          )}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" aria-hidden="true" onClick={() => setOpen(false)} />
          <div
            id="docs-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Documentation navigation"
            className="absolute inset-y-0 left-0 flex w-[min(320px,85vw)] flex-col border-r border-border bg-background shadow-2xl"
          >
            <div className="flex h-[var(--header-height)] shrink-0 items-center justify-between border-b border-border px-4">
              <span className="text-sm font-semibold">Documentation</span>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain p-4">
              <Sidebar onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
