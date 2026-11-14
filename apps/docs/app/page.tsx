import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  FileCode2,
  GitCompareArrows,
  Layers,
  Palette,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { THEME_PRESETS } from "@nativra/theme-engine";
import { HomeHeroPlayground } from "@/components/HomeHeroPlayground";
import { CommandLine } from "@/components/docs/CopyButton";
import { getCatalogCounts, getManifest } from "@/lib/registry";
import { ITEM_TYPE_ORDER, TYPE_META, catalogHref, itemHref } from "@/lib/item-types";
import { getCliVersion } from "@/lib/site";

export const metadata: Metadata = {
  title:
    "Nativra — Source-First React Native & Expo UI Components (shadcn/ui for Mobile)",
  description:
    "Copy production-ready React Native & Expo UI components, composite blocks, and screen templates directly into your codebase. Dual NativeWind v4 and StyleSheet parity with zero runtime lock-in.",
  alternates: {
    canonical: "/",
  },
};


const homepageFaqItems = [
  {
    question: "What is Nativra and how does it compare to shadcn/ui for React Native?",
    answer:
      "Nativra brings the source-first philosophy of shadcn/ui to React Native and Expo. Instead of locking your UI inside an opaque node_modules package, running `npx nativra-cli add button` copies clean, typed TypeScript component source code directly into your repository (`components/ui/Button.tsx`) so you own and customize every line.",
  },
  {
    question: "Does Nativra support both NativeWind v4 and React Native StyleSheet?",
    answer:
      "Yes. Every single Nativra primitive, composite block, and screen template is engineered with 1:1 visual and behavioral parity across both NativeWind v4 (Tailwind CSS for React Native) and pure React Native StyleSheet—with zero runtime styling lock-in.",
  },
  {
    question: "How do I install Nativra components in an Expo or React Native project?",
    answer:
      "Run `npx nativra-cli init` in your Expo or React Native project to generate `nativra.json`, then install any component, block, or template with `npx nativra-cli add <name>` (for example, `npx nativra-cli add button card dialog`).",
  },
  {
    question: "Is Nativra compatible with Expo SDK 52+ and React Native's New Architecture (Bridgeless / Fabric)?",
    answer:
      "Yes. All 39 Nativra components, 18 blocks, 8 screen templates, and 7 mobile hooks are tested for React Native 0.76+, Expo SDK 52+, Bridgeless mode, Fabric renderer, iOS VoiceOver, and Android TalkBack accessibility.",
  },
  {
    question: "How does Nativra prevent overwriting my local component customizations during updates?",
    answer:
      "Nativra records SHA-256 checksums of installed files in `nativra.lock.json`. Before updating or removing any component, `nativra-cli` verifies whether you modified the file locally, lets you inspect changes via `npx nativra-cli diff`, and supports atomic rollback.",
  },
];

const homepageFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: homepageFaqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const FEATURES = [
  {
    icon: FileCode2,
    title: "You own the source",
    body: "The CLI copies typed TypeScript into your repo — no runtime package, no version lock. Edit anything.",
  },
  {
    icon: Layers,
    title: "NativeWind or StyleSheet",
    body: "Every item ships both implementations with the same props and behavior. Pick one in nativra.json.",
  },
  {
    icon: GitCompareArrows,
    title: "Updates that respect your edits",
    body: "SHA-256 hashes in nativra.lock.json detect local changes. diff before you update; every update is snapshotted and reversible with rollback.",
  },
  {
    icon: Palette,
    title: "Theme engine",
    body: "Semantic tokens with light and dark palettes. Install a theme as source or wire it into global.css as CSS variables.",
  },
  {
    icon: ShieldCheck,
    title: "Accessible by default",
    body: "Accessibility roles and labels on interactive components, no font-scaling locks — and nativra audit checks the rest of your app.",
  },
  {
    icon: Smartphone,
    title: "Made for Expo",
    body: "Verified on iOS and Android, Expo Go and the New Architecture. init detects your setup and tsconfig aliases.",
  },
];

const WORKFLOW = [
  { cmd: "npx nativra-cli init", title: "Initialize", body: "Detects Expo, NativeWind, src/ layout and your tsconfig path alias, then writes nativra.json." },
  { cmd: "npx nativra-cli add login-form", title: "Add", body: "Resolves registry dependencies, rewrites imports to your aliases and records hashes in the lockfile." },
  { cmd: "npx nativra-cli diff button", title: "Compare", body: "See exactly how your copy differs from the latest registry version before changing anything." },
  { cmd: "npx nativra-cli update", title: "Update safely", body: "Locally modified files are skipped unless you pass --force. Undo any update with rollback." },
];

