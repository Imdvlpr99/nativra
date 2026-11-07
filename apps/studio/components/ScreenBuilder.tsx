"use client";

import React, { useState, useMemo, useEffect } from "react";
import type { ScreenIRDocument, ScreenIRNode } from "@nativra/studio-schema";
import { generateFromScreenIR } from "@nativra/codegen";
import {
  Layers,
  Plus,
  Trash2,
  Copy,
  Check,
  Code2,
  Eye,
  Sliders,
  Smartphone,
  RotateCcw,
  Undo2,
  Redo2,
} from "lucide-react";

export const DEFAULT_SCREEN_DOC: ScreenIRDocument = {
  name: "UserProfile",
  target: "nativewind",
  version: "1.0.0",
  root: {
    id: "node-root",
    type: "primitive",
    name: "VStack",
    props: { gap: 16 },
    children: [
      {
        id: "node-title",
        type: "primitive",
        name: "Text",
        props: { children: "User Profile" },
      },
      {
        id: "node-card",
        type: "component",
        name: "Card",
        props: { elevated: true },
        children: [
          {
            id: "node-name",
            type: "primitive",
            name: "Text",
            props: { children: "Sophia Martinez" },
          },
          {
            id: "node-badge",
            type: "component",
            name: "Badge",
            props: { label: "PRO MEMBER", variant: "primary" },
          },
        ],
      },
      {
        id: "node-btn",
        type: "component",
        name: "Button",
        props: { children: "Edit Profile", variant: "primary" },
      },
    ],
  },
};

