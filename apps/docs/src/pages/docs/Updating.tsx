import React from "react";
import { Seo } from "@/lib/head";
import { C, Callout, Defs, P, PageHeader, Section, Step, Steps } from "@/components/ui/Prose";
import { CodeBlock } from "@/components/ui/Code";
import { CommandLine } from "@/components/ui/CopyButton";


const DIFF = `--- components/ui/LoginForm.tsx  installed
+++ components/ui/LoginForm.tsx  registry
@@ -39,9 +39,9 @@
       <View className="mb-6">
         <Text variant="h2" className="text-center mb-1">
-          Sign in to Acme
+          Welcome back
         </Text>`;

const UPDATE = `  = lib/themes/theme.ts (up to date)
  = hooks/use-theme-colors.ts (up to date)
  ✓ Updated components/ui/Button.tsx
  ! components/ui/LoginForm.tsx has local changes — skipped (use --force, or 'nativra diff login-form')`;

const BACKUP_TREE = `.nativra/
└── backups/
    └── button/
        └── 2026-11-14T13-20-05-120Z/
            ├── manifest.json
            └── Button.tsx`;

export default function Updating() {
  return (
    <>
      <Seo title={"Updating & Rollback"} description={"How nativra diff, update, rollback and remove use SHA-256 hashes in nativra.lock.json to apply registry fixes without overwriting your edits."} path="/docs/updating" />
      <PageHeader
        eyebrow="Guides"
        title="Updating & rollback"
        description="Copied code usually means giving up upstream fixes. Nativra keeps them: it knows which files you edited, updates only the rest, and backs up whatever it changes."
        meta={["5 min read"]}
      />

      <Section id="model" title="How edits are detected">
        <P>
          <p>
            When the CLI writes a file it stores the file&apos;s SHA-256 hash in <code>nativra.lock.json</code>. Later, it hashes the
            file on disk again. Same hash: you haven&apos;t touched it. Different hash: it has local changes and is treated as
            yours. Line endings don&apos;t count, so a Windows checkout that turns LF into CRLF isn&apos;t an edit.
          </p>
        </P>
        <Defs
          items={[
            { term: "Unchanged file", desc: "Safe to replace with the registry version." },
            { term: "Edited file", desc: "Skipped by update and protected by remove, unless you pass --force." },
            { term: "Untracked file", desc: "Exists on disk but isn't in the lockfile. update skips it; add asks before overwriting." },
          ]}
        />
      </Section>

      <Section id="workflow" title="The update workflow">
        <Steps>
          <Step title="Find items with updates">
            <P>
              <p>
                <code>list --installed</code> shows every installed item with its version and the registry&apos;s, and says which
                have updates. <code>info &lt;item&gt;</code> shows the same for one item.
              </p>
            </P>
            <CommandLine command="npx nativra-cli list --installed" switcher />
          </Step>
          <Step title="See what changed">
            <P>
              <p>
                <code>diff</code> compares your copy with what <code>add</code> would write today, with your import aliases
                already applied. Lines starting with <code>-</code> are yours, <code>+</code> are the registry&apos;s.
              </p>
            </P>
            <CommandLine command="npx nativra-cli diff login-form" switcher />
            <CodeBlock code={DIFF} lang="diff" title="output" />
          </Step>
          <Step title="Update">
            <P>
              <p>
                With no ids, <code>update</code> checks every item in the lockfile. Pass ids to limit it. New registry dependencies
                are installed, and newly required npm packages are listed.
              </p>
            </P>
            <CommandLine command="npx nativra-cli update" switcher />
            <CodeBlock code={UPDATE} lang="text" title="output" />
          </Step>
          <Step title="Take the update for an edited file anyway">
            <P>
              <p>
                <code>--force</code> overwrites files with local changes. They are backed up first, so this is reversible.
              </p>
            </P>
            <CommandLine command="npx nativra-cli update login-form --force" switcher />
          </Step>
        </Steps>
        <P>
          <p>
            In CI, <code>update --check</code> reports like <code>--dry-run</code> and exits with code 1 while anything is out
            of date, including registry changes your local edits are holding back. An edited file whose registry source
            hasn&apos;t changed doesn&apos;t count. <code>diff &lt;item&gt; --exit-code</code> does the same for one item&apos;s
            files.
          </p>
        </P>
        <CommandLine command="npx nativra-cli update --check" />
      </Section>

      <Section id="rollback" title="Rollback">
        <P>
          <p>
            Before an operation changes files, the CLI copies the current versions into <code>.nativra/backups/&lt;id&gt;/&lt;timestamp&gt;/</code>{" "}
            with a <code>manifest.json</code>. <code>rollback</code> restores the newest snapshot for an item and consumes it, so
            running it again goes one step further back. Files the operation created are removed.
          </p>
        </P>
        <CommandLine command="npx nativra-cli rollback button" switcher />
        <CodeBlock code={BACKUP_TREE} lang="text" title="backup layout" />
        <Defs
          items={[
            { term: "update", desc: "Backs up every file it is about to replace, per item." },
            { term: "add --overwrite", desc: "Backs up every existing file it replaces, per item." },
            { term: "remove", desc: <>Backs up the item&apos;s files and its lockfile entry. <C>rollback &lt;id&gt;</C> restores both.</> },
            { term: "theme add --overwrite", desc: "Backs up the existing theme file under the theme's id." },
            { term: "audit --fix", desc: <>Backs up every file it rewrites under <C>audit-fix</C>. Undo with <C>rollback audit-fix</C>.</> },
          ]}
        />
        <Callout type="warning" title="Rollback protects later edits">
          If you edited a file after the operation you&apos;re undoing, <C>rollback</C> stops and lists it instead of discarding your
          work. Commit or copy the edit, then run <C>rollback &lt;id&gt; --force</C>.
        </Callout>
        <Callout type="note" title="Backups are local">
          <code>init</code> adds <code>.nativra/</code> to <code>.gitignore</code>. Backups are an undo buffer for your machine;
          git remains your history.
        </Callout>
      </Section>

      <Section id="remove" title="Removing items">
        <CommandLine command="npx nativra-cli remove button" switcher />
        <P>
          <p>
            <code>remove</code> deletes an item&apos;s files and its lockfile entry. It refuses, unless you pass <code>--force</code>{" "}
            or confirm the prompt, when:
          </p>
          <ul>
            <li>another installed item still depends on it (for example, LoginForm depends on Button), or</li>
            <li>any of its files has local changes.</li>
          </ul>
          <p>
            With <code>--yes</code> there is no prompt, so both cases fail unless <code>--force</code> is set. Removed files are
            backed up first, so <code>rollback</code> can bring an item back.
          </p>
        </P>
      </Section>
    </>
  );
}
