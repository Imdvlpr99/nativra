import React, { Suspense, use } from "react";
import { Link, useParams } from "react-router";
import { ChevronRight } from "lucide-react";
import { THEME_PRESETS } from "@nativra/theme-engine";
import { dependentsOf, findItem, type ItemSummary, type ItemType } from "@/lib/data";
import { TYPE_META, catalogHref, installCommand, itemHref } from "@/lib/item-types";
import { COMPONENT_PROPS_MAP } from "@/lib/component-props";
import { loadItem } from "@/lib/load-item";
import { Seo } from "@/lib/head";
import { SITE } from "@/lib/site";
import { PreviewFrame } from "@/components/PreviewFrame";

/** Item types with something visual to render; hooks and utilities have no preview. */
const PREVIEWABLE = new Set<ItemType>(["component", "block", "template"]);
import { ThemePreview, ThemeTokenTable } from "@/components/ThemePreview";
import { InstallTabs } from "@/components/InstallTabs";
import { SourceViewer } from "@/components/SourceViewer";
import { MarkdownDocs } from "@/components/MarkdownDocs";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import NotFound from "./NotFound";

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">{children}</span>;
}

function Block({ id, title, description, children }: { id: string; title: string; description?: string | undefined; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="space-y-5">
      <div className="space-y-1">
        <h2 id={id} className="text-2xl font-semibold">
          {title}
        </h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function ItemLinks({ items }: { items: ItemSummary[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((d) => (
        <li key={d.id}>
          <Link to={itemHref(d.type, d.id)} className="panel block h-full p-3 transition-colors hover:border-brand/40 hover:bg-surface">
            <span className="flex items-center justify-between gap-2 text-sm font-medium">
              {d.name}
              <span className="text-xs font-normal text-muted-foreground">{TYPE_META[d.type].label}</span>
            </span>
            <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">{d.description}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Loading({ label }: { label: string }) {
  return <div className="h-40 animate-pulse rounded-xl bg-muted" aria-busy="true" aria-label={`Loading ${label}`} />;
}

/** The parts that need the full item (source and docs), loaded from public/items/<id>.json. */
function ItemDocs({ id }: { id: string }) {
  const full = use(loadItem(id));
  return full.docs ? (
    <Block id="usage" title="Usage">
      <MarkdownDocs source={full.docs} />
    </Block>
  ) : null;
}

function ItemSource({ id }: { id: string }) {
  const full = use(loadItem(id));
  return <SourceViewer files={full.files} />;
}

export default function ItemPage({ type }: { type: ItemType }) {
  const { id = "" } = useParams();
  const item = findItem(id);
  if (!item || item.type !== type) return <NotFound />;

  const meta = TYPE_META[type];
  const deps = item.dependencies.map(findItem).filter((d): d is ItemSummary => Boolean(d));
  const dependents = dependentsOf(item.id);
  const props = type === "component" ? COMPONENT_PROPS_MAP[item.id] ?? [] : [];
  const theme = type === "theme" ? THEME_PRESETS[item.id] : undefined;
  const platforms = [
    item.platforms.ios && "iOS",
    item.platforms.android && "Android",
    item.platforms.expoGo && "Expo Go",
    item.platforms.web && "Web",
  ].filter((p): p is string => Boolean(p));
  const path = itemHref(type, item.id);

  return (
    <article className="space-y-16">
      <Seo
        title={`${item.name} — React Native ${meta.label}`}
        description={`${item.description} Install with ${installCommand(type, item.id).replace(/^npx /, "")}: source you own, for React Native and Expo.`}
        path={path}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: `React Native ${item.name} ${meta.label}`,
          description: item.description,
          url: `${SITE.url}${path}`,
          about: { "@type": "SoftwareSourceCode", name: item.name, programmingLanguage: "TypeScript", codeRepository: SITE.repo },
        }}
      />

      <header className="space-y-5 border-b border-border pb-10">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1 text-sm text-muted-foreground">
            <li>
              <Link to="/docs" className="hover:text-foreground">
                Docs
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <li>
              <Link to={catalogHref(type)} className="hover:text-foreground">
                {meta.plural}
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <li aria-current="page" className="font-medium text-foreground">
              {item.name}
            </li>
          </ol>
        </nav>
        <div className="space-y-3">
          <h1 className="text-[2.125rem] font-bold leading-tight sm:text-[2.75rem]">{item.name}</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">{item.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {item.status !== "stable" && <Chip>{item.status}</Chip>}
          <Chip>
            <span className="font-mono">v{item.version}</span>
          </Chip>
          {item.stylingTargets.map((t) => (
            <Chip key={t}>{t === "nativewind" ? "NativeWind" : "StyleSheet"}</Chip>
          ))}
          {platforms.map((p) => (
            <Chip key={p}>{p}</Chip>
          ))}
        </div>
        {item.deprecationMessage && (
          <p role="note" className="rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-sm">
            <strong>Deprecated.</strong> {item.deprecationMessage}
          </p>
        )}
      </header>

      {theme ? (
        <Block id="preview" title="Preview" description="Rendered with this theme's own tokens.">
          <ThemePreview theme={theme} />
        </Block>
      ) : type === "style" ? (
        <Block id="preview" title="Preview" description="Real blocks rendered with this style. Pick any theme for the colors.">
          <div className="space-y-6">
            <PreviewFrame id="login-form" type="block" fixedStyle={item.id} />
            <PreviewFrame id="settings-list" type="block" fixedStyle={item.id} />
          </div>
        </Block>
      ) : PREVIEWABLE.has(type) ? (
        <Block id="preview" title="Preview">
          <PreviewFrame id={item.id} type={type} />
        </Block>
      ) : null}

      <Block id="installation" title="Installation">
        <InstallTabs item={item} />
        {(type === "component" || type === "block" || type === "template" || type === "hook") && (
          <p className="mt-3 text-sm text-muted-foreground">
            Want to try it first?{" "}
            <Link to={`/playground?add=${item.id}`} className="font-medium text-foreground underline underline-offset-4 hover:text-brand">
              Open it in the playground
            </Link>
            : a real React Native project in your browser, with this item installed by the CLI.
          </p>
        )}
      </Block>

      {item.hasDocs && (
        <ErrorBoundary label="the usage docs">
          <Suspense fallback={<Loading label="documentation" />}>
            <ItemDocs id={item.id} />
          </Suspense>
        </ErrorBoundary>
      )}

      {props.length > 0 && (
        <Block id="props" title="Props">
          <div className="panel overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-surface text-xs text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium">Prop</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Type</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Default</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {props.map((p) => (
                  <tr key={p.name} className="border-t border-border align-top first:border-t-0">
                    <th scope="row" className="whitespace-nowrap px-4 py-2.5 font-mono text-xs font-medium">{p.name}</th>
                    <td className="px-4 py-2.5 font-mono text-xs text-brand">{p.type}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted-foreground">{p.default ?? "—"}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>
      )}

      {theme && (
        <Block id="tokens" title="Tokens">
          <ThemeTokenTable theme={theme} />
        </Block>
      )}

      <Block id="source" title="Source" description="Exactly what the CLI writes, before your import aliases are applied.">
        <ErrorBoundary label="the source code">
          <Suspense fallback={<Loading label="source" />}>
            <ItemSource id={item.id} />
          </Suspense>
        </ErrorBoundary>
      </Block>

      {(deps.length > 0 || item.npmDependencies.length > 0 || dependents.length > 0) && (
        <Block id="dependencies" title="Dependencies">
          {deps.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Registry items</h3>
              <ItemLinks items={deps} />
            </div>
          )}
          {item.npmDependencies.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">npm packages</h3>
              <ul className="flex flex-wrap gap-2">
                {item.npmDependencies.map((d) => (
                  <li key={d.package}>
                    <Chip>
                      <span className="font-mono text-foreground">{d.package}</span>
                      <span className="font-mono">{d.version}</span>
                      {d.peer && <span>peer</span>}
                    </Chip>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {dependents.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Used by</h3>
              <ItemLinks items={dependents} />
            </div>
          )}
        </Block>
      )}
    </article>
  );
}
