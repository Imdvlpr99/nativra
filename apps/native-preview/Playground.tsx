/**
 * Playground runtime, loaded by the docs playground in a sandboxed iframe:
 *
 *   /preview/index.html?playground=1&target=stylesheet|nativewind
 *
 * The parent page posts the project's files ({ type: "nativra-playground:run", files, scheme });
 * this page compiles them in the browser (see playground/runtime.ts) and renders App.tsx with
 * react-native-web. Errors and console output are posted back so the playground can show them.
 * For the NativeWind target it loads Tailwind's browser build and the project's global.css, and
 * turns className props into CSS classes (see playground/modules.ts).
 */
import React, { useEffect, useState, type ComponentType } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { loadApp, PlaygroundError, type ProjectFiles } from "./playground/runtime";
import { scheme as schemeRef } from "./playground/modules";

const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
const target = params.get("target") === "nativewind" ? "nativewind" : "stylesheet";

type Outgoing =
  | { type: "nativra-playground:ready" }
  | { type: "nativra-playground:status"; ok: true }
  | { type: "nativra-playground:status"; ok: false; message: string; file?: string | undefined }
  | { type: "nativra-playground:log"; level: "log" | "warn" | "error"; text: string };

/** The iframe is sandboxed (opaque origin), so "*" is the only target; nothing sensitive is sent. */
function post(message: Outgoing) {
  if (typeof window !== "undefined" && window.parent !== window) window.parent.postMessage(message, "*");
}

// Forward the app's console output to the playground terminal, batched: code that logs on every
// render would otherwise post thousands of messages a second and freeze the editor page. At most
// FLUSH_LIMIT entries go out per tick; past QUEUE_LIMIT the rest are counted and summarized.
const FLUSH_MS = 100;
const FLUSH_LIMIT = 100;
const QUEUE_LIMIT = 500;
const logQueue: Array<{ level: "log" | "warn" | "error"; text: string }> = [];
let droppedLogs = 0;
let flushTimer: ReturnType<typeof setTimeout> | null = null;

function flushLogs() {
  flushTimer = null;
  for (const entry of logQueue.splice(0, FLUSH_LIMIT)) post({ type: "nativra-playground:log", ...entry });
  if (logQueue.length === 0 && droppedLogs > 0) {
    post({ type: "nativra-playground:log", level: "warn", text: `… ${droppedLogs} more console messages were dropped` });
    droppedLogs = 0;
  }
  if (logQueue.length > 0 || droppedLogs > 0) flushTimer = setTimeout(flushLogs, FLUSH_MS);
}

function queueLog(level: "log" | "warn" | "error", text: string) {
  if (logQueue.length >= QUEUE_LIMIT) droppedLogs++;
  else logQueue.push({ level, text });
  flushTimer ??= setTimeout(flushLogs, FLUSH_MS);
}

for (const level of ["log", "warn", "error"] as const) {
  const original = console[level].bind(console);
  console[level] = (...args: unknown[]) => {
    original(...args);
    const text = args
      .map((a) => {
        if (typeof a === "string") return a;
        try {
          return JSON.stringify(a);
        } catch {
          return String(a);
        }
      })
      .join(" ");
    queueLog(level, text.slice(0, 2000));
  };
}

// ---------------------------------------------------------------------------
// NativeWind: Tailwind's browser build plus the project's global.css
// ---------------------------------------------------------------------------

function ensureTailwind() {
  if (document.getElementById("nv-tailwind")) return;
  const script = document.createElement("script");
  script.id = "nv-tailwind";
  script.src = "playground-tailwind.js";
  document.head.appendChild(script);
}

/**
 * The project's global.css made to work in the browser for the chosen scheme. Nativra's theme
 * variables are renamed (--color-x -> --nv-color-x) so they don't collide with the Tailwind theme
 * variables of the same name, which point at them.
 */
