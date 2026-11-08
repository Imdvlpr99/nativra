import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "React Native StyleSheet Guide — Zero-Dependency Native UI Styling",
  description:
    "Learn how to use Nativra components with pure React Native StyleSheet—zero CSS build steps, zero Babel plugins, and 100% native runtime speed.",
  alternates: {
    canonical: "/docs/styling/stylesheet",
  },
};

export default function StyleSheetGuidePage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-border pb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-300">
          Styling Target
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          React Native StyleSheet Guide
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          For teams who prefer standard React Native primitives without CSS build steps or Babel transforms. Zero runtime dependencies, native speed, full type safety.
        </p>
      </div>

      {/* Why StyleSheet */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Why Pure StyleSheet?
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
            <h3 className="font-semibold text-sm text-foreground">Zero Extra Dependencies</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No PostCSS, no Tailwind compiler, no Metro plugins. Works immediately in any vanilla React Native or Expo project.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
            <h3 className="font-semibold text-sm text-foreground">Peak Performance</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              React Native style objects are sent directly across the bridge or JSI without class string tokenization or runtime lookup.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
            <h3 className="font-semibold text-sm text-foreground">Dynamic Responsive Logic</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Easily calculate styles based on device window dimensions, orientation, and accessibility font scaling.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works in Nativra */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          How Nativra Implements StyleSheet Components
        </h2>
        <p className="text-sm text-muted-foreground">
          When you configure Nativra with the StyleSheet target, every component uses <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">StyleSheet.create()</code> and pairs with the standard <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">useColorScheme()</code> hook:
        </p>
        <div className="rounded-xl border border-border bg-zinc-950 p-4 font-mono text-xs text-zinc-200 overflow-x-auto">
{`import React from "react";
import { Pressable, Text, StyleSheet, useColorScheme } from "react-native";

export function Button({ variant = "default", children, ...props }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Pressable
      style={[
        styles.base,
        isDark ? styles.defaultDark : styles.defaultLight,
      ]}
      {...props}
    >
      <Text style={[styles.text, isDark ? styles.textDark : styles.textLight]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  defaultLight: { backgroundColor: "#18181b" },
  defaultDark: { backgroundColor: "#fafafa" },
  text: { fontSize: 14, fontWeight: "600" },
  textLight: { color: "#ffffff" },
  textDark: { color: "#18181b" },
});`}
        </div>
      </section>

      {/* Theme Integration */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Theming with StyleSheet
        </h2>
        <p className="text-sm text-muted-foreground">
          Nativra provides typed theme tokens that can be imported directly into your styles:
        </p>
        <pre className="rounded-xl border border-border bg-zinc-950 p-4 font-mono text-xs text-sky-400 overflow-x-auto">
          npx nativra-cli theme add midnight
        </pre>
        <p className="text-xs text-muted-foreground">
          This writes a typed TypeScript token file into your <code className="font-mono bg-muted px-1 py-0.5 rounded text-foreground">lib/themes/</code> directory.
        </p>
      </section>
    </div>
  );
}

