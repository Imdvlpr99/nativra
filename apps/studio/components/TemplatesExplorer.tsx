'use client';

import React, { useState, useMemo, useCallback } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Sparkles,
  ShoppingBag,
  Users,
  CreditCard,
  Lock,
  Copy,
  Check,
  Layers,
  Terminal,
} from 'lucide-react';

interface TemplateItem {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: LucideIcon;
  blocks: string[];
  dependencies: string[];
  nativeWindCode: string;
  styleSheetCode: string;
}

const TEMPLATES: TemplateItem[] = [
  {
    id: 'ecommerce',
    name: 'E-Commerce Storefront',
    category: 'Commerce',
    description: 'Complete mobile shopping screen with search header, hero promo banner, category chips, and pricing tiers.',
    icon: ShoppingBag,
    blocks: ['header', 'search-input', 'pricing-card', 'metric-card', 'button'],
    dependencies: ['@nativra/cli', 'lucide-react-native'],
    nativeWindCode: `import React from "react";
import { SafeAreaView, ScrollView, View, Text, TextInput, Pressable, Image } from "react-native";
import { PricingCard } from "@/components/blocks/pricing-card";

export default function StorefrontScreen() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView contentContainerClassName="p-5 gap-5">
        {/* Top App Header */}
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-white">Nativra Store</Text>
            <Text className="text-xs text-zinc-400">Discover premium mobile design kits</Text>
          </View>
          <View className="h-10 w-10 rounded-full bg-blue-600/20 border border-blue-500/30 items-center justify-center">
            <Text className="text-xs font-bold text-blue-400">🛒 2</Text>
          </View>
        </View>

        {/* Search */}
        <TextInput
          placeholder="Search products, kits & templates..."
          placeholderTextColor="#71717a"
          className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white"
        />

        {/* Featured Membership Plan */}
        <PricingCard
          planName="Developer Pro Pass"
          price="$29"
          period="/ month, billed yearly"
          popular
          buttonText="Unlock All UI Kits"
        />

        {/* Quick Checkout CTA */}
        <Pressable className="w-full rounded-xl bg-blue-600 py-3.5 items-center active:opacity-90">
          <Text className="text-sm font-semibold text-white">Proceed to Checkout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}`,
    styleSheetCode: `import React from "react";
import { SafeAreaView, ScrollView, View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { PricingCard } from "@/components/blocks/pricing-card";

export default function StorefrontScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Nativra Store</Text>
            <Text style={styles.subtitle}>Discover premium mobile design kits</Text>
          </View>
          <View style={styles.cartBadge}>
            <Text style={styles.cartText}>🛒 2</Text>
          </View>
        </View>

        <TextInput
          placeholder="Search products, kits & templates..."
          placeholderTextColor="#71717a"
          style={styles.searchInput}
        />

        <PricingCard
          planName="Developer Pro Pass"
          price="$29"
          period="/ month, billed yearly"
          popular
          buttonText="Unlock All UI Kits"
        />

        <Pressable style={styles.ctaButton}>
          <Text style={styles.ctaText}>Proceed to Checkout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#09090b" },
  scroll: { padding: 20, gap: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "700", color: "#ffffff" },
  subtitle: { fontSize: 12, color: "#a1a1aa", marginTop: 2 },
  cartBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#1e3a8a", alignItems: "center", justifyContent: "center" },
  cartText: { fontSize: 12, fontWeight: "700", color: "#60a5fa" },
  searchInput: { width: "100%", borderRadius: 16, borderWidth: 1, borderColor: "#27272a", backgroundColor: "#18181b", padding: 14, color: "#ffffff" },
  ctaButton: { width: "100%", borderRadius: 12, backgroundColor: "#2563eb", paddingVertical: 14, alignItems: "center" },
  ctaText: { fontSize: 14, fontWeight: "600", color: "#ffffff" },
});`,
  },
  {
    id: 'analytics',
    name: 'Fintech & Analytics Hub',
    category: 'Finance',
    description: 'Executive dashboard with KPI metric cards, performance metrics, and settings summary.',
    icon: CreditCard,
    blocks: ['header', 'metric-card', 'settings-list', 'button'],
    dependencies: ['@nativra/cli', 'lucide-react-native'],
    nativeWindCode: `import React from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";
import { MetricCard } from "@/components/blocks/metric-card";
import { SettingsList } from "@/components/blocks/settings-list";

export default function AnalyticsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView contentContainerClassName="p-5 gap-4">
        <View className="mb-2">
          <Text className="text-2xl font-bold text-white">Portfolio Overview</Text>
          <Text className="text-xs text-zinc-400">Real-time metrics & financial operations</Text>
        </View>

        <MetricCard
          title="Total Net Asset Value"
          value="$284,910"
          change="+32.4%"
          positive
          timeframe="vs past 30 days"
        />

        <MetricCard
          title="Monthly Recurring Yield"
          value="$14,280"
          change="+12.8%"
          positive
          timeframe="annualized"
        />

        <Text className="text-sm font-bold text-white mt-4">Security & Settlement</Text>
        <SettingsList />
      </ScrollView>
    </SafeAreaView>
  );
}`,
    styleSheetCode: `import React from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet } from "react-native";
import { MetricCard } from "@/components/blocks/metric-card";
import { SettingsList } from "@/components/blocks/settings-list";

export default function AnalyticsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Portfolio Overview</Text>
          <Text style={styles.subtitle}>Real-time metrics & financial operations</Text>
        </View>

        <MetricCard
          title="Total Net Asset Value"
          value="$284,910"
          change="+32.4%"
          positive
          timeframe="vs past 30 days"
        />

        <MetricCard
          title="Monthly Recurring Yield"
          value="$14,280"
          change="+12.8%"
          positive
          timeframe="annualized"
        />

        <Text style={styles.sectionTitle}>Security & Settlement</Text>
        <SettingsList />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#09090b" },
  scroll: { padding: 20, gap: 16 },
  header: { marginBottom: 8 },
  title: { fontSize: 24, fontWeight: "700", color: "#ffffff" },
  subtitle: { fontSize: 12, color: "#a1a1aa", marginTop: 2 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#ffffff", marginTop: 16 },
});`,
  },
  {
    id: 'social',
    name: 'Social Creator Profile',
    category: 'Social',
    description: 'Personal profile screen with verified badge, statistics summary, and settings preferences.',
    icon: Users,
    blocks: ['user-profile', 'settings-list', 'button'],
    dependencies: ['@nativra/cli', 'lucide-react-native'],
    nativeWindCode: `import React from "react";
import { SafeAreaView, ScrollView, View, Text, Pressable } from "react-native";
import { UserProfile } from "@/components/blocks/user-profile";
import { SettingsList } from "@/components/blocks/settings-list";

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <ScrollView contentContainerClassName="p-5 gap-5">
        <UserProfile
          name="Sophia Martinez"
          handle="@sophiam"
          bio="Senior Mobile Engineer building scalable design systems & fluid React Native mobile applications."
          verified
          isFollowing={false}
        />

        <Text className="text-sm font-bold text-white mt-2">Account Preferences</Text>
        <SettingsList />

        <Pressable className="w-full rounded-xl bg-zinc-900 border border-zinc-800 py-3.5 items-center active:bg-zinc-800">
          <Text className="text-xs font-semibold text-red-400">Log Out of All Devices</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}`,
    styleSheetCode: `import React from "react";
import { SafeAreaView, ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { UserProfile } from "@/components/blocks/user-profile";
import { SettingsList } from "@/components/blocks/settings-list";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <UserProfile
          name="Sophia Martinez"
          handle="@sophiam"
          bio="Senior Mobile Engineer building scalable design systems & fluid React Native mobile applications."
          verified
          isFollowing={false}
        />

        <Text style={styles.sectionTitle}>Account Preferences</Text>
        <SettingsList />

        <Pressable style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out of All Devices</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#09090b" },
  scroll: { padding: 20, gap: 20 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#ffffff", marginTop: 8 },
  logoutButton: { width: "100%", borderRadius: 12, backgroundColor: "#18181b", borderWidth: 1, borderColor: "#27272a", paddingVertical: 14, alignItems: "center" },
  logoutText: { fontSize: 12, fontWeight: "600", color: "#f87171" },
});`,
  },
  {
    id: 'auth',
    name: 'Auth & Onboarding Flow',
    category: 'Auth',
    description: 'Clean authentication and login screen with password verification and social provider shortcuts.',
    icon: Lock,
    blocks: ['login-form', 'button'],
    dependencies: ['@nativra/cli', 'lucide-react-native'],
    nativeWindCode: `import React from "react";
import { SafeAreaView, View, Text } from "react-native";
import { LoginForm } from "@/components/blocks/login-form";

export default function AuthScreen() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950 justify-center p-6">
      <View className="mb-6 items-center">
        <Text className="text-3xl font-extrabold text-white">Welcome Back</Text>
        <Text className="text-xs text-zinc-400 mt-1">Enter your credentials to access your account</Text>
      </View>
      <LoginForm />
    </SafeAreaView>
  );
}`,
    styleSheetCode: `import React from "react";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { LoginForm } from "@/components/blocks/login-form";

export default function AuthScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Enter your credentials to access your account</Text>
      </View>
      <LoginForm />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#09090b", justifyContent: "center", padding: 24 },
  header: { marginBottom: 24, alignItems: "center" },
  title: { fontSize: 28, fontWeight: "800", color: "#ffffff" },
  subtitle: { fontSize: 12, color: "#a1a1aa", marginTop: 4 },
});`,
  },
];

