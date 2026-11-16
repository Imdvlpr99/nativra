import React from "react";
import { Seo } from "@/lib/head";
import { Link } from "react-router";
import { CommandLine } from "@/components/ui/CopyButton";
import { C, Callout, P, PageHeader, Section } from "@/components/ui/Prose";
import { CodeBlock } from "@/components/ui/Code";
import { installPlan } from "@/lib/install-plan";


const SCREEN = `import { View } from "react-native";
import { router } from "expo-router";
import { LoginForm } from "@/components/ui/LoginForm";

export default function Quickstart() {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <LoginForm
        onSignIn={({ email, password }) => signIn(email, password)}
        onForgotPassword={() => router.push("/forgot-password")}
        onSignUp={() => router.push("/sign-up")}
      />
    </View>
  );
}`;

const EDIT = `         <Text variant="h2" className="text-center mb-1">
-          Welcome back
+          Sign in to Acme
         </Text>`;

const UPDATE_OUTPUT = `  ✓ Updated components/ui/Button.tsx
  ! components/ui/LoginForm.tsx has local changes — skipped (use --force, or 'nativra diff login-form')`;

export default function Quickstart() {
  const plan = installPlan("login-form");
  const items = Array.from(new Set(plan.map((f) => f.itemId)));

  return (
    <>
      <Seo title={"Quick start"} description={"A five-minute tutorial: add a login form block to an Expo app, edit the source you own, switch themes, and update safely with diff and rollback."} path="/docs/quickstart" />
      <PageHeader
        eyebrow="Get started · 03"
        title="Quick start"
        description="Build a sign-in screen, make it yours, theme it, and take an update without losing your changes. This is the whole Nativra workflow."
        meta={["5 min", "after Installation"]}
      />

      <Section id="add" title="1. Add a block">
        <P>
          <p>
            Blocks are composed sections. <C>login-form</C> needs {items.length - 1} other registry items; the CLI resolves
            them and installs everything dependencies-first:
          </p>
        </P>
        <CommandLine command="npx nativra-cli add login-form" switcher />
        <ul className="grid gap-x-6 gap-y-1 rounded-md border border-border bg-surface p-4 font-mono text-[12.5px] sm:grid-cols-2">
          {plan.map((f) => (
            <li key={f.path} className="truncate">
              <span className="text-brand" aria-hidden="true">+ </span>
              {f.path}
            </li>
          ))}
        </ul>
        <Callout type="note" title="Files that already exist">
          If a file is already there, <C>add</C> asks whether to overwrite or skip it. In scripts, <C>--yes</C> skips existing
          files, and <C>--on-conflict error</C> fails instead. Add <C>--dry-run</C> to preview the plan without writing.
        </Callout>
      </Section>

      <Section id="use" title="2. Render it">
        <CodeBlock code={SCREEN} title="app/sign-in.tsx" />
        <P>
          <p>
            Every prop is plain TypeScript in <C>components/ui/LoginForm.tsx</C>. Open the file to see exactly what it does.
          </p>
        </P>
      </Section>

      <Section id="customize" title="3. Make it yours">
        <P>
          <p>There is no override API to learn. Edit the file; it is your code now:</p>
        </P>
        <CodeBlock code={EDIT} lang="diff" title="components/ui/LoginForm.tsx" />
      </Section>

      <Section id="theme" title="4. Switch the theme">
        <P>
          <p>
            Your components use the default <strong>zinc</strong> theme. Replace it to restyle all of them at once.{" "}
            <C>--apply-css</C> also updates the CSS variables NativeWind reads:
          </p>
        </P>
        <CommandLine command="npx nativra-cli theme add midnight --overwrite --apply-css" switcher />
        <P>
          <p>
            Browse the palettes in <Link to="/docs/themes">Themes</Link>.
          </p>
        </P>
      </Section>

      <Section id="update" title="5. Update without losing edits">
        <P>
          <p>When the registry improves a component, first see how your copy differs:</p>
        </P>
        <CommandLine command="npx nativra-cli diff login-form" switcher />
        <P>
          <p>
            Then update. The file you edited in step 3 is skipped, and every file that does change is backed up first:
          </p>
        </P>
        <CommandLine command="npx nativra-cli update" switcher />
        <CodeBlock code={UPDATE_OUTPUT} lang="text" title="output (abridged)" />
        <P>
          <p>Changed your mind? Restore the previous version of an item:</p>
        </P>
        <CommandLine command="npx nativra-cli rollback button" switcher />
      </Section>

      <Section id="recap" title="What you learned">
        <P>
          <ul>
            <li>
              <C>add</C> copies an item and its dependencies, and hashes every file into <C>nativra.lock.json</C>.
            </li>
            <li>You customize by editing files, not by configuring a library.</li>
            <li>
              <C>diff</C>, <C>update</C> and <C>rollback</C> let you take upstream fixes and keep your changes.
            </li>
          </ul>
        </P>
      </Section>
    </>
  );
}
