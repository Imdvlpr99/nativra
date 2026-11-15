import React, { Suspense, use, useId, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Boxes, FileCode2, GitCompareArrows, Palette, ShieldCheck, Stethoscope } from "lucide-react";
import { THEME_PRESETS } from "@nativra/theme-engine";
import { CLI_VERSION, EXPO_MIN, RN_MIN, countOfType, itemsOfType, type StylingTarget } from "@/lib/data";
import { ITEM_TYPE_ORDER, TYPE_META, catalogHref, itemHref } from "@/lib/item-types";
import { installPlan } from "@/lib/install-plan";
import { loadItem } from "@/lib/load-item";
import { Seo } from "@/lib/head";
import { CommandLine } from "@/components/ui/CopyButton";
import { Highlighted } from "@/components/ui/Code";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const DEFAULT_CONFIG = `{
  "$schema": "https://nativra.vercel.app/schema.json",
  "version": 4,
  "registries": [{ "name": "default", "url": "https://nativra.vercel.app" }],
  "stylingTarget": "nativewind",
  "componentsDir": "components/ui",
  "hooksDir": "hooks",
  "utilsDir": "lib/utils",
  "themesDir": "lib/themes",
  "aliasPrefix": "@/"
}`;

const FAQ = [
  {
    q: "How is this different from a component library package?",
    a: "There is no Nativra package in your dependencies. The CLI copies TypeScript source into folders you choose, rewrites its imports to your path aliases and records a hash of each file. After that the code is yours to read and change.",
  },
  {
    q: "NativeWind or StyleSheet: do I have to choose?",
    a: "You choose once, with stylingTarget in nativra.json. Every item ships both versions with the same props, so switching later doesn't change how your screens use the components.",
  },
  {
    q: "What happens to my edits when a component is updated?",
    a: "update compares each file's hash with nativra.lock.json and skips files you changed unless you pass --force. Run diff first to see the difference. Every file update replaces is backed up, and rollback restores it.",
  },
  {
    q: "Which versions are supported?",
    a: `Expo SDK ${EXPO_MIN} or newer and React Native ${RN_MIN} or newer, including the New Architecture. The CLI needs Node.js 20+. Run nativra-cli doctor to check a project.`,
  },
  {
    q: "Can I host my own components?",
    a: "Yes. A registry is a folder of static JSON. Point --registry at an HTTPS URL or a local directory, or register it by name with registry add. Items from any registry get the same checks and lockfile tracking.",
  },
];

const FEATURES = [
  { icon: FileCode2, title: "Source, not a dependency", body: "Plain .tsx in your repo. Nothing from Nativra runs in your app, and nothing changes until you run a command." },
  { icon: Boxes, title: "One API, two styling targets", body: "NativeWind v4 classes or StyleSheet.create, with identical props. Both read colors from the installed theme." },
  { icon: GitCompareArrows, title: "Updates that keep your edits", body: "SHA-256 hashes in nativra.lock.json tell your changes apart from the original. Edited files are never overwritten silently." },
  { icon: Palette, title: "Semantic theme tokens", body: "Light and dark palettes of the same tokens. One theme add command restyles every installed component." },
  { icon: ShieldCheck, title: "Careful with your project", body: "HTTPS-only registries, path containment and symlink checks, checksum verification and transactional writes." },
  { icon: Stethoscope, title: "Checks for the whole app", body: "doctor validates your setup and versions. audit scores accessibility and token hygiene, and can migrate legacy touchables." },
];

const STEPS = [
  { cmd: "npx nativra-cli init", title: "Initialize", body: "Detects Expo, NativeWind, a src/ folder and your tsconfig alias, then writes nativra.json." },
  { cmd: "npx nativra-cli add login-form", title: "Add", body: "Resolves dependencies, rewrites imports to your aliases and hashes every file into nativra.lock.json." },
  { cmd: "npx nativra-cli update", title: "Update", body: "Replaces only files you haven't edited, backs them up first, and rollback undoes it." },
];

type Tab = "terminal" | "source" | "config";

function TerminalPane() {
  const plan = installPlan("login-form");
  const items = new Set(plan.map((f) => f.itemId)).size;
  return (
    <div className="space-y-0.5 px-5 py-4 font-mono text-[12.5px] leading-6">
      <p>
        <span className="text-emerald-400">$</span> npx nativra-cli add login-form
      </p>
      <p className="pb-2 text-code-muted">
        Resolved {items} items: login-form and {items - 1} dependencies
      </p>
      {plan.map((f) => (
        <p key={f.path} className="flex justify-between gap-4">
          <span className="min-w-0 truncate">
            <span className="text-emerald-400">+ </span>
            {f.path}
          </span>
          <span className="shrink-0 text-code-muted">{f.itemId}</span>
        </p>
      ))}
      <p className="flex justify-between gap-4 pt-2">
        <span>
          <span className="text-sky-300">~ </span>nativra.lock.json
        </span>
        <span className="shrink-0 text-code-muted">{items} items hashed</span>
      </p>
    </div>
  );
}

