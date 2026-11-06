"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check,
  Copy,
  Sparkles,
  RefreshCw,
  Terminal,
  Smartphone,
} from "lucide-react";

export function HomeHeroPlayground() {
  const [activeTab, setActiveTab] = useState<"button" | "input" | "badge" | "switch">("button");
  const [copied, setCopied] = useState(false);

  // Button state
  const [btnVariant, setBtnVariant] = useState<"primary" | "default" | "destructive" | "outline">("primary");
  const [btnSize, setBtnSize] = useState<"sm" | "md" | "lg">("md");
  const [btnLoading, setBtnLoading] = useState(false);

  // Input state
  const [inputVal, setInputVal] = useState("alex@company.com");
  const [inputError, setInputError] = useState(false);

  // Badge state
  const [badgeVariant, setBadgeVariant] = useState<"primary" | "default" | "secondary" | "outline">("primary");

  // Switch state
  const [switchOn, setSwitchOn] = useState(true);

  const getCliCommand = () => {
    return `npx nativra add ${activeTab}`;
  };

  const copyCli = () => {
    navigator.clipboard.writeText(getCliCommand());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl text-foreground">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-border bg-muted/30 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            Live Component Playground
          </span>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-lg bg-muted p-1 text-xs">
          {(["button", "input", "badge", "switch"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-3 py-1 font-medium capitalize transition-all ${
                activeTab === tab
                  ? "bg-background text-foreground shadow-sm font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Playground Area */}
      <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* Visual Preview Canvas */}
        <div className="flex flex-col justify-between p-6 sm:p-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5" />
              <span>Native Canvas Preview</span>
            </span>
            <span className="font-mono text-[11px]">Expo Go / iOS / Android</span>
          </div>

          <div className="my-auto flex min-h-[160px] items-center justify-center">
            {activeTab === "button" && (
              <button
                disabled={btnLoading}
                className={`inline-flex items-center justify-center rounded-lg font-medium transition-all ${
                  btnVariant === "primary"
                    ? "bg-sky-600 text-white hover:bg-sky-500"
                    : btnVariant === "destructive"
                    ? "bg-red-600 text-white hover:bg-red-500"
                    : btnVariant === "outline"
                    ? "border border-border bg-transparent text-foreground hover:bg-muted"
                    : "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                } ${
                  btnSize === "sm"
                    ? "px-3 py-1.5 text-xs"
                    : btnSize === "lg"
                    ? "px-5 py-2.5 text-base"
                    : "px-4 py-2 text-sm"
                }`}
              >
                {btnLoading && <RefreshCw className="mr-1.5 h-4 w-4 animate-spin" />}
                <span>{btnLoading ? "Processing..." : "Get Started Now"}</span>
              </button>
            )}

            {activeTab === "input" && (
              <div className="w-full max-w-xs space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className={`w-full rounded-lg border bg-background px-3 py-2 text-xs text-foreground outline-none transition-colors ${
                    inputError
                      ? "border-red-500"
                      : "border-border focus:border-sky-500"
                  }`}
                />
                <p className="text-[11px] text-muted-foreground">
                  {inputError ? "Invalid email domain format." : "We'll never spam you."}
                </p>
              </div>
            )}

            {activeTab === "badge" && (
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  badgeVariant === "primary"
                    ? "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
                    : badgeVariant === "secondary"
                    ? "bg-muted text-muted-foreground"
                    : badgeVariant === "outline"
                    ? "border border-border text-foreground"
                    : "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                }`}
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Production Ready
              </span>
            )}

            {activeTab === "switch" && (
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setSwitchOn(!switchOn)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    switchOn ? "bg-sky-600 dark:bg-sky-500" : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      switchOn ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
                <span className="text-xs font-medium text-foreground">
                  Live Sync to Cloud
                </span>
              </label>
            )}
          </div>

          {/* Quick Controls */}
          <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {activeTab === "button" && (
                <>
                  <button
                    onClick={() => setBtnVariant("primary")}
                    className={`px-2 py-0.5 rounded text-[11px] ${
                      btnVariant === "primary" ? "bg-sky-600 text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    Primary
                  </button>
                  <button
                    onClick={() => setBtnVariant("default")}
                    className={`px-2 py-0.5 rounded text-[11px] ${
                      btnVariant === "default" ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    Default
                  </button>
                  <button
                    onClick={() => setBtnVariant("destructive")}
                    className={`px-2 py-0.5 rounded text-[11px] ${
                      btnVariant === "destructive" ? "bg-red-600 text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    Destructive
                  </button>
                  <button
                    onClick={() => setBtnSize(btnSize === "sm" ? "md" : btnSize === "md" ? "lg" : "sm")}
                    className="px-2 py-0.5 rounded text-[11px] bg-muted text-muted-foreground hover:text-foreground"
                  >
                    Size: {btnSize.toUpperCase()}
                  </button>
                  <button
                    onClick={() => setBtnLoading(!btnLoading)}
                    className={`px-2 py-0.5 rounded text-[11px] ${
                      btnLoading ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {btnLoading ? "Stop Loading" : "Loading"}
                  </button>
                </>
              )}

              {activeTab === "input" && (
                <button
                  onClick={() => setInputError(!inputError)}
                  className={`px-2.5 py-1 rounded text-xs ${
                    inputError ? "bg-red-600 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {inputError ? "Clear Error" : "Simulate Error"}
                </button>
              )}

              {activeTab === "badge" && (
                <>
                  {(["primary", "default", "outline"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setBadgeVariant(v)}
                      className={`px-2 py-0.5 rounded text-[11px] capitalize ${
                        badgeVariant === v ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </>
              )}

              {activeTab === "switch" && (
                <button
                  onClick={() => setSwitchOn(!switchOn)}
                  className="px-2.5 py-1 rounded bg-muted text-xs text-muted-foreground hover:text-foreground"
                >
                  Toggle Value: {switchOn ? "ON" : "OFF"}
                </button>
              )}
            </div>

            <Link
              href={`/docs/components/${activeTab}`}
              className="inline-flex items-center text-[11px] font-medium text-sky-600 hover:underline dark:text-sky-400"
            >
              Full Docs →
            </Link>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="flex flex-col justify-between bg-zinc-950 p-6 text-zinc-100 font-mono text-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-zinc-800 text-[11px]">
              <span>components/ui/{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}.tsx</span>
              <span className="text-emerald-400">0 KB runtime package</span>
            </div>

            <div className="space-y-1.5 text-zinc-300 leading-relaxed overflow-x-auto">
              <span className="text-zinc-500">// 1. Import your own component file</span>
              <div>
                <span className="text-purple-400">import</span> &#123;{" "}
                <span className="text-sky-300">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </span>{" "}
                &#125; <span className="text-purple-400">from</span>{" "}
                <span className="text-amber-300">
                  &quot;@/components/ui/{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}&quot;
                </span>
                ;
              </div>

              <div className="pt-2 text-zinc-500">// 2. Use anywhere in your screens</div>
              <div className="text-zinc-200">
                {activeTab === "button" && (
                  <>
                    &lt;<span className="text-sky-400">Button</span> variant=
                    <span className="text-amber-300">&quot;{btnVariant}&quot;</span> size=
                    <span className="text-amber-300">&quot;{btnSize}&quot;</span>&gt;
                    {"\n"}  Get Started Now{"\n"}&lt;/
                    <span className="text-sky-400">Button</span>&gt;
                  </>
                )}
                {activeTab === "input" && (
                  <>
                    &lt;<span className="text-sky-400">Input</span>
                    {"\n"}  label=<span className="text-amber-300">&quot;Email Address&quot;</span>
                    {"\n"}  value=&#123;email&#125;
                    {"\n"}  error=&#123;{inputError ? "true" : "false"}&#125;
                    {"\n"}/&gt;
                  </>
                )}
                {activeTab === "badge" && (
                  <>
                    &lt;<span className="text-sky-400">Badge</span> variant=
                    <span className="text-amber-300">&quot;{badgeVariant}&quot;</span>&gt;
                    {"\n"}  Production Ready{"\n"}&lt;/
                    <span className="text-sky-400">Badge</span>&gt;
                  </>
                )}
                {activeTab === "switch" && (
                  <>
                    &lt;<span className="text-sky-400">Switch</span>
                    {"\n"}  value=&#123;{switchOn ? "true" : "false"}&#125;
                    {"\n"}  onValueChange=&#123;setSync&#125;
                    {"\n"}/&gt;
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick CLI Copy Bar */}
          <div className="mt-6 flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/90 p-2.5">
            <div className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-zinc-400" />
              <span className="text-zinc-400">$</span>
              <span className="text-sky-400">{getCliCommand()}</span>
            </div>
            <button
              onClick={copyCli}
              className="flex items-center gap-1 rounded bg-zinc-800 px-2.5 py-1 text-[11px] text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

