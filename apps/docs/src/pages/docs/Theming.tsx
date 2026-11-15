import React from "react";
import { Seo } from "@/lib/head";
import { Link } from "react-router";
import { THEME_PRESETS, toCssVariables, zincTheme } from "@nativra/theme-engine";
import { itemsOfType } from "@/lib/data";
import { itemHref } from "@/lib/item-types";
import { CommandLine } from "@/components/ui/CopyButton";
import { Callout, Defs, P, PageHeader, Section } from "@/components/ui/Prose";
import { CodeBlock } from "@/components/ui/Code";


const TOKEN_DOCS = [
  { term: "background · foreground", desc: "Screen surface and the default text on it." },
  { term: "card · popover", desc: "Raised surfaces (cards, sheets, menus) and their text (-foreground)." },
  { term: "primary", desc: "The main action color — primary buttons, active states, focus rings." },
  { term: "secondary · accent", desc: "Low-emphasis fills for secondary buttons, chips and hovered rows." },
  { term: "muted", desc: "Subtle backgrounds; muted-foreground is for helper text and placeholders." },
  { term: "destructive", desc: "Errors and destructive actions." },
  { term: "success · warning · info", desc: "Status colors: completed and up-trends, pending and caution, neutral tips. Each has a -foreground." },
  { term: "border · input · ring", desc: "Dividers, input outlines and the keyboard focus ring." },
];

const STYLE_DOCS = [
  { term: "radius.button · chip", desc: "Buttons and badges. Soft & friendly: 9999 (pills)." },
  { term: "radius.control", desc: "Inputs, selects, segmented controls and small tiles (14)." },
  { term: "radius.card · surface", desc: "Cards and list groups (20); dialogs, sheets and toasts (28)." },
  { term: "shadow.card · raised · overlay", desc: "Resting cards, floating menus and toasts, dialogs and sheets. Apply with elevation(level)." },
  { term: "pressedScale", desc: "How far pressables shrink while held (0.97). Apply with pressedStyle(pressed)." },
  { term: "fontWeight · headingLetterSpacing", desc: "Heading, title and label weights, and heading tracking, used by Text and Button." },
];

const STYLE_USAGE = `import { Pressable, Text } from "react-native";
import { elevation, pressedStyle, themeStyle, useThemeColors } from "@/hooks/use-theme-colors";

export function PromoCard({ onPress }: { onPress: () => void }) {
  const c = useThemeColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        { backgroundColor: c.card, borderRadius: themeStyle.radius.card, padding: 20 },
        elevation("card"),
        pressedStyle(pressed),
      ]}
    >
      <Text style={{ color: c.foreground, fontWeight: themeStyle.fontWeight.title }}>Matches the theme's shape</Text>
    </Pressable>
  );
}`;

const TS_USAGE = `import { View, Text } from "react-native";
import { useThemeColors } from "@/hooks/use-theme-colors";

export function Banner() {
  const c = useThemeColors(); // follows the device's light/dark setting
  return (
    <View style={{ backgroundColor: c.muted, borderColor: c.border, borderWidth: 1 }}>
      <Text style={{ color: c.foreground }}>Same tokens as the components</Text>
    </View>
  );
}`;

const THEME_FILE = `// lib/themes/theme.ts — installed with your first component
export const zinc = { background: "#ffffff", primary: "#18181b", /* … */ } as const;
export const zincDark = { background: "#09090b", primary: "#fafafa", /* … */ } as const;

// What every component reads (through useThemeColors / the CSS variables)
export const themeColors = { light: zinc, dark: zincDark } as const;`;

const TAILWIND = `// tailwind.config.js — theme.extend
colors: {
  border: "rgb(var(--color-border) / <alpha-value>)",
  input: "rgb(var(--color-input) / <alpha-value>)",
  ring: "rgb(var(--color-ring) / <alpha-value>)",
  background: "rgb(var(--color-background) / <alpha-value>)",
  foreground: "rgb(var(--color-foreground) / <alpha-value>)",
  primary: { DEFAULT: "rgb(var(--color-primary) / <alpha-value>)", foreground: "rgb(var(--color-primary-foreground) / <alpha-value>)" },
  secondary: { DEFAULT: "rgb(var(--color-secondary) / <alpha-value>)", foreground: "rgb(var(--color-secondary-foreground) / <alpha-value>)" },
  muted: { DEFAULT: "rgb(var(--color-muted) / <alpha-value>)", foreground: "rgb(var(--color-muted-foreground) / <alpha-value>)" },
  accent: { DEFAULT: "rgb(var(--color-accent) / <alpha-value>)", foreground: "rgb(var(--color-accent-foreground) / <alpha-value>)" },
  destructive: { DEFAULT: "rgb(var(--color-destructive) / <alpha-value>)", foreground: "rgb(var(--color-destructive-foreground) / <alpha-value>)" },
  success: { DEFAULT: "rgb(var(--color-success) / <alpha-value>)", foreground: "rgb(var(--color-success-foreground) / <alpha-value>)" },
  warning: { DEFAULT: "rgb(var(--color-warning) / <alpha-value>)", foreground: "rgb(var(--color-warning-foreground) / <alpha-value>)" },
  info: { DEFAULT: "rgb(var(--color-info) / <alpha-value>)", foreground: "rgb(var(--color-info-foreground) / <alpha-value>)" },
  card: { DEFAULT: "rgb(var(--color-card) / <alpha-value>)", foreground: "rgb(var(--color-card-foreground) / <alpha-value>)" },
  popover: { DEFAULT: "rgb(var(--color-popover) / <alpha-value>)", foreground: "rgb(var(--color-popover-foreground) / <alpha-value>)" },
},`;

