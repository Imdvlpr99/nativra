'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Copy,
  Check,
  ChevronUp,
  ChevronDown,
  Eye,
  Code2,
  Sliders,
  Undo2,
  Redo2,
  FileDown,
  FileUp,
  CopyPlus,
} from 'lucide-react';

export interface ScreenNode {
  id: string;
  type:
    | 'header'
    | 'search'
    | 'user-profile'
    | 'metric-card'
    | 'pricing-card'
    | 'settings-list'
    | 'button-action'
    | 'divider';
  title?: string;
  subtitle?: string;
  placeholder?: string;
  label?: string;
}

const DEFAULT_NODES: ScreenNode[] = [
  {
    id: 'header-1',
    type: 'header',
    title: 'Dashboard',
    subtitle: 'Welcome back, Sophia',
  },
  {
    id: 'search-1',
    type: 'search',
    placeholder: 'Search analytics or records...',
  },
  {
    id: 'metric-1',
    type: 'metric-card',
    title: 'Monthly Active Users',
    subtitle: '48,290 (+24.8%)',
  },
  {
    id: 'user-1',
    type: 'user-profile',
    title: 'Sophia Martinez',
    subtitle: '@sophiam • Verified Pro',
  },
  {
    id: 'action-1',
    type: 'button-action',
    label: 'Download Monthly Report',
  },
];

const COMPONENT_PALETTE = [
  { type: 'header' as const, label: 'App Header', desc: 'Title, subtitle & status' },
  { type: 'search' as const, label: 'Search Bar', desc: 'Input with icon' },
  { type: 'metric-card' as const, label: 'Metric KPI Card', desc: 'Stat counter & trend' },
  { type: 'user-profile' as const, label: 'User Profile Card', desc: 'Avatar, name & handle' },
  { type: 'settings-list' as const, label: 'Settings List', desc: 'Preferences & toggles' },
  { type: 'pricing-card' as const, label: 'Pricing Plan', desc: 'Tier & subscription button' },
  { type: 'button-action' as const, label: 'Action Button', desc: 'Primary CTA button' },
  { type: 'divider' as const, label: 'Section Divider', desc: 'Subtle separator line' },
];

