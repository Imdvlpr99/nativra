import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Installation Guide",
  description: "Get started with Nativra in your React Native or Expo project",
};

export default function InstallationPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-border pb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">
          Getting Started
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Installation
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          Set up Nativra in an existing or new Expo project in less than two minutes.
        </p>
      </div>

      <div className="space-y-10 text-foreground">
        {/* Step 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900">
              1
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Create or open your Expo project
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Nativra works seamlessly with Expo SDK 51+ and React Native 0.74+.
          </p>
          <pre className="rounded-xl border border-border bg-zinc-950 p-4 font-mono text-xs text-zinc-100 overflow-x-auto">
            npx create-expo-app@latest my-app --template default{"\n"}
            cd my-app
          </pre>
        </section>

        {/* Step 2 */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900">
              2
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Initialize Nativra
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Run the initialization command. It detects your package manager, TypeScript configuration, and prompts for your preferred styling target (NativeWind v4 or React Native StyleSheet).
          </p>
          <pre className="rounded-xl border border-border bg-zinc-950 p-4 font-mono text-xs text-sky-400 overflow-x-auto">
            npx nativra init
          </pre>
          <p className="text-xs text-muted-foreground">
            This creates a <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">nativra.json</code> configuration file in your project root.
          </p>
        </section>

        {/* Step 3 */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900">
              3
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Add components
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Install the components you need into your project with a single command:
          </p>
          <pre className="rounded-xl border border-border bg-zinc-950 p-4 font-mono text-xs text-sky-400 overflow-x-auto">
            npx nativra add button input card
          </pre>
          <p className="text-xs text-muted-foreground">
            Files are written directly into <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">components/ui/</code>.
          </p>
        </section>

        {/* Step 4 */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900">
              4
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Use in your screens
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Import components directly from your local components directory:
          </p>
          <div className="rounded-xl border border-border bg-zinc-950 p-4 font-mono text-xs text-zinc-100 overflow-x-auto">
{`import React from "react";
import { View } from "react-native";
import { Button } from "./components/ui/Button";
import { Card } from "./components/ui/Card";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
      <Card elevated padding="lg">
        <Button variant="primary" size="lg" onPress={() => console.log("Pressed!")}>
          Get Started
        </Button>
      </Card>
    </View>
  );
}`}
          </div>
        </section>
      </div>
    </div>
  );
}