const DEFAULT_TEMPLATE: TemplateItem = TEMPLATES[0] ?? {
  id: 'ecommerce',
  name: 'Storefront',
  category: 'Commerce',
  description: '',
  icon: ShoppingBag,
  blocks: [],
  dependencies: [],
  nativeWindCode: '',
  styleSheetCode: '',
};

export function TemplatesExplorer({
  target = 'nativewind',
}: {
  target?: 'nativewind' | 'stylesheet';
}) {
  const [selectedId, setSelectedId] = useState(DEFAULT_TEMPLATE.id);
  const [copied, setCopied] = useState(false);

  const selectedTemplate = useMemo(() => {
    return TEMPLATES.find((t) => t.id === selectedId) ?? DEFAULT_TEMPLATE;
  }, [selectedId]);

  const IconComp = selectedTemplate.icon;

  const currentCode = useMemo(() => {
    return target === 'nativewind'
      ? selectedTemplate.nativeWindCode
      : selectedTemplate.styleSheetCode;
  }, [selectedTemplate, target]);

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentCode]);

  return (
    <div className="flex flex-1 overflow-hidden h-full">
      {/* Left: Template Catalog */}
      <aside className="w-80 shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-900/70 p-4 space-y-4 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-sky-400" />
            <span className="text-xs font-bold text-white">Starter Templates</span>
          </div>
          <span className="text-[10px] rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-400 font-mono">
            {TEMPLATES.length} templates
          </span>
        </div>

        <div className="space-y-2">
          {TEMPLATES.map((tmpl) => {
            const TmplIcon = tmpl.icon;
            const isSelected = tmpl.id === selectedId;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => setSelectedId(tmpl.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-sky-500/10 text-white shadow-sm ring-1 ring-sky-500'
                    : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sky-400 shrink-0">
                    <TmplIcon className="h-4 w-4" />
                  </div>
                  <div className="truncate flex-1">
                    <p className="text-xs font-bold text-white truncate">{tmpl.name}</p>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono">
                      {tmpl.category}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Center: Template Inspector & Code View */}
      <main className="flex-1 flex flex-col p-6 bg-zinc-950 bg-dot-grid overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto space-y-6">
          {/* Header Banner */}
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <IconComp className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{selectedTemplate.name}</h2>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                    Ready to Use
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                  {selectedTemplate.description}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={copyCode}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 active:scale-95 transition-transform shrink-0"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Code Copied!' : 'Copy Screen Code'}</span>
            </button>
          </div>

          {/* Included Blocks & Dependencies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 mb-2">
                <Layers className="h-3.5 w-3.5 text-sky-400" />
                <span>Included Blocks</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedTemplate.blocks.map((b) => (
                  <span
                    key={b}
                    className="rounded-md bg-zinc-800 border border-zinc-700/60 px-2 py-1 text-[11px] font-mono text-zinc-300"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 mb-2">
                <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                <span>Install Dependencies</span>
              </span>
              <code className="text-[11px] font-mono text-zinc-300 block bg-zinc-950 p-2 rounded border border-zinc-800 truncate">
                npx nativra add {selectedTemplate.blocks.join(' ')}
              </code>
            </div>
          </div>

          {/* Source Code Container */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden">
            <div className="flex h-11 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 text-xs font-mono text-zinc-400">
              <span>src/screens/{selectedTemplate.id}.tsx ({target === 'nativewind' ? 'NativeWind v4' : 'StyleSheet'})</span>
              <span className="text-[11px] text-zinc-500">Self-contained React Native Screen</span>
            </div>
            <pre className="p-4 text-xs font-mono text-zinc-300 leading-relaxed bg-zinc-950/60 overflow-x-auto max-h-[500px]">
              <code>{currentCode}</code>
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}
