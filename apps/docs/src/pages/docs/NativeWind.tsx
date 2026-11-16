import React from "react";
import { Seo } from "@/lib/head";
import { Link } from "react-router";
import { CommandLine } from "@/components/ui/CopyButton";
import { Callout, P, PageHeader, Section, Step, Steps } from "@/components/ui/Prose";
import { CodeBlock } from "@/components/ui/Code";


const TAILWIND = `/** @type {import('tailwindcss').Config} */
module.exports = {
  // Include every folder Nativra writes to (see componentsDir in nativra.json)
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Nativra components use semantic colors backed by the theme's CSS variables
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
      },
    },
  },
  plugins: [],
};`;

const BABEL = `module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};`;

const METRO = `const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });`;

const CSS = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

const LAYOUT = `import "../global.css";
import { Stack } from "expo-router";

export default function NativeWind() {
  return <Stack />;
}`;

export default function NativeWindPage() {
  return (
    <>
      <Seo title={"NativeWind v4 setup"} description={"Configure NativeWind v4 in an Expo app (Tailwind config, Babel, Metro, global.css) so Nativra's NativeWind components render their styles."} path="/docs/styling/nativewind" />
      <PageHeader
        eyebrow="Concepts"
        title="NativeWind"
        description="Nativra's NativeWind components style themselves with Tailwind classes. NativeWind v4 compiles those classes at build time — set it up once, then every component just works."
        meta={["5 min","NativeWind v4","Tailwind CSS 3.4"]}
      />

      <Callout type="tip" title="Prefer zero setup?">
        Choose the <Link className="link" to="/docs/styling/stylesheet">StyleSheet</Link> target instead — those components
        need no Babel, Metro or Tailwind configuration.
      </Callout>

      <Section id="setup" title="Set up NativeWind">
        <Steps>
          <Step title="Install the packages">
            <CommandLine command="npx expo install nativewind react-native-reanimated react-native-safe-area-context" />
            <CommandLine command="npm install --save-dev tailwindcss@^3.4.17" switcher />
          </Step>
          <Step title="Configure Tailwind">
            <CodeBlock code={TAILWIND} lang="js" title="tailwind.config.js" />
            <P>
              <p>
                The <code>content</code> globs must cover your <code>componentsDir</code>, and the <code>colors</code> map
                connects classes like <code>bg-primary</code> to your <Link to="/docs/theming">theme</Link>.
              </p>
            </P>
          </Step>
          <Step title="Add the Babel preset">
            <CodeBlock code={BABEL} lang="js" title="babel.config.js" />
          </Step>
          <Step title="Wrap the Metro config">
            <CodeBlock code={METRO} lang="js" title="metro.config.js" />
          </Step>
          <Step title="Create and import global.css">
            <CodeBlock code={CSS} lang="css" title="global.css" />
            <P>
              <p>
                You don&apos;t write the theme variables yourself: the first <code>nativra-cli add</code> appends the default
                zinc theme to this file.
              </p>
            </P>
            <CodeBlock code={LAYOUT} title="app/_layout.tsx" />
          </Step>
          <Step title="Add the TypeScript types">
            <CodeBlock code={`/// <reference types="nativewind/types" />`} lang="ts" title="nativewind-env.d.ts" />
          </Step>
        </Steps>
      </Section>

      <Section id="nativra" title="Point Nativra at NativeWind">
        <P>
          <p>
            <code>init</code> picks NativeWind automatically when it finds <code>nativewind</code> or a Tailwind config. If you
            initialized earlier with StyleSheet, set <code>&quot;stylingTarget&quot;: &quot;nativewind&quot;</code> in{" "}
            <code>nativra.json</code>; new <code>add</code> runs then install the NativeWind versions.
          </p>
        </P>
        <CommandLine command="npx nativra-cli add button" switcher />
      </Section>

      <Section id="troubleshooting" title="Troubleshooting">
        <P>
          <ul>
            <li>
              <strong>Components render unstyled</strong> — the Metro wrapper or the <code>global.css</code> import is missing, or
              <code> content</code> doesn&apos;t include your components folder. Restart Metro with <code>--clear</code> after
              config changes.
            </li>
            <li>
              <strong>className type errors</strong> — add <code>nativewind-env.d.ts</code> and make sure it is included by
              your tsconfig.
            </li>
            <li>
              <strong>Still stuck?</strong> Run <code>npx nativra-cli doctor</code> — it checks the NativeWind setup and can
              scaffold a missing Tailwind config with <code>--fix</code>.
            </li>
          </ul>
        </P>
      </Section>
    </>
  );
}