export default function Theming() {
  const themes = itemsOfType("theme").filter((t) => THEME_PRESETS[t.id]);
  // Real adapter output, trimmed to the color block for readability.
  const css = toCssVariables(zincTheme).split("\n").slice(0, 8).join("\n") + "\n  /* … */\n}";

  return (
    <>
      <Seo title={"Theming"} description={"Nativra themes are semantic color tokens with light and dark palettes. Every component reads them, so switching themes restyles your whole UI."} path="/docs/theming" />
      <PageHeader
        eyebrow="Concepts"
        title="Theming"
        description="A theme is a set of semantic color tokens with a light and a dark palette. Every Nativra component reads them, so one command restyles your whole UI."
        meta={`${themes.length} presets · light and dark`.split(" · ")}
      />

      <Section id="how-it-works" title="How theming works">
        <P>
          <p>
            Every component reads its colors from one file: <code>lib/themes/theme.ts</code>. It is installed with the{" "}
            <strong>zinc</strong> theme the first time you add a component, and holds a light and a dark palette of the same
            semantic tokens.
          </p>
          <ul>
            <li>
              <strong>StyleSheet</strong> components read it through the <Link to="/docs/hooks/use-theme-colors">useThemeColors</Link>{" "}
              hook and follow the device&apos;s light/dark setting.
            </li>
            <li>
              <strong>NativeWind</strong> components use semantic classes (<code>bg-primary</code>,{" "}
              <code>text-muted-foreground</code>) backed by CSS variables in <code>global.css</code>.
            </li>
          </ul>
        </P>
        <CodeBlock code={THEME_FILE} lang="ts" title="lib/themes/theme.ts" />
      </Section>

      <Section id="switch" title="Switch themes">
        <P>
          <p>Replace the theme file with another preset. Every installed component picks up the new palette:</p>
        </P>
        <CommandLine command="npx nativra-cli theme add midnight --overwrite --apply-css" switcher />
        <P>
          <p>
            <code>--overwrite</code> replaces <code>theme.ts</code> (the old one is backed up — undo with{" "}
            <code>nativra rollback midnight</code>). <code>--apply-css</code> rewrites the CSS variables for NativeWind; it
            is harmless with StyleSheet.
          </p>
        </P>
        <Callout type="tip" title="Customize a preset">
          The theme file is yours: change a value in <code>theme.ts</code> (and, for NativeWind, the matching variable in{" "}
          <code>global.css</code>) to adjust a color everywhere at once.
        </Callout>
      </Section>

      <Section id="tokens" title="Token reference">
        <Defs items={TOKEN_DOCS} />
        <P>
          <p>
            Each token has a matching <code>-foreground</code> where text sits on it (for example{" "}
            <code>primary-foreground</code> for text on a primary button).
          </p>
        </P>
      </Section>

      <Section id="style" title="Style tokens: shape and depth">
        <P>
          <p>
            A theme sets more than color. <code>theme.ts</code> also exports <code>themeStyle</code>: corner radii by role, a
            border width, three soft shadow levels, press feedback and heading weights. Components read radii by{" "}
            <em>role</em> rather than size, so a theme can make every button a pill and another make it a crisp rectangle,
            without touching component code. Every preset ships the <strong>Soft &amp; friendly</strong> style.
          </p>
        </P>
        <Defs items={STYLE_DOCS} />
        <CodeBlock code={STYLE_USAGE} title="components/PromoCard.tsx" />
        <P>
          <p>
            NativeWind components use semantic classes for the same roles (<code>rounded-button</code>,{" "}
            <code>rounded-card</code>, <code>rounded-t-surface</code>, …). The CLI generates them into <code>global.css</code>{" "}
            together with the color variables, and refreshes an older block automatically on <code>add</code> and{" "}
            <code>update</code>.
          </p>
        </P>
      </Section>

      <Section id="presets" title="Presets">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {themes.map((t) => {
            const p = THEME_PRESETS[t.id]!;
            return (
              <li key={t.id}>
                <Link to={itemHref("theme", t.id)} className="group block rounded-md border border-border p-2 transition-colors hover:border-foreground/25">
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
      </Section>

      <Section id="stylesheet" title="With StyleSheet">
        <P>
          <p>Use the same hook in your own screens so they match the components:</p>
        </P>
        <CodeBlock code={TS_USAGE} title="components/Banner.tsx" />
      </Section>

      <Section id="nativewind" title="With NativeWind">
        <P>
          <p>
            When you add a component and <code>global.css</code> has no theme yet, the CLI writes the theme&apos;s variables
            there between marker comments (later <code>--apply-css</code> runs replace the block). The values are RGB channels
            so opacity modifiers like <code>bg-primary/10</code> work:
          </p>
        </P>
        <CodeBlock code={css} lang="css" title="global.css (generated)" />
        <P>
          <p>
            Map them once in your Tailwind config. <code>add</code> and <code>doctor</code> warn when this is missing, and{" "}
            <code>doctor --fix</code> includes it when it scaffolds a new config:
          </p>
        </P>
        <CodeBlock code={TAILWIND} lang="js" title="tailwind.config.js" />
      </Section>
    </>
  );
}
