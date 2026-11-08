"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Copy, Sparkles, ArrowRight } from "lucide-react";

type AccentPreset = "sky" | "emerald" | "violet" | "rose" | "amber";

const ACCENT_MAP: Record<
  AccentPreset,
  { name: string; hex: string; bg: string; text: string; ring: string; softBg: string }
> = {
  sky: {
    name: "Sky (Default)",
    hex: "#0284c7",
    bg: "bg-sky-600",
    text: "text-sky-600 dark:text-sky-400",
    ring: "border-sky-500",
    softBg: "bg-sky-500/10",
  },
  emerald: {
    name: "Emerald",
    hex: "#059669",
    bg: "bg-emerald-600",
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "border-emerald-500",
    softBg: "bg-emerald-500/10",
  },
  violet: {
    name: "Violet",
    hex: "#7c3aed",
    bg: "bg-violet-600",
    text: "text-violet-600 dark:text-violet-400",
    ring: "border-violet-500",
    softBg: "bg-violet-500/10",
  },
  rose: {
    name: "Rose",
    hex: "#e11d48",
    bg: "bg-rose-600",
    text: "text-rose-600 dark:text-rose-400",
    ring: "border-rose-500",
    softBg: "bg-rose-500/10",
  },
  amber: {
    name: "Amber",
    hex: "#d97706",
    bg: "bg-amber-600",
    text: "text-amber-600 dark:text-amber-400",
    ring: "border-amber-500",
    softBg: "bg-amber-500/10",
  },
};

