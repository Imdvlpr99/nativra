import React, { StrictMode } from "react";
import { prerenderToNodeStream } from "react-dom/static";
import { StaticRouter } from "react-router";
import { HeadCollector, HeadProvider } from "@/lib/head";
import { ITEMS } from "@/lib/data";
import { ITEM_TYPE_ORDER, TYPE_META, itemHref } from "@/lib/item-types";
import { App, GUIDE_ROUTES } from "./App";

/** Every URL the site prerenders, in sitemap order. */
export const ROUTES: string[] = [
  "/",
  "/docs",
  ...GUIDE_ROUTES.map((r) => `/docs/${r.path}`),
  ...ITEM_TYPE_ORDER.flatMap((t) => (ITEMS.some((i) => i.type === t) ? [`/docs/${TYPE_META[t].segment}`] : [])),
  ...ITEMS.map((i) => itemHref(i.type, i.id)),
];

/**
 * Renders one URL to static HTML. prerenderToNodeStream waits for every Suspense boundary
 * (lazy pages, item data, the highlighter), so the output is the complete page.
 */
export async function render(url: string): Promise<{ html: string; head: string }> {
  const head = new HeadCollector();
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <HeadProvider collector={head}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HeadProvider>
    </StrictMode>
  );
  let html = "";
  for await (const chunk of prelude) html += typeof chunk === "string" ? chunk : Buffer.from(chunk as Uint8Array).toString("utf8");
  return { html, head: head.toHtml() };
}