function SourcePane({ target }: { target: StylingTarget }) {
  const item = use(loadItem("button"));
  const file = item.files.find((f) => f.target === target) ?? item.files[0];
  return <Highlighted code={file?.content ?? ""} lang="tsx" className="px-5 py-4" />;
}

function Editor() {
  const [tab, setTab] = useState<Tab>("terminal");
  const [target, setTarget] = useState<StylingTarget>("nativewind");
  const baseId = useId();
  const tabs: Array<{ key: Tab; label: string }> = [
    { key: "terminal", label: "Terminal" },
    { key: "source", label: "Button.tsx" },
    { key: "config", label: "nativra.json" },
  ];

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-signature opacity-40 blur-2xl dark:opacity-25" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-2xl border border-code-border bg-code text-left text-code-fg shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-code-border px-2">
          <div role="tablist" aria-label="Example files" className="flex">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                id={`${baseId}-${t.key}`}
                aria-selected={tab === t.key}
                aria-controls={`${baseId}-panel`}
                onClick={() => setTab(t.key)}
                className={`relative px-3 py-3 font-mono text-xs transition-colors ${
                  tab === t.key ? "text-code-fg" : "text-code-muted hover:text-code-fg"
                }`}
              >
                {t.label}
                {tab === t.key && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-signature" aria-hidden="true" />}
              </button>
            ))}
          </div>
          {tab === "source" && (
            <div role="radiogroup" aria-label="Styling target" className="flex gap-1 pr-1">
              {(["nativewind", "stylesheet"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={target === t}
                  onClick={() => setTarget(t)}
                  className={`rounded-md px-2 py-1 font-mono text-[11px] transition-colors ${
                    target === t ? "bg-white/10 text-code-fg" : "text-code-muted hover:text-code-fg"
                  }`}
                >
                  {t === "nativewind" ? "NativeWind" : "StyleSheet"}
                </button>
              ))}
            </div>
          )}
        </div>
        <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-${tab}`} className="h-[26rem] overflow-auto">
          {tab === "terminal" && <TerminalPane />}
          {tab === "source" && (
            <ErrorBoundary label="Button.tsx">
              <Suspense fallback={<p className="px-5 py-4 font-mono text-xs text-code-muted">Loading Button.tsx…</p>}>
                <SourcePane target={target} />
              </Suspense>
            </ErrorBoundary>
          )}
          {tab === "config" && <Highlighted code={DEFAULT_CONFIG} lang="json" className="px-5 py-4" />}
        </div>
        <p className="border-t border-code-border px-5 py-2.5 text-xs text-code-muted">
          {tab === "terminal"
            ? "The files written in a default NativeWind project, computed from the registry at build time."
            : tab === "source"
              ? "The real registry source the CLI installs. Your copy gets your import aliases."
              : "What init writes for an Expo project with NativeWind and an @/* path alias."}
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const themes = itemsOfType("theme").filter((t) => THEME_PRESETS[t.id]);

  return (
    <main id="main-content" tabIndex={-1} className="outline-none">
      <Seo
        title="Nativra: source-first UI for React Native and Expo"
        description="Copy typed React Native and Expo components, blocks and screen templates into your codebase with one command. NativeWind v4 or StyleSheet, no runtime package, safe updates."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "SoftwareApplication",
              name: "Nativra",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Windows, macOS, Linux",
              softwareVersion: CLI_VERSION,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              downloadUrl: "https://www.npmjs.com/package/nativra-cli",
            },
            {
              "@type": "FAQPage",
              mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
          ],
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
          aria-hidden="true"
        />
        <div className="container-docs relative flex flex-col items-center pb-20 pt-20 text-center sm:pt-28">
          <a
            href="https://github.com/Imdvlpr99/nativra/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-sm text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-signature" aria-hidden="true" />
            <span className="font-mono text-xs">nativra-cli v{CLI_VERSION}</span>
            <span aria-hidden="true">·</span>
            Release notes
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <h1 className="mt-8 max-w-4xl text-[2.6rem] font-bold leading-[1.05] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
            React Native UI,
            <br />
            <span className="text-signature">delivered as source.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            One command copies typed, accessible components into your Expo or React Native project. NativeWind or StyleSheet.
            No runtime package, and updates never overwrite your edits.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/docs/installation" className="btn-primary h-11 px-5">
              Get started
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/docs/components" className="btn-secondary h-11 px-5">
              Browse components
            </Link>
          </div>
          <div className="mt-6 w-full max-w-sm text-left">
            <CommandLine command="npx nativra-cli init" />
          </div>

          <div className="mt-16 w-full max-w-4xl">
            <Editor />
          </div>
        </div>
      </section>

      {/* Registry contents */}
      <section aria-labelledby="catalog-heading" className="border-y border-border bg-surface">
        <h2 id="catalog-heading" className="sr-only">
          What&apos;s in the registry
        </h2>
        <ul className="container-docs grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-6">
          {ITEM_TYPE_ORDER.filter((t) => countOfType(t) > 0).map((t) => (
            <li key={t}>
              <Link to={catalogHref(t)} className="group block px-2 py-8 text-center transition-colors">
                <span className="block text-3xl font-bold tabular-nums tracking-tight">{countOfType(t)}</span>
                <span className="mt-1 block text-sm text-muted-foreground group-hover:text-brand">
                  {countOfType(t) === 1 ? TYPE_META[t].label : TYPE_META[t].plural}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Workflow */}
      <section aria-labelledby="workflow-heading" className="container-docs py-24">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <p className="eyebrow">Workflow</p>
          <h2 id="workflow-heading" className="text-3xl font-bold sm:text-4xl">
            Three commands. The rest is your code.
          </h2>
          <p className="text-muted-foreground">
            The CLI also covers diff, remove, rollback, doctor, audit, themes and custom registries.{" "}
            <Link to="/docs/cli" className="link">
              See every command
            </Link>
            .
          </p>
        </div>
        <ol className="mt-14 grid gap-4 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.cmd} className="panel flex flex-col gap-3 p-6">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-semibold" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="text-[15px] text-muted-foreground">{s.body}</p>
              <div className="mt-auto pt-2">
                <CommandLine command={s.cmd} />
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Features */}
      <section aria-labelledby="features-heading" className="border-t border-border">
        <div className="container-docs py-24">
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <p className="eyebrow">Why Nativra</p>
            <h2 id="features-heading" className="text-3xl font-bold sm:text-4xl">
              The convenience of a library, the control of your own code.
            </h2>
          </div>
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <li key={title} className="panel space-y-3 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface">
                  <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                </span>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Themes */}
      <section aria-labelledby="themes-heading" className="border-t border-border">
        <div className="container-docs py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl space-y-4">
              <p className="eyebrow">Themes</p>
              <h2 id="themes-heading" className="text-3xl font-bold sm:text-4xl">
                {themes.length} palettes, light and dark.
              </h2>
              <p className="text-muted-foreground">Generated from one token source, so the installed theme file and the CSS variables always agree.</p>
            </div>
            <Link to="/docs/theming" className="link inline-flex items-center gap-1 text-sm">
              How theming works <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {themes.map((t) => {
              const p = THEME_PRESETS[t.id]!;
              return (
                <li key={t.id}>
                  <Link to={itemHref("theme", t.id)} className="panel group block p-2 transition-colors hover:border-brand/40">
                    <span className="grid h-20 grid-cols-2 overflow-hidden rounded-lg" aria-hidden="true">
                      <span className="flex items-end p-2.5" style={{ background: String(p.light.background) }}>
                        <span className="h-4 w-9 rounded" style={{ background: String(p.light.primary) }} />
                      </span>
                      <span className="flex items-end p-2.5" style={{ background: String(p.dark.background) }}>
                        <span className="h-4 w-9 rounded" style={{ background: String(p.dark.primary) }} />
                      </span>
                    </span>
                    <span className="mt-2 block px-1 pb-0.5 text-sm font-medium">{t.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-heading" className="border-t border-border">
        <div className="container-docs mx-auto max-w-3xl py-24">
          <h2 id="faq-heading" className="text-center text-3xl font-bold sm:text-4xl">
            Questions
          </h2>
          <div className="mt-10 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="panel group px-5">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="text-xl leading-none text-muted-foreground transition-transform group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="pb-5 text-[15px] leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="container-docs flex flex-col items-center gap-6 py-20 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Add your first component in a minute.</h2>
          <p className="text-muted-foreground">
            Works with Expo SDK {EXPO_MIN}+ and React Native {RN_MIN}+.
          </p>
          <div className="flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <CommandLine command="npx nativra-cli add button" />
            </div>
            <Link to="/docs/quickstart" className="btn-primary h-11 px-5">
              Quick start
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
