import React from "react";
import { Seo } from "@/lib/head";
import { Link } from "react-router";
import { C, Callout, Defs, P, PageHeader, Section } from "@/components/ui/Prose";
import { CodeBlock } from "@/components/ui/Code";


const DEFAULT_CONFIG = `{
  "version": 4,
  "$schema": "https://nativra.vercel.app/schema.json",
  "registries": [{ "name": "default", "url": "https://nativra.vercel.app" }],
  "componentsDir": "components/ui",
  "hooksDir": "hooks",
  "utilsDir": "lib/utils",
  "themesDir": "lib/themes",
  "stylingTarget": "nativewind",
  "aliasPrefix": "@/"
}`;

const SRC_CONFIG = `{
  "version": 4,
  "$schema": "https://nativra.vercel.app/schema.json",
  "registries": [{ "name": "default", "url": "https://nativra.vercel.app" }],
  "componentsDir": "src/components/ui",
  "hooksDir": "src/hooks",
  "utilsDir": "src/lib/utils",
  "themesDir": "src/lib/themes",
  "stylingTarget": "stylesheet",
  "aliasPrefix": "@/",
  "aliases": {
    "components": "@/components/ui",
    "blocks": "@/components/ui",
    "hooks": "@/hooks",
    "utils": "@/lib/utils"
  }
}`;

export default function Configuration() {
  return (
    <>
      <Seo title={"Configuration"} description={"Every key in nativra.json: install directories, styling target, import aliases and registries, with the defaults init detects."} path="/docs/configuration" />
      <PageHeader
        eyebrow="Reference"
        title="Configuration"
        description={
          <>
            <C>nativra.json</C> tells the CLI where to write files, which
            styling target to install and how installed files import each other. <C>init</C> creates it; you can edit it by hand.
          </>
        }
        meta={["Reference"]}
      />

      <Section id="default" title="Default file">
        <P>
          <p>
            This is what <code>init --yes</code> writes for an Expo project with NativeWind, no <code>src/</code> folder and a{" "}
            <code>&quot;@/*&quot;: [&quot;./*&quot;]</code> path alias:
          </p>
        </P>
        <CodeBlock code={DEFAULT_CONFIG} lang="json" title="nativra.json" />
      </Section>

      <Section id="keys" title="Keys">
        <Defs
          items={[
            {
              term: "stylingTarget",
              desc: (
                <>
                  <C>&quot;nativewind&quot;</C> or{" "}
                  <C>&quot;stylesheet&quot;</C>. Which implementation of each item is installed.
                  Default: <C>nativewind</C>.
                </>
              ),
            },
            { term: "componentsDir", desc: <>Components and templates. Default: <C>components/ui</C>.</> },
            { term: "blocksDir", desc: <>Optional. Blocks go here when set, otherwise into <C>componentsDir</C>.</> },
            { term: "hooksDir", desc: <>Hooks. Default: <C>hooks</C>.</> },
            { term: "utilsDir", desc: <>Utilities such as <C>cn()</C>. Default: <C>lib/utils</C>.</> },
            { term: "themesDir", desc: <>Theme token files. Default: <C>lib/themes</C>.</> },
            {
              term: "aliasPrefix",
              desc: (
                <>
                  Prefix for rewritten imports. An import target is <C>aliasPrefix + dir</C>,
                  e.g. <C>@/components/ui</C>.
                </>
              ),
            },
            {
              term: "aliases",
              desc: (
                <>
                  Optional explicit import targets per kind (<C>components</C>,{" "}
                  <C>blocks</C>, <C>hooks</C>,{" "}
                  <C>utils</C>, <C>themes</C>). They
                  win over <C>aliasPrefix + dir</C>.
                </>
              ),
            },
            {
              term: "registries",
              desc: (
                <>
                  Named registry sources. <C>default</C> is used for every{" "}
                  <C>add</C>. See <Link className="link" to="/docs/registries">Custom registries</Link>.
                </>
              ),
            },
            { term: "version · $schema", desc: "Config format version (currently 4) and the JSON schema URL for editor hints." },
          ]}
        />
        <Callout type="warning" title="Directories must stay inside the project">
          Every directory must be a relative path. Absolute paths, drive letters and <code>..</code> segments are rejected when the
          config loads.
        </Callout>
      </Section>

      <Section id="detection" title="What init detects">
        <Defs
          items={[
            { term: "Framework", desc: <>Expo when <C>expo</C> is a dependency or an <C>app.json</C>/<C>app.config</C> exists; otherwise React Native.</> },
            { term: "Styling target", desc: <>NativeWind when <C>nativewind</C> or <C>tailwindcss</C> is installed or a Tailwind config exists; otherwise StyleSheet.</> },
            { term: "src/ layout", desc: <>With a <C>src/</C> folder, every default directory moves under it.</> },
            { term: "Path alias", desc: <>The first wildcard alias in <C>tsconfig.json</C>, such as <C>&quot;@/*&quot;: [&quot;./src/*&quot;]</C>.</> },
            { term: "Package manager", desc: "From the lockfile: pnpm, yarn, bun, otherwise npm. Used when installing npm dependencies." },
          ]}
        />
        <P>
          <p>
            Without <code>--yes</code>, init asks you to confirm the styling target and the components, hooks and utilities
            directories. It also adds <code>.nativra/</code> (local backups) to <code>.gitignore</code>.
          </p>
        </P>
      </Section>

      <Section id="aliases" title="When aliases are written">
        <P>
          <p>
            If your tsconfig alias points at a subfolder, <code>aliasPrefix + dir</code> would produce the wrong path, so init writes{" "}
            <code>aliases</code> explicitly. A project with <code>src/</code>, <code>&quot;@/*&quot;: [&quot;./src/*&quot;]</code> and the
            StyleSheet target gets:
          </p>
        </P>
        <CodeBlock code={SRC_CONFIG} lang="json" title="nativra.json" />
      </Section>

      <Section id="changes" title="Changing the config later">
        <P>
          <p>
            Edits apply to future <code>add</code>, <code>update</code> and <code>diff</code> runs. Files already installed stay where
            they are. Run <code>npx nativra-cli doctor</code> to check that the config is still valid.
          </p>
        </P>
      </Section>
    </>
  );
}