export function HomeBentoShowcase() {
  const [accent, setAccent] = useState<AccentPreset>("sky");
  const [activeChip, setActiveChip] = useState("Today");
  const [segment, setSegment] = useState("Week");
  const [selectedDate, setSelectedDate] = useState("Nov 9, 2026");
  const [activeTab, setActiveTab] = useState("wallet");
  const [dotIndex, setDotIndex] = useState(1);
  const [toastVisible, setToastVisible] = useState(true);
  const [btnVariant, setBtnVariant] = useState<"primary" | "secondary" | "outline" | "destructive">("primary");
  const [btnSize, setBtnSize] = useState<"sm" | "md" | "lg">("md");
  const [btnLoading, setBtnLoading] = useState(false);
  const [lastAction, setLastAction] = useState("Scan QR");
  const [copiedCmd, setCopiedCmd] = useState(false);

  const theme = ACCENT_MAP[accent];

  const handleCopyInstall = () => {
    navigator.clipboard.writeText(
      "npx nativra-cli add button chip stat-tile action-tile date-picker bottom-tab-bar"
    );
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 1800);
  };

  return (
    <section className="border-t border-border bg-muted/20 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Section Header + Live Theme Controls */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>81 Registry Items · One Visual Language</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Every mobile surface, composed from the same token system.
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
              Interact with live Nativra primitives below. Switch the semantic accent preset and watch every button, chip, tab dock, and metric tile adapt instantaneously—compiled for both NativeWind v4 and React Native StyleSheet.
            </p>
          </div>

          {/* Accent Switcher */}
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm">
            <span className="px-2 text-xs font-semibold text-muted-foreground">
              Preview Accent:
            </span>
            {(Object.keys(ACCENT_MAP) as AccentPreset[]).map((key) => {
              const item = ACCENT_MAP[key];
              const isSelected = key === accent;
              return (
                <button
                  key={key}
                  onClick={() => setAccent(key)}
                  className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.hex }}
                  />
                  <span className="capitalize">{key}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Bento Grid */}
        <div className="grid gap-4 md:grid-cols-12">
          {/* Tile 1: Interactive Button Playground (5 cols) */}
          <div className="md:col-span-5 rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Button Playground
              </span>
              <code className="text-[11px] font-mono text-muted-foreground">
                npx nativra-cli add button
              </code>
            </div>

            <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30">
              <button
                onClick={() => setBtnLoading(!btnLoading)}
                style={
                  btnVariant === "primary"
                    ? { backgroundColor: theme.hex, color: "#fff" }
                    : undefined
                }
                className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all active:scale-95 ${
                  btnSize === "sm"
                    ? "h-8 px-3 text-xs"
                    : btnSize === "lg"
                    ? "h-12 px-6 text-base"
                    : "h-10 px-4 text-sm"
                } ${
                  btnVariant === "secondary"
                    ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                    : btnVariant === "outline"
                    ? "border border-zinc-300 bg-transparent text-foreground dark:border-zinc-700"
                    : btnVariant === "destructive"
                    ? "bg-rose-600 text-white"
                    : ""
                }`}
              >
                {btnLoading ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : null}
                <span>{btnLoading ? "Processing..." : "Continue to Checkout"}</span>
              </button>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground mr-1">
                  Variant:
                </span>
                {(["primary", "secondary", "outline", "destructive"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setBtnVariant(v)}
                    className={`rounded-lg px-2 py-1 text-[11px] font-medium capitalize ${
                      btnVariant === v
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground mr-1">
                    Size:
                  </span>
                  {(["sm", "md", "lg"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setBtnSize(s)}
                      className={`rounded-lg px-2 py-1 text-[11px] font-medium uppercase ${
                        btnSize === s
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setBtnLoading(!btnLoading)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold border ${
                    btnLoading
                      ? "border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  Loading: {btnLoading ? "On" : "Off"}
                </button>
              </div>
            </div>
          </div>

          {/* Tile 2: Filter Chips & Segmented Control (4 cols) */}
          <div className="md:col-span-4 rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Filter Chips
                </span>
                <code className="text-[11px] font-mono text-muted-foreground">chip</code>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["Today", "Week", "Month", "Custom"].map((label) => {
                  const selected = activeChip === label;
                  return (
                    <button
                      key={label}
                      onClick={() => setActiveChip(label)}
                      style={selected ? { backgroundColor: theme.hex, borderColor: theme.hex } : undefined}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
                        selected
                          ? "text-white shadow-sm"
                          : "border-border bg-muted/50 text-foreground hover:bg-muted"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Segmented Control
                </span>
                <code className="text-[11px] font-mono text-muted-foreground">
                  segmented-control
                </code>
              </div>
              <div className="grid grid-cols-3 rounded-xl bg-muted p-1">
                {["Day", "Week", "Month"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setSegment(item)}
                    className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                      segment === item
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tile 3: KPI Stat Tile (3 cols) */}
          <div className="md:col-span-3 rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Stat Tile
              </span>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                -12% budget
              </span>
            </div>
            <div className="my-3">
              <p className="text-xs font-medium text-muted-foreground">Spent this month</p>
              <p className="mt-1 text-3xl font-black tracking-tight text-foreground tabular-nums">
                $2,450
              </p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: "76%", backgroundColor: theme.hex }}
                />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              $550 remaining of $3,000 limit
            </p>
          </div>

          {/* Tile 4: Quick Action Tiles (4 cols) */}
          <div className="md:col-span-4 rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Action Tiles
              </span>
              <span className="text-[11px] text-muted-foreground">
                Active: <strong className="text-foreground">{lastAction}</strong>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { label: "Scan QR", icon: "📷", primary: true },
                { label: "Send", icon: "↗️", primary: false },
                { label: "Split Bill", icon: "➗", primary: false },
              ].map((tile) => {
                const isSelected = lastAction === tile.label;
                return (
                  <button
                    key={tile.label}
                    onClick={() => setLastAction(tile.label)}
                    style={
                      isSelected
                        ? { backgroundColor: theme.hex, borderColor: theme.hex, color: "#fff" }
                        : undefined
                    }
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 transition-all active:scale-95 ${
                      isSelected
                        ? "text-white shadow-sm"
                        : "border-border bg-muted/30 text-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="text-base mb-1">{tile.icon}</span>
                    <span className="text-[11px] font-bold">{tile.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tile 5: Date Picker + Live Toast (4 cols) */}
          <div className="md:col-span-4 rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Date Picker
                </span>
                <code className="text-[11px] font-mono text-muted-foreground">date-picker</code>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-3 py-2">
                <span className="text-xs font-semibold text-foreground">
                  📅 Due: {selectedDate}
                </span>
                <div className="flex gap-1">
                  {["Nov 9, 2026", "Nov 16, 2026"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        selectedDate === d
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {d.replace(", 2026", "")}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Toast Feedback
                </span>
                <button
                  onClick={() => setToastVisible(!toastVisible)}
                  className="text-[11px] font-semibold hover:underline"
                  style={{ color: theme.hex }}
                >
                  {toastVisible ? "Dismiss" : "Show toast"}
                </button>
              </div>
              {toastVisible ? (
                <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  <span>✓ Changes saved to nativra.lock.json</span>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border px-3 py-2 text-center text-xs text-muted-foreground">
                  Toast dismissed — click &ldquo;Show toast&rdquo; above
                </div>
              )}
            </div>
          </div>

          {/* Tile 6: Bottom Tab Bar + Pagination Dots (4 cols) */}
          <div className="md:col-span-4 rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Bottom Tab Bar
                </span>
                <code className="text-[11px] font-mono text-muted-foreground">
                  bottom-tab-bar
                </code>
              </div>
              <div className="grid grid-cols-4 rounded-xl border border-border bg-muted/30 p-1.5">
                {[
                  { id: "home", label: "Home", icon: "🏠" },
                  { id: "wallet", label: "Wallet", icon: "💳" },
                  { id: "inbox", label: "Inbox", icon: "💬", badge: 3 },
                  { id: "profile", label: "Profile", icon: "👤" },
                ].map((t) => {
                  const active = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className="relative flex flex-col items-center justify-center py-1"
                    >
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs transition-all ${
                          active ? "bg-card shadow-sm" : ""
                        }`}
                      >
                        {t.icon}
                      </span>
                      {t.badge ? (
                        <span className="absolute right-2 top-0.5 rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                          {t.badge}
                        </span>
                      ) : null}
                      <span
                        className="mt-1 text-[10px] font-semibold"
                        style={active ? { color: theme.hex } : undefined}
                      >
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Pagination Dots
              </span>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setDotIndex(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    style={dotIndex === idx ? { backgroundColor: theme.hex } : undefined}
                    className={`h-2 rounded-full transition-all ${
                      dotIndex === idx ? "w-6" : "w-2 bg-zinc-300 dark:bg-zinc-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Command Bar */}
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:px-6 shadow-sm">
          <div className="flex items-center gap-3 overflow-x-auto max-w-full">
            <span className="rounded-lg bg-sky-500/10 px-2.5 py-1 text-xs font-bold text-sky-600 dark:text-sky-400 shrink-0">
              Install All Shown
            </span>
            <code className="font-mono text-xs text-foreground whitespace-nowrap">
              npx nativra-cli add button chip stat-tile action-tile date-picker bottom-tab-bar
            </code>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleCopyInstall}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/60 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
            >
              {copiedCmd ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy CLI</span>
                </>
              )}
            </button>
            <Link
              href="/docs/components"
              className="inline-flex items-center gap-1 text-xs font-bold hover:underline"
              style={{ color: theme.hex }}
            >
              <span>Browse all 81 items</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

