import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  Layers,
  Sparkles,
  Smartphone,
  Terminal,
  GitPullRequest,
  CheckCircle2,
  X,
} from "lucide-react";
import { HomeHeroPlayground } from "@/components/HomeHeroPlayground";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ------------------------------------------------------------------- */}
      {/* Hero Section */}
      {/* ------------------------------------------------------------------- */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20 sm:px-6 lg:px-8">
        {/* Subtle Background Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-sky-400 to-indigo-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        <div className="mx-auto max-w-5xl text-center space-y-6">
          {/* Announcement Pill with Brand Icon */}
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 py-1 pl-1.5 pr-3.5 text-xs font-semibold text-sky-800 dark:border-sky-900/60 dark:bg-sky-950/60 dark:text-sky-300 shadow-sm">
            <Image src="/icon.png" alt="Nativra" width={18} height={18} className="rounded-full object-contain" />
            <span>Introducing Nativra v0.1 — Source-First React Native UI</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Native UI,{" "}
            <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              built your way.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            A source-first UI platform for React Native and Expo. Copy production-grade components into your codebase, own every line, and customize without runtime package locks.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/docs/components"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-muted"
            >
              Browse Components
            </Link>

            <Link
              href="/docs/cli"
              className="inline-flex items-center gap-1.5 rounded-xl border border-sky-300/60 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-800 transition-all hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-300"
            >
              <Terminal className="h-4 w-4" />
              <span>CLI Guide</span>
            </Link>
          </div>

          {/* Live Interactive Playground Hero Component */}
          <div className="mx-auto pt-8 flex justify-center">
            <HomeHeroPlayground />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* Quickstart CLI Box */}
      {/* ------------------------------------------------------------------- */}
      <section className="border-y border-border bg-muted/20 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Terminal className="h-4 w-4 text-sky-500" />
            <span>Add in Seconds</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            One command to install. Zero runtime locks.
          </h2>

          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Nativra installs clean TypeScript source files straight into your repository. No mysterious node_modules packages.
          </p>

          <div className="mx-auto max-w-xl rounded-xl border border-border bg-zinc-950 p-4 text-left font-mono text-xs text-zinc-100 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-zinc-500 text-[11px]">
              <span>bash</span>
              <span>nativra-cli</span>
            </div>
            <div className="pt-3 space-y-1.5 text-zinc-300">
              <div>
                <span className="text-zinc-500">$ </span>
                <span className="text-sky-400">npx nativra-cli init</span>
              </div>
              <div className="text-zinc-400 pl-4">✓ Created nativra.json (target: NativeWind)</div>
              <div className="pt-1">
                <span className="text-zinc-500">$ </span>
                <span className="text-sky-400">npx nativra-cli add button input card badge</span>
              </div>
              <div className="text-emerald-400 pl-4">✓ Written: components/ui/Button.tsx</div>
              <div className="text-emerald-400 pl-4">✓ Written: components/ui/Input.tsx</div>
              <div className="text-emerald-400 pl-4">✓ Written: components/ui/Card.tsx</div>
              <div className="text-emerald-400 pl-4">✓ Written: components/ui/Badge.tsx</div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* Architectural Pillars (6 Cards) */}
      {/* ------------------------------------------------------------------- */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
              Core Principles
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Engineered for Mobile Developers
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Everything you need to deliver high-performance, accessible native apps with total engineering freedom.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                color: "text-sky-500 bg-sky-500/10",
                title: "Source Ownership",
                desc: "Components are copied into your repository as clean TypeScript. You own every line, every prop, and every animation frame.",
              },
              {
                icon: Smartphone,
                color: "text-emerald-500 bg-emerald-500/10",
                title: "Native-First Quality Bar",
                desc: "Strict 44x44pt touch targets, accessibility roles/states, dynamic typography, and tested compatibility on iOS and Android.",
              },
              {
                icon: Layers,
                color: "text-purple-500 bg-purple-500/10",
                title: "Two Styling Targets",
                desc: "Every component is authored for both Tailwind-based NativeWind v4 and vanilla React Native StyleSheet. Choose during init.",
              },
              {
                icon: GitPullRequest,
                color: "text-amber-500 bg-amber-500/10",
                title: "Conflict-Free Upgrades",
                desc: "SHA-256 file hashing tracks modifications. The CLI detects local edits and ensures you never lose custom work on updates.",
              },
              {
                icon: Terminal,
                color: "text-blue-500 bg-blue-500/10",
                title: "Intelligent CLI",
                desc: "Automated dependency resolution, upstream diffing, atomic rollbacks, and environment doctor checks via npx nativra.",
              },
              {
                icon: Sparkles,
                color: "text-rose-500 bg-rose-500/10",
                title: "Zero Runtime Overhead",
                desc: "No heavyweight library packages bundled into your release build. Faster cold starts, zero extra bridge hops, minimal bundle footprint.",
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-zinc-400 hover:shadow-sm dark:hover:border-zinc-700"
                >
                  <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${f.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 font-bold text-foreground text-base">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* Comparison Matrix Table */}
      {/* ------------------------------------------------------------------- */}
      <section className="border-t border-border bg-muted/20 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              How Nativra Compares
            </h2>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Why leading mobile teams are moving from traditional npm UI libraries to source-owned components.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/50 text-muted-foreground font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Feature</th>
                  <th className="px-5 py-3.5">Traditional RN Libraries</th>
                  <th className="px-5 py-3.5 text-foreground font-bold">Nativra</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  {
                    feature: "Code Location",
                    traditional: "Compiled in node_modules",
                    nativra: "100% in your components/ui folder",
                  },
                  {
                    feature: "Runtime Package",
                    traditional: "200 KB - 800 KB bundle impact",
                    nativra: "0 KB runtime overhead",
                  },
                  {
                    feature: "Styling Targets",
                    traditional: "Proprietary styling runtime only",
                    nativra: "NativeWind v4 + Pure StyleSheet",
                  },
                  {
                    feature: "Customizability",
                    traditional: "Restricted by exposed props",
                    nativra: "Infinite (edit any line of code)",
                  },
                  {
                    feature: "Upgrade Safety",
                    traditional: "Upstream updates break layouts",
                    nativra: "SHA-256 hash checks prevent overwriting",
                  },
                  {
                    feature: "Interactive Previews",
                    traditional: "External Storybook setup required",
                    nativra: "Live mobile device canvas for all 70 components in docs",
                  },
                ].map((row) => (
                  <tr key={row.feature} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-foreground">
                      {row.feature}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      <span className="flex items-center gap-1.5 text-zinc-500">
                        <X className="h-3.5 w-3.5 text-red-500" />
                        <span>{row.traditional}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-foreground">
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        <span>{row.nativra}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- */}
      {/* CTA Section */}
      {/* ------------------------------------------------------------------- */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-gradient-to-b from-card to-muted/40 p-8 sm:p-12 text-center shadow-lg space-y-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-md">
            <Sparkles className="h-6 w-6" />
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Start building native mobile apps today.
          </h2>

          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Initialize Nativra in your Expo or React Native project in less than two minutes. Free, open source, and MIT licensed.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/docs/installation"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <span>Install Nativra</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/docs/components"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-muted"
            >
              Explore Components
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
