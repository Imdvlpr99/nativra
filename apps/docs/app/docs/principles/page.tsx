import type { Metadata } from "next";
import { CodeBlock, Defs, DocsHeader, DocsSection, NextStep, P } from "@/components/docs/Prose";

export const metadata: Metadata = {
  title: "Principles — Why Source-First UI for React Native",
  description:
    "The ideas behind Nativra: you own the source, two styling targets with one API, a registry you can inspect, and updates that never overwrite your edits.",
  alternates: { canonical: "/docs/principles" },
};

const LOCK = `{
  "items": {
    "button": {
      "version": "0.1.0",
      "files": {
        "components/ui/Button.tsx": "9f2c…e41a"
      }
    },
    "login-form": {
      "version": "0.1.0",
      "files": { "components/ui/LoginForm.tsx": "51b0…7c3d" },
      "dependencies": ["card", "button", "input", "label", "separator", "text"]
    }
  }
}`;

export default function PrinciplesPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Getting started"
        title="Principles"
        description="Four ideas explain every decision in Nativra. If you understand these, the CLI and the registry will behave the way you expect."
        meta="4 min read"
      />

      <DocsSection id="ownership" title="You own the source">
        <P>
          <p>
            A component library installed from npm is a black box with its own release schedule. When you need a different
            shadow on Android or a larger touch area, you wait or fork.
          </p>
          <p>
            Nativra copies readable TypeScript into your repository instead. After <code>add</code>, the file is yours: commit
            it, edit any line, delete what you don&apos;t need. There is no Nativra runtime package in your app.
          </p>
        </P>
      </DocsSection>

      <DocsSection id="two-targets" title="Two styling targets, one API">
        <P>
          <p>
            Every component, block and template is written twice — once with NativeWind v4 classes, once with{" "}
            <code>StyleSheet.create</code> — with the same props and behavior. You choose a target once in{" "}
            <code>nativra.json</code>, and the CLI only installs that version.
          </p>
          <p>
            Both versions ship with the same neutral look and light/dark support. Because the colors live in your copy of the
            file, restyling is an edit, not an override. <a href="/docs/theming">Themes</a> give you matching token sets to use
            in your own screens.
          </p>
        </P>
      </DocsSection>

      <DocsSection id="registry" title="An open, inspectable registry">
        <P>
          <p>
            The registry is static JSON: a <code>registry.json</code> index and one file per item with its source, dependencies
            and SHA-256 hashes. The CLI verifies each hash before writing, refuses unsafe paths, and only talks to HTTPS
            registries. You can host your own registry and add it next to the default one.
          </p>
        </P>
      </DocsSection>

      <DocsSection id="safe-updates" title="Updates never overwrite your edits">
        <P>
          <p>
            Copied code usually means giving up upstream fixes. Nativra keeps them by recording a hash of every file it writes
            in <code>nativra.lock.json</code>:
          </p>
        </P>
        <CodeBlock code={LOCK} lang="json" title="nativra.lock.json" />
        <Defs
          items={[
            { term: "diff", desc: "Compares your file with what the registry would install today, with your import aliases applied." },
            { term: "update", desc: "Changes a file only if its hash still matches the lockfile — i.e. you haven't edited it — unless you pass --force." },
            { term: "rollback", desc: "Every update snapshots the files it changes; rollback restores the newest snapshot, then the one before." },
            { term: "remove", desc: "Refuses to delete files you modified, or items other installed items depend on, unless you pass --force." },
          ]}
        />
      </DocsSection>

      <NextStep href="/docs/cli" title="CLI reference" description="Every command and flag, generated from the CLI itself." />
    </>
  );
}
