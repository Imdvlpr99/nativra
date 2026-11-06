import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NativeWind v4 Guide",
  description: "Complete setup and configuration guide for using NativeWind v4 with Nativra",
};

export default function NativeWindGuidePage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-border pb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">
          Styling Target
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          NativeWind v4 Guide
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          NativeWind v4 brings Tailwind CSS compilation to React Native with zero runtime style overhead, CSS variables, and full dark mode support.
        </p>
      </div>

      {/* Step 1: Install Dependencies */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          1. Install NativeWind and Tailwind CSS
        </h2>
        <p className="text-sm text-muted-foreground">
          In your Expo or React Native project root, install NativeWind v4 and its peer dependencies:
        </p>
        <pre className="rounded-xl border border-border bg-zinc-950 p-4 font-mono text-xs text-sky-400 overflow-x-auto">
          npx expo install nativewind react-native-reanimated react-native-safe-area-context{"\n"}
          npm install --save-dev tailwindcss@^3.4.0
        </pre>
      </section>

      {/* Step 2: Configure tailwind.config.js */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          2. Configure tailwind.config.js
        </h2>
        <p className="text-sm text-muted-foreground">
          Include your <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">components/ui</code> folder in the content array so Tailwind generates styles for your Nativra components:
        </p>
        <div className="rounded-xl border border-border bg-zinc-950 p-4 font-mono text-xs text-zinc-200 overflow-x-auto">
{`/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
      },
    },
  },
  plugins: [],
};`}
        </div>
      </section>

      {/* Step 3: Global CSS Setup */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          3. Set Up global.css
        </h2>
        <p className="text-sm text-muted-foreground">
          Create a <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">global.css</code> file in your project root with the standard Tailwind directives:
        </p>
        <div className="rounded-xl border border-border bg-zinc-950 p-4 font-mono text-xs text-zinc-200 overflow-x-auto">
{`@tailwind base;
@tailwind components;
@tailwind utilities;`}
        </div>
        <p className="text-xs text-muted-foreground">
          Import this file at the top of your root layout (e.g., <code className="font-mono bg-muted px-1 py-0.5 rounded text-foreground">app/_layout.tsx</code>):
        </p>
        <pre className="rounded-lg border border-border bg-zinc-950 p-3 font-mono text-xs text-zinc-300">
          import &quot;../global.css&quot;;
        </pre>
      </section>

      {/* Step 4: Initialize Nativra with NativeWind Target */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          4. Initialize Nativra for NativeWind
        </h2>
        <p className="text-sm text-muted-foreground">
          Run the Nativra initialization command and choose <strong className="text-foreground">NativeWind</strong>:
        </p>
        <pre className="rounded-xl border border-border bg-zinc-950 p-4 font-mono text-xs text-sky-400 overflow-x-auto">
          npx nativra init
        </pre>
        <p className="text-xs text-muted-foreground">
          Now, whenever you run <code className="font-mono bg-muted px-1 py-0.5 rounded text-foreground">npx nativra add button</code>, you receive class-based NativeWind components configured with your design tokens.
        </p>
      </section>
    </div>
  );
}

