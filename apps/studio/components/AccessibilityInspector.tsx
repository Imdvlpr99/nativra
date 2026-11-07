'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';

export interface A11yIssue {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'touch-target' | 'labels' | 'contrast' | 'semantics';
  component: string;
  title: string;
  description: string;
  recommendation: string;
  codeSnippet: string;
}

const DEFAULT_ISSUES: A11yIssue[] = [
  {
    id: 'a11y-1',
    severity: 'critical',
    category: 'touch-target',
    component: 'IconButton / Dismiss',
    title: 'Touch target size is smaller than 48x48 dp',
    description: 'Interactive button has computed dimensions of 32x32 dp, violating Android and iOS minimum touch target guidelines.',
    recommendation: 'Add hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} or increase container padding to reach at least 48x48 dp.',
    codeSnippet: `<TouchableOpacity\n  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}\n  className="h-10 w-10 items-center justify-center rounded-full bg-zinc-800"\n  accessibilityRole="button"\n  accessibilityLabel="Dismiss dialog"\n>\n  <X size={16} color="#ffffff" />\n</TouchableOpacity>`,
  },
  {
    id: 'a11y-2',
    severity: 'warning',
    category: 'labels',
    component: 'Search Input',
    title: 'Missing explicit accessibilityLabel on text input',
    description: 'Screen readers will announce the placeholder text, which can vary or be lost when the user starts typing.',
    recommendation: 'Provide an explicit accessibilityLabel="Search catalog and filters" and accessibilityHint="Double tap to edit".',
    codeSnippet: `<TextInput\n  accessibilityLabel="Search catalog items"\n  accessibilityHint="Double tap to enter search terms"\n  placeholder="Search..."\n  placeholderTextColor="#71717a"\n  className="h-11 px-4 rounded-xl bg-zinc-900 text-white"\n/>`,
  },
  {
    id: 'a11y-3',
    severity: 'warning',
    category: 'contrast',
    component: 'Muted Caption Text',
    title: 'Color contrast ratio below WCAG AA (3.8:1 < 4.5:1)',
    description: 'Text color #71717a against background #09090b yields a 3.8:1 contrast ratio, which is below the recommended 4.5:1 for body copy.',
    recommendation: 'Use zinc-400 (#a1a1aa) or lighter to achieve 6.2:1 contrast.',
    codeSnippet: `// Recommended\n<Text className="text-xs text-zinc-400 font-medium">\n  Updated 2 hours ago\n</Text>`,
  },
  {
    id: 'a11y-4',
    severity: 'info',
    category: 'semantics',
    component: 'UserProfile Avatar',
    title: 'Image missing accessible fallback or decorative marker',
    description: 'Ensure non-decorative avatars convey the user name or are marked accessible={false} if accompanied by adjacent text.',
    recommendation: 'Mark as accessible={false} when adjacent name heading already announces the user identity.',
    codeSnippet: `<Image\n  source={{ uri: avatarUrl }}\n  accessible={false}\n  importantForAccessibility="no"\n  className="h-12 w-12 rounded-full"\n/>`,
  },
];

