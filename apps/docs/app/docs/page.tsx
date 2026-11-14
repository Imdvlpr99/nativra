import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getCatalogCounts } from "@/lib/registry";
import { ITEM_TYPE_ORDER, TYPE_META, catalogHref } from "@/lib/item-types";
import { CommandLine } from "@/components/docs/CopyButton";

export const metadata: Metadata = {
  title: "Introduction to Nativra — Source-First React Native & Expo UI",
  description:
    "Learn how Nativra brings the source-first philosophy of shadcn/ui to React Native and Expo with dual NativeWind v4 and StyleSheet styling parity.",
  alternates: {
    canonical: "/docs",
  },
};

const NEXT_STEPS = [
  { title: "Installation", href: "/docs/installation", body: "Set up nativra.json in a new or existing Expo project." },
  { title: "Principles", href: "/docs/principles", body: "Why source-first, and how the registry and CLI fit together." },
  { title: "CLI reference", href: "/docs/cli", body: "Every command and flag: add, diff, update, rollback, audit and more." },
  { title: "Theming", href: "/docs/theming", body: "Semantic tokens, presets, and wiring CSS variables for NativeWind." },
];

export default async function DocsPage() {
  const counts = await getCatalogCounts();

  return (
    <div className="space-y-14">
      <header className="space-y-4">
        <p className="eyebrow">Getting started</p>
        <h1 className="text-3xl font-semibold sm:text-4xl">Introduction</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Nativra is a registry of React Native and Expo UI plus a CLI that copies it into your project. You don&apos;t
          install a component library — you install source files you own, styled with NativeWind v4 or plain StyleSheet.
        </p>
      </header>

      <section aria-labelledby="how" className="space-y-4">
        <h2 id="how" className="text-xl font-semibold">
          How it works
        </h2>
        <ol className="space-y-4">
          {[
            ["Initialize once", "npx nativra-cli init", "Detects your framework, styling and path aliases and writes nativra.json."],
            ["Add what you need", "npx nativra-cli add button card", "Copies the files and their registry dependencies, rewriting imports to your aliases."],
            ["Keep it current", "npx nativra-cli update", "Applies registry changes only to files you haven't edited, with a backup you can roll back."],
          ].map(([title, cmd, body], i) => (
            <li key={cmd} className="grid gap-2 sm:grid-cols-[1.5rem_1fr]">
              <span className="font-mono text-sm text-muted-foreground" aria-hidden="true">
                {i + 1}
              </span>
              <div className="space-y-2">
                <p className="font-medium">{title}</p>
                <p className="text-sm text-muted-foreground">{body}</p>
                <CommandLine command={cmd!} />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="registry" className="space-y-4">
        <h2 id="registry" className="text-xl font-semibold">
          What&apos;s in the registry
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {ITEM_TYPE_ORDER.filter((t) => counts[t] > 0).map((t) => (
            <li key={t}>
              <Link
                href={catalogHref(t)}
                className="group flex h-full flex-col rounded-lg border border-border p-4 transition-colors hover:border-foreground/30 hover:bg-accent/40"
              >
                <span className="flex items-baseline justify-between">
                  <span className="font-medium">{TYPE_META[t].plural}</span>
                  <span className="font-mono text-sm text-muted-foreground">{counts[t]}</span>
                </span>
                <span className="mt-1 text-sm text-muted-foreground">{TYPE_META[t].blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="next" className="space-y-4">
        <h2 id="next" className="text-xl font-semibold">
          Next steps
        </h2>
        <ul className="divide-y divide-border rounded-lg border border-border">
          {NEXT_STEPS.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="group flex items-center justify-between gap-4 p-4 transition-colors hover:bg-accent/40">
                <span>
                  <span className="block font-medium">{s.title}</span>
                  <span className="block text-sm text-muted-foreground">{s.body}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
