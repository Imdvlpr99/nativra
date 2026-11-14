import type { Metadata } from "next";
import Link from "next/link";
import { THEME_PRESETS, toCssVariables, zincTheme } from "@nativra/theme-engine";
import { getItemsByType } from "@/lib/registry";
import { itemHref } from "@/lib/item-types";
import { CommandLine } from "@/components/docs/CopyButton";
import { Callout, CodeBlock, Defs, DocsHeader, DocsSection, NextStep, P } from "@/components/docs/Prose";

export const metadata: Metadata = {
  title: "Theming — Semantic Tokens and Theme Presets for React Native",
  description:
    "Nativra themes are semantic color tokens with light and dark palettes. Install one as a TypeScript file or as CSS variables for NativeWind.",
  alternates: { canonical: "/docs/theming" },
};

const TOKEN_DOCS = [
  { term: "background · foreground", desc: "Screen surface and the default text on it." },
  { term: "card · popover", desc: "Raised surfaces (cards, sheets, menus) and their text (-foreground)." },
  { term: "primary", desc: "The main action color — primary buttons, active states, focus rings." },
  { term: "secondary · accent", desc: "Low-emphasis fills for secondary buttons, chips and hovered rows." },
  { term: "muted", desc: "Subtle backgrounds; muted-foreground is for helper text and placeholders." },
  { term: "destructive", desc: "Errors and destructive actions." },
  { term: "border · input · ring", desc: "Dividers, input outlines and the keyboard focus ring." },
];

const TS_USAGE = `import { StyleSheet, useColorScheme } from "react-native";
import { midnight, midnightDark } from "@/lib/themes/theme";

export function useTokens() {
  return useColorScheme() === "dark" ? midnightDark : midnight;
}

// in a component
const t = useTokens();
<View style={{ backgroundColor: t.background, borderColor: t.border }} />`;

const TAILWIND = `// tailwind.config.js
module.exports = {
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: "var(--color-primary)",
        "primary-foreground": "var(--color-primary-foreground)",
        muted: "var(--color-muted)",
        border: "var(--color-border)",
      },
    },
  },
};`;

export default async function ThemingPage() {
  const themes = (await getItemsByType("theme")).filter((t) => THEME_PRESETS[t.id]);
  // Real adapter output, trimmed to the color block for readability.
  const css = toCssVariables(zincTheme).split("\n").slice(0, 8).join("\n") + "\n  /* … */\n}";

  return (
    <>
      <DocsHeader
        eyebrow="Guides"
        title="Theming"
        description="A theme is a set of semantic color tokens with a light and a dark palette. Install one as a TypeScript file, or as CSS variables for NativeWind."
        meta={`${themes.length} presets · light and dark`}
      />

      <DocsSection id="how-it-works" title="How theming works">
        <P>
          <p>
            Components ship with a neutral palette and light/dark support built in. Because their colors live in your copy of
            each file, you restyle a component by editing it.
          </p>
          <p>
            Themes are for the rest of your app: they give your own screens the same vocabulary — <code>background</code>,{" "}
            <code>primary</code>, <code>muted</code> — so you never hard-code a hex value twice.
          </p>
        </P>
        <Callout type="note" title="Installing a theme doesn't restyle installed components">
          Components use their own colors today. To align a component with a theme, replace its color values with the theme&apos;s
          tokens — it&apos;s your code.
        </Callout>
      </DocsSection>

      <DocsSection id="tokens" title="Token reference">
        <Defs items={TOKEN_DOCS} />
        <P>
          <p>
            Each token has a matching <code>-foreground</code> where text sits on it (for example{" "}
            <code>primary-foreground</code> for text on a primary button).
          </p>
        </P>
      </DocsSection>

      <DocsSection id="presets" title="Presets">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {themes.map((t) => {
            const p = THEME_PRESETS[t.id]!;
            return (
              <li key={t.id}>
                <Link href={itemHref("theme", t.id)} className="group block rounded-lg border border-border p-2 transition-colors hover:border-foreground/30">
                  <span className="grid h-14 grid-cols-2 overflow-hidden rounded-md" aria-hidden="true">
                    <span className="flex items-end p-2" style={{ background: String(p.light.background) }}>
                      <span className="h-3 w-8 rounded-sm" style={{ background: String(p.light.primary) }} />
                    </span>
                    <span className="flex items-end p-2" style={{ background: String(p.dark.background) }}>
                      <span className="h-3 w-8 rounded-sm" style={{ background: String(p.dark.primary) }} />
                    </span>
                  </span>
                  <span className="mt-2 block px-1 text-sm font-medium">{t.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </DocsSection>

      <DocsSection id="stylesheet" title="With StyleSheet">
        <P>
          <p>
            <code>theme add</code> writes a typed token file with both palettes to your <code>themesDir</code>{" "}
            (default <code>lib/themes</code>):
          </p>
        </P>
        <CommandLine command="npx nativra-cli theme add midnight" switcher />
        <CodeBlock code={TS_USAGE} title="hooks/use-tokens.ts" />
      </DocsSection>

      <DocsSection id="nativewind" title="With NativeWind">
        <P>
          <p>
            Add <code>--apply-css</code> to also write the tokens as CSS variables into your <code>global.css</code> (between
            marker comments, so running it again replaces the block):
          </p>
        </P>
        <CommandLine command="npx nativra-cli theme add midnight --apply-css" switcher />
        <CodeBlock code={css} lang="css" title="global.css (generated)" />
        <P>
          <p>Then map the variables to Tailwind colors so classes like <code>bg-background</code> work:</p>
        </P>
        <CodeBlock code={TAILWIND} lang="js" title="tailwind.config.js" />
      </DocsSection>

      <NextStep href="/docs/styling/nativewind" title="NativeWind setup" description="Configure NativeWind v4 for Nativra components." />
    </>
  );
}