export function ScreenBuilder({
  target = 'nativewind',
}: {
  target?: 'nativewind' | 'stylesheet';
}) {
  const fallbackNode: ScreenNode = DEFAULT_NODES[0] ?? {
    id: 'header-1',
    type: 'header',
    title: 'Dashboard',
    subtitle: 'Welcome back',
  };

  const [nodes, setNodes] = useState<ScreenNode[]>(DEFAULT_NODES);
  const [history, setHistory] = useState<ScreenNode[][]>([DEFAULT_NODES]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string>(fallbackNode.id);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const pushHistory = (newNodes: ScreenNode[]) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push(newNodes);
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setNodes(newNodes);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      const prev = history[nextIdx];
      if (prev) {
        setNodes(prev);
        if (prev[0]) setSelectedId(prev[0].id);
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      const next = history[nextIdx];
      if (next) {
        setNodes(next);
        if (next[0]) setSelectedId(next[0].id);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  const selectedNode = nodes.find((n) => n.id === selectedId) ?? nodes[0] ?? fallbackNode;

  const addNode = (type: ScreenNode['type']) => {
    const id = `${type}-${Date.now().toString(36).substring(4)}`;
    let newNode: ScreenNode = { id, type };

    switch (type) {
      case 'header':
        newNode = { ...newNode, title: 'Screen Title', subtitle: 'Subtitle' };
        break;
      case 'search':
        newNode = { ...newNode, placeholder: 'Search...' };
        break;
      case 'metric-card':
        newNode = { ...newNode, title: 'Total Revenue', subtitle: '$128,450 (+18%)' };
        break;
      case 'user-profile':
        newNode = { ...newNode, title: 'Alex Johnson', subtitle: '@alexj' };
        break;
      case 'settings-list':
        newNode = { ...newNode, title: 'Preferences' };
        break;
      case 'pricing-card':
        newNode = { ...newNode, title: 'Pro Plan', subtitle: '$29/mo' };
        break;
      case 'button-action':
        newNode = { ...newNode, label: 'Continue' };
        break;
      case 'divider':
        newNode = { ...newNode };
        break;
    }

    pushHistory([...nodes, newNode]);
    setSelectedId(id);
  };

  const removeNode = (id: string) => {
    const next = nodes.filter((n) => n.id !== id);
    pushHistory(next);
    if (selectedId === id && next.length > 0 && next[0]) {
      setSelectedId(next[0].id);
    }
  };

  const duplicateNode = (id: string) => {
    const targetIdx = nodes.findIndex((n) => n.id === id);
    if (targetIdx === -1) return;
    const targetNode = nodes[targetIdx];
    if (!targetNode) return;
    const newId = `${targetNode.type}-${Date.now().toString(36).substring(4)}`;
    const cloned: ScreenNode = { ...targetNode, id: newId };
    const next = [...nodes];
    next.splice(targetIdx + 1, 0, cloned);
    pushHistory(next);
    setSelectedId(newId);
  };

  const moveNode = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= nodes.length) return;
    const copy = [...nodes];
    const fromNode = copy[index];
    const toNode = copy[newIdx];
    if (fromNode && toNode) {
      copy[index] = toNode;
      copy[newIdx] = fromNode;
      pushHistory(copy);
    }
  };

  const updateSelectedNode = (updates: Partial<ScreenNode>) => {
    const next = nodes.map((n) => (n.id === selectedId ? { ...n, ...updates } : n));
    pushHistory(next);
  };

  const exportSchema = () => {
    const doc = {
      schemaVersion: '3.0.0',
      id: 'custom-screen',
      name: 'CustomScreen',
      canvas: {
        device: 'iphone',
        isLandscape: false,
        zoom: 100,
        target,
        colorScheme: 'dark',
      },
      nodes: nodes.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        subtitle: n.subtitle,
        props: { placeholder: n.placeholder, label: n.label },
      })),
    };
    const jsonStr = JSON.stringify(doc, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'screen.nativra.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSchema = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.nodes)) {
          const importedNodes: ScreenNode[] = parsed.nodes.map((n: { id?: string; type?: ScreenNode['type']; title?: string; subtitle?: string; props?: { placeholder?: string; label?: string } }) => ({
            id: n.id || `node-${Math.random().toString(36).substring(6)}`,
            type: n.type || 'header',
            title: n.title,
            subtitle: n.subtitle,
            placeholder: n.props?.placeholder,
            label: n.props?.label,
          }));
          if (importedNodes.length > 0) {
            pushHistory(importedNodes);
            if (importedNodes[0]) setSelectedId(importedNodes[0].id);
          }
        }
      } catch {
        alert('Invalid JSON screen document');
      }
    };
    reader.readAsText(file);
  };

  // Generate complete React Native Screen TSX
  const screenCode = useMemo(() => {
    const isNW = target === 'nativewind';

    if (isNW) {
      return `import React from "react";
import { SafeAreaView, ScrollView, View, Text, TextInput, Pressable } from "react-native";
import { UserProfile } from "@/components/blocks/user-profile";
import { MetricCard } from "@/components/blocks/metric-card";
import { SettingsList } from "@/components/blocks/settings-list";
import { PricingCard } from "@/components/blocks/pricing-card";

export default function CustomScreen() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView contentContainerClassName="p-5 gap-4">
${nodes
  .map((node) => {
    switch (node.type) {
      case 'header':
        return `        {/* Header */}
        <View className="mb-2">
          <Text className="text-2xl font-bold text-white">${node.title || 'Screen'}</Text>
          <Text className="text-xs text-zinc-400">${node.subtitle || ''}</Text>
        </View>`;
      case 'search':
        return `        {/* Search */}
        <TextInput
          placeholder="${node.placeholder || 'Search...'}"
          placeholderTextColor="#71717a"
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white"
        />`;
      case 'metric-card':
        return `        {/* Metric KPI */}
        <MetricCard
          title="${node.title || 'Metric'}"
          value="${node.subtitle || '0'}"
          change="+24.8%"
          positive
        />`;
      case 'user-profile':
        return `        {/* User Profile */}
        <UserProfile
          name="${node.title || 'User'}"
          handle="${node.subtitle || '@handle'}"
          bio="Senior Mobile Engineer building design systems."
          verified
        />`;
      case 'settings-list':
        return `        {/* Settings List */}
        <SettingsList />`;
      case 'pricing-card':
        return `        {/* Pricing Card */}
        <PricingCard
          planName="${node.title || 'Pro Plan'}"
          price="${node.subtitle || '$19'}"
          period="/ month"
          popular
        />`;
      case 'button-action':
        return `        {/* Button Action */}
        <Pressable
          onPress={() => console.log("${node.label || 'Action'} pressed")}
          className="w-full rounded-xl bg-blue-600 py-3.5 items-center active:opacity-90 shadow-sm"
        >
          <Text className="text-sm font-semibold text-white">${node.label || 'Action'}</Text>
        </Pressable>`;
      case 'divider':
        return `        {/* Divider */}
        <View className="h-px w-full bg-zinc-800 my-1" />`;
    }
  })
  .join('\n\n')}
      </ScrollView>
    </SafeAreaView>
  );
}`;
    }

    // StyleSheet target
    return `import React from "react";
import { SafeAreaView, ScrollView, View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { UserProfile } from "@/components/blocks/user-profile";
import { MetricCard } from "@/components/blocks/metric-card";
import { SettingsList } from "@/components/blocks/settings-list";
import { PricingCard } from "@/components/blocks/pricing-card";

export default function CustomScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
${nodes
  .map((node) => {
    switch (node.type) {
      case 'header':
        return `        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>${node.title || 'Screen'}</Text>
          <Text style={styles.headerSubtitle}>${node.subtitle || ''}</Text>
        </View>`;
      case 'search':
        return `        {/* Search */}
        <TextInput
          placeholder="${node.placeholder || 'Search...'}"
          placeholderTextColor="#71717a"
          style={styles.searchInput}
        />`;
      case 'metric-card':
        return `        {/* Metric KPI */}
        <MetricCard
          title="${node.title || 'Metric'}"
          value="${node.subtitle || '0'}"
          change="+24.8%"
          positive
        />`;
      case 'user-profile':
        return `        {/* User Profile */}
        <UserProfile
          name="${node.title || 'User'}"
          handle="${node.subtitle || '@handle'}"
          bio="Senior Mobile Engineer building design systems."
          verified
        />`;
      case 'settings-list':
        return `        {/* Settings List */}
        <SettingsList />`;
      case 'pricing-card':
        return `        {/* Pricing Card */}
        <PricingCard
          planName="${node.title || 'Pro Plan'}"
          price="${node.subtitle || '$19'}"
          period="/ month"
          popular
        />`;
      case 'button-action':
        return `        {/* Button Action */}
        <Pressable
          onPress={() => console.log("${node.label || 'Action'} pressed")}
          style={styles.button}
        >
          <Text style={styles.buttonLabel}>${node.label || 'Action'}</Text>
        </Pressable>`;
      case 'divider':
        return `        {/* Divider */}
        <View style={styles.divider} />`;
    }
  })
  .join('\n\n')}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b",
  },
  scroll: {
    padding: 20,
    gap: 16,
  },
  header: {
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#a1a1aa",
    marginTop: 2,
  },
  searchInput: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272a",
    backgroundColor: "#18181b",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#ffffff",
  },
  button: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#27272a",
    marginVertical: 4,
  },
});`;
  }, [nodes, target]);

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(screenCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [screenCode]);

  return (
    <div className="flex flex-1 overflow-hidden h-full">
      {/* Left: Component Palette & Layers Tree */}
      <aside className="w-72 shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-900/70">
        <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-sky-400" />
            <span className="text-xs font-semibold text-zinc-200">Screen Blocks</span>
          </div>
          <span className="text-[10px] rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-400 font-mono">
            {nodes.length} blocks
          </span>
        </div>

        {/* Component Palette Grid */}
        <div className="p-3 border-b border-zinc-800/80">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2 block">
            Add Block
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {COMPONENT_PALETTE.map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => addNode(item.type)}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950/70 p-2 text-left text-xs text-zinc-300 hover:border-zinc-700 hover:text-white transition-all group"
              >
                <Plus className="h-3 w-3 text-sky-400 group-hover:scale-125 transition-transform" />
                <span className="truncate text-[11px] font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Screen Layers / Hierarchy Tree */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-2 py-1 block">
            Screen Hierarchy
          </span>
          {nodes.map((node, idx) => {
            const isSelected = node.id === selectedId;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedId(node.id)}
                className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-800 text-white font-medium ring-1 ring-zinc-700'
                    : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[10px] text-zinc-500 font-mono">#{idx + 1}</span>
                  <span className="capitalize truncate font-medium">
                    {node.type.replace('-', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveNode(idx, 'up')}
                    className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-20"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === nodes.length - 1}
                    onClick={() => moveNode(idx, 'down')}
                    className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-20"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeNode(node.id)}
                    className="p-1 text-zinc-500 hover:text-red-400 ml-1"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Center: Live Screen Canvas Viewport */}
      <main className="flex-1 flex flex-col items-center justify-center relative p-6 bg-zinc-950 bg-dot-grid overflow-y-auto">
        {/* Canvas Toolbar */}
        <div className="absolute top-4 left-6 z-10 flex items-center gap-2">
          <div className="flex rounded-xl border border-zinc-800 bg-zinc-900/90 p-1 text-xs backdrop-blur shadow-lg">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-medium transition-colors ${
                activeTab === 'preview' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Canvas</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-medium transition-colors ${
                activeTab === 'code' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Export Code</span>
            </button>
          </div>

          {/* Undo / Redo Stack Controls */}
          <div className="flex items-center gap-0.5 rounded-xl border border-zinc-800 bg-zinc-900/90 p-1 text-xs backdrop-blur shadow-lg">
            <button
              type="button"
              disabled={historyIndex === 0}
              onClick={undo}
              title="Undo (Ctrl+Z)"
              className="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={historyIndex >= history.length - 1}
              onClick={redo}
              title="Redo (Ctrl+Y)"
              className="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Block Duplication */}
          <button
            type="button"
            onClick={() => duplicateNode(selectedId)}
            title="Duplicate Selected Block"
            className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900/90 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-white shadow-sm backdrop-blur transition-colors"
          >
            <CopyPlus className="h-3.5 w-3.5 text-sky-400" />
            <span>Duplicate</span>
          </button>

          {/* Export Schema */}
          <button
            type="button"
            onClick={exportSchema}
            title="Export ScreenDocument JSON"
            className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900/90 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-white shadow-sm backdrop-blur transition-colors"
          >
            <FileDown className="h-3.5 w-3.5 text-emerald-400" />
            <span>Export JSON</span>
          </button>

          {/* Import Schema */}
          <label
            title="Import ScreenDocument JSON"
            className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900/90 px-2.5 py-1.5 text-xs text-zinc-400 hover:text-white shadow-sm backdrop-blur cursor-pointer transition-colors"
          >
            <FileUp className="h-3.5 w-3.5 text-purple-400" />
            <span>Import JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportSchema}
              className="hidden"
            />
          </label>

          <span className="rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-400 font-mono shadow-sm">
            Target: {target === 'nativewind' ? 'NativeWind v4' : 'StyleSheet'}
          </span>
        </div>

        {activeTab === 'preview' ? (
          /* Visual Mobile Canvas Frame */
          <div className="w-[393px] min-h-[720px] rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl flex flex-col overflow-hidden my-auto transition-all">
            {/* Minimal App Header */}
            <div className="flex h-10 items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-4 text-xs font-semibold text-zinc-300">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Live Screen Preview
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">393 × 720</span>
            </div>

            {/* Screen Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {nodes.map((node) => {
                const isSelected = node.id === selectedId;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedId(node.id)}
                    className={`relative rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-sky-500 ring-offset-2 ring-offset-zinc-900'
                        : 'hover:ring-1 hover:ring-zinc-700'
                    }`}
                  >
                    {/* Header Node */}
                    {node.type === 'header' && (
                      <div className="py-2">
                        <h2 className="text-xl font-bold text-white">{node.title || 'Screen Title'}</h2>
                        <p className="text-xs text-zinc-400">{node.subtitle || 'Subtitle note'}</p>
                      </div>
                    )}

                    {/* Search Node */}
                    {node.type === 'search' && (
                      <div className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-400 flex items-center justify-between">
                        <span>{node.placeholder || 'Search...'}</span>
                        <span className="text-[10px] rounded bg-zinc-800 px-1 py-0.5 text-zinc-500 font-mono">
                          ⌘K
                        </span>
                      </div>
                    )}

                    {/* Metric Card Node */}
                    {node.type === 'metric-card' && (
                      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                        <span className="text-[10px] uppercase font-semibold text-zinc-500">
                          {node.title || 'Metric'}
                        </span>
                        <div className="mt-1 flex items-baseline justify-between">
                          <span className="text-2xl font-black text-white">
                            {node.subtitle || '128,450'}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-400">+24.8%</span>
                        </div>
                      </div>
                    )}

                    {/* User Profile Node */}
                    {node.type === 'user-profile' && (
                      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                          {(node.title || 'U').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 truncate">
                          <p className="text-xs font-bold text-white truncate">
                            {node.title || 'User'}
                          </p>
                          <p className="text-[11px] text-zinc-400 truncate">
                            {node.subtitle || '@handle'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Settings List Node */}
                    {node.type === 'settings-list' && (
                      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3 space-y-2 text-xs">
                        <div className="flex items-center justify-between py-1 text-zinc-300">
                          <span>Push Notifications</span>
                          <span className="text-emerald-400 font-medium">Enabled</span>
                        </div>
                        <div className="h-px bg-zinc-800" />
                        <div className="flex items-center justify-between py-1 text-zinc-300">
                          <span>Dark Mode</span>
                          <span className="text-zinc-500">System</span>
                        </div>
                      </div>
                    )}

                    {/* Pricing Card Node */}
                    {node.type === 'pricing-card' && (
                      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">
                            {node.title || 'Pro Plan'}
                          </span>
                          <span className="text-[10px] rounded-full bg-sky-500/20 text-sky-400 px-2 py-0.5 font-semibold">
                            Popular
                          </span>
                        </div>
                        <div className="mt-2 text-xl font-extrabold text-white">
                          {node.subtitle || '$19'}
                        </div>
                      </div>
                    )}

                    {/* Action Button Node */}
                    {node.type === 'button-action' && (
                      <div className="w-full rounded-xl bg-blue-600 py-3 text-center text-xs font-semibold text-white shadow-md">
                        {node.label || 'Action Button'}
                      </div>
                    )}

                    {/* Divider Node */}
                    {node.type === 'divider' && <div className="h-px w-full bg-zinc-800 my-1" />}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Generated Code View */
          <div className="w-full max-w-2xl h-[650px] rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl flex flex-col overflow-hidden my-auto">
            <div className="flex h-11 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4">
              <span className="text-xs font-mono text-zinc-400">src/screens/CustomScreen.tsx</span>
              <button
                type="button"
                onClick={copyCode}
                className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-2.5 py-1 text-xs font-medium text-white hover:bg-zinc-700 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="flex-1 overflow-auto p-4 text-xs font-mono text-zinc-300 leading-relaxed bg-zinc-950/60">
              <code>{screenCode}</code>
            </pre>
          </div>
        )}
      </main>

      {/* Right: Property Inspector for Selected Node */}
      <aside className="w-80 shrink-0 flex flex-col border-l border-zinc-800 bg-zinc-900/90 p-4 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-sky-400" />
            <span className="text-xs font-bold text-white">Block Inspector</span>
          </div>
          <span className="text-[10px] rounded bg-zinc-800 px-2 py-0.5 text-zinc-400 font-mono capitalize">
            {selectedNode?.type}
          </span>
        </div>

        {selectedNode ? (
          <div className="space-y-4">
            {/* Title / Heading input */}
            {(selectedNode.type === 'header' ||
              selectedNode.type === 'metric-card' ||
              selectedNode.type === 'user-profile' ||
              selectedNode.type === 'pricing-card') && (
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                  Title / Heading
                </label>
                <input
                  type="text"
                  value={selectedNode.title || ''}
                  onChange={(e) => updateSelectedNode({ title: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white outline-none focus:border-zinc-700"
                />
              </div>
            )}

            {/* Subtitle / Value input */}
            {(selectedNode.type === 'header' ||
              selectedNode.type === 'metric-card' ||
              selectedNode.type === 'user-profile' ||
              selectedNode.type === 'pricing-card') && (
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                  Subtitle / Detail
                </label>
                <input
                  type="text"
                  value={selectedNode.subtitle || ''}
                  onChange={(e) => updateSelectedNode({ subtitle: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white outline-none focus:border-zinc-700"
                />
              </div>
            )}

            {/* Search Placeholder */}
            {selectedNode.type === 'search' && (
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                  Search Placeholder
                </label>
                <input
                  type="text"
                  value={selectedNode.placeholder || ''}
                  onChange={(e) => updateSelectedNode({ placeholder: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white outline-none focus:border-zinc-700"
                />
              </div>
            )}

            {/* Button Label */}
            {selectedNode.type === 'button-action' && (
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">
                  Button CTA Label
                </label>
                <input
                  type="text"
                  value={selectedNode.label || ''}
                  onChange={(e) => updateSelectedNode({ label: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-white outline-none focus:border-zinc-700"
                />
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-4 border-t border-zinc-800/80 space-y-2">
              <button
                type="button"
                onClick={() => removeNode(selectedNode.id)}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Block</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-zinc-500 text-center py-8">Select a block on the canvas to inspect</p>
        )}
      </aside>
    </div>
  );
}
