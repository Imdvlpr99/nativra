import React, { createContext, useContext, useEffect } from "react";
import { SITE } from "./site";

export interface HeadData {
  title: string;
  description: string;
  path: string;
  /** "article" for item pages */
  type?: "website" | "article";
  jsonLd?: object;
  noindex?: boolean;
}

/** Collects the page's head tags during prerendering. The last <Seo> rendered wins. */
export class HeadCollector {
  data: HeadData | undefined;

  toHtml(): string {
    const d = this.data;
    if (!d) return "";
    const url = `${SITE.url}${d.path}`;
    const image = `${SITE.url}/og.png`;
    const tags = [
      `<title>${esc(fullTitle(d.title))}</title>`,
      `<meta name="description" content="${esc(d.description)}" />`,
      `<link rel="canonical" href="${esc(url)}" />`,
      `<meta property="og:type" content="${d.type ?? "website"}" />`,
      `<meta property="og:site_name" content="Nativra" />`,
      `<meta property="og:title" content="${esc(fullTitle(d.title))}" />`,
      `<meta property="og:description" content="${esc(d.description)}" />`,
      `<meta property="og:url" content="${esc(url)}" />`,
      `<meta property="og:image" content="${image}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      d.noindex ? `<meta name="robots" content="noindex" />` : "",
      d.jsonLd ? `<script type="application/ld+json">${JSON.stringify(d.jsonLd).replace(/</g, "\\u003c")}</script>` : "",
    ];
    return tags.filter(Boolean).join("\n    ");
  }
}

const HeadContext = createContext<HeadCollector | null>(null);

export function HeadProvider({ collector, children }: { collector: HeadCollector | null; children: React.ReactNode }) {
  return <HeadContext.Provider value={collector}>{children}</HeadContext.Provider>;
}

function fullTitle(title: string): string {
  return title.includes("Nativra") ? title : `${title} · Nativra`;
}

function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/**
 * Declares the page's title, description and canonical URL. Written into the static HTML at
 * prerender time and kept in sync on client-side navigation.
 */
export function Seo(props: HeadData) {
  const collector = useContext(HeadContext);
  if (collector) collector.data = props;

  const { title, description, path } = props;
  useEffect(() => {
    document.title = fullTitle(title);
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle(title));
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${SITE.url}${path}`;
  }, [title, description, path]);

  return null;
}
