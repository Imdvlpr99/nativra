import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Layers,
  Sparkles,
  GitPullRequest,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Principles & Architecture — Why Source-First UI Beats Runtime Libraries",
  description:
    "Discover the architectural principles behind Nativra: 100% source code ownership, dual NativeWind/StyleSheet parity, SHA-256 lockfile safety, and native accessibility.",
  alternates: {
    canonical: "/docs/principles",
  },
};

export default function PrinciplesPage() {
  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="space-y-3 border-b border-border pb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">
          Architecture
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Principles & Architecture
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          Nativra is built on a simple premise: mobile developers should own their UI code without sacrificing speed, accessibility, or platform-native polish.
        </p>
      </div>

      {/* Principle 1: Source Ownership */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            1. Source Ownership Over Package Dependency
          </h2>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            When you install a traditional UI library via <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">npm install &lt;library&gt;</code>, your project inherits its build setup, hidden dependencies, and rigid abstraction boundaries. When you inevitably need to tweak an Android elevation shadow, adjust touch hit-slops, or migrate to a new React Native architecture, you are stuck waiting on an upstream release.
          </p>
          <p>
            With Nativra, you run <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">npx nativra-cli add &lt;component&gt;</code> and the exact, readable TypeScript source file is copied into your repository&apos;s <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">components/ui/</code> folder. You can commit it to Git, edit any line, and refactor whenever you need to.
          </p>
        </div>
      </section>

      {/* Principle 2: Dual Styling Targets */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            <Layers className="h-4 w-4" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            2. Dual Styling Targets (NativeWind & StyleSheet)
          </h2>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            The React Native ecosystem is divided between utility-first Tailwind styling (NativeWind v4) and pure platform <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">StyleSheet.create()</code>. Nativra does not force you to pick a side.
          </p>
          <p>
            Every single component, block, and theme in Nativra is simultaneously authored in both targets. During <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">nativra init</code>, you choose your preferred styling target. From that point on, all added components automatically match your architecture.
          </p>
        </div>
      </section>

      {/* Principle 3: Native First Quality Bar */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <Sparkles className="h-4 w-4" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            3. Native First Quality Bar
          </h2>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            Web ports often feel sluggish on mobile. Nativra components are written specifically for React Native:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>
              <strong className="text-foreground">Touch Target Sizing:</strong> Interactive elements follow Apple Human Interface Guidelines and Google Material guidelines (minimum 44x44pt touch areas).
            </li>
            <li>
              <strong className="text-foreground">Accessibility First:</strong> Components carry semantic <code className="font-mono bg-muted px-1 py-0.5 rounded text-foreground">accessibilityRole</code> and <code className="font-mono bg-muted px-1 py-0.5 rounded text-foreground">accessibilityState</code> for TalkBack and VoiceOver out of the box.
            </li>
            <li>
              <strong className="text-foreground">Zero Layout Shift:</strong> Dimensions and font sizes are tuned to prevent reflows during async data rendering.
            </li>
          </ul>
        </div>
      </section>

      {/* Principle 4: Conflict-Free Upgrades */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <GitPullRequest className="h-4 w-4" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            4. Safe, Conflict-Free Updates
          </h2>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            A common worry with copied code is: &ldquo;How do I receive upstream bug fixes without losing my custom modifications?&rdquo;
          </p>
          <p>
            Nativra solves this with cryptographic SHA-256 file hashing stored in your <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">nativra.json</code>. When you run <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">nativra diff</code> or <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">nativra update</code>, the CLI detects whether you have edited the file locally. If you have, it will never overwrite your changes without warning and showing an interactive diff.
          </p>
        </div>
      </section>

      {/* Next Steps CTA */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 p-5">
        <div>
          <h3 className="text-sm font-bold text-foreground">Ready to get started?</h3>
          <p className="text-xs text-muted-foreground">Follow our step-by-step setup guide for Expo or React Native.</p>
        </div>
        <Link
          href="/docs/installation"
          className="rounded-lg bg-foreground px-4 py-2 text-xs font-semibold text-background transition-colors hover:opacity-90"
        >
          View Installation Guide →
        </Link>
      </div>
    </div>
  );
}

