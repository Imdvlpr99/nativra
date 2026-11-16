import React from "react";
import { Seo } from "@/lib/head";
import { Link } from "react-router";
import { C, Defs, P, PageHeader, Section } from "@/components/ui/Prose";
import { CodeBlock } from "@/components/ui/Code";
import { installPlan } from "@/lib/install-plan";


const REGISTRY_SOURCE = `// As authored in the registry: canonical aliases only
import { Text } from "@/components/ui/Text";
import { useThemeColors } from "@/hooks/use-theme-colors";`;

const INSTALLED = `// Installed with aliasPrefix "~/", componentsDir "ui", hooksDir "lib/hooks"
import { Text } from "~/ui/Text";
import { useThemeColors } from "~/lib/hooks/use-theme-colors";`;

const LOCK = `{
  "items": {
    "zinc": {
      "version": "0.1.0",
      "files": { "lib/themes/theme.ts": "1e37f57f…28a55c" }
    },
    "use-theme-colors": {
      "version": "0.1.0",
      "files": { "hooks/use-theme-colors.ts": "b950bc44…718fb8" },
      "dependencies": ["zinc"]
    },
    "button": {
      "version": "0.1.0",
      "files": { "components/ui/Button.tsx": "…" },
      "dependencies": ["use-theme-colors"]
    }
  }
}`;

const STAGES = [
  { title: "Registry", body: "Static JSON. registry.json indexes the items; items/<id>.json holds each item's source, dependencies and SHA-256 hashes." },
  { title: "CLI", body: "Resolves dependencies, verifies hashes, picks your styling target and rewrites imports to your paths." },
  { title: "Your project", body: "Plain .tsx files in the folders you chose, plus nativra.lock.json recording what was written." },
];

export default function HowItWorks() {
  const plan = installPlan("login-form");
  const items = Array.from(new Set(plan.map((f) => f.itemId)));

  return (
    <>
      <Seo title={"How it works"} description={"How Nativra moves source from a static registry into your React Native project: dependency resolution, styling targets, import rewriting, the lockfile and safety checks."} path="/docs/principles" />
      <PageHeader
        eyebrow="Concepts"
        title="How it works"
        description="Nativra has two parts: a registry of source files and a CLI that copies them into your project. Nothing from Nativra runs in your app."
        meta={["4 min read"]}
      />

      <Section id="pipeline" title="From registry to project">
        <ol className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          {STAGES.map((s, i) => (
            <li key={s.title} className="space-y-2 bg-background p-5">
              <p className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</p>
              <p className="font-semibold">{s.title}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
        <P>
          <p>
            The output is ordinary source: you can read it, commit it and change it. There is no Nativra package in your{" "}
            <C>dependencies</C>, and nothing changes in your project unless you run a command.
          </p>
        </P>
      </Section>

      <Section id="items" title="Item types">
        <Defs
          items={[
            { term: "component", desc: <>Primitives such as Button, Input and Dialog. Installed to <C>componentsDir</C>.</> },
            { term: "block", desc: <>Composed sections such as LoginForm. Installed to <C>blocksDir</C>, or <C>componentsDir</C> when that is unset.</> },
            { term: "template", desc: <>Full screen flows built from blocks and components. Installed to <C>componentsDir</C>.</> },
            { term: "hook", desc: <>Behaviour helpers such as <C>useThemeColors</C> and <C>useHaptics</C>. Installed to <C>hooksDir</C>.</> },
            { term: "utility", desc: <>Shared helpers such as <C>cn()</C>. Installed to <C>utilsDir</C>.</> },
            { term: "theme", desc: <>Semantic color tokens for light and dark. Installed as <C>theme.ts</C> in <C>themesDir</C>.</> },
            { term: "style", desc: <>The UI&apos;s shape, type, density, surfaces and press feedback. Installed as <C>style.ts</C> in <C>themesDir</C>.</> },
          ]}
        />
      </Section>

      <Section id="dependencies" title="Dependencies are resolved for you">
        <P>
          <p>
            Each item lists the registry items it needs. <C>add</C> walks that graph and installs dependencies first. For
            example, <C>add login-form</C> installs {items.length} items: {items.map((id, i) => (
              <span key={id}>
                {i > 0 && (i === items.length - 1 ? " and " : ", ")}
                <C>{id}</C>
              </span>
            ))}
            .
          </p>
          <p>
            npm packages an item needs, such as <C>react-native-reanimated</C>, are listed separately. The CLI checks which are
            missing and offers to install them with your package manager. Pass <C>--install</C> to install without asking, or{" "}
            <C>--no-install</C> to skip.
          </p>
        </P>
      </Section>

      <Section id="targets" title="One API, two styling targets">
        <P>
          <p>
            Every item is written twice: once with NativeWind v4 classes and once with <C>StyleSheet.create</C>, with the same
            props and behaviour. <C>stylingTarget</C> in <C>nativra.json</C> decides which one you get. Both read colors from the
            installed theme, so they look the same. See <Link to="/docs/styling/nativewind">NativeWind</Link> and{" "}
            <Link to="/docs/styling/stylesheet">StyleSheet</Link>.
          </p>
        </P>
      </Section>

      <Section id="imports" title="Imports are rewritten to your paths">
        <P>
          <p>
            Registry source always imports through canonical aliases: <C>@/components/ui</C>, <C>@/lib/utils</C>, <C>@/hooks</C>{" "}
            and <C>@/blocks</C>. When the CLI writes a file, it rewrites them to match your directories and the path alias from{" "}
            <C>tsconfig.json</C>. <C>add</C>, <C>update</C> and <C>diff</C> share one renderer, so <C>diff</C> never reports a
            change that is only an import path.
          </p>
        </P>
        <CodeBlock code={REGISTRY_SOURCE} lang="ts" title="registry source" />
        <CodeBlock code={INSTALLED} lang="ts" title="installed file" />
      </Section>

      <Section id="lockfile" title="The lockfile">
        <P>
          <p>
            Every file the CLI writes is hashed into <C>nativra.lock.json</C>, together with the item&apos;s version and the
            items it depends on. Commit it: <C>update</C>, <C>diff</C>, <C>remove</C> and <C>doctor</C> use it to tell your
            edits apart from the original.
          </p>
        </P>
        <CodeBlock code={LOCK} lang="json" title="nativra.lock.json" />
        <P>
          <p>
            <Link to="/docs/updating">Updating &amp; rollback</Link> explains what each command does with these hashes.
          </p>
        </P>
      </Section>

      <Section id="safety" title="Safety checks">
        <Defs
          items={[
            { term: "Checksums", desc: "Each file's content is hashed and compared with the registry's SHA-256 before it is written." },
            { term: "HTTPS only", desc: "Remote registries must use HTTPS. http://localhost is the only exception, and redirects to plain HTTP are refused." },
            { term: "Path containment", desc: "Configured directories must be relative paths inside the project. Targets that escape the project or pass through symlinks are rejected." },
            { term: "Transactional writes", desc: "A multi-file install either completes or is undone. The lockfile is written atomically." },
            { term: "No shell strings", desc: "npm installs run with an argument array, and package names and versions from a registry are validated first." },
          ]}
        />
      </Section>
    </>
  );
}
