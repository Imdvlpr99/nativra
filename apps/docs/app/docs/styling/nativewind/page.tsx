import type { Metadata } from "next";
import Link from "next/link";
import { CommandLine } from "@/components/docs/CopyButton";
import { Callout, CodeBlock, DocsHeader, DocsSection, NextStep, P, Step, Steps } from "@/components/docs/Prose";

export const metadata: Metadata = {
  title: "NativeWind v4 setup — Tailwind classes for Nativra components",
  description:
    "Configure NativeWind v4 in an Expo app (Tailwind config, Babel, Metro, global.css) so Nativra's NativeWind components render their styles.",
  alternates: { canonical: "/docs/styling/nativewind" },
};

const TAILWIND = `/** @type {import('tailwindcss').Config} */
module.exports = {
  // Include every folder Nativra writes to (see componentsDir in nativra.json)
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: { extend: {} },
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

export default function RootLayout() {
  return <Stack />;
}`;

export default function NativeWindPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Guides"
        title="NativeWind"
        description="Nativra's NativeWind components style themselves with Tailwind classes. NativeWind v4 compiles those classes at build time — set it up once, then every component just works."
        meta="5 min · NativeWind v4 · Tailwind CSS 3.4"
      />

      <Callout type="tip" title="Prefer zero setup?">
        Choose the <Link className="link" href="/docs/styling/stylesheet">StyleSheet</Link> target instead — those components
        need no Babel, Metro or Tailwind configuration.
      </Callout>

      <DocsSection id="setup" title="Set up NativeWind">
        <Steps>
          <Step title="Install the packages">
            <CommandLine command="npx expo install nativewind react-native-reanimated react-native-safe-area-context" />
            <CommandLine command="npm install --save-dev tailwindcss@^3.4.17" switcher />
          </Step>
          <Step title="Configure Tailwind">
            <CodeBlock code={TAILWIND} lang="js" title="tailwind.config.js" />
            <P>
              <p>
                The <code>content</code> globs must cover your <code>componentsDir</code>, or Tailwind will not generate the
                classes Nativra components use.
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
            <CodeBlock code={LAYOUT} title="app/_layout.tsx" />
          </Step>
          <Step title="Add the TypeScript types">
            <CodeBlock code={`/// <reference types="nativewind/types" />`} lang="ts" title="nativewind-env.d.ts" />
          </Step>
        </Steps>
      </DocsSection>

      <DocsSection id="nativra" title="Point Nativra at NativeWind">
        <P>
          <p>
            <code>init</code> picks NativeWind automatically when it finds <code>nativewind</code> or a Tailwind config. If you
            initialized earlier with StyleSheet, set <code>&quot;stylingTarget&quot;: &quot;nativewind&quot;</code> in{" "}
            <code>nativra.json</code>; new <code>add</code> runs then install the NativeWind versions.
          </p>
        </P>
        <CommandLine command="npx nativra-cli add button" switcher />
      </DocsSection>

      <DocsSection id="troubleshooting" title="Troubleshooting">
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
      </DocsSection>

      <NextStep href="/docs/styling/stylesheet" title="StyleSheet" description="The zero-configuration alternative." />
    </>
  );
}
