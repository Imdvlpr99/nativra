"use client";

import React, { useState, useMemo } from "react";
import { NavigationGenerator, type GeneratorResult } from "@nativra/codegen";
import type { NavigationDocument } from "@nativra/studio-schema";
import {
  Compass,
  Plus,
  Trash2,
  Copy,
  Check,
  Code2,
  Eye,
  Sliders,
  Layers,
} from "lucide-react";

export interface NavRoute {
  name: string;
  title: string;
  component: string;
  icon: string;
  headerShown: boolean;
}

export function NavigationBuilder() {
  const [navType, setNavType] = useState<"tabs" | "stack" | "drawer">("tabs");
  const [framework, setFramework] = useState<"expo-router" | "react-navigation">("expo-router");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const [routes, setRoutes] = useState<NavRoute[]>([
    { name: "index", title: "Feed", component: "FeedScreen", icon: "Home", headerShown: false },
    { name: "explore", title: "Explore", component: "ExploreScreen", icon: "Search", headerShown: true },
    { name: "notifications", title: "Activity", component: "NotificationsScreen", icon: "Bell", headerShown: true },
    { name: "profile", title: "Profile", component: "ProfileScreen", icon: "User", headerShown: true },
  ]);

  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  const generated = useMemo((): GeneratorResult => {
    const navGen = new NavigationGenerator();
    const doc: NavigationDocument = {
      schemaVersion: "3.0.0",
      id: "app-nav",
      name: "AppNavigator",
      type: navType,
      initialRouteName: routes[0]?.name ?? "index",
      routes: routes.map((r, i) => ({
        id: String(i + 1),
        name: r.name,
        title: r.title,
        component: r.component,
        icon: r.icon,
        headerShown: r.headerShown,
      })),
      activeTintColor: "#38bdf8",
      inactiveTintColor: "#71717a",
      backgroundColor: "#09090b",
    };

    if (framework === "expo-router") {
      return navGen.generateExpoRouter(doc);
    }
    return navGen.generateReactNavigation(doc);
  }, [navType, framework, routes]);

  const addRoute = () => {
    const num = routes.length + 1;
    setRoutes((prev) => [
      ...prev,
      {
        name: `tab${num}`,
        title: `Screen ${num}`,
        component: `Screen${num}`,
        icon: "Circle",
        headerShown: true,
      },
    ]);
    setSelectedRouteIndex(routes.length);
  };

  const removeRoute = (idx: number) => {
    if (routes.length <= 1) return;
    setRoutes((prev) => prev.filter((_, i) => i !== idx));
    setSelectedRouteIndex(0);
  };

  const updateSelectedRoute = (patch: Partial<NavRoute>) => {
    setRoutes((prev) =>
      prev.map((r, i) => (i === selectedRouteIndex ? { ...r, ...patch } : r))
    );
  };

  const currentRoute = routes[selectedRouteIndex] ?? routes[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(generated.files[0]?.content ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-1 overflow-hidden bg-zinc-950 select-none">
      {/* 1. Left Sidebar: Navigation Graph */}
      <aside className="w-72 shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-900/60">
        <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-sky-400" />
            <span className="text-xs font-bold text-zinc-200">Route Topology</span>
          </div>
          <button
            onClick={addRoute}
            className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:text-white"
          >
            <Plus className="h-3 w-3" />
            <span>Add Route</span>
          </button>
        </div>

        {/* Routes List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {routes.map((route, idx) => {
            const isSel = idx === selectedRouteIndex;
            return (
              <div
                key={idx}
                onClick={() => setSelectedRouteIndex(idx)}
                className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                  isSel
                    ? "bg-sky-500/15 text-sky-400 font-semibold border border-sky-500/30"
                    : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  <span className="truncate">{route.title}</span>
                  <span className="font-mono text-[10px] text-zinc-500">/{route.name}</span>
                </div>
                {routes.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRoute(idx);
                    }}
                    className="p-1 text-zinc-500 hover:text-red-400"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Topology Switcher */}
        <div className="p-3 border-t border-zinc-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Navigator Type
          </span>
          <div className="grid grid-cols-3 gap-1">
            {(["tabs", "stack", "drawer"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setNavType(t)}
                className={`py-1.5 rounded text-xs font-semibold capitalize transition-colors ${
                  navType === t ? "bg-zinc-800 text-sky-400" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* 2. Center: Visual Navigation Preview */}
      <main className="flex-1 flex flex-col overflow-hidden bg-zinc-950 bg-dot-grid">
        {/* Top Header */}
        <div className="h-12 border-b border-zinc-800 bg-zinc-900/90 px-4 flex items-center justify-between backdrop-blur">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-sky-400" />
            <span className="text-xs font-bold text-zinc-200">
              {framework === "expo-router" ? "Expo Router v4" : "React Navigation v6"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Framework Switcher */}
            <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 text-xs">
              <button
                onClick={() => setFramework("expo-router")}
                className={`rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                  framework === "expo-router" ? "bg-zinc-800 text-sky-400" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Expo Router
              </button>
              <button
                onClick={() => setFramework("react-navigation")}
                className={`rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                  framework === "react-navigation" ? "bg-zinc-800 text-sky-400" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                React Navigation
              </button>
            </div>

            {/* View Tab */}
            <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 text-xs">
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                  activeTab === "preview" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
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

        {/* Workspace */}
        {activeTab === "preview" ? (
          <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
            {/* Simulated Phone with Tab Bar */}
            <div className="w-[360px] h-[640px] rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl flex flex-col justify-between overflow-hidden">
              {/* Screen Top Header */}
              <div className="h-14 shrink-0 flex items-center justify-between px-5 border-b border-zinc-800 bg-zinc-900/60">
                <span className="text-sm font-bold text-white">{currentRoute?.title}</span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {currentRoute?.headerShown ? "Header Visible" : "Header Hidden"}
                </span>
              </div>

              {/* Active Route Screen Body */}
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-2">
                <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl font-bold text-sky-400">
                  {currentRoute?.name[0]?.toUpperCase()}
                </div>
                <h3 className="text-base font-bold text-white">{currentRoute?.title} Screen</h3>
                <p className="text-xs text-zinc-500 font-mono">
                  Route component: {currentRoute?.component}.tsx
                </p>
              </div>

              {/* Bottom Tab Bar Simulation */}
              {navType === "tabs" && (
                <div className="h-16 shrink-0 flex items-center justify-around border-t border-zinc-800 bg-zinc-900/80 px-2 pb-2">
                  {routes.map((r, idx) => {
                    const isSel = idx === selectedRouteIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedRouteIndex(idx)}
                        className={`flex flex-col items-center gap-1 text-[10px] transition-colors ${
                          isSel ? "text-sky-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        <div
                          className={`h-4 w-4 rounded-full ${
                            isSel ? "bg-sky-400" : "bg-zinc-700"
                          }`}
                        />
                        <span>{r.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2 bg-zinc-900/40">
              <span className="text-xs font-mono text-zinc-400">{generated.files[0]?.path}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded bg-zinc-800 px-2.5 py-1 text-xs text-zinc-200 hover:bg-zinc-700"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied" : "Copy Code"}</span>
              </button>
            </div>
            <pre className="flex-1 overflow-auto p-4 font-mono text-xs text-zinc-300 leading-relaxed">
              <code>{generated.files[0]?.content}</code>
            </pre>
          </div>
        )}
      </main>

      {/* 3. Right Sidebar: Route Properties */}
      <aside className="w-72 shrink-0 flex flex-col border-l border-zinc-800 bg-zinc-900/90 p-4 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
          <Sliders className="h-4 w-4 text-sky-400" />
          <span className="text-xs font-bold text-zinc-200">Route Configuration</span>
        </div>

        {currentRoute && (
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-zinc-400 uppercase">Route Path / Name</label>
              <input
                type="text"
                value={currentRoute.name}
                onChange={(e) => updateSelectedRoute({ name: e.target.value })}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-200 outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-zinc-400 uppercase">Screen Title</label>
              <input
                type="text"
                value={currentRoute.title}
                onChange={(e) => updateSelectedRoute({ title: e.target.value })}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-200 outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-zinc-400 uppercase">Component Export</label>
              <input
                type="text"
                value={currentRoute.component}
                onChange={(e) => updateSelectedRoute({ component: e.target.value })}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-200 outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-2">
              <span className="text-zinc-400">Header Shown</span>
              <input
                type="checkbox"
                checked={currentRoute.headerShown}
                onChange={(e) => updateSelectedRoute({ headerShown: e.target.checked })}
                className="rounded accent-sky-500"
              />
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
