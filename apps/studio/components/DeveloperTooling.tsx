'use client';

import React, { useState } from 'react';
import {
  Wrench,
  Package,
  Layers,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { defaultTheme } from '@nativra/theme-engine';
import { exportAIContext } from '@nativra/codegen';

export function DeveloperTooling() {
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'dependencies' | 'tokens' | 'ai-context'>('diagnostics');
  const [copied, setCopied] = useState(false);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const aiContextOutput = exportAIContext({
    framework: 'expo-sdk-52',
    stylingSystem: 'nativewind',
    installedComponents: ['button', 'input', 'badge', 'card', 'avatar', 'separator', 'switch', 'skeleton'],
    themeTokens: {
      preset: 'zinc',
      primary: defaultTheme.light.primary,
      background: defaultTheme.dark.background,
    },
  });

  const DIAGNOSTIC_CHECKS = [
    {
      name: 'Nativra Project Configuration',
      status: 'pass',
      detail: 'nativra.json located with stylingTarget="nativewind"',
    },
    {
      name: 'Expo SDK Compatibility',
      status: 'pass',
      detail: 'Target SDK 52 detected. Supports react-native 0.76.x with New Architecture',
    },
    {
      name: 'NativeWind & Tailwind Configuration',
      status: 'pass',
      detail: 'tailwind.config.js detected with nativra content glob & presets',
    },
    {
      name: 'React Native Peer Dependencies',
      status: 'pass',
      detail: 'react-native-reanimated, react-native-safe-area-context, lucide-react-native active',
    },
    {
      name: 'Deterministic Source Integrity',
      status: 'pass',
      detail: 'All 22 registry items hashes verified against registry.json manifest',
    },
  ];

  const DEPENDENCY_ITEMS = [
    { name: 'react-native', installed: '0.76.5', required: '>=0.74.0', status: 'pass' },
    { name: 'expo', installed: '52.0.0', required: '>=51.0.0', status: 'pass' },
    { name: 'react', installed: '18.3.1', required: '>=18.2.0', status: 'pass' },
    { name: 'nativewind', installed: '4.1.23', required: '^4.0.1', status: 'pass' },
    { name: 'lucide-react-native', installed: '0.460.0', required: '>=0.400.0', status: 'pass' },
    { name: 'typescript', installed: '5.9.3', required: '>=5.0.0', status: 'pass' },
  ];

  return (
    <div className="flex flex-1 overflow-hidden h-full">
      {/* Left Navigation Sidebar */}
      <aside className="w-72 shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-900/60">
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Wrench className="h-4 w-4 text-sky-400" />
            <h2 className="text-xs font-semibold text-zinc-100">Developer Tooling</h2>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            Diagnostics, dependencies, tokens, and AI context
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="p-2 space-y-1">
          {[
            { id: 'diagnostics' as const, label: 'Project Diagnostics', icon: ShieldCheck, desc: 'Health check & fixes' },
            { id: 'dependencies' as const, label: 'Dependency Analyzer', icon: Package, desc: 'Version compatibility' },
            { id: 'tokens' as const, label: 'Design Token Inspector', icon: Layers, desc: 'Theme & CSS variables' },
            { id: 'ai-context' as const, label: 'AI Context Exporter', icon: Sparkles, desc: 'Agent prompt context' },
          ].map(({ id, label, icon: Icon, desc }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isActive
                    ? 'border-sky-500/50 bg-zinc-800/80 shadow-md ring-1 ring-sky-500/20'
                    : 'border-transparent hover:bg-zinc-800/40 hover:border-zinc-800 text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-sky-400' : 'text-zinc-500'}`} />
                  <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                    {label}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 pl-6">{desc}</p>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-zinc-950 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* TAB 1: Diagnostics */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Project Health & Diagnostics</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Evaluates local configuration, framework versions, and styling targets
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  All Checks Passing (5/5)
                </span>
              </div>

              <div className="space-y-2.5">
                {DIAGNOSTIC_CHECKS.map((check, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 flex items-start gap-3.5"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-zinc-200">{check.name}</div>
                      <div className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                        {check.detail}
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      OK
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
                <h4 className="text-xs font-semibold text-zinc-300 mb-2">CLI Diagnostic Command</h4>
                <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300">
                  <span>npx nativra doctor</span>
                  <button
                    type="button"
                    onClick={() => copyText('npx nativra doctor')}
                    className="text-xs text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Dependency Analyzer */}
          {activeTab === 'dependencies' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Dependency & Ecosystem Analyzer</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Verified against Nativra Official Compatibility Matrix
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900/60">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-800 bg-zinc-900 text-zinc-400 font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Package</th>
                      <th className="py-3 px-4">Installed Version</th>
                      <th className="py-3 px-4">Required Version</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {DEPENDENCY_ITEMS.map((dep) => (
                      <tr key={dep.name} className="hover:bg-zinc-800/30">
                        <td className="py-3 px-4 font-mono font-medium text-white">{dep.name}</td>
                        <td className="py-3 px-4 font-mono text-zinc-400">{dep.installed}</td>
                        <td className="py-3 px-4 font-mono text-zinc-400">{dep.required}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" /> Compatible
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Design Token Inspector */}
          {activeTab === 'tokens' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Design Token Inspector</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Semantic colors, typography, spacing, and border radii mapping
                </p>
              </div>

              {/* Color Tokens Specimen */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <h4 className="text-xs font-semibold text-zinc-300 mb-3">Semantic Color Tokens</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(defaultTheme.light).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-3 rounded-lg border border-zinc-800 bg-zinc-950 flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-5 w-5 rounded-md border border-zinc-700 shadow-sm"
                          style={{ backgroundColor: value }}
                        />
                        <span className="text-xs font-medium text-white truncate">{key}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Radius & Spacing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                  <h4 className="text-xs font-semibold text-zinc-300 mb-3">Radius Tokens (dp)</h4>
                  <div className="space-y-2">
                    {Object.entries(defaultTheme.radius).map(([key, val]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between text-xs py-1 border-b border-zinc-800/60"
                      >
                        <span className="text-zinc-400 capitalize">{key}</span>
                        <span className="font-mono text-sky-400 font-semibold">{val} dp</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                  <h4 className="text-xs font-semibold text-zinc-300 mb-3">Font Size Scale (sp)</h4>
                  <div className="space-y-2">
                    {Object.entries(defaultTheme.fontSize).map(([key, val]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between text-xs py-1 border-b border-zinc-800/60"
                      >
                        <span className="text-zinc-400">{key}</span>
                        <span className="font-mono text-sky-400 font-semibold">{val} sp</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI Context Exporter */}
          {activeTab === 'ai-context' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">AI Context Exporter (Section 7.4)</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Structured context format tailored for AI agents (Claude, Gemini, Cursor)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copyText(aiContextOutput)}
                  className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-500 transition-colors"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied Context' : 'Copy AI Context'}</span>
                </button>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 overflow-hidden shadow-xl">
                <div className="p-3 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                  <span>nativra-context.json</span>
                  <span className="font-mono text-[10px]">JSON Specification 3.0</span>
                </div>
                <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto bg-zinc-950/80 leading-relaxed max-h-96">
                  <code>{aiContextOutput}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