export default async function HomePage() {
  const [counts, manifest] = await Promise.all([getCatalogCounts(), getManifest()]);
  const version = getCliVersion();
  const themes = manifest.items.filter((i) => i.type === "theme" && THEME_PRESETS[i.id]);
  const stats = ITEM_TYPE_ORDER.filter((t) => counts[t] > 0 && t !== "utility");

  return (
    <main id="main-content" tabIndex={-1} className="outline-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFaqJsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="container-docs grid gap-12 py-16 sm:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center">
          <div className="space-y-6">
            <Link
              href="/docs/changelog"
              className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="font-mono">v{version}</span>
              <span aria-hidden="true">·</span>
              <span>What&apos;s new</span>
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
            <h1 className="text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl">
              Native UI,
              <br />
              <span className="text-muted-foreground">built your way.</span>
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Copy accessible React Native and Expo components into your project with one command. The source is yours —
              styled with NativeWind or StyleSheet, with no runtime dependency.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/docs/installation"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Get started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/docs/components"
                className="inline-flex h-11 items-center rounded-md border border-border px-5 text-sm font-medium transition-colors hover:bg-accent"
              >
                Browse components
              </Link>
            </div>
            <div className="max-w-md">
              <CommandLine command="npx nativra-cli init" />
            </div>
          </div>
          <div className="min-w-0">
            <HomeHeroPlayground />
          </div>
        </div>
      </section>

      {/* Catalog numbers */}
      <section aria-labelledby="catalog-heading" className="border-b border-border">
        <h2 id="catalog-heading" className="sr-only">
          What&apos;s in the registry
        </h2>
        <ul className="container-docs grid grid-cols-2 divide-border sm:grid-cols-3 lg:grid-cols-5 lg:divide-x">
          {stats.map((t) => (
            <li key={t}>
              <Link href={catalogHref(t)} className="group block px-2 py-8 transition-colors hover:bg-accent/40 lg:px-6">
                <span className="block font-mono text-3xl font-semibold tabular-nums">{counts[t]}</span>
                <span className="mt-1 flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground">
                  {TYPE_META[t].plural}
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Features */}
      <section aria-labelledby="features-heading" className="container-docs py-20 sm:py-24">
        <div className="max-w-2xl space-y-3">
          <p className="eyebrow">Why Nativra</p>
          <h2 id="features-heading" className="text-3xl font-semibold sm:text-4xl">
            A component library you can actually change.
          </h2>
          <p className="text-lg text-muted-foreground">
            Packages give you components you can&apos;t edit. Nativra gives you the code, plus tooling to keep it current.
          </p>
        </div>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="space-y-3 bg-background p-6">
              <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Workflow */}
      <section aria-labelledby="workflow-heading" className="border-y border-border bg-muted/30">
        <div className="container-docs grid gap-12 py-20 sm:py-24 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-3">
            <p className="eyebrow">The CLI</p>
            <h2 id="workflow-heading" className="text-3xl font-semibold sm:text-4xl">
              From install to update, nothing is overwritten by surprise.
            </h2>
            <p className="text-muted-foreground">
              Twelve commands cover the lifecycle — including <code className="font-mono text-foreground">remove</code>,{" "}
              <code className="font-mono text-foreground">rollback</code>, <code className="font-mono text-foreground">doctor</code> and{" "}
              <code className="font-mono text-foreground">audit</code>.
            </p>
            <Link href="/docs/cli" className="link inline-flex items-center gap-1 text-sm">
              CLI reference <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <ol className="space-y-6">
            {WORKFLOW.map((step, i) => (
              <li key={step.cmd} className="grid gap-3 sm:grid-cols-[2rem_1fr]">
                <span className="font-mono text-sm text-muted-foreground" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="space-y-2">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.body}</p>
                  <CommandLine command={step.cmd} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Themes */}
      <section aria-labelledby="themes-heading" className="container-docs py-20 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl space-y-3">
            <p className="eyebrow">Themes</p>
            <h2 id="themes-heading" className="text-3xl font-semibold sm:text-4xl">
              {themes.length} palettes, light and dark.
            </h2>
            <p className="text-muted-foreground">Generated from one token source, so the installed files and CSS variables always agree.</p>
          </div>
          <Link href="/docs/themes" className="link inline-flex items-center gap-1 text-sm">
            All themes <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {themes.map((t) => {
            const p = THEME_PRESETS[t.id]!;
            return (
              <li key={t.id}>
                <Link href={itemHref("theme", t.id)} className="group block rounded-lg border border-border p-2 transition-colors hover:border-foreground/30">
                  <span className="grid h-16 grid-cols-2 overflow-hidden rounded-md" aria-hidden="true">
                    <span className="flex items-end p-2" style={{ background: String(p.light.background) }}>
                      <span className="h-4 w-8 rounded-sm" style={{ background: String(p.light.primary) }} />
                    </span>
                    <span className="flex items-end p-2" style={{ background: String(p.dark.background) }}>
                      <span className="h-4 w-8 rounded-sm" style={{ background: String(p.dark.primary) }} />
                    </span>
                  </span>
                  <span className="mt-2 block px-1 text-sm font-medium">{t.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-heading" className="border-t border-border">
        <div className="container-docs grid gap-10 py-20 sm:py-24 lg:grid-cols-[1fr_2fr]">
          <h2 id="faq-heading" className="text-3xl font-semibold">
            Questions
          </h2>
          <div className="divide-y divide-border border-y border-border">
            {homepageFaqItems.map((f) => (
              <details key={f.question} className="group py-1">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-3 font-medium [&::-webkit-details-marker]:hidden">
                  {f.question}
                  <span className="text-xl leading-none text-muted-foreground transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="container-docs flex flex-col items-start justify-between gap-6 py-16 sm:flex-row sm:items-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Add your first component in a minute.</h2>
            <p className="text-muted-foreground">Works in any Expo or React Native 0.74+ project.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="sm:w-72">
              <CommandLine command="npx nativra-cli add button" />
            </div>
            <Link
              href="/docs/installation"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Read the guide
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
