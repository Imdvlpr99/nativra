import type { Metadata } from "next";
import { CommandLine } from "@/components/docs/CopyButton";
import { Callout, CodeBlock, Defs, DocsHeader, DocsSection, NextStep, P, Step, Steps } from "@/components/docs/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contributing — Add a Component to the Nativra Registry",
  description:
    "How to author a Nativra registry item: folder layout, item.json, NativeWind and StyleSheet sources, docs, building and validating the registry.",
  alternates: { canonical: "/docs/contributing" },
};

const TREE = `registry/default/components/rating-stars/
├── item.json              # metadata, dependencies, files
├── docs.mdx               # Markdown shown on the docs page
├── nativewind/
│   └── RatingStars.tsx
└── stylesheet/
    └── RatingStars.tsx`;

const ITEM = `{
  "id": "rating-stars",
  "name": "Rating Stars",
  "description": "A star rating display and input.",
  "type": "component",
  "status": "beta",
  "version": "0.1.0",
  "stylingTargets": ["nativewind", "stylesheet"],
  "platforms": { "android": true, "ios": true, "expoGo": true },
  "files": [
    { "path": "nativewind/RatingStars.tsx", "target": "nativewind" },
    { "path": "stylesheet/RatingStars.tsx", "target": "stylesheet" }
  ],
  "registryDependencies": [{ "id": "text", "registry": "default" }],
  "npmDependencies": [],
  "tags": ["rating", "input", "review"],
  "docsPath": "docs.mdx"
}`;

export default function ContributingPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Project"
        title="Contributing"
        description="Every registry item is a folder of plain files. This guide walks through adding one, from folder to pull request."
        meta="pnpm 9 · Node.js 20+"
      />

      <DocsSection id="setup" title="Set up the repository">
        <CodeBlock
          lang="bash"
          title="terminal"
          code={`git clone ${SITE.repo}.git
cd nativra
pnpm install
pnpm build`}
        />
        <Defs
          items={[
            { term: "registry/default/", desc: "Authored items: components, blocks, templates, hooks, utilities, themes." },
            { term: "packages/cli", desc: "nativra-cli." },
            { term: "packages/registry-builder", desc: "Validates items and builds the static registry JSON." },
            { term: "packages/theme-engine", desc: "Theme presets — the source of truth for registry theme files." },
            { term: "apps/docs · apps/native-preview", desc: "This site, and an Expo app for checking items on devices." },
          ]}
        />
      </DocsSection>

      <DocsSection id="add-item" title="Add an item">
        <Steps>
          <Step title="Create the folder">
            <CodeBlock code={TREE} lang="text" title="layout" />
            <P>
              <p>The folder name must equal the item&apos;s <code>id</code>.</p>
            </P>
          </Step>
          <Step title="Describe it in item.json">
            <CodeBlock code={ITEM} lang="json" title="item.json" />
          </Step>
          <Step title="Write both implementations">
            <P>
              <p>
                The NativeWind and StyleSheet files export the same component with the same props. Import shared code through
                the canonical aliases — <code>@/components/ui</code>, <code>@/lib/utils</code>, <code>@/hooks</code> — so the CLI
                can rewrite them to each user&apos;s paths.
              </p>
            </P>
          </Step>
          <Step title="Document it">
            <P>
              <p>
                <code>docs.mdx</code> is plain Markdown: a short usage example, variants and accessibility notes. It is rendered
                on the item&apos;s page.
              </p>
            </P>
          </Step>
          <Step title="Build and validate">
            <CommandLine command="node scripts/build-registry.mjs" />
            <P>
              <p>
                The build fails if the schema is invalid, the id doesn&apos;t match the folder, a dependency doesn&apos;t exist, or a
                file targets an undeclared styling target.
              </p>
            </P>
          </Step>
        </Steps>
      </DocsSection>

      <DocsSection id="preview" title="Preview and test">
        <Defs
          items={[
            { term: "pnpm dev", desc: "Runs this docs site with your item at /docs/<type>/<id>." },
            { term: "pnpm --filter @nativra/native-preview sync", desc: "Copies registry components into the Expo preview app; then start it to test on iOS/Android." },
            { term: "pnpm typecheck · pnpm lint · pnpm test", desc: "What CI runs. CLI end-to-end tests install items from the built registry." },
          ]}
        />
        <Callout type="note" title="Themes are generated">
          Don&apos;t edit <code>registry/default/themes/*/theme.ts</code> by hand. Change the preset in{" "}
          <code>packages/theme-engine</code> and run <code>pnpm themes:generate</code>; CI checks they match.
        </Callout>
      </DocsSection>

      <DocsSection id="checklist" title="Pull request checklist">
        <P>
          <ul>
            <li>Both targets have identical props and behavior, verified in light and dark mode.</li>
            <li>
              Interactive elements set <code>accessibilityRole</code> and a label, and have a touch area of at least 44×44pt
              (use <code>hitSlop</code> for smaller visuals).
            </li>
            <li>
              No <code>allowFontScaling={"{false}"}</code>; text respects Dynamic Type.
            </li>
            <li>
              TypeScript is strict — no <code>any</code> without a comment explaining why.
            </li>
            <li>New npm dependencies are declared in <code>npmDependencies</code> and justified in the PR.</li>
          </ul>
        </P>
      </DocsSection>

      <NextStep href="/docs/changelog" title="Changelog" description="What changed in each release." />
    </>
  );
}
