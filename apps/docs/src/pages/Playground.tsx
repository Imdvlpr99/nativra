import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Code2,
  Files,
  Maximize2,
  Moon,
  PackagePlus,
  PanelRightClose,
  PanelRightOpen,
  RefreshCw,
  RotateCcw,
  Smartphone,
  Sun,
  TerminalSquare,
  X,
} from "lucide-react";
import { Seo } from "@/lib/head";
import { PhoneMockup } from "@/components/PhoneMockup";
import { itemsOfType } from "@/lib/data";
import { FileTree } from "@/playground/FileTree";
import { AddPanel } from "@/playground/AddPanel";
import { Terminal } from "@/playground/Terminal";
import { Console, type ConsoleEntry } from "@/playground/Console";
import { Splitter } from "@/playground/Splitter";
import { PlaygroundShell, type Line } from "@/playground/cli";
import { clearState, loadState, saveState, starterProject, type ProjectFiles, type Target } from "@/playground/project";

// CodeMirror only loads in the browser, after the page is interactive.
const Editor = lazy(() => import("@/playground/Editor").then((m) => ({ default: m.Editor })));

type Status = { kind: "starting" } | { kind: "ok" } | { kind: "error"; message: string; file?: string | undefined };
type MobilePane = "code" | "preview" | "terminal" | "add";
type SidebarTab = "files" | "add";
type BottomTab = "terminal" | "console";

interface Layout {
  sidebar: number;
  preview: number;
  bottom: number;
  sidebarOpen: boolean;
  previewOpen: boolean;
  bottomOpen: boolean;
  frame: "device" | "fill";
}

const DEFAULT_LAYOUT: Layout = { sidebar: 256, preview: 400, bottom: 240, sidebarOpen: true, previewOpen: true, bottomOpen: true, frame: "device" };
const LAYOUT_KEY = "nativra-playground-layout";
const THEMES = itemsOfType("theme");
const STYLES = itemsOfType("style");

const WELCOME: Line[] = [
  { text: "Welcome to the Nativra playground: a real Expo project running in your browser.", tone: "accent" },
  { text: 'Install something from the registry, then use it in App.tsx. Type "help" for every command.', tone: "muted" },
];
const FIRST_STEPS = ["npx nativra-cli add button card", "npx nativra-cli list --type block", "npx nativra-cli style add ios", "help"];

/**
 * True at md+ widths. Only one layout is mounted, so there is one preview iframe and one editor.
 * Starts as desktop so the prerendered HTML matches the first client render.
 */
function useIsDesktop(): boolean {
  const [desktop, setDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

function loadLayout(): Layout {
  try {
    const raw = window.localStorage.getItem(LAYOUT_KEY);
    return raw ? { ...DEFAULT_LAYOUT, ...(JSON.parse(raw) as Partial<Layout>) } : DEFAULT_LAYOUT;
  } catch {
    return DEFAULT_LAYOUT;
  }
}

/** Ids from nativra.lock.json, and the theme/style that currently fill theme.ts and style.ts. */
function projectInfo(files: ProjectFiles) {
  let items: Record<string, { type?: string; files?: Record<string, string> }> = {};
  try {
    items = (JSON.parse(files["nativra.lock.json"] ?? "{}") as { items?: typeof items }).items ?? {};
  } catch {
    items = {};
  }
  const slot = (type: string, file: string) =>
    Object.entries(items).find(([, e]) => e.type === type && Object.keys(e.files ?? {}).some((k) => k.endsWith(file)))?.[0];
  let style: string | undefined;
  try {
    style = (JSON.parse(files["nativra.json"] ?? "{}") as { style?: string }).style;
  } catch {
    style = undefined;
  }
  return { installed: new Set(Object.keys(items)), theme: slot("theme", "theme.ts"), style: slot("style", "style.ts") ?? style };
}

const iconBtn =
  "inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground";
const selectCls =
  "h-8 cursor-pointer rounded-md border border-input bg-background pl-2 pr-7 text-xs text-foreground transition-colors duration-150 hover:border-foreground/30";

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (v: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex shrink-0 rounded-md border border-border bg-muted/60 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`cursor-pointer rounded px-2.5 py-1 text-xs transition-colors duration-150 ${
            value === o.value ? "bg-background font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  const tone =
    status.kind === "ok"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : status.kind === "error"
        ? "border-destructive/30 bg-destructive/10 text-destructive"
        : "border-border bg-muted text-muted-foreground";
  return (
    <span className={`inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium ${tone}`} aria-live="polite">
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${
          status.kind === "ok" ? "bg-emerald-500" : status.kind === "error" ? "bg-destructive" : "animate-pulse bg-muted-foreground motion-reduce:animate-none"
        }`}
      />
      {status.kind === "ok" ? "Running" : status.kind === "error" ? "Error" : "Starting"}
    </span>
  );
}

