"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);

/**
 * Builds the "On this page" list from the rendered h2/h3 headings of #docs-content,
 * assigning stable ids to headings that lack one so every section is deep-linkable.
 */
export function OnThisPage() {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const root = document.getElementById("docs-content");
    if (!root) return;
    const used = new Set<string>();
    const found: Heading[] = [];
    root.querySelectorAll<HTMLHeadingElement>("h2, h3").forEach((el) => {
      if (el.closest("[data-toc-skip]")) return;
      const text = el.textContent?.trim() ?? "";
      if (!text) return;
      let id = el.id || slug(text) || "section";
      while (used.has(id) || (!el.id && document.getElementById(id))) id = `${id}-x`;
      used.add(id);
      if (!el.id) el.id = id;
      found.push({ id: el.id, text, level: el.tagName === "H3" ? 3 : 2 });
    });
    setHeadings(found);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" }
    );
    found.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className="space-y-2 text-sm">
      <p className="text-xs font-semibold text-foreground">On this page</p>
      <ul className="space-y-1.5 border-l border-border">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={activeId === h.id ? "location" : undefined}
              className={`-ml-px block border-l py-0.5 transition-colors ${h.level === 3 ? "pl-6" : "pl-3"} ${
                activeId === h.id
                  ? "border-primary font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
