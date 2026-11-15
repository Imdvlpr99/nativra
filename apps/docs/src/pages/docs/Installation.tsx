import React from "react";
import { Seo } from "@/lib/head";
import { Link } from "react-router";
import { EXPO_MIN, RN_MIN } from "@/lib/data";
import { CommandLine } from "@/components/ui/CopyButton";
import { C, Callout, Defs, P, PageHeader, Section, Step, Steps } from "@/components/ui/Prose";
import { CodeBlock } from "@/components/ui/Code";



const USAGE = `import { View } from "react-native";
import { Button } from "@/components/ui/Button";

export default function Installation() {
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
      <Seo title={"Installation"} description={`Set up Nativra in an Expo SDK ${EXPO_MIN}+ or React Native ${RN_MIN}+ project: run nativra-cli init, check nativra.json and add your first component.`} path="/docs/installation" />
      <PageHeader
        eyebrow="Get started · 02"
        title="Installation"
        description="Add Nativra to a new or existing project. Nothing in your app changes until you add a component."
        meta={["2 min", "Node.js 20+", `Expo SDK ${EXPO_MIN}+`]}
      />

      <Section id="requirements" title="Requirements">
        <Defs
          items={[
            { term: "Node.js", desc: "20 or newer. Only the CLI needs it; nothing from Nativra runs in your app." },
            { term: "Expo / React Native", desc: `Expo SDK ${EXPO_MIN}+ or React Native ${RN_MIN}+. The New Architecture is supported.` },
            { term: "Styling", desc: <>NativeWind v4 <em>or</em> plain <C>StyleSheet</C>. <C>init</C> picks one from what you have installed.</> },
            { term: "TypeScript", desc: "Recommended. Components are written in strict TypeScript." },
          ]}
        />
      </Section>

      <Section id="setup" title="Set up your project">
        <Steps>
          <Step title="Create or open an app">
            <P>
              <p>Skip this if you already have a project.</p>
            </P>
            <CommandLine command="npx create-expo-app@latest my-app" switcher />
          </Step>
          <Step title="Run init">
            <CommandLine command="npx nativra-cli init" switcher />
            <P>
              <p>
                <C>init</C> detects Expo or bare React Native, NativeWind, a <C>src/</C> folder, your package manager and your{" "}
                <C>tsconfig.json</C> path alias, then asks you to confirm. Pass <C>--yes</C> to accept the detected values.
              </p>
              <p>
                It writes <C>nativra.json</C> and adds <C>.nativra/</C> (local update backups) to <C>.gitignore</C>.
              </p>
            </P>
          </Step>
          <Step title="Add a component">
            <CommandLine command="npx nativra-cli add button" switcher />
            <P>
              <p>
                This writes <C>components/ui/Button.tsx</C> along with what it depends on: the <C>use-theme-colors</C> hook and
                the default <C>zinc</C> theme. Each file&apos;s hash goes into <C>nativra.lock.json</C>.
              </p>
            </P>
          </Step>
          <Step title="Use it">
            <CodeBlock code={USAGE} title="app/index.tsx" />
          </Step>
          <Step title="Commit">
            <P>
              <p>
                Commit <C>nativra.json</C>, <C>nativra.lock.json</C> and the new files. The lockfile is how later{" "}
                <C>update</C> and <C>diff</C> runs recognise your edits.
              </p>
            </P>
          </Step>
        </Steps>
      </Section>

      <Section id="nativewind" title="Using NativeWind?">
        <Callout type="warning" title="Configure NativeWind before adding components">
          NativeWind components need NativeWind&apos;s Babel and Metro setup and a Tailwind config that maps the theme colors.
          Follow <Link to="/docs/styling/nativewind" className="link">NativeWind setup</Link>, or use the StyleSheet target,
          which needs no configuration.
        </Callout>
      </Section>

      <Section id="check" title="Check your setup">
        <P>
          <p>
            <C>doctor</C> validates <C>nativra.json</C>, your versions against the tested range, the TypeScript alias and the
            NativeWind config. See <Link to="/docs/doctor-audit">Doctor &amp; audit</Link>.
          </p>
        </P>
        <CommandLine command="npx nativra-cli doctor" switcher />
      </Section>
    </>
  );
}
