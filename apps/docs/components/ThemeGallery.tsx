"use client";

import React, { useState } from "react";
import { Check, Copy, Palette, Terminal } from "lucide-react";

interface ThemeToken {
  slot: string;
  light: string;
  dark: string;
}

interface ThemePreset {
  id: string;
  name: string;
  description: string;
  tokens: ThemeToken[];
  preview: {
    bgLight: string;
    bgDark: string;
    cardLight: string;
    cardDark: string;
    primaryLight: string;
    primaryDark: string;
    textLight: string;
    textDark: string;
  };
}

const THEMES: ThemePreset[] = [
  {
    id: "zinc",
    name: "Zinc",
    description: "Neutral monochrome grayscale tokens matching modern high-contrast design systems.",
    tokens: [
      { slot: "background", light: "#ffffff", dark: "#09090b" },
      { slot: "foreground", light: "#09090b", dark: "#fafafa" },
      { slot: "card", light: "#ffffff", dark: "#18181b" },
      { slot: "primary", light: "#18181b", dark: "#fafafa" },
      { slot: "secondary", light: "#f4f4f5", dark: "#27272a" },
      { slot: "muted", light: "#71717a", dark: "#a1a1aa" },
      { slot: "destructive", light: "#ef4444", dark: "#7f1d1d" },
      { slot: "border", light: "#e4e4e7", dark: "#27272a" },
    ],
    preview: {
      bgLight: "bg-white",
      bgDark: "bg-zinc-950",
      cardLight: "bg-zinc-50 border-zinc-200",
      cardDark: "bg-zinc-900 border-zinc-800",
      primaryLight: "bg-zinc-900 text-white",
      primaryDark: "bg-zinc-100 text-zinc-900",
      textLight: "text-zinc-900",
      textDark: "text-zinc-50",
    },
  },
  {
    id: "dark-slate",
    name: "Dark Slate",
    description: "Slate-toned cool charcoal color palette with steel blue accents.",
    tokens: [
      { slot: "background", light: "#f8fafc", dark: "#0f172a" },
      { slot: "foreground", light: "#0f172a", dark: "#f8fafc" },
      { slot: "card", light: "#ffffff", dark: "#1e293b" },
      { slot: "primary", light: "#3b82f6", dark: "#60a5fa" },
      { slot: "secondary", light: "#f1f5f9", dark: "#334155" },
      { slot: "muted", light: "#64748b", dark: "#94a3b8" },
      { slot: "destructive", light: "#ef4444", dark: "#991b1b" },
      { slot: "border", light: "#e2e8f0", dark: "#334155" },
    ],
    preview: {
      bgLight: "bg-slate-50",
      bgDark: "bg-slate-950",
      cardLight: "bg-white border-slate-200",
      cardDark: "bg-slate-900 border-slate-800",
      primaryLight: "bg-blue-600 text-white",
      primaryDark: "bg-blue-500 text-white",
      textLight: "text-slate-900",
      textDark: "text-slate-50",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Deep indigo & navy night theme with sky blue neon brand highlights.",
    tokens: [
      { slot: "background", light: "#f0fdf4", dark: "#0b0f19" },
      { slot: "foreground", light: "#0b0f19", dark: "#f8fafc" },
      { slot: "card", light: "#ffffff", dark: "#111827" },
      { slot: "primary", light: "#0284c7", dark: "#38bdf8" },
      { slot: "secondary", light: "#e0f2fe", dark: "#1e293b" },
      { slot: "muted", light: "#64748b", dark: "#94a3b8" },
      { slot: "destructive", light: "#ef4444", dark: "#dc2626" },
      { slot: "border", light: "#bae6fd", dark: "#1e293b" },
    ],
    preview: {
      bgLight: "bg-sky-50/50",
      bgDark: "bg-[#0b0f19]",
      cardLight: "bg-white border-sky-100",
      cardDark: "bg-[#111827] border-slate-800",
      primaryLight: "bg-sky-600 text-white",
      primaryDark: "bg-sky-400 text-zinc-950 font-bold",
      textLight: "text-slate-900",
      textDark: "text-slate-100",
    },
  },
];

export function ThemeGallery() {
  const [selectedTheme, setSelectedTheme] = useState<string>("midnight");
  const [copied, setCopied] = useState(false);

  const activeTheme: ThemePreset =
    THEMES.find((t) => t.id === selectedTheme) ?? THEMES[0]!;

  const handleCopy = () => {
    navigator.clipboard.writeText(`npx nativra theme add ${activeTheme.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Theme Selection Tabs */}
      <div className="flex flex-wrap gap-2">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setSelectedTheme(theme.id)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all ${
              selectedTheme === theme.id
                ? "border-sky-500 bg-card text-foreground shadow-sm ring-1 ring-sky-500/50"
                : "border-border bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground"
            }`}
          >
            <Palette className="h-3.5 w-3.5" />
            <span>{theme.name}</span>
          </button>
        ))}
      </div>

      {/* Theme Info Box */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                {activeTheme.name} Theme
              </h3>
              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                Preset
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeTheme.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 font-mono text-xs">
              <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">$</span>
              <span className="text-foreground">npx nativra theme add {activeTheme.id}</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Mock Component Card */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
            Simulated Mobile Surface
          </span>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Light Mode Card */}
            <div className={`rounded-xl border p-5 ${activeTheme.preview.bgLight} ${activeTheme.preview.cardLight}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Light Appearance
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                  Active
                </span>
              </div>
              <h4 className={`font-bold text-sm ${activeTheme.preview.textLight}`}>
                Account Settings
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Manage notifications and account preferences.
              </p>
              <button
                className={`mt-4 inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm ${activeTheme.preview.primaryLight}`}
              >
                Save Changes
              </button>
            </div>

            {/* Dark Mode Card */}
            <div className={`rounded-xl border p-5 ${activeTheme.preview.bgDark} ${activeTheme.preview.cardDark}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Dark Appearance
                </span>
                <span className="rounded-full bg-sky-950 px-2 py-0.5 text-[10px] font-semibold text-sky-300">
                  Active
                </span>
              </div>
              <h4 className={`font-bold text-sm ${activeTheme.preview.textDark}`}>
                Account Settings
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Manage notifications and account preferences.
              </p>
              <button
                className={`mt-4 inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm ${activeTheme.preview.primaryDark}`}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Color Swatches Grid */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-3">
            Semantic Token Swatches
          </span>
          <div className="grid gap-2.5 sm:grid-cols-4">
            {activeTheme.tokens.map((token) => (
              <div
                key={token.slot}
                className="flex items-center gap-3 rounded-lg border border-border bg-background p-2.5 text-xs"
              >
                <div
                  className="h-8 w-8 rounded-md border border-border shadow-inner shrink-0"
                  style={{ backgroundColor: token.dark }}
                  title={`Dark: ${token.dark} | Light: ${token.light}`}
                />
                <div className="min-w-0">
                  <div className="font-semibold text-foreground truncate">{token.slot}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">
                    {token.dark}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
