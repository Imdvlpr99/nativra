import React from "react";
import { Seo } from "@/lib/head";
import { Link } from "react-router";
import { C, Callout, Defs, P, PageHeader, Section } from "@/components/ui/Prose";
import { CommandLine } from "@/components/ui/CopyButton";


export default function DoctorAudit() {
  return (
    <>
      <Seo title={"Doctor & Audit"} description={"nativra doctor checks your project setup and version compatibility. nativra audit scores accessibility, token hygiene and legacy touchables, and can fix them."} path="/docs/doctor-audit" />
      <PageHeader
        eyebrow="Guides"
        title="Doctor & audit"
        description="Two read-only checks. doctor answers “is my project set up correctly?”. audit answers “how healthy is my UI code?”"
        meta={["3 min read"]}
      />

      <Section id="doctor" title="doctor">
        <CommandLine command="npx nativra-cli doctor" switcher />
        <P>
          <p>Runs these checks and prints a pass, warning or failure for each:</p>
        </P>
        <Defs
          items={[
            { term: "nativra.json", desc: "Exists and passes schema validation." },
            { term: "Compatibility", desc: <>Your React Native, Expo SDK, React, TypeScript and NativeWind versions against the <Link className="link" to="/docs/compatibility">tested matrix</Link>. An Expo SDK below 51 fails; other versions below the tested minimum are warnings.</> },
            { term: "Expo structure", desc: <>An <C>app.json</C> or <C>app.config</C> exists.</> },
            { term: "TypeScript", desc: <><C>tsconfig.json</C> exists and declares a path alias.</> },
            { term: "NativeWind", desc: "When NativeWind is installed: a Tailwind config exists and maps Nativra's theme colors." },
            { term: "Lockfile", desc: <><C>nativra.lock.json</C> parses, and how many items it tracks.</> },
          ]}
        />
        <P>
          <p>
            <code>doctor --fix</code> repairs what it safely can: it scaffolds a missing <code>nativra.json</code> from the detected
            environment and a missing <code>tailwind.config.js</code>. An invalid <code>nativra.json</code> is reported, never
            overwritten.
          </p>
        </P>
      </Section>

      <Section id="audit" title="audit">
        <CommandLine command="npx nativra-cli audit" switcher />
        <P>
          <p>
            Scans your source files and reports findings with file, line and column, plus a score out of 100 and a grade
            (A+ to D). Files installed by Nativra count as compliant.
          </p>
        </P>
        <Defs
          items={[
            { term: "a11y-interactive-label", desc: <>A <C>Pressable</C> or Touchable without <C>accessibilityRole</C>, <C>accessibilityLabel</C> or spread props. Worth 40 points, scaled by coverage.</> },
            { term: "prefer-nativra-button", desc: <>Legacy <C>TouchableOpacity</C> / <C>TouchableHighlight</C>. Up to 20 points.</> },
            { term: "dynamic-type-support", desc: <><C>allowFontScaling={"{false}"}</C>, which blocks larger text for people who need it. Up to 10 points deducted.</> },
            { term: "Token hygiene", desc: "Hard-coded hex colors outside theme and token files. Up to 20 points." },
            { term: "Adoption", desc: "20 points when at least one Nativra item is installed, otherwise 10." },
          ]}
        />
      </Section>

      <Section id="audit-fix" title="Fixing legacy touchables">
        <P>
          <p>
            <code>audit --fix</code> rewrites <code>TouchableOpacity</code> and <code>TouchableHighlight</code> to{" "}
            <code>Pressable</code>. Preview first, then apply:
          </p>
        </P>
        <CommandLine command="npx nativra-cli audit --fix --dry-run" switcher />
        <CommandLine command="npx nativra-cli audit --fix" switcher />
        <Callout type="tip" title="Reversible">
          Every rewritten file is backed up first. Undo the whole fix with <code>npx nativra-cli rollback audit-fix</code>.
        </Callout>
      </Section>

      <Section id="ci" title="In CI">
        <P>
          <p>
            <code>--min-score</code> exits with code 1 when the score is below the number you give, so the job fails.{" "}
            <code>audit --json</code> prints the full report as JSON for storing or further checks; the two combine.
          </p>
        </P>
        <CommandLine command="npx nativra-cli audit --min-score 80" />
        <CommandLine command="npx nativra-cli audit --json --min-score 80 > audit-report.json" />
      </Section>
    </>
  );
}
