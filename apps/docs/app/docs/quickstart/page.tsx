import type { Metadata } from "next";
import Link from "next/link";
import { CommandLine } from "@/components/docs/CopyButton";
import { Callout, CodeBlock, DocsHeader, DocsSection, NextStep, P, Step, Steps } from "@/components/docs/Prose";

export const metadata: Metadata = {
  title: "Quick start — Build a Sign-in Screen with Nativra",
  description:
    "A five-minute tutorial: add a login form block to an Expo app, customize the source you own, apply a theme, and update safely with diff and rollback.",
  alternates: { canonical: "/docs/quickstart" },
};

const SCREEN = `import { View } from "react-native";
import { LoginForm } from "@/components/ui/LoginForm";

export default function SignInScreen() {
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

const DIFF_OUTPUT = `--- components/ui/Button.tsx  installed
+++ components/ui/Button.tsx  registry
@@ -12,7 +12,7 @@
-  sm: "px-3 py-1.5 gap-1.5",
+  sm: "px-3 py-2 gap-1.5",`;

export default function QuickstartPage() {
  return (
    <>
      <DocsHeader
        eyebrow="Getting started"
        title="Quick start"
        description="Build a sign-in screen, make it yours, theme it, and learn how updates work — the whole Nativra workflow in one sitting."
        meta="5 min · assumes you finished Installation"
      />

      <DocsSection id="add" title="1. Add a block">
        <P>
          <p>
            Blocks are composed sections. <code>login-form</code> depends on Card, Button, Input, Label, Separator and Text —
            the CLI resolves and installs all of them in dependency order.
          </p>
        </P>
        <CommandLine command="npx nativra-cli add login-form" switcher />
        <Callout type="note">
          Already have one of those files? It is skipped, never overwritten. Pass <code>--dry-run</code> to see the plan first.
        </Callout>
      </DocsSection>

      <DocsSection id="use" title="2. Render it">
        <CodeBlock code={SCREEN} title="app/sign-in.tsx" />
        <P>
          <p>
            Every prop is plain TypeScript in <code>components/ui/LoginForm.tsx</code> — open the file to see exactly what it does.
          </p>
        </P>
      </DocsSection>

      <DocsSection id="customize" title="3. Make it yours">
        <P>
          <p>
            There is no theme override API to learn. Edit the file directly — it is your code now. For example, change the
            heading:
          </p>
        </P>
        <CodeBlock code={EDIT} lang="diff" title="components/ui/LoginForm.tsx" />
      </DocsSection>

      <DocsSection id="theme" title="4. Apply a theme">
        <P>
          <p>
            Your components already use the default <strong>zinc</strong> theme. Switch every one of them to another palette
            by replacing the theme file (and, with NativeWind, its CSS variables):
          </p>
        </P>
        <CommandLine command="npx nativra-cli theme add midnight --overwrite --apply-css" switcher />
        <P>
          <p>
            Browse all palettes in <Link href="/docs/themes">Themes</Link>.
          </p>
        </P>
      </DocsSection>

      <DocsSection id="update" title="5. Update without losing your edits">
        <P>
          <p>
            When the registry improves a component, compare first. <code>diff</code> shows how your copy differs from what the
            CLI would install today:
          </p>
        </P>
        <CommandLine command="npx nativra-cli diff button" switcher />
        <CodeBlock code={DIFF_OUTPUT} lang="diff" title="example output" />
        <P>
          <p>
            Then update. Files you edited — like <code>LoginForm.tsx</code> above — are skipped unless you pass{" "}
            <code>--force</code>, and every file that does change is backed up first.
          </p>
        </P>
        <Steps>
          <Step title="Update everything you installed">
            <CommandLine command="npx nativra-cli update" switcher />
          </Step>
          <Step title="Changed your mind? Undo the last update of an item">
            <CommandLine command="npx nativra-cli rollback button" switcher />
          </Step>
        </Steps>
      </DocsSection>

      <DocsSection id="recap" title="What you learned">
        <P>
          <ul>
            <li>
              <strong>add</strong> copies source plus its dependencies and records hashes in <code>nativra.lock.json</code>.
            </li>
            <li>The code is yours: customize by editing files, not by configuring a library.</li>
            <li>
              <strong>diff → update → rollback</strong> lets you take upstream fixes without losing local changes.
            </li>
          </ul>
        </P>
      </DocsSection>

      <NextStep href="/docs/principles" title="Principles" description="Why source-first, and the guarantees the CLI makes." />
    </>
  );
}
