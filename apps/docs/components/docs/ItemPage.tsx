import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import type { RegistryItem, RegistryItemType } from "@nativra/registry-schema";
import { THEME_PRESETS } from "@nativra/theme-engine";
import { getDependents, getItem, getItemsByType, getSummaries } from "@/lib/registry";
import { TYPE_META, catalogHref, itemHref } from "@/lib/item-types";
import { COMPONENT_PROPS_MAP } from "@/lib/component-props";
import { SITE } from "@/lib/site";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeViewer } from "@/components/CodeViewer";
import { MarkdownDocs } from "@/components/MarkdownDocs";
import { InstallTabs, type InstallInfo } from "./InstallTabs";
import { ThemePreview, ThemeTokenTable } from "./ThemePreview";

const DESTINATION: Record<RegistryItemType, string> = {
  component: "components/ui",
  block: "components/ui",
  template: "components/ui",
  hook: "hooks",
  utility: "lib/utils",
  theme: "lib/themes",
};

function baseName(path: string) {
  return (path.split("/").pop() ?? path).replace(/\.(tsx?|jsx?)$/, "");
}

function importSnippet(item: RegistryItem): string | undefined {
  const file = item.files[0];
  if (!file) return undefined;
  const name = baseName(file.path);
  switch (item.type) {
    case "hook": {
      const fn = name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
      return `import { ${fn} } from "@/hooks/${name}";`;
    }
    case "utility":
      return `import { ${item.id} } from "@/lib/utils";`;
    case "theme":
      return `import { ${item.id.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())} } from "@/lib/themes/${name}";`;
    default:
      return `import { ${name} } from "@/components/ui/${name}";`;
  }
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">
      {children}
    </span>
  );
}

