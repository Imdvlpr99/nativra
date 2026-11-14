import type { Metadata } from "next";
import Link from "next/link";
import { CommandLine } from "@/components/docs/CopyButton";
import { Callout, CodeBlock, Defs, DocsHeader, DocsSection, NextStep, P, Step, Steps } from "@/components/docs/Prose";

export const metadata: Metadata = {
  title: "Installation — Set Up Nativra in Expo & React Native",
  description:
    "Install Nativra in an Expo SDK 51+ or React Native 0.74+ project: run npx nativra-cli init, review nativra.json and add your first component.",
  alternates: { canonical: "/docs/installation" },
};

const CONFIG = `{
  "$schema": "https://nativra.vercel.app/schema.json",
  "version": 4,
  "registries": [{ "name": "default", "url": "https://nativra.vercel.app" }],
  "stylingTarget": "nativewind",
  "componentsDir": "components/ui",
  "hooksDir": "hooks",
  "utilsDir": "lib/utils",
  "themesDir": "lib/themes",
  "aliasPrefix": "@/"
}`;

const USAGE = `import { View } from "react-native";
import { Button } from "@/components/ui/Button";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Button variant="primary" onPress={() => console.log("pressed")}>
        Continue
      </Button>
    </View>
  );
}`;

export default function InstallationPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Getting started"
        title="Installation"
        description="Add Nativra to a new or existing Expo project. It takes about two minutes and changes nothing until you add a component."
        meta="2 min · requires Node.js 20+"
      />

      <DocsSection id="requirements" title="Requirements">
        <Defs
          items={[
            { term: "Node.js", desc: "20 or newer (for the CLI only — nothing runs in your app)." },
            { term: "Expo / React Native", desc: "Expo SDK 51+ or React Native 0.74+. The New Architecture is supported." },
            { term: "Styling", desc: <>NativeWind v4 <em>or</em> plain StyleSheet. You pick one during <code className="font-mono text-foreground">init</code>.</> },
            { term: "TypeScript", desc: "Recommended. Components are written in TypeScript." },
          ]}
        />
      </DocsSection>

      <DocsSection id="setup" title="Set up your project">
        <Steps>
          <Step title="Create or open an Expo app">
            <P>
              <p>Skip this step if you already have a project.</p>
            </P>
            <CommandLine command="npx create-expo-app@latest my-app" switcher />
          </Step>
          <Step title="Initialize Nativra">
            <P>
              <p>
                Run this in the project root. It detects Expo vs. bare React Native, NativeWind, a <code>src/</code> folder,
                your package manager and your <code>tsconfig.json</code> path alias, then asks you to confirm.
              </p>
            </P>
            <CommandLine command="npx nativra-cli init" switcher />
            <P>
              <p>
                It writes <code>nativra.json</code> and adds <code>.nativra/</code> (local update backups) to your{" "}
                <code>.gitignore</code>.
              </p>
            </P>
          </Step>
          <Step title="Add a component">
            <CommandLine command="npx nativra-cli add button" switcher />
            <P>
              <p>
                The source lands in <code>components/ui/Button.tsx</code> with imports rewritten to your aliases, and its hash is
                recorded in <code>nativra.lock.json</code>. Commit both files.
              </p>
            </P>
          </Step>
          <Step title="Use it">
            <CodeBlock code={USAGE} title="app/index.tsx" />
          </Step>
        </Steps>
      </DocsSection>

      <DocsSection id="configuration" title="What init writes">
        <P>
          <p>
            <code>nativra.json</code> tells the CLI where files go and how imports should look. You can edit it at any time;
            it only affects future <code>add</code> and <code>update</code> runs.
          </p>
        </P>
        <CodeBlock code={CONFIG} lang="json" title="nativra.json" />
        <Defs
          items={[
            { term: "stylingTarget", desc: <>Which implementation to install: <code className="font-mono text-foreground">nativewind</code> or <code className="font-mono text-foreground">stylesheet</code>.</> },
            { term: "componentsDir", desc: "Destination for components, blocks and templates." },
            { term: "hooksDir · utilsDir · themesDir", desc: "Destinations for hooks, utilities and theme token files." },
            { term: "aliasPrefix · aliases", desc: <>How installed files import each other (<code className="font-mono text-foreground">@/components/ui/…</code>). <code className="font-mono text-foreground">init</code> derives these from your tsconfig.</> },
            { term: "registries", desc: <>Where items are fetched from. Add private registries with <Link className="link" href="/docs/cli#registry-add">registry add</Link>.</> },
          ]}
        />
      </DocsSection>

      <DocsSection id="nativewind" title="Using NativeWind?">
        <Callout type="tip" title="Set up NativeWind first">
          NativeWind needs its Babel/Metro config and a Tailwind config before NativeWind components render styles. Follow the{" "}
          <Link className="link" href="/docs/styling/nativewind">NativeWind guide</Link>, or choose the StyleSheet target, which needs no setup.
        </Callout>
      </DocsSection>

      <NextStep href="/docs/quickstart" title="Quick start" description="Build a sign-in screen, customize it, and update it safely." />
    </>
  );
}