export function ScreenBuilder({ target: initialTarget = "nativewind" }: { target?: "nativewind" | "stylesheet" }) {
  const [doc, setDocState] = useState<ScreenIRDocument>(DEFAULT_SCREEN_DOC);
  const [history, setHistory] = useState<ScreenIRDocument[]>([]);
  const [future, setFuture] = useState<ScreenIRDocument[]>([]);
  const [target, setTarget] = useState<"nativewind" | "stylesheet">(initialTarget);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("node-card");
  const [activeTab, setActiveTab] = useState<"canvas" | "code">("canvas");
  const [copied, setCopied] = useState(false);

  const pushDocChange = (updater: (prev: ScreenIRDocument) => ScreenIRDocument) => {
    setDocState((current) => {
      const next = updater(current);
      setHistory((prev) => [...prev.slice(-30), current]);
      setFuture([]);
      return next;
    });
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1]!;
    setHistory((prev) => prev.slice(0, -1));
    setFuture((prev) => [doc, ...prev]);
    setDocState(previous);
  };

  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0]!;
    setFuture((prev) => prev.slice(1));
    setHistory((prev) => [...prev, doc]);
    setDocState(next);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const activeDoc: ScreenIRDocument = useMemo(() => ({
    ...doc,
    target,
  }), [doc, target]);

  const generated = useMemo(() => {
    try {
      return generateFromScreenIR(activeDoc);
    } catch {
      return { files: [{ path: "screen.tsx", content: "// Compilation error" }], dependencies: [] };
    }
  }, [activeDoc]);

  // Find node by id
  const findNode = (node: ScreenIRNode, id: string): ScreenIRNode | null => {
    if (node.id === id) return node;
    for (const child of node.children ?? []) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  };

  const selectedNode = useMemo(() => findNode(doc.root, selectedNodeId), [doc, selectedNodeId]);

  // Update selected node props
  const updateNodeProps = (newProps: Record<string, unknown>) => {
    const updateRecursive = (node: ScreenIRNode): ScreenIRNode => {
      if (node.id === selectedNodeId) {
        return { ...node, props: { ...node.props, ...newProps } };
      }
      return {
        ...node,
        children: node.children ? node.children.map(updateRecursive) : undefined,
      };
    };
    pushDocChange((prev) => ({ ...prev, root: updateRecursive(prev.root) }));
  };

  // Add child node
  const addChildNode = (nodeType: string) => {
    const newNode: ScreenIRNode = {
      id: "node-" + Math.random().toString(36).substring(2, 7),
      type: nodeType === "VStack" || nodeType === "HStack" || nodeType === "Text" ? "primitive" : "component",
      name: nodeType,
      props:
        nodeType === "Button"
          ? { children: "New Button", variant: "primary" }
          : nodeType === "Badge"
          ? { label: "New Badge", variant: "default" }
          : nodeType === "Text"
          ? { children: "New text label" }
          : nodeType === "Input"
          ? { placeholder: "Enter text..." }
          : { gap: 12 },
    };

    const addRecursive = (node: ScreenIRNode): ScreenIRNode => {
      if (node.id === selectedNodeId) {
        return {
          ...node,
          children: [...(node.children ?? []), newNode],
        };
      }
      return {
        ...node,
        children: node.children ? node.children.map(addRecursive) : undefined,
      };
    };

    pushDocChange((prev) => ({ ...prev, root: addRecursive(prev.root) }));
    setSelectedNodeId(newNode.id);
  };

  // Delete node
  const deleteNode = (id: string) => {
    if (id === doc.root.id) return; // Prevent deleting root
    const deleteRecursive = (node: ScreenIRNode): ScreenIRNode => {
      return {
        ...node,
        children: node.children
          ? node.children.filter((c) => c.id !== id).map(deleteRecursive)
          : undefined,
      };
    };
    pushDocChange((prev) => ({ ...prev, root: deleteRecursive(prev.root) }));
    setSelectedNodeId(doc.root.id);
  };

  // Tree render component
  const renderTree = (node: ScreenIRNode, depth = 0) => {
    const isSelected = node.id === selectedNodeId;
    return (
      <div key={node.id} className="space-y-1">
        <button
          onClick={() => setSelectedNodeId(node.id)}
          style={{ paddingLeft: `${depth * 14 + 10}px` }}
          className={`w-full flex items-center justify-between py-1.5 pr-2 rounded-lg text-xs transition-colors ${
            isSelected
              ? "bg-sky-500/15 text-sky-400 font-semibold border border-sky-500/30"
              : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
          }`}
        >
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-[10px] font-mono text-zinc-500">{node.type === "primitive" ? "pr" : "ui"}</span>
            <span className="truncate">{node.name}</span>
          </div>
          {node.id !== doc.root.id && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteNode(node.id);
              }}
              className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </button>
        {node.children?.map((child) => renderTree(child, depth + 1))}
      </div>
    );
  };

  // Canvas visual preview renderer
  const renderVisualNode = (node: ScreenIRNode): React.ReactNode => {
    const isSelected = node.id === selectedNodeId;
    const borderClass = isSelected ? "ring-2 ring-sky-500 ring-offset-2 ring-offset-zinc-950" : "";

    switch (node.name) {
      case "VStack":
        return (
          <div
            key={node.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedNodeId(node.id);
            }}
            className={`flex flex-col gap-3 p-3 rounded-2xl border border-dashed border-zinc-800 ${borderClass}`}
          >
            {node.children?.map(renderVisualNode)}
          </div>
        );
      case "HStack":
        return (
          <div
            key={node.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedNodeId(node.id);
            }}
            className={`flex flex-row items-center gap-3 p-2 rounded-xl border border-dashed border-zinc-800 ${borderClass}`}
          >
            {node.children?.map(renderVisualNode)}
          </div>
        );
      case "Card":
        return (
          <div
            key={node.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedNodeId(node.id);
            }}
            className={`w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-4 shadow-lg space-y-3 ${borderClass}`}
          >
            {node.children?.map(renderVisualNode)}
          </div>
        );
      case "Button":
        return (
          <button
            key={node.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedNodeId(node.id);
            }}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-md transition-all ${
              node.props?.variant === "destructive"
                ? "bg-red-600 text-white"
                : "bg-sky-500 text-white shadow-sky-500/20"
            } ${borderClass}`}
          >
            {String(node.props?.children || "Button")}
          </button>
        );
      case "Badge":
        return (
          <span
            key={node.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedNodeId(node.id);
            }}
            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
              node.props?.variant === "primary"
                ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                : "bg-zinc-800 text-zinc-300"
            } ${borderClass}`}
          >
            {String(node.props?.label || "Badge")}
          </span>
        );
      case "Input":
        return (
          <div
            key={node.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedNodeId(node.id);
            }}
            className={`w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-400 ${borderClass}`}
          >
            {String(node.props?.placeholder || "Input field...")}
          </div>
        );
      case "Text":
      default:
        return (
          <span
            key={node.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedNodeId(node.id);
            }}
            className={`text-sm font-semibold text-zinc-100 ${borderClass}`}
          >
            {String(node.props?.children || "Text Label")}
          </span>
        );
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generated.files[0]?.content ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-1 overflow-hidden bg-zinc-950 select-none">
      {/* 1. Left Sidebar: Screen Component Tree & Palette */}
      <aside className="w-72 shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-900/60">
        <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-sky-400" />
            <span className="text-xs font-bold text-zinc-200">Screen IR Tree</span>
          </div>
          <button
            onClick={() => pushDocChange(() => DEFAULT_SCREEN_DOC)}
            title="Reset tree"
            className="p-1 rounded text-zinc-500 hover:text-zinc-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Tree Nodes */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {renderTree(doc.root)}
        </div>

        {/* Quick Add Palette */}
        <div className="p-3 border-t border-zinc-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Insert Into Selected Node
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {["Button", "Card", "Text", "Badge", "Input", "HStack", "VStack"].map((item) => (
              <button
                key={item}
                onClick={() => addChildNode(item)}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
              >
                <Plus className="h-3 w-3 text-sky-400" />
                <span>{item}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* 2. Center: Visual Mobile Canvas */}
      <main className="flex-1 flex flex-col overflow-hidden bg-zinc-950 bg-dot-grid">
        {/* Top Header Bar */}
        <div className="h-12 border-b border-zinc-800 bg-zinc-900/90 px-4 flex items-center justify-between backdrop-blur">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-sky-400" />
            <span className="text-xs font-bold text-zinc-200">{doc.name}Screen.tsx</span>
            <span className="text-[10px] font-mono rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-400">
              Screen IR v4
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Undo / Redo controls */}
            <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 text-xs">
              <button
                onClick={handleUndo}
                disabled={history.length === 0}
                title="Undo (Ctrl+Z)"
                className="flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <Undo2 className="h-3.5 w-3.5" />
                <span>Undo</span>
              </button>
              <button
                onClick={handleRedo}
                disabled={future.length === 0}
                title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
                className="flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <Redo2 className="h-3.5 w-3.5" />
                <span>Redo</span>
              </button>
            </div>

            {/* Target Switcher */}
            <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 text-xs">
              <button
                onClick={() => setTarget("nativewind")}
                className={`rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                  target === "nativewind" ? "bg-zinc-800 text-sky-400" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                NativeWind
              </button>
              <button
                onClick={() => setTarget("stylesheet")}
                className={`rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                  target === "stylesheet" ? "bg-zinc-800 text-sky-400" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                StyleSheet
              </button>
            </div>

            {/* View Mode */}
            <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 text-xs">
              <button
                onClick={() => setActiveTab("canvas")}
                className={`flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                  activeTab === "canvas" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Eye className="h-3 w-3" />
                <span>Visual</span>
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                  activeTab === "code" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Code2 className="h-3 w-3" />
                <span>TSX</span>
              </button>
            </div>
          </div>
        </div>

        {/* Workspace Body */}
        {activeTab === "canvas" ? (
          <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
            {/* Simulated Phone Frame */}
            <div className="w-[360px] h-[640px] rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl flex flex-col overflow-hidden">
              {/* Phone Status Bar */}
              <div className="h-8 shrink-0 flex items-center justify-between px-5 text-[11px] font-semibold text-zinc-400 border-b border-zinc-900 bg-zinc-900/40">
                <span>9:41</span>
                <div className="h-3.5 w-16 rounded-full bg-black" />
                <span className="font-mono text-[10px]">100%</span>
              </div>

              {/* Screen Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {renderVisualNode(doc.root)}
              </div>

              {/* Bottom Indicator */}
              <div className="h-5 shrink-0 flex items-center justify-center">
                <div className="h-1 w-24 rounded-full bg-zinc-700" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2 bg-zinc-900/40">
              <span className="text-xs font-mono text-zinc-400">{generated.files[0]?.path}</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 rounded bg-zinc-800 px-2.5 py-1 text-xs text-zinc-200 hover:bg-zinc-700"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied" : "Copy TSX"}</span>
              </button>
            </div>
            <pre className="flex-1 overflow-auto p-4 font-mono text-xs text-zinc-300 leading-relaxed">
              <code>{generated.files[0]?.content}</code>
            </pre>
          </div>
        )}
      </main>

      {/* 3. Right Sidebar: Node Properties Inspector */}
      <aside className="w-72 shrink-0 flex flex-col border-l border-zinc-800 bg-zinc-900/90 p-4 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
          <Sliders className="h-4 w-4 text-sky-400" />
          <span className="text-xs font-bold text-zinc-200">Node Properties</span>
        </div>

        {selectedNode ? (
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase">Node ID</span>
              <div className="font-mono text-zinc-300 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                {selectedNode.id}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase">Component</span>
              <div className="font-semibold text-sky-400 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                {selectedNode.name}
              </div>
            </div>

            {/* Dynamic Editable Fields */}
            {"children" in (selectedNode.props ?? {}) && (
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-zinc-400 uppercase">Label / Content</label>
                <input
                  type="text"
                  value={String(selectedNode.props?.children ?? "")}
                  onChange={(e) => updateNodeProps({ children: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-200 outline-none focus:border-sky-500"
                />
              </div>
            )}

            {"label" in (selectedNode.props ?? {}) && (
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-zinc-400 uppercase">Label</label>
                <input
                  type="text"
                  value={String(selectedNode.props?.label ?? "")}
                  onChange={(e) => updateNodeProps({ label: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-200 outline-none focus:border-sky-500"
                />
              </div>
            )}

            {"variant" in (selectedNode.props ?? {}) && (
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-zinc-400 uppercase">Variant</label>
                <select
                  value={String(selectedNode.props?.variant ?? "primary")}
                  onChange={(e) => updateNodeProps({ variant: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-200 outline-none focus:border-sky-500"
                >
                  <option value="default">Default</option>
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="destructive">Destructive</option>
                  <option value="outline">Outline</option>
                </select>
              </div>
            )}

            {"placeholder" in (selectedNode.props ?? {}) && (
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-zinc-400 uppercase">Placeholder</label>
                <input
                  type="text"
                  value={String(selectedNode.props?.placeholder ?? "")}
                  onChange={(e) => updateNodeProps({ placeholder: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-200 outline-none focus:border-sky-500"
                />
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-zinc-500">Select a node in the tree to inspect and edit its properties.</p>
        )}
      </aside>
    </div>
  );
}