/**
 * The playground: an Expo project in the browser with a file explorer, a registry browser, an
 * editor, a live react-native-web preview (the docs' own preview app in playground mode), a
 * terminal running a browser build of nativra-cli, and the app's console.
 */
export default function Playground() {
  const [target, setTarget] = useState<Target>("stylesheet");
  const [files, setFilesState] = useState<ProjectFiles>(() => starterProject("stylesheet"));
  const [tabs, setTabs] = useState<string[]>(["App.tsx"]);
  const [active, setActive] = useState("App.tsx");
  const [lines, setLines] = useState<Array<Line & { id: number }>>([]);
  const [logs, setLogs] = useState<ConsoleEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const [scheme, setScheme] = useState<"light" | "dark">("light");
  const [status, setStatus] = useState<Status>({ kind: "starting" });
  const [pane, setPane] = useState<MobilePane>("code");
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("files");
  const [bottomTab, setBottomTab] = useState<BottomTab>("terminal");
  const [layout, setLayout] = useState<Layout>(DEFAULT_LAYOUT);
  const [reloadKey, setReloadKey] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const isDesktop = useIsDesktop();

  const filesRef = useRef(files);
  filesRef.current = files;
  const idRef = useRef(0);
  const frame = useRef<HTMLIFrameElement>(null);
  const frameReady = useRef(false);

  const info = useMemo(() => projectInfo(files), [files]);
  const patchLayout = (patch: Partial<Layout>) => setLayout((l) => ({ ...l, ...patch }));

  const print = useCallback((next: Line | Line[]) => {
    const list = Array.isArray(next) ? next : [next];
    setLines((prev) => [...prev, ...list.map((l) => ({ ...l, id: ++idRef.current }))].slice(-600));
  }, []);

  const setFiles = useCallback((next: ProjectFiles) => {
    filesRef.current = next;
    setFilesState(next);
  }, []);

  const shell = useMemo(
    () => new PlaygroundShell({ files: () => filesRef.current, setFiles, print, clear: () => setLines([]), setTarget }),
    [print, setFiles]
  );

  /** Runs a command and makes sure its output is visible. */
  const runCommand = useCallback(
    async (command: string) => {
      setBottomTab("terminal");
      setLayout((l) => (l.bottomOpen ? l : { ...l, bottomOpen: true }));
      print({ text: `~/app $ ${command}`, tone: "command" });
      setBusy(true);
      try {
        await shell.run(command);
      } finally {
        setBusy(false);
      }
    },
    [print, shell]
  );

  const openFile = useCallback((path: string) => {
    setTabs((t) => (t.includes(path) ? t : [...t, path]));
    setActive(path);
    setPane("code");
  }, []);

  const closeTab = (path: string) => {
    setTabs((t) => {
      const next = t.filter((p) => p !== path);
      if (active === path) setActive(next[next.length - 1] ?? "");
      return next;
    });
  };

  // Restore the project and layout, then run ?add=<id> from an item page's "Open in playground".
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setTarget(saved.target);
      setFiles(saved.files);
    }
    setLayout(loadLayout());
    setScheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    print(WELCOME);
    setHydrated(true);
    const add = new URLSearchParams(window.location.search).get("add");
    if (add && /^[a-z][a-z0-9-]*$/.test(add)) void runCommand(`npx nativra-cli add ${add}`);
    // Runs once on mount.
  }, []);

  useEffect(() => {
    if (hydrated) saveState({ target, files });
  }, [files, target, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(LAYOUT_KEY, JSON.stringify(layout));
    } catch {
      // Storage unavailable: the layout lasts for this visit only.
    }
  }, [layout, hydrated]);

  // Close tabs of files the CLI removed; keep something open.
  useEffect(() => {
    setTabs((t) => {
      const next = t.filter((p) => files[p] !== undefined);
      return next.length > 0 ? next : files["App.tsx"] !== undefined ? ["App.tsx"] : next;
    });
    setActive((a) => (files[a] !== undefined ? a : files["App.tsx"] !== undefined ? "App.tsx" : Object.keys(files).sort()[0] ?? ""));
  }, [files]);

  // Preview messaging.
  const previewSrc = `/preview/index.html?playground=1&target=${target}`;
  useEffect(() => {
    frameReady.current = false;
    setStatus({ kind: "starting" });
  }, [previewSrc, reloadKey]);

  const send = useCallback(() => {
    if (!frameReady.current) return;
    frame.current?.contentWindow?.postMessage({ type: "nativra-playground:run", files: filesRef.current, scheme }, "*");
  }, [scheme]);

  useEffect(() => {
    const t = setTimeout(send, 300);
    return () => clearTimeout(t);
  }, [files, send]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow) return;
      const data = e.data as { type?: string; ok?: boolean; message?: string; file?: string; level?: string; text?: string } | null;
      if (data?.type === "nativra-playground:ready") {
        frameReady.current = true;
        send();
      } else if (data?.type === "nativra-playground:status") {
        setStatus(data.ok ? { kind: "ok" } : { kind: "error", message: data.message ?? "Unknown error", file: data.file });
      } else if (data?.type === "nativra-playground:log" && typeof data.text === "string") {
        const level: ConsoleEntry["level"] = data.level === "error" ? "error" : data.level === "warn" ? "warn" : "log";
        const text = data.text;
        setLogs((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.text === text && last.level === level) return [...prev.slice(0, -1), { ...last, count: last.count + 1 }];
          return [...prev, { id: ++idRef.current, level, text, count: 1 }].slice(-300);
        });
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [send]);

  const reset = () => {
    clearState();
    setFiles(starterProject(target));
    setTabs(["App.tsx"]);
    setActive("App.tsx");
    setLines([]);
    setLogs([]);
    print(WELCOME);
  };

  const switchTarget = (next: Target) => {
    if (next === target) return;
    setTarget(next);
    setFiles(starterProject(next));
    setTabs(["App.tsx"]);
    setActive("App.tsx");
    setLogs([]);
    print({ text: `Switched to a fresh ${next === "nativewind" ? "NativeWind" : "StyleSheet"} project.`, tone: "success" });
  };

  const errorCount = logs.filter((l) => l.level === "error").reduce((n, l) => n + l.count, 0);
  const suggestions = hydrated && info.installed.size === 0 ? FIRST_STEPS : [];
  const show = (p: MobilePane) => (pane === p ? "flex" : "hidden");
  // On a phone the preview already is phone-sized: no frame inside the frame.
  const framed = isDesktop && layout.frame === "device";

  const previewFrame = (
    <iframe
      ref={frame}
      key={`${previewSrc}#${reloadKey}`}
      src={previewSrc}
      title="Live preview of the playground app"
      // Opaque origin: the project's code can't reach the docs site's storage or cookies.
      sandbox="allow-scripts"
      // 1px taller than its slot: hides the sub-pixel seam a scaled iframe leaves at its edge.
      className="absolute inset-x-0 top-0 h-[calc(100%+1px)] w-full border-0"
    />
  );

  // -- Regions ----------------------------------------------------------------

  const sidebar = (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <div className="flex h-9 shrink-0 items-center border-b border-border px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {sidebarTab === "files" ? "Explorer" : "Add from the registry"}
      </div>
      <div className="min-h-0 flex-1">
        {sidebarTab === "files" ? (
          <FileTree paths={Object.keys(files)} selected={active} onSelect={openFile} />
        ) : (
          <AddPanel installed={info.installed} busy={busy} onAdd={(id) => void runCommand(`npx nativra-cli add ${id}`)} />
        )}
      </div>
    </div>
  );

  const editor = (
    <div className="flex h-full min-h-0 flex-col bg-code">
      <div className="flex h-9 shrink-0 items-stretch overflow-x-auto border-b border-code-border bg-[hsl(225_18%_6%)]" role="tablist" aria-label="Open files">
        {tabs.map((path) => {
          const selected = path === active;
          const name = path.split("/").pop();
          return (
            <div
              key={path}
              className={`group flex shrink-0 items-center border-r border-code-border ${selected ? "bg-code text-code-fg" : "text-code-muted hover:text-code-fg"}`}
            >
              <button
                type="button"
                role="tab"
                aria-selected={selected}
                title={path}
                onClick={() => setActive(path)}
                onAuxClick={(e) => e.button === 1 && closeTab(path)}
                className={`flex h-full cursor-pointer items-center gap-1.5 pl-3 pr-1 font-mono text-xs ${selected ? "shadow-[inset_0_2px_0_0_hsl(var(--brand))]" : ""}`}
              >
                {name}
                {status.kind === "error" && status.file === path && <span className="h-1.5 w-1.5 rounded-full bg-red-400" aria-label="has an error" />}
              </button>
              <button
                type="button"
                onClick={() => closeTab(path)}
                aria-label={`Close ${name}`}
                className="mr-1 inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded text-code-muted opacity-60 transition-opacity hover:bg-white/10 hover:text-code-fg hover:opacity-100 group-hover:opacity-100"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
      {/* Phones have no file tree beside the editor: pick files here. */}
      <div className="border-b border-code-border px-3 py-1.5 md:hidden">
        <label htmlFor="pg-file" className="sr-only">
          Open file
        </label>
        <select id="pg-file" value={active} onChange={(e) => openFile(e.target.value)} className="w-full rounded border border-code-border bg-code px-2 py-1 font-mono text-xs text-code-fg">
          {Object.keys(files)
            .sort()
            .map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
        </select>
      </div>
      <div className="relative min-h-0 flex-1" role="tabpanel" aria-label={active}>
        {hydrated && active && files[active] !== undefined ? (
          <Suspense fallback={<p className="p-4 font-mono text-xs text-code-muted">Loading editor…</p>}>
            <Editor key={active} path={active} value={files[active]!} onChange={(next) => setFiles({ ...filesRef.current, [active]: next })} />
          </Suspense>
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center font-mono text-xs text-code-muted">
            {hydrated ? "No file open. Pick one in the explorer." : "Loading…"}
          </div>
        )}
      </div>
    </div>
  );

  const bottom = (
    <div className="flex h-full min-h-0 flex-col bg-code">
      <div className="flex h-9 shrink-0 items-center gap-1 border-b border-code-border px-2">
        <div role="tablist" aria-label="Panel" className="flex items-center gap-1">
          {(
            [
              ["terminal", "Terminal", TerminalSquare, 0],
              ["console", "Console", Code2, errorCount],
            ] as const
          ).map(([id, label, Icon, badge]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={bottomTab === id}
              onClick={() => {
                setBottomTab(id);
                patchLayout({ bottomOpen: true });
              }}
              className={`inline-flex h-7 cursor-pointer items-center gap-1.5 rounded px-2 text-xs transition-colors duration-150 ${
                bottomTab === id ? "bg-white/[0.06] text-code-fg" : "text-code-muted hover:text-code-fg"
              }`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {label}
              {badge > 0 && (
                <span className="rounded-full bg-red-500/20 px-1.5 text-[10px] font-semibold text-red-300" aria-label={`${badge} errors`}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => (bottomTab === "terminal" ? setLines([]) : setLogs([]))}
            className="cursor-pointer rounded px-2 py-1 text-xs text-code-muted transition-colors duration-150 hover:bg-white/[0.06] hover:text-code-fg"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => patchLayout({ bottomOpen: !layout.bottomOpen })}
            aria-label={layout.bottomOpen ? "Collapse panel" : "Expand panel"}
            aria-expanded={layout.bottomOpen}
            className="hidden h-7 w-7 cursor-pointer items-center justify-center rounded text-code-muted transition-colors duration-150 hover:bg-white/[0.06] hover:text-code-fg md:inline-flex"
          >
            {layout.bottomOpen ? <ChevronDown className="h-4 w-4" aria-hidden="true" /> : <ChevronUp className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1" role="tabpanel">
        {bottomTab === "terminal" ? (
          <Terminal lines={lines} busy={busy} suggestions={suggestions} onCommand={(c) => void runCommand(c)} />
        ) : (
          <Console entries={logs} />
        )}
      </div>
    </div>
  );

  const preview = (
    <div className="flex h-full min-h-0 flex-col bg-muted/40">
      <div className="flex h-9 shrink-0 items-center gap-1 border-b border-border bg-surface px-2">
        <span className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Preview</span>
        <div className="ml-auto flex items-center gap-0.5">
          {isDesktop && (
          <button
            type="button"
            onClick={() => patchLayout({ frame: layout.frame === "device" ? "fill" : "device" })}
            className={iconBtn}
            aria-label={layout.frame === "device" ? "Fill the panel" : "Show in a phone frame"}
            title={layout.frame === "device" ? "Fill the panel" : "Show in a phone frame"}
          >
            {layout.frame === "device" ? <Maximize2 className="h-4 w-4" aria-hidden="true" /> : <Smartphone className="h-4 w-4" aria-hidden="true" />}
          </button>
          )}
          <button
            type="button"
            onClick={() => setScheme((s) => (s === "dark" ? "light" : "dark"))}
            className={iconBtn}
            aria-label={`Preview in ${scheme === "dark" ? "light" : "dark"} mode`}
            title={`Preview in ${scheme === "dark" ? "light" : "dark"} mode`}
          >
            {scheme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
          </button>
          <button type="button" onClick={() => setReloadKey((k) => k + 1)} className={iconBtn} aria-label="Reload the preview" title="Reload the preview">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => patchLayout({ previewOpen: false })}
            className={`${iconBtn} hidden md:inline-flex`}
            aria-label="Hide the preview"
            title="Hide the preview"
          >
            <PanelRightClose className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className={`relative flex min-h-0 flex-1 items-center justify-center ${framed ? "p-3" : ""}`}>
        {framed ? (
          <PhoneMockup scheme={scheme}>{previewFrame}</PhoneMockup>
        ) : (
          <div className="relative h-full w-full bg-background">{previewFrame}</div>
        )}
        {status.kind === "error" && (
          <div role="alert" className="absolute inset-x-3 bottom-3 rounded-lg border border-destructive/30 bg-background/95 p-3 shadow-lg backdrop-blur">
            <p className="text-xs font-semibold text-destructive">{status.file ? `Error in ${status.file}` : "The app crashed"}</p>
            <p className="mt-1 line-clamp-4 font-mono text-[11.5px] leading-snug text-foreground">{status.message}</p>
            {status.file && files[status.file] !== undefined && (
              <button
                type="button"
                onClick={() => openFile(status.file!)}
                className="mt-2 cursor-pointer text-xs font-medium text-foreground underline underline-offset-4 hover:text-brand"
              >
                Open {status.file}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const railButton = (tab: SidebarTab, label: string, Icon: typeof Files) => {
    const on = layout.sidebarOpen && sidebarTab === tab;
    return (
      <button
        type="button"
        aria-pressed={on}
        aria-label={label}
        title={label}
        onClick={() => {
          if (on) patchLayout({ sidebarOpen: false });
          else {
            setSidebarTab(tab);
            patchLayout({ sidebarOpen: true });
          }
        }}
        className={`relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md transition-colors duration-150 ${
          on ? "text-foreground before:absolute before:inset-y-2 before:-left-1 before:w-0.5 before:rounded-full before:bg-brand" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </button>
    );
  };

  return (
    <>
      <Seo
        title="Playground"
        description="Try Nativra in your browser: a real React Native project with a file explorer, a registry browser, an editor, a live preview and a terminal running nativra-cli. No install."
        path="/playground"
      />
      <h1 className="sr-only">Nativra playground</h1>
      <div className="flex h-[calc(100dvh-var(--header-height))] min-h-[520px] flex-col border-t border-border bg-background">
        {/* Top bar */}
        {/* Phones: title, status and Reset on one row, the project controls scrolling below.
            md+: everything on one row. */}
        <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-border bg-surface px-3 py-2">
          <div className="order-1 mr-1 flex min-w-0 items-baseline gap-2">
            <span className="text-sm font-semibold text-foreground">Playground</span>
            <span className="hidden truncate text-xs text-muted-foreground lg:inline">Expo · react-native-web · nativra-cli</span>
          </div>
          <div className="order-3 -mx-3 flex w-[calc(100%+1.5rem)] items-center gap-2 overflow-x-auto px-3 md:order-2 md:mx-0 md:w-auto md:overflow-visible md:px-0">
          <Segmented
            label="Styling target"
            value={target}
            onChange={switchTarget}
            options={[
              { value: "stylesheet", label: "StyleSheet" },
              { value: "nativewind", label: "NativeWind" },
            ]}
          />
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="pg-theme">
              Theme
            </label>
            <select
              id="pg-theme"
              className={selectCls}
              value={info.theme ?? ""}
              disabled={busy}
              onChange={(e) => e.target.value && void runCommand(`npx nativra-cli theme add ${e.target.value} --overwrite`)}
              title="Color theme (runs nativra theme add)"
            >
              {!info.theme && <option value="">Theme</option>}
              {THEMES.map((t) => (
                <option key={t.id} value={t.id}>
                  Theme: {t.name}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="pg-style">
              Style
            </label>
            <select
              id="pg-style"
              className={selectCls}
              value={info.style ?? "soft"}
              disabled={busy}
              onChange={(e) => void runCommand(`npx nativra-cli style add ${e.target.value}`)}
              title="UI style (runs nativra style add)"
            >
              {STYLES.map((s) => (
                <option key={s.id} value={s.id}>
                  Style: {s.name.replace(/ style$/, "")}
                </option>
              ))}
            </select>
          </div>
          </div>
          <div className="order-2 ml-auto flex items-center gap-2 md:order-3">
            <StatusPill status={status} />
            <button
              type="button"
              onClick={reset}
              title="Start over with a fresh project"
              aria-label="Reset the project"
              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Desktop workspace */}
        {isDesktop ? (
        <div className="flex min-h-0 flex-1">
          <nav aria-label="Playground views" className="flex w-12 shrink-0 flex-col items-center gap-1 border-r border-border bg-surface py-2">
            {railButton("files", "Explorer", Files)}
            {railButton("add", "Add from the registry", PackagePlus)}
          </nav>

          {layout.sidebarOpen && (
            <>
              <div className="min-h-0 shrink-0 border-r border-border" style={{ width: layout.sidebar }}>
                {sidebar}
              </div>
              <Splitter
                orientation="vertical"
                label="Resize the sidebar"
                value={layout.sidebar}
                min={200}
                max={420}
                onChange={(v) => patchLayout({ sidebar: v })}
                onReset={() => patchLayout({ sidebar: DEFAULT_LAYOUT.sidebar })}
              />
            </>
          )}

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="min-h-0 flex-1">{editor}</div>
            {layout.bottomOpen ? (
              <>
                <Splitter
                  orientation="horizontal"
                  label="Resize the terminal"
                  value={layout.bottom}
                  min={120}
                  max={560}
                  invert
                  onChange={(v) => patchLayout({ bottom: v })}
                  onReset={() => patchLayout({ bottom: DEFAULT_LAYOUT.bottom })}
                />
                <div className="min-h-0 shrink-0 border-t border-code-border" style={{ height: layout.bottom }}>
                  {bottom}
                </div>
              </>
            ) : (
              <div className="shrink-0 border-t border-code-border">{bottom}</div>
            )}
          </div>

          {layout.previewOpen ? (
            <>
              <Splitter
                orientation="vertical"
                label="Resize the preview"
                value={layout.preview}
                min={320}
                max={720}
                invert
                onChange={(v) => patchLayout({ preview: v })}
                onReset={() => patchLayout({ preview: DEFAULT_LAYOUT.preview })}
              />
              <section aria-label="Preview" className="min-h-0 shrink-0 border-l border-border" style={{ width: layout.preview }}>
                {preview}
              </section>
            </>
          ) : (
            <button
              type="button"
              onClick={() => patchLayout({ previewOpen: true })}
              className="flex w-10 shrink-0 cursor-pointer flex-col items-center gap-2 border-l border-border bg-surface py-3 text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground"
              aria-label="Show the preview"
            >
              <PanelRightOpen className="h-4 w-4" aria-hidden="true" />
              <span className="[writing-mode:vertical-rl]">Preview</span>
            </button>
          )}
        </div>

        ) : (
        /* Phone workspace: one pane at a time, switched from the tab bar below. The preview stays
           mounted (hidden) so the app keeps running while you edit. */
        <div className="flex min-h-0 flex-1 flex-col">
          <div className={`${show("code")} min-h-0 flex-1 flex-col`}>{editor}</div>
          <div className={`${show("preview")} min-h-0 flex-1 flex-col`}>{preview}</div>
          <div className={`${show("terminal")} min-h-0 flex-1 flex-col`}>{bottom}</div>
          <div className={`${show("add")} min-h-0 flex-1 flex-col`}>
            <AddPanel installed={info.installed} busy={busy} onAdd={(id) => void runCommand(`npx nativra-cli add ${id}`)} />
          </div>
          <nav
            aria-label="Playground views"
            className="grid shrink-0 grid-cols-4 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]"
          >
            {(
              [
                ["code", "Code", Code2],
                ["preview", "Preview", Smartphone],
                ["terminal", "Terminal", TerminalSquare],
                ["add", "Add", PackagePlus],
              ] as const
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                aria-pressed={pane === id}
                onClick={() => setPane(id)}
                className={`flex h-14 cursor-pointer flex-col items-center justify-center gap-0.5 text-[11px] transition-colors duration-150 ${
                  pane === id ? "font-medium text-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 ${pane === id ? "text-brand" : ""}`} aria-hidden="true" />
                {label}
              </button>
            ))}
          </nav>
        </div>
        )}
      </div>
    </>
  );
}
