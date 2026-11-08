"use client";

import React, { useState } from "react";
import {
  getTypographyScale,
  defaultSpace,
  defaultRadius,
  type DensityPreset,
  type FontScaleTier,
  type TypographyVariantName,
} from "@nativra/theme-engine";

const VARIANT_META: Array<{
  key: TypographyVariantName;
  sample: string;
}> = [
  { key: "displayLarge", sample: "Native by default" },
  { key: "displayMedium", sample: "Design system, shipped" },
  { key: "h1", sample: "Section headline" },
  { key: "h2", sample: "Subsection title" },
  { key: "h3", sample: "Card header title" },
  { key: "bodyLarge", sample: "Emphasized reading copy for mobile screens." },
  { key: "body", sample: "Default reading size used across Nativra components." },
  { key: "bodySmall", sample: "Secondary subheadline used for list subtitles and captions." },
  { key: "label", sample: "Form control label" },
  { key: "caption", sample: "$24,590.00 · Tabular numeric metrics" },
  { key: "overline", sample: "SECTION OVERLINE" },
];

export function TokenAndTypeVisualizer() {
  const [density, setDensity] = useState<DensityPreset>("regular");
  const [fontScale, setFontScale] = useState<FontScaleTier>("md");

  const typeScale = getTypographyScale(density, fontScale);
  const densityMultiplier =
    density === "compact" ? 0.85 : density === "comfortable" ? 1.15 : 1.0;

  return (
    <div className="space-y-10">
      {/* Typography Scale Inspector */}
      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Typography & Density Scale
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              12 semantic typography variants tuned for iOS and Android with tabular numerals, preconfigured line heights, and dynamic density scaling.
            </p>
          </div>

          {/* Density & Font Scale Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-xl border border-border bg-card p-1">
              {(["compact", "regular", "comfortable"] as DensityPreset[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDensity(d)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition-all ${
                    density === d
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="flex items-center rounded-xl border border-border bg-card p-1">
              {(["sm", "md", "lg", "xl"] as FontScaleTier[]).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setFontScale(tier)}
                  className={`rounded-lg px-2 py-1 text-xs font-semibold uppercase transition-all ${
                    fontScale === tier
                      ? "bg-sky-600 text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {VARIANT_META.map(({ key, sample }) => {
            const spec = typeScale[key];
            return (
              <div
                key={key}
                className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3 sm:w-56 shrink-0">
                  <code className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-bold text-foreground">
                    {key}
                  </code>
                  <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                    {spec.fontSize}px / {spec.lineHeight}px / {spec.fontWeight}
                  </span>
                </div>
                <div className="flex-1 overflow-hidden">
                  <p
                    style={{
                      fontSize: `${Math.min(spec.fontSize, 36)}px`,
                      lineHeight: `${Math.min(spec.lineHeight, 44)}px`,
                      fontWeight: spec.fontWeight,
                      letterSpacing: `${spec.letterSpacing}px`,
                    }}
                    className={`truncate text-foreground ${
                      spec.tabularNums ? "tabular-nums" : ""
                    }`}
                  >
                    {sample}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Spacing & Border Radius Visualizers */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Spacing Scale */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-foreground">
              4-pt Spacing Grid ({density} density)
            </h3>
            <p className="text-xs text-muted-foreground">
              Density-independent pixel (`dp`) scale automatically adjusted by active density preset.
            </p>
          </div>
          <div className="space-y-2">
            {Object.entries(defaultSpace)
              .filter(([k]) => k !== "0")
              .map(([token, baseVal]) => {
                const scaled = Math.round(baseVal * densityMultiplier);
                return (
                  <div key={token} className="flex items-center gap-3 text-xs">
                    <code className="w-10 font-mono font-bold text-foreground">
                      space.{token}
                    </code>
                    <span className="w-12 font-mono text-muted-foreground tabular-nums">
                      {scaled}px
                    </span>
                    <div className="flex-1">
                      <div
                        className="h-3 rounded bg-sky-500/80 transition-all"
                        style={{ width: `${Math.min(100, (scaled / 96) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Border Radius Scale */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Corner Radius Tokens
            </h3>
            <p className="text-xs text-muted-foreground">
              Unified corner geometry across cards, sheets, buttons, and pill badges.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Object.entries(defaultRadius).map(([name, val]) => (
              <div
                key={name}
                className="flex flex-col items-center justify-center rounded-xl border border-border bg-muted/20 p-3 text-center"
              >
                <div
                  className="mb-2 h-12 w-16 border-2 border-sky-500 bg-sky-500/15"
                  style={{ borderRadius: `${Math.min(val, 999)}px` }}
                />
                <code className="font-mono text-xs font-bold text-foreground">
                  radius.{name}
                </code>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {val}px
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

