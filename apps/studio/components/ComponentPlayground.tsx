'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Play,
  Copy,
  Check,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Sun,
  Moon,
} from 'lucide-react';

export type ComponentState =
  | 'default'
  | 'pressed'
  | 'disabled'
  | 'loading'
  | 'focused'
  | 'selected'
  | 'error'
  | 'empty';

export type PlaygroundComponent = 'button' | 'input' | 'badge' | 'card' | 'switch' | 'avatar';

const STATES: { id: ComponentState; label: string; desc: string }[] = [
  { id: 'default', label: 'Default', desc: 'Standard interactive rest state' },
  { id: 'pressed', label: 'Pressed / Active', desc: 'Active press down visual feedback' },
  { id: 'disabled', label: 'Disabled', desc: 'Non-interactive diminished state' },
  { id: 'loading', label: 'Loading', desc: 'In-progress spinner indicator' },
  { id: 'focused', label: 'Focused', desc: 'Accessibility focus ring or cursor active' },
  { id: 'selected', label: 'Selected', desc: 'Checked or active item highlight' },
  { id: 'error', label: 'Error', desc: 'Form validation failure / alert state' },
  { id: 'empty', label: 'Empty', desc: 'Zero data / placeholder blank state' },
];

export function ComponentPlayground({
  target = 'nativewind',
}: {
  target?: 'nativewind' | 'stylesheet';
}) {
  const [component, setComponent] = useState<PlaygroundComponent>('button');
  const [activeState, setActiveState] = useState<ComponentState>('default');
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');
  const [isDark, setIsDark] = useState(true);
  const [copied, setCopied] = useState(false);

  // Generate code snippet for active state
  const codeSnippet = useMemo(() => {
    const isNW = target === 'nativewind';
    if (component === 'button') {
      if (isNW) {
        switch (activeState) {
          case 'pressed':
            return `<Button variant="primary" className="scale-95 opacity-80">\n  Pressed Button\n</Button>`;
          case 'disabled':
            return `<Button variant="primary" disabled aria-disabled={true}>\n  Disabled Button\n</Button>`;
          case 'loading':
            return `<Button variant="primary" loading={true}>\n  Please wait...\n</Button>`;
          case 'selected':
            return `<Button variant="primary" className="ring-2 ring-sky-400 bg-sky-600">\n  Selected Option\n</Button>`;
          case 'error':
            return `<Button variant="destructive">\n  Delete Account\n</Button>`;
          default:
            return `<Button variant="primary">\n  Interactive Button\n</Button>`;
        }
      } else {
        switch (activeState) {
          case 'loading':
            return `<Button variant="primary" loading={true} style={styles.loadingButton}>\n  Loading...\n</Button>`;
          case 'disabled':
            return `<Button variant="primary" disabled style={styles.disabledButton}>\n  Disabled\n</Button>`;
          default:
            return `<Button variant="primary" style={styles.button}>\n  Interactive Button\n</Button>`;
        }
      }
    } else if (component === 'input') {
      if (isNW) {
        switch (activeState) {
          case 'focused':
            return `<Input\n  label="Email Address"\n  placeholder="name@domain.com"\n  className="border-sky-500 ring-2 ring-sky-500/30"\n  autoFocus\n/>`;
          case 'error':
            return `<Input\n  label="Password"\n  value="weak"\n  error={true}\n  errorMessage="Password must be at least 8 characters"\n  className="border-red-500"\n/>`;
          case 'disabled':
            return `<Input\n  label="Organization ID"\n  value="ORG-99214"\n  disabled={true}\n  editable={false}\n/>`;
          case 'empty':
            return `<Input\n  label="Optional Notes"\n  placeholder="Add notes here..."\n/>`;
          default:
            return `<Input\n  label="Full Name"\n  placeholder="Jane Doe"\n/>`;
        }
      } else {
        return `<TextInput\n  style={[styles.input, ${activeState === 'error' ? 'styles.inputError' : 'null'}]}\n  placeholder="Enter value..."\n/>`;
      }
    }
    return `// <${component.toUpperCase()} state="${activeState}" target="${target}" />`;
  }, [component, activeState, target]);

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [codeSnippet]);

  return (
    <div className="flex flex-1 overflow-hidden h-full">
      {/* Left Column: Component Picker & State Switcher */}
      <aside className="w-80 shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-900/60">
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2 mb-3">
            <Play className="h-4 w-4 text-sky-400" />
            <h2 className="text-xs font-semibold text-zinc-100">Component Playground</h2>
          </div>

          {/* Component Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-950/80 rounded-xl border border-zinc-800">
            {(['button', 'input', 'badge', 'card', 'switch', 'avatar'] as PlaygroundComponent[]).map(
              (c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setComponent(c)}
                  className={`capitalize px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    component === c
                      ? 'bg-zinc-800 text-white shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {c}
                </button>
              )
            )}
          </div>
        </div>

        {/* States Header */}
        <div className="px-4 py-2 border-b border-zinc-800/80 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Interactive States (8)
          </span>
          <span className="text-[10px] text-zinc-400 font-mono capitalize">{activeState}</span>
        </div>

        {/* States List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {STATES.map((s) => {
            const isSelected = activeState === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveState(s.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-sky-500/50 bg-zinc-800/80 shadow-md ring-1 ring-sky-500/20'
                    : 'border-zinc-800/60 bg-zinc-950/40 hover:bg-zinc-800/40 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold text-zinc-200">{s.label}</span>
                  {isSelected && <span className="h-2 w-2 rounded-full bg-sky-400" />}
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug">{s.desc}</p>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Area: Specimen Viewport & Controls */}
      <main className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
        {/* Top Control Bar */}
        <header className="h-14 border-b border-zinc-800 px-6 flex items-center justify-between bg-zinc-900/60 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400">Specimen:</span>
            <span className="text-xs font-bold text-white capitalize bg-zinc-800 px-2.5 py-1 rounded-lg">
              {component} • {activeState}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Platform Toggle */}
            <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-950/70 p-1">
              <button
                type="button"
                onClick={() => setPlatform('ios')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  platform === 'ios' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                iOS
              </button>
              <button
                type="button"
                onClick={() => setPlatform('android')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  platform === 'android' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Android
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-sky-400" />}
            </button>
          </div>
        </header>

        {/* Live Canvas Viewport */}
        <div
          className={`flex-1 flex items-center justify-center p-8 transition-colors ${
            isDark ? 'bg-zinc-950' : 'bg-zinc-100'
          }`}
        >
          <div
            className={`w-full max-w-sm rounded-3xl p-8 border shadow-2xl transition-all flex flex-col items-center justify-center min-h-[300px] ${
              isDark
                ? 'bg-zinc-900/90 border-zinc-800 text-white'
                : 'bg-white border-zinc-200 text-zinc-900 shadow-zinc-200/50'
            }`}
          >
            {/* Live Component Specimen */}
            {component === 'button' && (
              <div className="w-full flex flex-col items-center gap-3">
                <button
                  type="button"
                  disabled={activeState === 'disabled' || activeState === 'loading'}
                  className={`w-full py-3.5 px-6 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                    activeState === 'pressed'
                      ? 'scale-95 bg-sky-600 text-white opacity-80'
                      : activeState === 'disabled'
                      ? 'bg-zinc-700/50 text-zinc-500 cursor-not-allowed opacity-60'
                      : activeState === 'loading'
                      ? 'bg-sky-500 text-white opacity-90 cursor-wait'
                      : activeState === 'selected'
                      ? 'bg-sky-600 text-white ring-4 ring-sky-500/30'
                      : activeState === 'error'
                      ? 'bg-red-600 text-white'
                      : 'bg-sky-500 text-white hover:bg-sky-400 shadow-lg shadow-sky-500/20'
                  }`}
                >
                  {activeState === 'loading' && <Loader2 className="h-4 w-4 animate-spin text-white" />}
                  {activeState === 'disabled' && <Lock className="h-4 w-4" />}
                  {activeState === 'selected' && <CheckCircle2 className="h-4 w-4" />}
                  <span>
                    {activeState === 'loading'
                      ? 'Processing...'
                      : activeState === 'disabled'
                      ? 'Disabled Button'
                      : activeState === 'selected'
                      ? 'Selected Option'
                      : activeState === 'error'
                      ? 'Destructive Action'
                      : activeState === 'pressed'
                      ? 'Pressed State'
                      : 'Primary Action'}
                  </span>
                </button>
                <span className="text-[11px] text-zinc-500">
                  Platform: {platform === 'ios' ? 'iOS Spring Curve' : 'Android Material Ripple'}
                </span>
              </div>
            )}

            {component === 'input' && (
              <div className="w-full space-y-2">
                <label className="text-xs font-semibold block text-zinc-400">
                  Email Address
                </label>
                <div
                  className={`w-full rounded-xl px-4 py-3 text-sm border flex items-center gap-2 transition-all ${
                    activeState === 'focused'
                      ? 'border-sky-500 ring-2 ring-sky-500/30 bg-zinc-950 text-white'
                      : activeState === 'error'
                      ? 'border-red-500 bg-red-500/10 text-red-200'
                      : activeState === 'disabled'
                      ? 'border-zinc-800 bg-zinc-800/40 text-zinc-500 cursor-not-allowed'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-200'
                  }`}
                >
                  <input
                    type="text"
                    readOnly
                    value={
                      activeState === 'error'
                        ? 'invalid-email-format'
                        : activeState === 'disabled'
                        ? 'locked@nativra.com'
                        : activeState === 'empty'
                        ? ''
                        : 'sophia@example.com'
                    }
                    placeholder="Enter email address..."
                    className="bg-transparent border-none outline-none w-full text-sm text-inherit placeholder:text-zinc-600"
                  />
                  {activeState === 'error' && <AlertCircle className="h-4 w-4 text-red-400" />}
                </div>
                {activeState === 'error' && (
                  <p className="text-[11px] text-red-400 font-medium">
                    Please provide a valid email format.
                  </p>
                )}
              </div>
            )}

            {component === 'badge' && (
              <div className="flex flex-col items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                    activeState === 'error'
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                      : activeState === 'selected'
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                      : activeState === 'disabled'
                      ? 'bg-zinc-800 text-zinc-500'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  <Sparkles className="h-3 w-3" />
                  <span>{activeState === 'error' ? 'Failed' : 'Pro Member'}</span>
                </span>
              </div>
            )}

            {component === 'card' && (
              <div className="w-full p-5 rounded-2xl border border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
                <div>
                  <div className="text-xs text-zinc-400 font-medium">Monthly ARR</div>
                  <div className="text-2xl font-bold text-white mt-1">$48,250</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 font-semibold text-xs">
                  +18.4%
                </div>
              </div>
            )}

            {component === 'switch' && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Push Notifications</span>
                <div
                  className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${
                    activeState === 'disabled'
                      ? 'bg-zinc-800 opacity-50 cursor-not-allowed'
                      : activeState === 'selected' || activeState === 'default'
                      ? 'bg-sky-500'
                      : 'bg-zinc-700'
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white transition-transform ${
                      activeState === 'selected' || activeState === 'default'
                        ? 'translate-x-5'
                        : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            )}

            {component === 'avatar' && (
              <div className="flex flex-col items-center gap-2">
                <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center font-bold text-white text-lg shadow-lg">
                  SM
                </div>
                <span className="text-xs text-zinc-400">Sophia Martinez</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Code Preview */}
        <footer className="h-44 border-t border-zinc-800 bg-zinc-900/90 flex flex-col">
          <div className="px-6 py-2.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
            <span className="text-xs font-semibold text-zinc-300">
              JSX Usage for State: <span className="text-sky-400 font-mono">{activeState}</span>
            </span>
            <button
              type="button"
              onClick={copyCode}
              className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSX'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto flex-1 bg-zinc-950/70">
            <code>{codeSnippet}</code>
          </pre>
        </footer>
      </main>
    </div>
  );
}
