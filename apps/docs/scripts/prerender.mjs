#!/usr/bin/env node
/**
 * Renders every route to static HTML after `vite build` (client → dist/) and
 * `vite build --ssr src/entry-server.tsx --outDir dist-server`.
 *
 * Output: dist/index.html, dist/docs/index.html, dist/docs/<page>/index.html, dist/404.html,
 * plus sitemap.xml and robots.txt. Any static host serves it; the browser hydrates each page.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const SITE_URL = "https://nativra.vercel.app";

// The server bundle reads public/items/*.json relative to the app root.
process.chdir(root);

const template = await readFile(join(dist, "index.html"), "utf8");
const { render, ROUTES } = await import(pathToFileURL(join(root, "dist-server/entry-server.js")).href);

/** The route each file was rendered for; entry-client only hydrates when the URL matches it. */
function page(head, html, route) {
  const routeMeta = `<meta name="nativra-route" content="${route}" />`;
  return template.replace("<!--app-head-->", `${routeMeta}\n    ${head}`).replace("<!--app-html-->", html);
}

const started = Date.now();
for (const url of ROUTES) {
  const { html, head } = await render(url);
  const file = url === "/" ? join(dist, "index.html") : join(dist, url, "index.html");
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, page(head, html, url), "utf8");
}

const notFound = await render("/404");
await writeFile(join(dist, "404.html"), page(notFound.head, notFound.html, "/404"), "utf8");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`).join("\n")}
</urlset>
`;
await writeFile(join(dist, "sitemap.xml"), sitemap, "utf8");
await writeFile(join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`, "utf8");

console.log(`✅ Prerendered ${ROUTES.length} pages + 404 in ${((Date.now() - started) / 1000).toFixed(1)}s`);
