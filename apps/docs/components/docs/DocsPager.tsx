"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { NavSection } from "@/lib/docs-nav";

/** Previous / next links following the sidebar's reading order. */
export function DocsPager({ sections }: { sections: NavSection[] }) {
  const pathname = usePathname() ?? "";
  const order = sections.flatMap((s) => [
    ...(s.href ? [{ title: `${s.title} overview`, href: s.href }] : []),
    ...s.links,
  ]);
  const index = order.findIndex((l) => l.href === pathname);
  if (index === -1) return null;
  const prev = order[index - 1];
  const next = order[index + 1];

  return (
    <nav aria-label="Pagination" className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
      {prev ? (
        <Link href={prev.href} className="group rounded-lg border border-border p-4 transition-colors hover:border-foreground/30">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
            Previous
          </span>
          <span className="mt-1 block font-medium">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          href={next.href}
          className="group rounded-lg border border-border p-4 text-right transition-colors hover:border-foreground/30"
        >
          <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
            Next
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
          <span className="mt-1 block font-medium">{next.title}</span>
        </Link>
      )}
    </nav>
  );
}
