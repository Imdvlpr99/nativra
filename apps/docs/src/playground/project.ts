/**
 * The playground's in-memory Expo project: a flat map of project-relative paths to file
 * contents, with a starter for each styling target and per-browser persistence.
 */
export type ProjectFiles = Record<string, string>;
export type Target = "stylesheet" | "nativewind";

export interface PlaygroundState {
  target: Target;
  files: ProjectFiles;
}

const STORAGE_KEY = "nativra-playground-v1";

const PACKAGE_JSON = (target: Target) =>
  `${JSON.stringify(
    {
      name: "nativra-playground",
      private: true,
      main: "expo/AppEntry.js",
      dependencies: {
        expo: "~52.0.0",
        react: "18.3.1",
        "react-native": "0.76.5",
        ...(target === "nativewind" ? { nativewind: "^4.1.23", tailwindcss: "^3.4.17" } : {}),
      },
    },
    null,
    2
  )}\n`;

const TSCONFIG = `${JSON.stringify(
  { extends: "expo/tsconfig.base", compilerOptions: { strict: true, paths: { "@/*": ["./*"] } } },
  null,
  2
)}\n`;

export function nativraJson(target: Target, style = "soft"): string {
  return `${JSON.stringify(
    {
      $schema: "https://nativra.vercel.app/schema.json",
      version: 4,
      registries: [{ name: "default", url: "https://nativra.vercel.app" }],
      componentsDir: "components/ui",
      hooksDir: "hooks",
      utilsDir: "lib/utils",
      themesDir: "lib/themes",
      stylingTarget: target,
      aliasPrefix: "@/",
      style,
    },
    null,
    2
  )}\n`;
}

const APP_STYLESHEET = `import { StyleSheet, Text, View, useColorScheme } from "react-native";

// Try it: run this in the terminal below, then use the components here.
//
//   npx nativra-cli add button card
//
// import { Button } from "@/components/ui/Button";
// import { Card } from "@/components/ui/Card";

export default function App() {
  // Follows the preview's light/dark toggle (the device setting in a real app).
  const dark = useColorScheme() === "dark";
  return (
    <View style={styles.screen}>
      <Text style={[styles.title, { color: dark ? "#fafafa" : "#09090b" }]}>Hello from Nativra</Text>
      <Text style={[styles.body, { color: dark ? "#a1a1aa" : "#52525b" }]}>
        Edit App.tsx, or add a component from the terminal below. The preview updates as you type.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 8 },
  title: { fontSize: 24, fontWeight: "700" },
  body: { fontSize: 16, lineHeight: 24, textAlign: "center", maxWidth: 320 },
});
`;

const APP_NATIVEWIND = `import "./global.css";
import { Text, View, useColorScheme } from "react-native";

// Try it: run this in the terminal below, then use the components here.
//
//   npx nativra-cli add button card
//
// import { Button } from "@/components/ui/Button";
// import { Card } from "@/components/ui/Card";

export default function App() {
  // Follows the preview's light/dark toggle (the device setting in a real app).
  const dark = useColorScheme() === "dark";
  return (
    <View className="flex-1 items-center justify-center gap-2 p-6">
      <Text className={\`text-2xl font-bold \${dark ? "text-zinc-50" : "text-zinc-950"}\`}>Hello from Nativra</Text>
      <Text className={\`max-w-xs text-center text-base \${dark ? "text-zinc-400" : "text-zinc-600"}\`}>
        Edit App.tsx, or add a component from the terminal below. The preview updates as you type.
      </Text>
    </View>
  );
}
`;

const GLOBAL_CSS = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

const TAILWIND_CONFIG = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Nativra's semantic colors; the values come from the theme block in global.css.
      colors: {
        border: "rgb(var(--color-border) / <alpha-value>)",
        input: "rgb(var(--color-input) / <alpha-value>)",
        ring: "rgb(var(--color-ring) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        primary: { DEFAULT: "rgb(var(--color-primary) / <alpha-value>)", foreground: "rgb(var(--color-primary-foreground) / <alpha-value>)" },
        secondary: { DEFAULT: "rgb(var(--color-secondary) / <alpha-value>)", foreground: "rgb(var(--color-secondary-foreground) / <alpha-value>)" },
        muted: { DEFAULT: "rgb(var(--color-muted) / <alpha-value>)", foreground: "rgb(var(--color-muted-foreground) / <alpha-value>)" },
        accent: { DEFAULT: "rgb(var(--color-accent) / <alpha-value>)", foreground: "rgb(var(--color-accent-foreground) / <alpha-value>)" },
        destructive: { DEFAULT: "rgb(var(--color-destructive) / <alpha-value>)", foreground: "rgb(var(--color-destructive-foreground) / <alpha-value>)" },
        success: { DEFAULT: "rgb(var(--color-success) / <alpha-value>)", foreground: "rgb(var(--color-success-foreground) / <alpha-value>)" },
        warning: { DEFAULT: "rgb(var(--color-warning) / <alpha-value>)", foreground: "rgb(var(--color-warning-foreground) / <alpha-value>)" },
        info: { DEFAULT: "rgb(var(--color-info) / <alpha-value>)", foreground: "rgb(var(--color-info-foreground) / <alpha-value>)" },
        card: { DEFAULT: "rgb(var(--color-card) / <alpha-value>)", foreground: "rgb(var(--color-card-foreground) / <alpha-value>)" },
        popover: { DEFAULT: "rgb(var(--color-popover) / <alpha-value>)", foreground: "rgb(var(--color-popover-foreground) / <alpha-value>)" },
      },
    },
  },
  plugins: [],
};
`;

/** A fresh project for the target. */
export function starterProject(target: Target): ProjectFiles {
  const files: ProjectFiles = {
    "App.tsx": target === "nativewind" ? APP_NATIVEWIND : APP_STYLESHEET,
    "package.json": PACKAGE_JSON(target),
    "tsconfig.json": TSCONFIG,
    "nativra.json": nativraJson(target),
  };
  if (target === "nativewind") {
    files["global.css"] = GLOBAL_CSS;
    files["tailwind.config.js"] = TAILWIND_CONFIG;
  }
  return files;
}

export function loadState(): PlaygroundState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PlaygroundState>;
    if ((parsed.target !== "stylesheet" && parsed.target !== "nativewind") || typeof parsed.files !== "object" || !parsed.files) {
      return null;
    }
    return { target: parsed.target, files: parsed.files };
  } catch {
    return null;
  }
}

export function saveState(state: PlaygroundState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable (private mode): the project lasts for this visit only.
  }
}

export function clearState(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing stored.
  }
}
