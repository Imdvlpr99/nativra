import React from "react";
import { Link, useLocation } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { READING_ORDER } from "@/lib/site";

/** Previous / next in sidebar order: every page's "what to read next". */
export function Pager() {
  const { pathname } = useLocation();
  const index = READING_ORDER.findIndex((l) => l.href === pathname);
  if (index === -1) return null;
  const prev = READING_ORDER[index - 1];
  const next = READING_ORDER[index + 1];
  const card = "panel group flex flex-col gap-1 p-4 transition-colors hover:border-brand/40 hover:bg-surface";

  return (
    <nav aria-label="Previous and next page" className="mt-20 grid gap-3 sm:grid-cols-2">
      {prev ? (
        <Link to={prev.href} className={card}>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
            Previous
          </span>
          <span className="font-medium">{prev.title}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next && (
        <Link to={next.href} className={`${card} sm:items-end sm:text-right`}>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            Next · {next.section}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
          <span className="font-medium">{next.title}</span>
        </Link>
      )}
    </nav>
  );
}
