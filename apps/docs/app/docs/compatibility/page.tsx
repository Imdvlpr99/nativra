import type { Metadata } from "next";
import Link from "next/link";
import { getAllItems } from "@/lib/registry";
import { ITEM_TYPE_ORDER, TYPE_META, itemHref } from "@/lib/item-types";
import { Defs, DocsHeader, DocsSection, NextStep, P } from "@/components/docs/Prose";

export const metadata: Metadata = {
  title: "Compatibility — Expo, React Native, iOS and Android support",
  description:
    "Supported Expo SDK, React Native, iOS, Android and tooling versions for Nativra, plus per-item platform support generated from the registry.",
  alternates: { canonical: "/docs/compatibility" },
};

function Mark({ ok }: { ok: boolean | undefined }) {
  return ok ? (
    <span className="text-brand" aria-label="Supported">✓</span>
  ) : (
    <span className="text-muted-foreground" aria-label="Not supported">—</span>
  );
}

export default async function CompatibilityPage() {
  const items = await getAllItems();

  return (
    <>
      <DocsHeader
        eyebrow="Guides"
        title="Compatibility"
        description="What Nativra supports, and how each registry item declares its platforms."
        meta={`${items.length} items · platform data from the registry`}
      />

      <DocsSection id="runtimes" title="Runtimes">
        <Defs
          items={[
            { term: "Expo SDK", desc: "51 and 52, including Expo Go and development builds." },
            { term: "React Native", desc: "0.74 – 0.76, old and New Architecture (Fabric, TurboModules)." },
            { term: "iOS", desc: "16, 17 and 18." },
            { term: "Android", desc: "API 31+ (Android 12 and newer)." },
          ]}
        />
      </DocsSection>

      <DocsSection id="styling" title="Styling targets">
        <Defs
          items={[
            { term: "NativeWind", desc: <>v4 (<code className="font-mono text-foreground">^4.0.1</code>) with Tailwind CSS 3.4.</> },
            { term: "StyleSheet", desc: "Any React Native version above; no extra packages." },
          ]}
        />
      </DocsSection>

      <DocsSection id="tooling" title="CLI requirements">
        <Defs
          items={[
            { term: "Node.js", desc: "20 or newer." },
            { term: "Package managers", desc: "npm, pnpm, yarn and bun are detected automatically." },
            { term: "Operating systems", desc: "Windows, macOS and Linux." },
          ]}
        />
      </DocsSection>

      <DocsSection id="items" title="Per-item support">
        <P>
          <p>
            Each item declares its platforms in the registry. Web support means the component renders under React Native Web;
            it is not the primary target.
          </p>
        </P>
        {ITEM_TYPE_ORDER.map((type) => {
          const rows = items.filter((i) => i.type === type).sort((a, b) => a.name.localeCompare(b.name));
          if (rows.length === 0) return null;
          return (
            <div key={type} className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <caption className="border-b border-border bg-muted/40 px-4 py-2 text-left text-xs font-medium text-muted-foreground">
                  {TYPE_META[type].plural} ({rows.length})
                </caption>
                <thead className="text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-2 font-medium">Item</th>
                    <th scope="col" className="px-3 py-2 text-center font-medium">iOS</th>
                    <th scope="col" className="px-3 py-2 text-center font-medium">Android</th>
                    <th scope="col" className="px-3 py-2 text-center font-medium">Expo Go</th>
                    <th scope="col" className="px-3 py-2 text-center font-medium">Web</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((i) => (
                    <tr key={i.id} className="border-t border-border">
                      <th scope="row" className="px-4 py-2 font-normal">
                        <Link href={itemHref(type, i.id)} className="hover:underline">
                          {i.name}
                        </Link>
                      </th>
                      <td className="px-3 py-2 text-center"><Mark ok={i.platforms.ios} /></td>
                      <td className="px-3 py-2 text-center"><Mark ok={i.platforms.android} /></td>
                      <td className="px-3 py-2 text-center"><Mark ok={i.platforms.expoGo} /></td>
                      <td className="px-3 py-2 text-center"><Mark ok={i.platforms.web} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </DocsSection>

      <NextStep href="/docs/components" title="Browse components" description="Previews, props and source for every component." />
    </>
  );
}