function Section({ id, title, children, description }: { id: string; title: string; description?: string | undefined; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="scroll-mt-24 space-y-4">
      <div className="space-y-1">
        <h2 id={id} className="text-xl font-semibold">
          {title}
        </h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function ItemLinks({ items }: { items: Array<{ id: string; name: string; type: RegistryItemType; description: string }> }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((d) => (
        <li key={d.id}>
          <Link
            href={itemHref(d.type, d.id)}
            className="block h-full rounded-lg border border-border p-3 transition-colors hover:border-foreground/30 hover:bg-accent/40"
          >
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

async function ItemPage({ type, id }: { type: RegistryItemType; id: string }) {
  const item = await getItem(id);
  if (!item || item.type !== type) notFound();

  const meta = TYPE_META[type];
  const [deps, dependents] = await Promise.all([
    getSummaries((item.registryDependencies ?? []).map((d) => d.id)),
    getDependents(item.id),
  ]);
  const props = type === "component" ? COMPONENT_PROPS_MAP[item.id] ?? [] : [];
  const theme = type === "theme" ? THEME_PRESETS[item.id] : undefined;
  const platforms = [
    item.platforms.ios && "iOS",
    item.platforms.android && "Android",
    item.platforms.expoGo && "Expo Go",
    item.platforms.web && "Web",
  ].filter(Boolean) as string[];

  const snippet = importSnippet(item);
  const install: InstallInfo = {
    id: item.id,
    destination: DESTINATION[type],
    files: item.files.map((f) => ({ name: f.path.split("/").pop() ?? f.path, ...(f.target ? { target: f.target } : {}) })),
    registryDeps: deps.map((d) => ({ id: d.id, name: d.name, href: itemHref(d.type, d.id) })),
    npmDeps: (item.npmDependencies ?? []).map((d) => ({ package: d.package, version: d.version, ...(d.peer ? { peer: d.peer } : {}) })),
    ...(snippet ? { importSnippet: snippet } : {}),
    isTheme: type === "theme",
  };

  const url = `${SITE.url}${itemHref(type, item.id)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Docs", item: `${SITE.url}/docs` },
          { "@type": "ListItem", position: 2, name: meta.plural, item: `${SITE.url}${catalogHref(type)}` },
          { "@type": "ListItem", position: 3, name: item.name, item: url },
        ],
      },
      {
        "@type": "TechArticle",
        headline: `React Native ${item.name} ${meta.label} — Nativra`,
        description: item.description,
        url,
        about: {
          "@type": "SoftwareSourceCode",
          name: item.name,
          programmingLanguage: "TypeScript",
          runtimePlatform: "React Native & Expo",
          codeRepository: SITE.repo,
        },
      },
    ],
  };

  return (
    <article className="space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <header className="space-y-4">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1 text-sm text-muted-foreground">
            <li>
              <Link href="/docs" className="hover:text-foreground">
                Docs
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <li>
              <Link href={catalogHref(type)} className="hover:text-foreground">
                {meta.plural}
              </Link>
            </li>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <li aria-current="page" className="text-foreground">
              {item.name}
            </li>
          </ol>
        </nav>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold sm:text-4xl">{item.name}</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">{item.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {item.status !== "stable" && <Chip>{item.status}</Chip>}
          <Chip>v{item.version}</Chip>
          {item.stylingTargets.map((t) => (
            <Chip key={t}>{t === "nativewind" ? "NativeWind" : "StyleSheet"}</Chip>
          ))}
          {platforms.map((p) => (
            <Chip key={p}>{p}</Chip>
          ))}
        </div>
        {item.status === "deprecated" && item.deprecationMessage && (
          <p role="note" className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm">
            <strong>Deprecated.</strong> {item.deprecationMessage}
          </p>
        )}
      </header>

      <Section id="preview" title="Preview" description={theme ? "Rendered with this theme's own tokens." : undefined}>
        {theme ? <ThemePreview theme={theme} /> : <ComponentPreview item={item} showInstallBar={false} />}
      </Section>

      <Section id="installation" title="Installation">
        <InstallTabs info={install} />
      </Section>

      {item.docs && (
        <Section id="documentation" title="Documentation">
          <MarkdownDocs source={item.docs} />
        </Section>
      )}

      {props.length > 0 && (
        <Section id="props" title="Props">
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-2 font-medium">Prop</th>
                  <th scope="col" className="px-4 py-2 font-medium">Type</th>
                  <th scope="col" className="px-4 py-2 font-medium">Default</th>
                  <th scope="col" className="px-4 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {props.map((p) => (
                  <tr key={p.name} className="border-t border-border align-top first:border-t-0">
                    <th scope="row" className="whitespace-nowrap px-4 py-2.5 font-mono text-xs font-medium text-foreground">{p.name}</th>
                    <td className="px-4 py-2.5 font-mono text-xs text-primary">{p.type}</td>
                    <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-muted-foreground">{p.default ?? "—"}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {theme && (
        <Section id="tokens" title="Tokens">
          <ThemeTokenTable theme={theme} />
        </Section>
      )}

      <Section id="source" title="Source" description="This is exactly what the CLI writes, before your import aliases are applied.">
        <CodeViewer files={item.files} defaultTarget="nativewind" />
      </Section>

      {(deps.length > 0 || install.npmDeps.length > 0 || dependents.length > 0) && (
        <Section id="dependencies" title="Dependencies">
          {deps.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Registry items</h3>
              <ItemLinks items={deps} />
            </div>
          )}
          {install.npmDeps.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">npm packages</h3>
              <ul className="flex flex-wrap gap-2">
                {install.npmDeps.map((d) => (
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
        </Section>
      )}
    </article>
  );
}

/** Builds the exports for a /docs/<segment>/[id] route of one item type. */
export function itemRoute(type: RegistryItemType) {
  type Props = { params: Promise<{ id: string }> };
  const meta = TYPE_META[type];

  return {
    async generateStaticParams() {
      return (await getItemsByType(type)).map((i) => ({ id: i.id }));
    },
    async generateMetadata({ params }: Props): Promise<Metadata> {
      const { id } = await params;
      const item = await getItem(id);
      if (!item || item.type !== type) return { title: `${meta.label} not found` };
      const title = `React Native ${item.name} ${meta.label} (NativeWind & StyleSheet)`;
      const description = `${item.description} Install with npx nativra-cli add ${item.id} — source you own, for React Native and Expo.`;
      const path = itemHref(type, item.id);
      return {
        title,
        description,
        keywords: [item.name, `React Native ${item.name}`, `Expo ${item.name}`, `NativeWind ${item.name}`, ...(item.tags ?? [])],
        alternates: { canonical: path },
        openGraph: { type: "article", url: `${SITE.url}${path}`, title: `${title} | Nativra`, description, images: ["/nativra-banner.png"] },
        twitter: { card: "summary_large_image", title: `${title} | Nativra`, description, images: ["/nativra-banner.png"] },
      };
    },
    async Page({ params }: Props) {
      const { id } = await params;
      return <ItemPage type={type} id={id} />;
    },
  };
}
