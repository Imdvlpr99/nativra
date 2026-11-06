import type { Metadata } from "next";
import { Sparkles, CheckCircle2, Terminal, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Release history, roadmap updates, and feature changelog for Nativra",
};

export default function ChangelogPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-border pb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">
          Releases & History
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Changelog
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          Stay up to date with the latest components, CLI improvements, and platform updates to Nativra.
        </p>
      </div>

      <div className="space-y-12">
        {/* Release v0.1.0 */}
        <div className="relative pl-6 border-l-2 border-sky-500 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              v0.1.0 — Foundation Release
            </h2>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Latest
            </span>
            <span className="font-mono text-xs text-muted-foreground">November 2026</span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Initial foundational release of the Nativra developer platform and source-owned React Native toolchain.
          </p>

          <div className="space-y-6 pt-2">
            <div>
              <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Layers className="h-4 w-4 text-sky-500" />
                <span>Foundation Component Catalog (12 Primitives)</span>
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                All 12 items authored simultaneously for NativeWind v4 and React Native StyleSheet:
              </p>
              <ul className="grid gap-1.5 sm:grid-cols-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span><strong>Button</strong> — 7 variants, 5 sizes, loading indicator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span><strong>Badge</strong> — Semantic status tag labels</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span><strong>Avatar</strong> — Image avatar with automatic initials fallback</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span><strong>Input</strong> — Form text input with error state and helper text</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span><strong>Card</strong> — Elevated container surface with custom padding</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span><strong>Checkbox</strong> — Accessible toggle with check indicator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span><strong>Switch</strong> — Track/thumb toggle switch with themed colors</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span><strong>Skeleton</strong> — Shimmer pulse animation placeholders</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span><strong>Spinner</strong> — Themed native activity indicator</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span><strong>Separator</strong> — Horizontal and vertical hairline dividers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span><strong>Label</strong> — Accessible form label with required asterisk</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span><strong>Text</strong> — Scalable typography variant hierarchy</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-500" />
                <span>Nativra CLI & Tooling</span>
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-xs text-muted-foreground">
                <li><code className="font-mono text-foreground">nativra init</code>: Project setup wizard with styling target detection.</li>
                <li><code className="font-mono text-foreground">nativra add</code>: Dependency resolution and non-destructive installation.</li>
                <li><code className="font-mono text-foreground">nativra diff</code> & <code className="font-mono text-foreground">update</code>: Cryptographic SHA-256 conflict detection.</li>
                <li><code className="font-mono text-foreground">nativra doctor</code>: Environment diagnostic tool.</li>
                <li><code className="font-mono text-foreground">nativra theme</code>: Theme token management.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Nativra Studio</span>
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Visual component customizer and code inspector running on Next.js 15, editing schema-defined properties with live hot reloading.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

