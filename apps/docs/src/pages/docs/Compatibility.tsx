import React from "react";
import { Seo } from "@/lib/head";
import { Link } from "react-router";
import { Check, Minus } from "lucide-react";
import { ITEMS, MATRIX } from "@/lib/data";
import { ITEM_TYPE_ORDER, TYPE_META, itemHref } from "@/lib/item-types";
import { C, Defs, P, PageHeader, Section } from "@/components/ui/Prose";


function list(values: readonly string[]): string {
  return values.length <= 1 ? values.join("") : `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;
}

function Mark({ ok }: { ok: boolean | undefined }) {
  return ok ? (
    <Check className="mx-auto h-4 w-4 text-brand" aria-label="Supported" />
  ) : (
    <Minus className="mx-auto h-4 w-4 text-muted-foreground/60" aria-label="Not supported" />
  );
}

export default function Compatibility() {
  const items = ITEMS;

  return (
    <>
      <Seo title={"Compatibility"} description={"Supported Expo SDK, React Native, iOS, Android and tooling versions for Nativra, plus per-item platform support generated from the registry."} path="/docs/compatibility" />
      <PageHeader
        eyebrow="Reference"
        title="Compatibility"
        description="What Nativra supports, and how each registry item declares its platforms."
        meta={`${items.length} items · platform data from the registry`.split(" · ")}
      />

      <Section id="runtimes" title="Runtimes">
        <P>
          <p>
            These values come from the compatibility matrix in <C>@nativra/registry-schema</C>, the same data{" "}
            <Link to="/docs/doctor-audit#doctor">doctor</Link> checks your project against.
          </p>
        </P>
        <Defs
          items={[
            { term: "Expo SDK", desc: <>{MATRIX.expo.minSdk} or newer. Tested on {list(MATRIX.expo.testedSdks.map(String))}. <C>doctor</C> fails below the minimum.</> },
            { term: "React Native", desc: <>{MATRIX.reactNative.min} or newer. Tested on {list(MATRIX.reactNative.tested)}. <C>doctor</C> warns below the minimum.</> },
            { term: "React", desc: <>{MATRIX.react.min} or newer. Tested on {list(MATRIX.react.tested)}.</> },
            { term: "TypeScript", desc: <>{MATRIX.typescript.min} or newer. Tested on {list(MATRIX.typescript.tested)}.</> },
            { term: "iOS", desc: <>Deployment target {MATRIX.ios.minDeploymentTarget} or newer.</> },
            { term: "Android", desc: <>minSdk {MATRIX.android.minSdk}, targetSdk {MATRIX.android.targetSdk}.</> },
            { term: "React Navigation", desc: list(MATRIX.reactNavigation.supportedVersions) },
          ]}
        />
      </Section>

      <Section id="styling" title="Styling targets">
        <Defs
          items={[
            { term: "NativeWind", desc: <>{list(MATRIX.nativewind.supportedVersions)}, with Tailwind CSS 3.4.</> },
            { term: "StyleSheet", desc: "Any React Native version above; no extra packages." },
          ]}
        />
      </Section>

      <Section id="tooling" title="CLI requirements">
        <Defs
          items={[
            { term: "Node.js", desc: "20 or newer." },
            { term: "Package managers", desc: "npm, pnpm, yarn and bun are detected automatically." },
            { term: "Operating systems", desc: "Windows, macOS and Linux." },
          ]}
        />
      </Section>

      <Section id="items" title="Per-item support">
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
            <div key={type} className="overflow-x-auto rounded-md border border-border">
              <table className="w-full text-left text-sm">
                <caption className="border-b border-border bg-surface px-4 py-2 text-left font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
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
                        <Link to={itemHref(type, i.id)} className="hover:underline">
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
      </Section>
    </>
  );
}
