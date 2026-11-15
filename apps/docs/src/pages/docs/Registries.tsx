import React from "react";
import { Seo } from "@/lib/head";
import { Link } from "react-router";
import { Callout, Defs, P, PageHeader, Section } from "@/components/ui/Prose";
import { CodeBlock } from "@/components/ui/Code";
import { CommandLine } from "@/components/ui/CopyButton";


const LAYOUT = `my-registry/
├── registry.json          # index: every item's id, name, type, version
└── items/
    ├── brand-button.json  # full item: metadata + inlined file contents + hashes
    └── promo-card.json`;

const ITEM = `{
  "id": "promo-card",
  "name": "Promo Card",
  "type": "block",
  "registryDependencies": [
    { "id": "card" },
    { "id": "brand-button", "registry": "acme" }
  ]
}`;

export default function Registries() {
  return (
    <>
      <Seo title={"Custom Registries"} description={"Install from your own Nativra registry: the static file layout, local directories, HTTPS hosting, and cross-registry dependencies."} path="/docs/registries" />
      <PageHeader
        eyebrow="Guides"
        title="Custom registries"
        description="A registry is a folder of static JSON. Host one for your team's own components and install them with the same commands, checks and lockfile."
        meta={["4 min read"]}
      />

      <Section id="layout" title="What a registry is">
        <P>
          <p>
            The CLI reads two kinds of file: <code>registry.json</code> at the root, and <code>items/&lt;id&gt;.json</code> for
            each item. Any static host works, and so does a directory on disk.
          </p>
        </P>
        <CodeBlock code={LAYOUT} lang="text" title="registry layout" />
        <P>
          <p>
            In this repository, source items live in <code>registry/default/&lt;type&gt;/&lt;id&gt;/</code> with an{" "}
            <code>item.json</code>, and <code>node scripts/build-registry.mjs</code> produces the files above, inlining each source
            file with its SHA-256 hash. The same layout and builder work for your own items. See{" "}
            <Link to="/docs/contributing">Contributing</Link> for the <code>item.json</code> format.
          </p>
        </P>
      </Section>

      <Section id="locations" title="Where a registry can live">
        <Defs
          items={[
            { term: "https://…", desc: "Any HTTPS origin. Redirects to plain HTTP are refused." },
            { term: "http://localhost", desc: "Allowed for local development only (also 127.0.0.1). Any other http:// URL is rejected." },
            { term: "./path/to/dir", desc: "A local directory containing registry.json. Useful for monorepos and testing." },
          ]}
        />
      </Section>

      <Section id="install" title="Installing from your registry">
        <P>
          <p>
            Pass <code>--registry</code> to <code>add</code>, <code>update</code>, <code>diff</code>, <code>list</code>,{" "}
            <code>search</code> or <code>info</code> to use another registry for that run:
          </p>
        </P>
        <CommandLine command="npx nativra-cli add promo-card --registry https://ui.acme.dev" switcher />
        <CommandLine command="npx nativra-cli list --registry ./packages/ui-registry" switcher />
        <P>
          <p>
            To make it permanent, change the <code>url</code> of the <code>default</code> entry in{" "}
            <Link to="/docs/configuration#keys">nativra.json</Link>. Every command without <code>--registry</code> then uses it.
          </p>
        </P>
      </Section>

      <Section id="named" title="Named registries and cross-registry dependencies">
        <P>
          <p>Register additional sources by name:</p>
        </P>
        <CommandLine command="npx nativra-cli registry add acme https://ui.acme.dev" switcher />
        <CommandLine command="npx nativra-cli registry list" switcher />
        <P>
          <p>
            Top-level ids passed to <code>add</code> always resolve from <code>default</code>. Named registries are used for{" "}
            <code>registryDependencies</code> that name them, so an item in one registry can depend on items in another:
          </p>
        </P>
        <CodeBlock code={ITEM} lang="json" title="items/promo-card.json (excerpt)" />
        <Callout type="note" title="Same guarantees everywhere">
          Items from any registry go through the same checksum verification, path containment checks, import rewriting and
          lockfile tracking as the default registry.
        </Callout>
      </Section>
    </>
  );
}