function nativewindCss(globalCss: string, scheme: "light" | "dark"): { css: string; theme: string } {
  const css = globalCss
    .replace(/^\s*@tailwind[^;]*;\s*$/gm, "")
    .replace(/--color-/g, "--nv-color-")
    // Apply the dark palette always (dark) or never (light), whatever the OS prefers.
    .replace(/@media\s*\(prefers-color-scheme:\s*dark\)/g, scheme === "dark" ? "@media all" : "@media not all");
  const names = [...new Set([...globalCss.matchAll(/--color-([a-z0-9-]+)\s*:/g)].map((m) => m[1]!))];
  // Utilities are imported without a cascade layer (and without preflight, which react-native-web
  // replaces): react-native-web's base classes are unlayered, and unlayered CSS always beats a
  // layer, so layered utilities could never override a View's default background or a Text's color.
  const theme = [
    '@import "tailwindcss/theme";',
    '@import "tailwindcss/utilities";',
    `@theme inline {\n${names.map((n) => `  --color-${n}: rgb(var(--nv-color-${n}));`).join("\n")}\n}`,
  ].join("\n");
  return { css, theme };
}

function applyNativewindCss(files: ProjectFiles, scheme: "light" | "dark") {
  const globalPath = ["global.css", "src/global.css", "app/global.css"].find((p) => files[p] !== undefined);
  const { css, theme } = nativewindCss(globalPath ? files[globalPath]! : "", scheme);
  const upsert = (id: string, type: string, text: string) => {
    let el = document.getElementById(id) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = id;
      if (type) el.setAttribute("type", type);
      document.head.appendChild(el);
    }
    if (el.textContent !== text) el.textContent = text;
  };
  upsert("nv-theme", "text/tailwindcss", theme);
  upsert("nv-global", "", css);
  ensureTailwind();
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

class Boundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  override state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  override componentDidCatch(error: Error) {
    post({ type: "nativra-playground:status", ok: false, message: error.message });
  }
  override render() {
    return this.state.error ? <ErrorView message={this.state.error.message} /> : this.props.children;
  }
}

function ErrorView({ message, file }: { message: string; file?: string | undefined }) {
  return (
    <ScrollView contentContainerStyle={styles.errorWrap}>
      <View style={styles.errorBox}>
        <Text style={styles.errorTitle}>{file ? `Error in ${file}` : "Error"}</Text>
        <Text style={styles.errorText}>{message}</Text>
      </View>
    </ScrollView>
  );
}

export default function Playground() {
  const [run, setRun] = useState<{ App: ComponentType; id: number } | null>(null);
  const [error, setError] = useState<{ message: string; file?: string | undefined } | null>(null);
  const [scheme, setScheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    let id = 0;
    const onMessage = (e: MessageEvent) => {
      if (e.source !== window.parent) return;
      const data = e.data as { type?: string; files?: ProjectFiles; scheme?: string } | null;
      if (data?.type !== "nativra-playground:run" || !data.files) return;
      const nextScheme = data.scheme === "dark" ? "dark" : "light";
      schemeRef.current = nextScheme;
      setScheme(nextScheme);
      if (target === "nativewind") applyNativewindCss(data.files, nextScheme);
      try {
        const App = loadApp(data.files);
        setRun({ App, id: ++id });
        setError(null);
        post({ type: "nativra-playground:status", ok: true });
      } catch (err) {
        const message = (err as Error).message;
        const file = err instanceof PlaygroundError ? err.file : undefined;
        setError({ message, file });
        post({ type: "nativra-playground:status", ok: false, message, file });
      }
    };
    window.addEventListener("message", onMessage);
    post({ type: "nativra-playground:ready" });
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const background = scheme === "dark" ? "#09090b" : "#ffffff";
  return (
    <SafeAreaProvider>
      <View style={[styles.screen, { backgroundColor: background }]}>
        {/* A compile error keeps the last working app on screen (like fast refresh); the
            playground page shows the error itself. Only a first-run failure shows it here. */}
        {error && !run ? (
          <ErrorView message={error.message} file={error.file} />
        ) : run ? (
          // A new key remounts the app, so edits start from fresh state like a reload.
          <Boundary key={run.id}>
            <run.App />
          </Boundary>
        ) : (
          <Text style={styles.waiting}>Starting…</Text>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  waiting: { margin: 24, color: "#71717a", fontSize: 13 },
  errorWrap: { padding: 16 },
  errorBox: { borderRadius: 12, borderWidth: 1, borderColor: "#fca5a5", backgroundColor: "#fef2f2", padding: 14, gap: 6 },
  errorTitle: { color: "#991b1b", fontSize: 13, fontWeight: "700" },
  errorText: { color: "#7f1d1d", fontSize: 12, fontFamily: "monospace" },
});