export function AccessibilityInspector() {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [selectedIssueId, setSelectedIssueId] = useState<string>(DEFAULT_ISSUES[0]?.id ?? 'a11y-1');
  const [copied, setCopied] = useState(false);

  const filteredIssues = DEFAULT_ISSUES.filter(
    (issue) => filter === 'all' || issue.severity === filter
  );

  const selectedIssue =
    DEFAULT_ISSUES.find((i) => i.id === selectedIssueId) ?? DEFAULT_ISSUES[0]!;

  const copySnippet = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const criticalCount = DEFAULT_ISSUES.filter((i) => i.severity === 'critical').length;
  const warningCount = DEFAULT_ISSUES.filter((i) => i.severity === 'warning').length;
  const infoCount = DEFAULT_ISSUES.filter((i) => i.severity === 'info').length;

  return (
    <div className="flex flex-1 overflow-hidden h-full">
      {/* Left Column: Audit Overview & Violations List */}
      <aside className="w-80 shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-900/60">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <h2 className="text-xs font-semibold text-zinc-100">Accessibility Inspector</h2>
            </div>
            <span className="text-[10px] rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-400 font-medium border border-emerald-500/20">
              WCAG 2.1 AA
            </span>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setFilter('critical')}
              className={`p-2 rounded-lg border text-center transition-all ${
                filter === 'critical'
                  ? 'border-red-500/50 bg-red-500/10'
                  : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
              }`}
            >
              <div className="text-base font-bold text-red-400">{criticalCount}</div>
              <div className="text-[10px] text-zinc-400">Critical</div>
            </button>
            <button
              onClick={() => setFilter('warning')}
              className={`p-2 rounded-lg border text-center transition-all ${
                filter === 'warning'
                  ? 'border-amber-500/50 bg-amber-500/10'
                  : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
              }`}
            >
              <div className="text-base font-bold text-amber-400">{warningCount}</div>
              <div className="text-[10px] text-zinc-400">Warnings</div>
            </button>
            <button
              onClick={() => setFilter('info')}
              className={`p-2 rounded-lg border text-center transition-all ${
                filter === 'info'
                  ? 'border-sky-500/50 bg-sky-500/10'
                  : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700'
              }`}
            >
              <div className="text-base font-bold text-sky-400">{infoCount}</div>
              <div className="text-[10px] text-zinc-400">Notices</div>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 py-2 border-b border-zinc-800/80 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Detected Issues ({filteredIssues.length})
          </span>
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="text-[10px] text-sky-400 hover:underline"
            >
              Show all
            </button>
          )}
        </div>

        {/* Issues List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filteredIssues.map((issue) => {
            const isSelected = issue.id === selectedIssueId;
            return (
              <button
                key={issue.id}
                onClick={() => setSelectedIssueId(issue.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-sky-500/50 bg-zinc-800/80 shadow-md ring-1 ring-sky-500/20'
                    : 'border-zinc-800/80 bg-zinc-950/50 hover:bg-zinc-800/40 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {issue.severity === 'critical' ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                  ) : issue.severity === 'warning' ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  ) : (
                    <Info className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                  )}
                  <span className="text-xs font-semibold text-zinc-200 truncate">
                    {issue.component}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                  {issue.title}
                </p>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Area: Detailed Issue Report & Suggested Resolution */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-zinc-950 p-6">
        <div className="max-w-3xl w-full mx-auto space-y-6">
          {/* Header Card */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-xl">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider ${
                    selectedIssue.severity === 'critical'
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                      : selectedIssue.severity === 'warning'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                  }`}
                >
                  {selectedIssue.severity}
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  {selectedIssue.category}
                </span>
              </div>
              <span className="text-xs font-medium text-zinc-300 bg-zinc-800 px-2.5 py-1 rounded-lg">
                Target: {selectedIssue.component}
              </span>
            </div>

            <h1 className="text-lg font-bold text-white mb-2 leading-snug">
              {selectedIssue.title}
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">
              {selectedIssue.description}
            </p>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-emerald-300 mb-1">
                  Suggested Actionable Fix
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {selectedIssue.recommendation}
                </p>
              </div>
            </div>
          </div>

          {/* Code Specimen & Copy */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 overflow-hidden shadow-xl">
            <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-400" />
                <span className="text-xs font-semibold text-zinc-200">
                  Accessible React Native Implementation
                </span>
              </div>
              <button
                type="button"
                onClick={() => copySnippet(selectedIssue.codeSnippet)}
                className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto bg-zinc-950/80 leading-relaxed">
              <code>{selectedIssue.codeSnippet}</code>
            </pre>
          </div>

          {/* Best Practices Checklist */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Mobile Accessibility Rules Checklist
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-zinc-300">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Touch targets at least 48 x 48 dp (Apple HIG / Material)</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Every Pressable / Touchable has accessibilityRole</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Inputs include accessibilityLabel & hint</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Dynamic font scaling respects user accessibility preferences</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
