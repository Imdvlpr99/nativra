import type { Metadata } from "next";
import Link from "next/link";
import { CommandLine } from "@/components/docs/CopyButton";
import { CodeBlock, Defs, DocsHeader, DocsSection, NextStep, P } from "@/components/docs/Prose";

export const metadata: Metadata = {
  title: "StyleSheet — Zero-configuration Nativra components",
  description:
    "Use Nativra with plain React Native StyleSheet: no Babel plugin, no Metro config, no Tailwind. How the components handle dark mode and how to restyle them.",
  alternates: { canonical: "/docs/styling/stylesheet" },
};

const CONFIG = `{
  "stylingTarget": "stylesheet"
}`;

/** Trimmed from registry/default/components/badge/stylesheet/Badge.tsx */
const PATTERN = `import { View, Text, StyleSheet, useColorScheme, type ViewStyle } from "react-native";

const styles = StyleSheet.create({
  base: { flexDirection: "row", alignItems: "center", borderRadius: 999 },
  md: { paddingHorizontal: 10, paddingVertical: 2 },
});

function getContainerStyle(variant: BadgeVariant, dark: boolean): ViewStyle {
  const map: Record<BadgeVariant, ViewStyle> = {
    default: { backgroundColor: dark ? "#fafafa" : "#171717" },
    primary: { backgroundColor: dark ? "#0c4a6e" : "#e0f2fe" },
    // …
  };
  return map[variant];
}

export function Badge({ label, variant = "default", size = "md" }: BadgeProps) {
  const dark = useColorScheme() === "dark";
  return (
    <View style={[styles.base, styles[size], getContainerStyle(variant, dark)]}>
      <Text>{label}</Text>
    </View>
  );
}`;

export default function StyleSheetPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Guides"
        title="StyleSheet"
        description="The StyleSheet target uses only React Native primitives. There is nothing to configure: install a component and render it."
        meta="2 min · no build configuration"
      />

      <DocsSection id="choose" title="Choose the StyleSheet target">
        <P>
          <p>
            <code>init</code> selects StyleSheet when your project has no NativeWind or Tailwind config. To switch later, set the
            target in <code>nativra.json</code> — future <code>add</code> and <code>update</code> runs install the StyleSheet
            versions.
          </p>
        </P>
        <CodeBlock code={CONFIG} lang="json" title="nativra.json" />
        <CommandLine command="npx nativra-cli add badge" switcher />
      </DocsSection>

      <DocsSection id="how-it-works" title="How the components are written">
        <P>
          <p>
            Static layout goes in <code>StyleSheet.create</code>. Colors are chosen per variant and color scheme with{" "}
            <code>useColorScheme()</code>, so components follow the device&apos;s light or dark setting:
          </p>
        </P>
        <CodeBlock code={PATTERN} title="components/ui/Badge.tsx (excerpt)" />
      </DocsSection>

      <DocsSection id="restyle" title="Restyling">
        <Defs
          items={[
            { term: "Change a color", desc: "Edit the value in the component's color map. It is your file — there is no override layer." },
            { term: "Use your theme", desc: <>Replace hex values with tokens from a theme file (<Link className="link" href="/docs/theming#stylesheet">Theming → StyleSheet</Link>).</> },
            { term: "Add a variant", desc: "Extend the variant union type and add an entry to the map; TypeScript flags every place that needs it." },
          ]}
        />
      </DocsSection>

      <DocsSection id="tradeoffs" title="StyleSheet or NativeWind?">
        <P>
          <ul>
            <li>
              <strong>StyleSheet</strong> — no build tooling, plain objects you can compute at runtime. Best for teams that
              don&apos;t use Tailwind.
            </li>
            <li>
              <strong>NativeWind</strong> — Tailwind classes and <code>dark:</code> variants, matching a web codebase. Needs
              one-time <Link href="/docs/styling/nativewind">setup</Link>.
            </li>
          </ul>
          <p>Both targets have the same props, so switching later doesn&apos;t change how your screens use the components.</p>
        </P>
      </DocsSection>

      <NextStep href="/docs/compatibility" title="Compatibility" description="Supported platforms, SDKs and per-item support." />
    </>
  );
}
