import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Introduction",
  description: "Introduction and getting started with Nativra",
};

export default function DocsPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-border pb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">
          Getting Started
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Introduction to Nativra
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          Nativra is a source-first UI platform for React Native and Expo. You own every component file in your repository with zero runtime vendor lock-in.
        </p>
      </div>

      {/* Why Source-First? */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Why Source-First?
        </h2>
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            Traditional component libraries install pre-compiled code into your <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">node_modules</code>. When you need to adjust touch animations, change safe area padding, or tweak accessibility props for Android TalkBack or iOS VoiceOver, you hit a brick wall.
          </p>
          <p>
            Nativra inverts this model. You run <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">npx nativra add button</code>, and a clean, typed TypeScript source file is copied directly into your project&apos;s <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">components/ui/Button.tsx</code>. You can customize, refactor, and commit it directly to Git.
          </p>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Explore the Documentation
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/docs/installation"
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-zinc-400 hover:shadow-sm dark:hover:border-zinc-700"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                Installation Guide
              </h3>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Step-by-step setup for Expo SDK 51+, React Native 0.74+, NativeWind v4, or StyleSheet.
            </p>
          </Link>

          <Link
            href="/docs/principles"
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-zinc-400 hover:shadow-sm dark:hover:border-zinc-700"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                Principles & Architecture
              </h3>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Deep dive into source ownership, dual styling targets, and conflict-free upgrades.
            </p>
          </Link>

          <Link
            href="/docs/cli"
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-zinc-400 hover:shadow-sm dark:hover:border-zinc-700"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                CLI Command Reference
              </h3>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Complete command list for init, add, diff, update, doctor, and theme management.
            </p>
          </Link>

          <Link
            href="/docs/components"
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-zinc-400 hover:shadow-sm dark:hover:border-zinc-700"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                Components Catalog
              </h3>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Browse 12 foundation mobile components with interactive previews and source code.
            </p>
          </Link>
        </div>
      </section>

      {/* Quick Start Terminal Snippet */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Quick Start in 30 Seconds
        </h2>
        <div className="rounded-xl border border-border bg-zinc-950 p-4 font-mono text-xs text-zinc-100 overflow-x-auto shadow-sm">
          <div className="flex items-center gap-1.5 pb-3 border-b border-zinc-800 text-zinc-500 text-[11px]">
            <span>Terminal</span>
          </div>
          <div className="pt-3 space-y-1.5">
            <div>
              <span className="text-zinc-500">$ </span>
              <span className="text-sky-400">npx nativra init</span>
            </div>
            <div>
              <span className="text-zinc-500">$ </span>
              <span className="text-sky-400">npx nativra add button input card</span>
            </div>
            <div className="text-emerald-400">✓ Written: components/ui/Button.tsx</div>
            <div className="text-emerald-400">✓ Written: components/ui/Input.tsx</div>
            <div className="text-emerald-400">✓ Written: components/ui/Card.tsx</div>
          </div>
        </div>
      </section>
    </div>
  );
}
