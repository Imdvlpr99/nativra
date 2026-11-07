'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Compass,
  Plus,
  Trash2,
  Copy,
  Check,
  Home,
  Terminal,
} from 'lucide-react';

export interface RouteItem {
  id: string;
  name: string;
  title: string;
  icon: string;
  headerShown: boolean;
}

const DEFAULT_ROUTES: RouteItem[] = [
  { id: '1', name: 'Home', title: 'Feed & Discover', icon: 'Home', headerShown: false },
  { id: '2', name: 'Explore', title: 'Trending', icon: 'Search', headerShown: true },
  { id: '3', name: 'Notifications', title: 'Activity', icon: 'Bell', headerShown: true },
  { id: '4', name: 'Profile', title: 'My Account', icon: 'User', headerShown: true },
];

export function NavigationGenerator() {
  const [navType, setNavType] = useState<'bottom-tabs' | 'native-stack' | 'drawer'>('bottom-tabs');
  const [routes, setRoutes] = useState<RouteItem[]>(DEFAULT_ROUTES);
  const [initialRoute, setInitialRoute] = useState<string>('Home');
  const [activeTab, setActiveTab] = useState<'visual' | 'code' | 'types'>('visual');
  const [copied, setCopied] = useState(false);

  const addRoute = () => {
    const num = routes.length + 1;
    const newRoute: RouteItem = {
      id: Math.random().toString(36).substring(4),
      name: `Screen${num}`,
      title: `Screen ${num}`,
      icon: 'Home',
      headerShown: true,
    };
    setRoutes((prev) => [...prev, newRoute]);
  };

  const removeRoute = (id: string) => {
    setRoutes((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRoute = (id: string, updates: Partial<RouteItem>) => {
    setRoutes((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  // Generate React Navigation Code
  const navigationCode = useMemo(() => {
    if (navType === 'bottom-tabs') {
      return `import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Search, Bell, User, Heart, Settings } from "lucide-react-native";
import type { RootTabParamList } from "./types";

// Import your screen components
${routes.map((r) => `import ${r.name}Screen from "@/screens/${r.name}Screen";`).join('\n')}

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_ICONS: Record<string, any> = {
  Home,
  Search,
  Bell,
  User,
  Heart,
  Settings,
};

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="${initialRoute}"
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: "#2563eb",
          tabBarInactiveTintColor: "#71717a",
          tabBarStyle: {
            backgroundColor: "#09090b",
            borderTopColor: "#27272a",
            height: 60,
            paddingBottom: 8,
          },
          headerStyle: {
            backgroundColor: "#09090b",
          },
          headerTintColor: "#ffffff",
          tabBarIcon: ({ color, size }) => {
            const IconComponent = TAB_ICONS[route.name] || Home;
            return <IconComponent color={color} size={size} />;
          },
        })}
      >
${routes
  .map(
    (r) => `        <Tab.Screen
          name="${r.name}"
          component={${r.name}Screen}
          options={{
            title: "${r.title}",
            headerShown: ${r.headerShown},
          }}
        />`
  )
  .join('\n')}
      </Tab.Navigator>
    </NavigationContainer>
  );
}`;
    }

    if (navType === 'native-stack') {
      return `import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types";

// Import your screen components
${routes.map((r) => `import ${r.name}Screen from "@/screens/${r.name}Screen";`).join('\n')}

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="${initialRoute}"
        screenOptions={{
          headerStyle: { backgroundColor: "#09090b" },
          headerTintColor: "#ffffff",
          headerTitleStyle: { fontWeight: "700" },
          animation: "slide_from_right",
        }}
      >
${routes
  .map(
    (r) => `        <Stack.Screen
          name="${r.name}"
          component={${r.name}Screen}
          options={{
            title: "${r.title}",
            headerShown: ${r.headerShown},
          }}
        />`
  )
  .join('\n')}
      </Stack.Navigator>
    </NavigationContainer>
  );
}`;
    }

    // Drawer Navigator
    return `import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import type { RootDrawerParamList } from "./types";

// Import your screen components
${routes.map((r) => `import ${r.name}Screen from "@/screens/${r.name}Screen";`).join('\n')}

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="${initialRoute}"
        screenOptions={{
          drawerStyle: { backgroundColor: "#09090b", width: 280 },
          drawerActiveTintColor: "#2563eb",
          drawerInactiveTintColor: "#a1a1aa",
          headerStyle: { backgroundColor: "#09090b" },
          headerTintColor: "#ffffff",
        }}
      >
${routes
  .map(
    (r) => `        <Drawer.Screen
          name="${r.name}"
          component={${r.name}Screen}
          options={{
            title: "${r.title}",
            headerShown: ${r.headerShown},
          }}
        />`
  )
  .join('\n')}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}`
  }, [navType, routes, initialRoute]);

  // Generate TypeScript Parameter List
  const typesCode = useMemo(() => {
    const typeName =
      navType === 'bottom-tabs'
        ? 'RootTabParamList'
        : navType === 'native-stack'
        ? 'RootStackParamList'
        : 'RootDrawerParamList';

    return `import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type ${typeName} = {
${routes.map((r) => `  ${r.name}: undefined;`).join('\n')}
};

export type ScreenProps<T extends keyof ${typeName}> = NativeStackScreenProps<${typeName}, T>;
`;
  }, [navType, routes]);

  const copyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="flex flex-1 overflow-hidden h-full">
      {/* Left: Navigator Architecture & Route List */}
      <aside className="w-80 shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-900/70">
        <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-sky-400" />
            <span className="text-xs font-semibold text-zinc-200">Navigation Generator</span>
          </div>
          <span className="text-[10px] rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-400 font-mono">
            React Navigation v7
          </span>
        </div>

        {/* Navigator Type Switcher */}
        <div className="p-3 border-b border-zinc-800/80">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-2 block">
            Navigator Type
          </span>
          <div className="grid grid-cols-3 gap-1">
            {(['bottom-tabs', 'native-stack', 'drawer'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setNavType(type)}
                className={`rounded-lg py-1.5 px-2 text-center text-xs font-medium capitalize transition-all ${
                  navType === type
                    ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                {type.replace('-', ' ')}
              </button>
            ))}
          </div>

          <div className="mt-3">
            <label className="text-[11px] font-medium text-zinc-400 block mb-1">
              Initial Route
            </label>
            <select
              value={initialRoute}
              onChange={(e) => setInitialRoute(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-white outline-none"
            >
              {routes.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name} ({r.title})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Routes List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Registered Screens ({routes.length})
            </span>
            <button
              type="button"
              onClick={addRoute}
              className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300"
            >
              <Plus className="h-3 w-3" />
              <span>Add Screen</span>
            </button>
          </div>

          {routes.map((route) => (
            <div
              key={route.id}
              className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={route.name}
                  onChange={(e) => updateRoute(route.id, { name: e.target.value })}
                  className="font-bold text-white bg-transparent outline-none w-28 text-xs border-b border-transparent focus:border-zinc-700"
                />
                <button
                  type="button"
                  onClick={() => removeRoute(route.id)}
                  disabled={routes.length <= 1}
                  className="p-1 text-zinc-500 hover:text-red-400 disabled:opacity-20"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <label className="text-zinc-500 block mb-0.5">Title</label>
                  <input
                    type="text"
                    value={route.title}
                    onChange={(e) => updateRoute(route.id, { title: e.target.value })}
                    className="w-full rounded bg-zinc-900 border border-zinc-800 px-2 py-1 text-zinc-300 outline-none text-[11px]"
                  />
                </div>
                <div>
                  <label className="text-zinc-500 block mb-0.5">Icon</label>
                  <select
                    value={route.icon}
                    onChange={(e) => updateRoute(route.id, { icon: e.target.value })}
                    className="w-full rounded bg-zinc-900 border border-zinc-800 px-2 py-1 text-zinc-300 outline-none text-[11px]"
                  >
                    {['Home', 'Search', 'Bell', 'User', 'Heart', 'Settings'].map((ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={route.headerShown}
                  onChange={(e) => updateRoute(route.id, { headerShown: e.target.checked })}
                  className="rounded border-zinc-700 text-blue-600"
                />
                <span className="text-[11px] text-zinc-400">Show Header</span>
              </label>
            </div>
          ))}
        </div>

        {/* Required Packages footer */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950/60 text-[11px] text-zinc-400 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-zinc-300">
            <Terminal className="h-3.5 w-3.5 text-emerald-400" />
            <span>Required Dependencies</span>
          </div>
          <code className="text-[10px] text-zinc-400 font-mono block bg-zinc-900 p-1.5 rounded border border-zinc-800/80 truncate">
            npx expo install @react-navigation/native @react-navigation/bottom-tabs
          </code>
        </div>
      </aside>

      {/* Center: Interactive Visual Diagram & Generated Code */}
      <main className="flex-1 flex flex-col items-center justify-center relative p-6 bg-zinc-950 bg-dot-grid overflow-y-auto">
        {/* Navigation Toolbar */}
        <div className="absolute top-4 left-6 z-10 flex items-center gap-2">
          <div className="flex rounded-xl border border-zinc-800 bg-zinc-900/90 p-1 text-xs backdrop-blur shadow-lg">
            <button
              onClick={() => setActiveTab('visual')}
              className={`rounded-lg px-3 py-1 font-medium transition-colors ${
                activeTab === 'visual' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Visual Flow
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`rounded-lg px-3 py-1 font-medium transition-colors ${
                activeTab === 'code' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Navigator Code
            </button>
            <button
              onClick={() => setActiveTab('types')}
              className={`rounded-lg px-3 py-1 font-medium transition-colors ${
                activeTab === 'types' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Types.ts
            </button>
          </div>
        </div>

        {activeTab === 'visual' ? (
          /* Visual Flow Preview */
          <div className="w-[393px] h-[680px] rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl flex flex-col justify-between overflow-hidden my-auto">
            {/* Top Bar */}
            <div className="h-12 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-4 text-xs font-semibold text-white">
              <span>{initialRoute} Screen</span>
              <span className="text-[10px] font-mono text-zinc-500">Active View</span>
            </div>

            {/* Simulated Active Screen View */}
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="h-16 w-16 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Compass className="h-8 w-8 animate-spin-slow" />
              </div>
              <h3 className="text-base font-bold text-white">
                {initialRoute} Navigator Route
              </h3>
              <p className="text-xs text-zinc-400 max-w-[240px]">
                Navigating via <strong>{navType}</strong> with {routes.length} configured native routes.
              </p>
            </div>

            {/* Bottom Tab Bar Simulation */}
            {navType === 'bottom-tabs' && (
              <div className="h-16 border-t border-zinc-800 bg-zinc-950/95 flex items-center justify-around px-2">
                {routes.map((r) => {
                  const isActive = r.name === initialRoute;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setInitialRoute(r.name)}
                      className={`flex flex-col items-center gap-1 py-1 transition-colors ${
                        isActive ? 'text-blue-500' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      <Home className="h-4 w-4" />
                      <span className="text-[10px] font-medium">{r.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Generated Code View */
          <div className="w-full max-w-2xl h-[650px] rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl flex flex-col overflow-hidden my-auto">
            <div className="flex h-11 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4">
              <span className="text-xs font-mono text-zinc-400">
                {activeTab === 'code' ? 'src/navigation/root-navigator.tsx' : 'src/navigation/types.ts'}
              </span>
              <button
                type="button"
                onClick={() =>
                  copyCode(activeTab === 'code' ? navigationCode : typesCode)
                }
                className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-2.5 py-1 text-xs font-medium text-white hover:bg-zinc-700 transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy File'}</span>
              </button>
            </div>
            <pre className="flex-1 overflow-auto p-4 text-xs font-mono text-zinc-300 leading-relaxed bg-zinc-950/60">
              <code>{activeTab === 'code' ? navigationCode : typesCode}</code>
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
