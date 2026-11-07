"use client";

import { useMemo, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { Control } from "@nativra/studio-schema";
import { generateInstallCommand, generateUsage } from "@nativra/codegen";
import { getFixtures } from "@nativra/preview-runtime";
import { PreviewCanvas } from "../components/PreviewCanvas";

function WorkbenchLoader({ name }: { name: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-zinc-500 bg-zinc-950 font-mono text-xs">
      <div className="flex items-center gap-2 mb-2">
        <span className="h-2 w-2 rounded-full bg-sky-400 animate-ping" />
        <span className="text-zinc-300 font-semibold">Loading {name}...</span>
      </div>
      <p className="text-[11px] text-zinc-600">Initializing workbench modules</p>
    </div>
  );
}

const ComponentPlayground = dynamic(
  () => import("../components/ComponentPlayground").then((mod) => mod.ComponentPlayground),
  { loading: () => <WorkbenchLoader name="Component Playground" /> }
);
const IconExplorer = dynamic(
  () => import("../components/IconExplorer").then((mod) => mod.IconExplorer),
  { loading: () => <WorkbenchLoader name="Icon Explorer" /> }
);
import {
  Sun,
  Moon,
  Copy,
  Check,
  Code2,
  Sliders,
  Terminal,
  Activity,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Trash2,
  X,
  FolderOpen,
  ShieldCheck,
  Play,
} from "lucide-react";

export interface StudioItem {
  id: string;
  name: string;
  type: string;
  description?: string;
  stylingTargets: string[];
  files: { path: string; target?: string | undefined; content?: string | undefined }[];
  controls: Control[];
}

type Values = Record<string, string | boolean | number>;

interface EventLogEntry {
  id: string;
  time: string;
  event: string;
  detail: string;
}

const THEME_PALETTES = {
  zinc: { primary: "#18181b", primaryFg: "#ffffff", accent: "#3b82f6", name: "Zinc" },
  "dark-slate": { primary: "#0284c7", primaryFg: "#ffffff", accent: "#38bdf8", name: "Dark Slate" },
  midnight: { primary: "#7c3aed", primaryFg: "#ffffff", accent: "#c084fc", name: "Midnight" },
} as const;

type ThemeKey = keyof typeof THEME_PALETTES;

export default function StudioClient({ items }: { items: StudioItem[] }) {
  const [studioMode, setStudioMode] = useState<"components" | "playground" | "icons">("components");
  const [id, setId] = useState(items[0]?.id ?? "button");
  const [target, setTarget] = useState<"nativewind" | "stylesheet">("nativewind");
  const [values, setValues] = useState<Values>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "component" | "block" | "hook">("all");
  const [zoom, setZoom] = useState<number>(100);
  const [canvasMode, setCanvasMode] = useState<"light" | "dark" | "dots">("dots");
  const [activeTheme, setActiveTheme] = useState<ThemeKey>("zinc");
  const [activeTab, setActiveTab] = useState<"props" | "code" | "usage" | "events">("props");
  const [events, setEvents] = useState<EventLogEntry[]>([]);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Interactive component local states
  const [buttonPressedCount, setButtonPressedCount] = useState(0);
  const [interactiveInputText, setInteractiveInputText] = useState("");
  const [disclosureOpen, setDisclosureOpen] = useState(false);

  const item = useMemo(() => items.find((i) => i.id === id) ?? items[0], [items, id]);

  const logEvent = useCallback((event: string, detail: string) => {
    const entry: EventLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      time: new Date().toLocaleTimeString(),
      event,
      detail,
    };
    setEvents((prev) => [entry, ...prev.slice(0, 49)]);
  }, []);

  const copyToClipboard = useCallback((text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    logEvent("Clipboard", `Copied ${type} to clipboard`);
    setTimeout(() => setCopiedType(null), 2000);
  }, [logEvent]);

  const currentTheme = THEME_PALETTES[activeTheme] ?? THEME_PALETTES.zinc;

  const merged = useMemo<Values>(() => {
    const out: Values = {};
    for (const c of item?.controls ?? []) {
      if (c.type === "color") continue;
      out[c.propKey] = (values[c.propKey] ?? c.defaultValue ?? (c.type === "boolean" ? false : "")) as string | boolean | number;
    }
    return out;
  }, [item, values]);

  const file = useMemo(() => item?.files.find((f) => !f.target || f.target === target) ?? item?.files[0], [item, target]);
  const set = useCallback((k: string, val: string | boolean | number) => setValues((p) => ({ ...p, [k]: val })), []);

  const usage = useMemo(() => item ? generateUsage(item.id, merged) : "", [item, merged]);
  const installCmd = useMemo(() => item ? generateInstallCommand(item.id) : "", [item]);
  const fixtures = useMemo(() => item ? getFixtures(item.id) : [], [item]);

  const filteredItems = useMemo(() => {
    return items.filter((i) => {
      const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || i.type === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, categoryFilter]);

  // Render Component in simulated mobile screen
  function renderHarness() {
    if (!item) return null;
    const variant = String(merged.variant ?? "default");

    if (item.id === "button") {
      const disabled = Boolean(merged.disabled);
      const loading = Boolean(merged.loading);
      const size = String(merged.size ?? "md");
      const label = String(merged.children || "Button");

      const sizePadding: Record<string, string> = {
        xs: "py-1 px-2.5 text-xs",
        sm: "py-1.5 px-3 text-xs",
        md: "py-2.5 px-4 text-sm",
        lg: "py-3 px-5 text-base",
        xl: "py-3.5 px-6 text-lg",
      };

      const defaultVariantStyle: { bg: string; text: string; border?: string | undefined } = {
        bg: currentTheme.primary,
        text: currentTheme.primaryFg,
      };
      const variantStyles: Record<string, { bg: string; text: string; border?: string | undefined }> = {
        default: defaultVariantStyle,
        primary: { bg: currentTheme.accent, text: "#ffffff" },
        secondary: { bg: "#f4f4f5", text: "#18181b", border: "border border-zinc-200" },
        destructive: { bg: "#ef4444", text: "#ffffff" },
        outline: { bg: "transparent", text: "#18181b", border: "border border-zinc-300" },
        ghost: { bg: "transparent", text: "#18181b" },
        link: { bg: "transparent", text: currentTheme.accent },
      };

      const currentStyle = variantStyles[variant] ?? defaultVariantStyle;

      return (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <button
            type="button"
            disabled={disabled || loading}
            onClick={() => {
              setButtonPressedCount((c) => c + 1);
              logEvent("onPress", `Button clicked (${variant}, count: ${buttonPressedCount + 1})`);
            }}
            style={{ backgroundColor: currentStyle.bg, color: currentStyle.text }}
            className={`flex items-center justify-center gap-2 rounded-xl font-semibold shadow-sm transition-all duration-150 active:scale-95 disabled:pointer-events-none disabled:opacity-50 ${
              sizePadding[size] ?? sizePadding.md
            } ${currentStyle.border ?? ""}`}
          >
            {loading && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            <span>{label}</span>
          </button>
          {buttonPressedCount > 0 && (
            <span className="text-xs text-zinc-500">
              Simulated presses: <strong className="text-zinc-700">{buttonPressedCount}</strong>
            </span>
          )}
        </div>
      );
    }

    if (item.id === "badge") {
      const size = String(merged.size ?? "md");
      const label = String(merged.label || "Badge");
      const defaultBadgeStyle: { bg: string; text: string; border?: string | undefined } = {
        bg: currentTheme.primary,
        text: currentTheme.primaryFg,
      };
      const badgeStyles: Record<string, { bg: string; text: string; border?: string | undefined }> = {
        default: defaultBadgeStyle,
        primary: { bg: "#e0f2fe", text: "#0369a1" },
        secondary: { bg: "#f4f4f5", text: "#3f3f46" },
        destructive: { bg: "#fee2e2", text: "#b91c1c" },
        outline: { bg: "transparent", text: "#3f3f46", border: "border border-zinc-300" },
      };
      const sizeStyles: Record<string, string> = {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      };
      const cur = badgeStyles[variant] ?? defaultBadgeStyle;

      return (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <span
            style={{ backgroundColor: cur.bg, color: cur.text }}
            className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeStyles[size] ?? sizeStyles.md} ${
              cur.border ?? ""
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75" />
            <span>{label}</span>
          </span>
        </div>
      );
    }

    if (item.id === "input") {
      const err = Boolean(merged.error);
      const disabled = Boolean(merged.disabled);
      const label = String(merged.label || "Email");
      const placeholder = String(merged.placeholder || "you@example.com");
      const errMsg = String(merged.errorMessage || "Invalid email address");

      return (
        <div className="w-full max-w-xs space-y-1.5 py-4">
          <label className="text-xs font-medium text-zinc-700">{label}</label>
          <div className="relative">
            <input
              type="text"
              disabled={disabled}
              value={interactiveInputText}
              placeholder={placeholder}
              onChange={(e) => {
                setInteractiveInputText(e.target.value);
                logEvent("onChangeText", `Value: "${e.target.value}"`);
              }}
              className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-150 disabled:bg-zinc-100 disabled:opacity-60 ${
                err
                  ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  : "border-zinc-300 focus:border-zinc-900 focus:ring-2 focus:ring-zinc-100"
              }`}
            />
            {interactiveInputText && (
              <button
                type="button"
                onClick={() => {
                  setInteractiveInputText("");
                  logEvent("onClear", "Input cleared");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {err && <p className="text-xs text-red-500">{errMsg}</p>}
        </div>
      );
    }

    if (item.id === "card") {
      const elevated = Boolean(merged.elevated);
      const padding = String(merged.padding ?? "md");
      const padClass = { sm: "p-3", md: "p-5", lg: "p-6" }[padding] ?? "p-5";

      return (
        <div
          className={`w-full max-w-sm rounded-2xl border border-zinc-200 bg-white transition-all duration-200 ${
            elevated ? "shadow-xl shadow-zinc-200/60" : "shadow-sm"
          } ${padClass}`}
        >
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                <FolderOpen className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900">Project Card</h4>
                <p className="text-xs text-zinc-500">Updated 2 minutes ago</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
              Active
            </span>
          </div>
          <p className="py-2 text-xs leading-relaxed text-zinc-600">
            Card component with native elevation shadow and structured layout.
          </p>
          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => logEvent("onPress", "Card cancel pressed")}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => logEvent("onPress", "Card submit pressed")}
              style={{ backgroundColor: currentTheme.primary, color: currentTheme.primaryFg }}
              className="rounded-lg px-3 py-1.5 text-xs font-medium shadow-sm hover:opacity-90"
            >
              Confirm
            </button>
          </div>
        </div>
      );
    }

    if (item.id === "checkbox") {
      const checked = Boolean(merged.checked);
      const disabled = Boolean(merged.disabled);
      const label = String(merged.label || "I agree to the terms");

      return (
        <div
          onClick={() => {
            if (disabled) return;
            set("checked", !checked);
            logEvent("onCheckedChange", `Checked: ${!checked}`);
          }}
          className={`flex cursor-pointer items-center gap-3 py-4 ${disabled ? "pointer-events-none opacity-50" : ""}`}
        >
          <div
            style={{
              backgroundColor: checked ? currentTheme.primary : "transparent",
              borderColor: checked ? currentTheme.primary : "#d4d4d8",
            }}
            className="flex h-5 w-5 items-center justify-center rounded-md border transition-colors duration-150"
          >
            {checked && <Check className="h-3.5 w-3.5 text-white stroke-[2.5]" />}
          </div>
          <span className="text-sm font-medium text-zinc-800">{label}</span>
        </div>
      );
    }

    if (item.id === "switch") {
      const value = Boolean(merged.value);
      const disabled = Boolean(merged.disabled);

      return (
        <div className="flex flex-col items-center gap-3 py-8">
          <div
            onClick={() => {
              if (disabled) return;
              set("value", !value);
              logEvent("onValueChange", `Switch: ${!value}`);
            }}
            style={{ backgroundColor: value ? currentTheme.accent : "#e4e4e7" }}
            className={`flex h-7 w-12 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 ${
              disabled ? "pointer-events-none opacity-50" : ""
            } ${value ? "justify-end" : "justify-start"}`}
          >
            <div className="h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200" />
          </div>
          <span className="text-xs text-zinc-500">Status: {value ? "Enabled (true)" : "Disabled (false)"}</span>
        </div>
      );
    }

    if (item.id === "separator") {
      const vertical = merged.orientation === "vertical";
      return (
        <div className="flex h-40 w-full items-center justify-center p-6">
          {vertical ? (
            <div className="flex h-full items-center gap-3">
              <span className="text-xs text-zinc-400">Left</span>
              <div className="h-full w-px bg-zinc-200" />
              <span className="text-xs text-zinc-400">Right</span>
            </div>
          ) : (
            <div className="w-full space-y-3">
              <span className="text-xs text-zinc-400">Top Content</span>
              <div className="h-px w-full bg-zinc-200" />
              <span className="text-xs text-zinc-400">Bottom Content</span>
            </div>
          )}
        </div>
      );
    }

    if (item.id === "skeleton") {
      const w = Number(merged.width) || 200;
      const h = Number(merged.height) || 24;
      const radius = String(merged.radius ?? "md");
      const rMap: Record<string, string> = {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-xl",
        full: "rounded-full",
      };

      return (
        <div className="space-y-4 py-8">
          <div
            style={{ width: `${w}px`, height: `${h}px` }}
            className={`animate-pulse bg-zinc-200 ${rMap[radius] ?? "rounded-md"}`}
          />
          <div className="space-y-2">
            <div className="h-3 w-48 animate-pulse rounded bg-zinc-200/70" />
            <div className="h-3 w-36 animate-pulse rounded bg-zinc-200/50" />
          </div>
        </div>
      );
    }

    if (item.id === "spinner") {
      const size = String(merged.size ?? "md");
      const sMap: Record<string, string> = { sm: "h-5 w-5 border-2", md: "h-8 w-8 border-3", lg: "h-12 w-12 border-4" };
      return (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          <div
            style={{ borderTopColor: currentTheme.primary }}
            className={`animate-spin rounded-full border-zinc-200 ${sMap[size] ?? sMap.md}`}
          />
          <span className="text-xs text-zinc-500">Loading spinner ({size})</span>
        </div>
      );
    }

    if (item.id === "avatar") {
      const size = String(merged.size ?? "md");
      const fallback = String(merged.fallback || "NV");
      const sMap: Record<string, { box: string; font: string; dot: string }> = {
        sm: { box: "h-8 w-8", font: "text-xs", dot: "h-2 w-2" },
        md: { box: "h-11 w-11", font: "text-sm", dot: "h-2.5 w-2.5" },
        lg: { box: "h-16 w-16", font: "text-lg", dot: "h-3.5 w-3.5" },
        xl: { box: "h-20 w-20", font: "text-xl", dot: "h-4 w-4" },
      };
      const cur = sMap[size] ?? { box: "h-11 w-11", font: "text-sm", dot: "h-2.5 w-2.5" };

      return (
        <div className="flex flex-col items-center justify-center gap-3 py-8">
          <div className="relative">
            <div
              style={{ backgroundColor: "#f4f4f5", color: "#18181b" }}
              className={`flex items-center justify-center rounded-full font-bold shadow-inner ${cur.box} ${cur.font}`}
            >
              {fallback.slice(0, 2).toUpperCase()}
            </div>
            <span
              className={`absolute bottom-0 right-0 rounded-full bg-emerald-500 ring-2 ring-white ${cur.dot}`}
            />
          </div>
          <span className="text-xs text-zinc-500">Avatar with online status</span>
        </div>
      );
    }

    if (item.id === "text") {
      const textVariant = String(merged.variant ?? "p");
      const content = String(merged.children || "The quick brown fox jumps over the lazy dog.");
      const styleClasses: Record<string, string> = {
        h1: "text-2xl font-bold tracking-tight text-zinc-900",
        h2: "text-xl font-bold tracking-tight text-zinc-900",
        h3: "text-lg font-semibold text-zinc-900",
        p: "text-sm text-zinc-700 leading-relaxed",
        lead: "text-base font-normal text-zinc-600",
        muted: "text-xs text-zinc-500",
        code: "text-xs font-mono bg-zinc-100 text-zinc-800 p-2 rounded-lg border border-zinc-200",
      };

      return (
        <div className="max-w-xs text-center py-6">
          <p className={styleClasses[textVariant] ?? styleClasses.p}>{content}</p>
        </div>
      );
    }

    if (item.id === "label") {
      const labelText = String(merged.children || "Email address");
      const required = Boolean(merged.required);
      const disabled = Boolean(merged.disabled);

      return (
        <div className={`flex items-center gap-1.5 py-4 ${disabled ? "opacity-50" : ""}`}>
          <span className="text-sm font-semibold text-zinc-800">{labelText}</span>
          {required && <span className="text-sm font-bold text-red-500">*</span>}
        </div>
      );
    }

    if (item.id === "empty-state") {
      const title = String(merged.title || "No Projects Found");
      const desc = String(merged.description || "Get started by creating your first project item.");
      const actionLabel = String(merged.actionLabel || "Create Project");
      const showAction = Boolean(merged.showAction !== false);

      return (
        <div className="w-full max-w-sm rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/70 p-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 shadow-sm">
            <FolderOpen className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
          <p className="mt-1 text-xs text-zinc-500 leading-relaxed">{desc}</p>
          {showAction && (
            <button
              type="button"
              onClick={() => logEvent("onPress", `Empty state CTA pressed: "${actionLabel}"`)}
              style={{ backgroundColor: currentTheme.primary, color: currentTheme.primaryFg }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium shadow-sm transition-transform active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{actionLabel}</span>
            </button>
          )}
        </div>
      );
    }

    if (item.id === "login-form") {
      const title = String(merged.title || "Welcome back");
      const subtitle = String(merged.subtitle || "Enter your credentials to access your account");
      const submitLabel = String(merged.submitLabel || "Sign In");
      const loading = Boolean(merged.loading);
      const disabled = Boolean(merged.disabled);

      return (
        <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-md">
          <div className="mb-4 text-center">
            <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
            <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-zinc-700">Email</label>
              <input
                type="email"
                defaultValue="developer@nativra.dev"
                disabled={disabled}
                className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-100"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-700">Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); logEvent("onPress", "Forgot password clicked"); }} className="text-[11px] text-sky-600 hover:underline">
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                defaultValue="••••••••"
                disabled={disabled}
                className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 text-xs text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:bg-zinc-100"
              />
            </div>
            <button
              type="button"
              disabled={disabled || loading}
              onClick={() => logEvent("onSubmit", "Login form submitted")}
              style={{ backgroundColor: currentTheme.primary, color: currentTheme.primaryFg }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              {loading && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
              <span>{submitLabel}</span>
            </button>
          </div>
        </div>
      );
    }

    if (item.id === "use-disclosure") {
      const triggerLabel = String(merged.triggerLabel || "Open Bottom Sheet");
      const sheetTitle = String(merged.sheetTitle || "Interactive Sheet");

      return (
        <div className="relative w-full max-w-sm min-h-[500px] flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/60 p-6 overflow-hidden">
          {/* Central Trigger Card */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-zinc-800 shadow-sm border border-zinc-200/80">
              <Layers className="h-6 w-6 text-zinc-700" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">Modal Bottom Sheet</h3>
              <p className="mt-1 text-xs text-zinc-500 max-w-[260px] leading-relaxed">
                Triggered via the <code>useDisclosure()</code> hook state (isOpen: <strong className="text-zinc-700">{disclosureOpen ? "true" : "false"}</strong>)
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setDisclosureOpen(true);
                logEvent("onOpen", "useDisclosure opened modal sheet");
              }}
              style={{ backgroundColor: currentTheme.primary, color: currentTheme.primaryFg }}
              className="mt-2 flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold shadow-sm transition-transform active:scale-95 hover:opacity-90"
            >
              <Layers className="h-4 w-4" />
              <span>{triggerLabel}</span>
            </button>
          </div>

          {/* Full-width Modal Bottom Sheet Overlay */}
          {disclosureOpen && (
            <div
              onClick={() => {
                setDisclosureOpen(false);
                logEvent("onClose", "useDisclosure dismissed via backdrop");
              }}
              className="absolute inset-0 z-30 flex flex-col justify-end bg-black/50 backdrop-blur-[2px] transition-all duration-300 animate-in fade-in"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full rounded-t-3xl bg-white p-5 shadow-2xl border-t border-zinc-100 animate-in slide-in-from-bottom duration-200"
              >
                {/* Drag handle */}
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-zinc-300" />

                <div className="mb-3 flex items-center justify-between border-b border-zinc-100 pb-2.5">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">{sheetTitle}</h4>
                    <p className="text-[11px] text-zinc-500">useDisclosure() bottom drawer</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDisclosureOpen(false);
                      logEvent("onClose", "useDisclosure closed via X");
                    }}
                    className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-xs leading-relaxed text-zinc-600">
                  This bottom drawer was triggered via the <code>useDisclosure()</code> hook state. It provides <code>isOpen</code>, <code>onOpen()</code>, <code>onClose()</code>, and <code>onToggle()</code>.
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDisclosureOpen(false);
                      logEvent("onClose", "Cancelled sheet");
                    }}
                    className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDisclosureOpen(false);
                      logEvent("onConfirm", "Sheet action completed");
                    }}
                    style={{ backgroundColor: currentTheme.accent }}
                    className="flex-1 rounded-xl py-2.5 text-xs font-semibold text-white shadow-sm hover:opacity-90 active:scale-95 transition-transform"
                  >
                    Confirm & Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (item.id === "user-profile") {
      const name = String(merged.name || "Sophia Martinez");
      const handle = String(merged.handle || "@sophiam");
      const bio = String(merged.bio || "Senior Mobile Engineer building design systems & fluid React Native mobile apps.");
      const verified = Boolean(merged.verified !== false);
      const isFollowing = Boolean(merged.isFollowing);

      return (
        <div className="w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="relative">
              <div
                style={{ backgroundColor: currentTheme.primary, color: currentTheme.primaryFg }}
                className="flex h-14 w-14 items-center justify-center rounded-full text-base font-bold shadow-inner"
              >
                {name.slice(0, 2).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            {verified && (
              <span
                style={{ backgroundColor: "#e0f2fe", color: "#0369a1" }}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified Pro</span>
              </span>
            )}
          </div>

          <div className="mt-3.5">
            <h3 className="text-base font-bold text-zinc-900">{name}</h3>
            <p className="text-xs text-zinc-500 font-mono">{handle}</p>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600">{bio}</p>
          </div>

          <div className="my-3.5 h-px w-full bg-zinc-200" />

          <div className="flex items-center justify-around py-1 text-center">
            <div>
              <p className="text-sm font-black text-zinc-900">14.2k</p>
              <p className="text-[10px] text-zinc-500">Followers</p>
            </div>
            <div className="h-6 w-px bg-zinc-200" />
            <div>
              <p className="text-sm font-black text-zinc-900">420</p>
              <p className="text-[10px] text-zinc-500">Following</p>
            </div>
            <div className="h-6 w-px bg-zinc-200" />
            <div>
              <p className="text-sm font-black text-zinc-900">38</p>
              <p className="text-[10px] text-zinc-500">Projects</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => {
                set("isFollowing", !isFollowing);
                logEvent("onFollow", `Following toggled to: ${!isFollowing}`);
              }}
              style={
                isFollowing
                  ? { border: "1px solid #d4d4d8", color: "#18181b", backgroundColor: "transparent" }
                  : { backgroundColor: currentTheme.primary, color: currentTheme.primaryFg }
              }
              className="flex-1 rounded-xl py-2 text-xs font-semibold transition-all active:scale-95 shadow-sm"
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
            <button
              type="button"
              onClick={() => logEvent("onMessage", "Message button pressed")}
              className="flex-1 rounded-xl border border-zinc-200 bg-zinc-100 py-2 text-xs font-semibold text-zinc-800 transition-all hover:bg-zinc-200 active:scale-95"
            >
              Message
            </button>
          </div>
        </div>
      );
    }

    if (item.id === "settings-list") {
      const title = String(merged.title || "Preferences");
      const notifications = Boolean(merged.notifications !== false);
      const darkMode = Boolean(merged.darkMode);
      const biometrics = Boolean(merged.biometrics !== false);

      return (
        <div className="w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-5 shadow-lg">
          <div className="mb-2">
            <h3 className="text-base font-bold text-zinc-900">{title}</h3>
            <p className="text-xs text-zinc-500">Manage your mobile app experience</p>
          </div>

          <div className="my-2 h-px w-full bg-zinc-200" />

          {/* Row 1: Notifications */}
          <div className="flex items-center justify-between py-2.5">
            <div className="pr-2">
              <p className="text-xs font-semibold text-zinc-900">Push Notifications</p>
              <p className="text-[11px] text-zinc-500">Receive instant project alerts</p>
            </div>
            <div
              onClick={() => {
                set("notifications", !notifications);
                logEvent("onToggle", `Notifications: ${!notifications}`);
              }}
              style={{ backgroundColor: notifications ? currentTheme.accent : "#e4e4e7" }}
              className={`flex h-6 w-11 cursor-pointer items-center rounded-full p-0.5 transition-colors ${
                notifications ? "justify-end" : "justify-start"
              }`}
            >
              <div className="h-5 w-5 rounded-full bg-white shadow-sm" />
            </div>
          </div>

          <div className="h-px w-full bg-zinc-100" />

          {/* Row 2: Dark Mode */}
          <div className="flex items-center justify-between py-2.5">
            <div className="pr-2">
              <p className="text-xs font-semibold text-zinc-900">Dark Theme</p>
              <p className="text-[11px] text-zinc-500">Midnight dark UI palette</p>
            </div>
            <div
              onClick={() => {
                set("darkMode", !darkMode);
                logEvent("onToggle", `Dark mode: ${!darkMode}`);
              }}
              style={{ backgroundColor: darkMode ? currentTheme.accent : "#e4e4e7" }}
              className={`flex h-6 w-11 cursor-pointer items-center rounded-full p-0.5 transition-colors ${
                darkMode ? "justify-end" : "justify-start"
              }`}
            >
              <div className="h-5 w-5 rounded-full bg-white shadow-sm" />
            </div>
          </div>

          <div className="h-px w-full bg-zinc-100" />

          {/* Row 3: Biometrics */}
          <div className="flex items-center justify-between py-2.5">
            <div className="pr-2">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-semibold text-zinc-900">Face ID & Security</p>
                <span className="rounded bg-sky-100 px-1 py-0.5 text-[9px] font-bold text-sky-700">Protected</span>
              </div>
              <p className="text-[11px] text-zinc-500">Biometric app lock</p>
            </div>
            <div
              onClick={() => {
                set("biometrics", !biometrics);
                logEvent("onToggle", `Biometrics: ${!biometrics}`);
              }}
              style={{ backgroundColor: biometrics ? currentTheme.accent : "#e4e4e7" }}
              className={`flex h-6 w-11 cursor-pointer items-center rounded-full p-0.5 transition-colors ${
                biometrics ? "justify-end" : "justify-start"
              }`}
            >
              <div className="h-5 w-5 rounded-full bg-white shadow-sm" />
            </div>
          </div>

          <div className="h-px w-full bg-zinc-100" />

          {/* Row 4: Account Details Navigation */}
          <div
            onClick={() => logEvent("onNavigate", "Account details clicked")}
            className="flex cursor-pointer items-center justify-between py-2.5 hover:opacity-75 transition-opacity"
          >
            <div>
              <p className="text-xs font-semibold text-zinc-900">Account Details</p>
              <p className="text-[11px] text-zinc-500">Password, 2FA, session tokens</p>
            </div>
            <ChevronRight className="h-4 w-4 text-zinc-400" />
          </div>
        </div>
      );
    }

    if (item.id === "pricing-card") {
      const planName = String(merged.planName || "Pro Mobile");
      const price = String(merged.price || "$19");
      const period = String(merged.period || "/ month, billed yearly");
      const popular = Boolean(merged.popular !== false);
      const buttonText = String(merged.buttonText || "Start 14-Day Free Trial");

      return (
        <div className="w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-900">{planName}</h3>
            {popular && (
              <span
                style={{ backgroundColor: "#e0f2fe", color: "#0369a1" }}
                className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              >
                Most Popular
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-zinc-500">Complete mobile UI infrastructure for production Expo & RN apps.</p>

          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-zinc-900">{price}</span>
            <span className="text-xs text-zinc-500">{period}</span>
          </div>

          <div className="my-4 h-px w-full bg-zinc-200" />

          <div className="space-y-2.5 text-xs text-zinc-700">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>12 foundation mobile components</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Dual NativeWind v4 & StyleSheet</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Source-first ownership, 0 bloat</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Interactive studio prop inspector</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => logEvent("onSubscribe", `Subscribed to ${planName} (${price})`)}
            style={{ backgroundColor: currentTheme.primary, color: currentTheme.primaryFg }}
            className="mt-6 w-full rounded-xl py-2.5 text-xs font-semibold shadow-sm transition-transform active:scale-95 hover:opacity-95"
          >
            {buttonText}
          </button>
        </div>
      );
    }

    if (item.id === "metric-card") {
      const title = String(merged.title || "Monthly Active Users");
      const value = String(merged.value || "48,290");
      const change = String(merged.change || "+24.8%");
      const positive = Boolean(merged.positive !== false);
      const timeframe = String(merged.timeframe || "vs last month");

      return (
        <div className="w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{title}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                positive ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
              }`}
            >
              {change}
            </span>
          </div>

          <div className="mt-3">
            <h2 className="text-3xl font-black tracking-tight text-zinc-900">{value}</h2>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-500">
            <span>{timeframe}</span>
            <span className="font-medium text-emerald-600">High organic retention</span>
          </div>
        </div>
      );
    }

    if (item.id === "alert") {
      const alertVariant = String(merged.variant || "info");
      const title = String(merged.title || "Update Available");
      const description = String(merged.description || "A new version of Nativra mobile UI is ready to install.");
      const dismissible = Boolean(merged.dismissible !== false);

      const defaultAlertTheme = {
        bg: "bg-sky-50 dark:bg-sky-950/40",
        border: "border-sky-200 dark:border-sky-800/60",
        title: "text-sky-900 dark:text-sky-200",
        desc: "text-sky-700 dark:text-sky-300",
        badge: "text-sky-500",
      };

      const variantThemes: Record<string, typeof defaultAlertTheme> = {
        default: { bg: "bg-zinc-100 dark:bg-zinc-900", border: "border-zinc-200 dark:border-zinc-800", title: "text-zinc-900 dark:text-zinc-100", desc: "text-zinc-600 dark:text-zinc-400", badge: "text-zinc-500" },
        info: defaultAlertTheme,
        success: { bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-200 dark:border-emerald-800/60", title: "text-emerald-900 dark:text-emerald-200", desc: "text-emerald-700 dark:text-emerald-300", badge: "text-emerald-500" },
        warning: { bg: "bg-amber-50 dark:bg-amber-950/40", border: "border-amber-200 dark:border-amber-800/60", title: "text-amber-900 dark:text-amber-200", desc: "text-amber-700 dark:text-amber-300", badge: "text-amber-500" },
        destructive: { bg: "bg-red-50 dark:bg-red-950/40", border: "border-red-200 dark:border-red-800/60", title: "text-red-900 dark:text-red-200", desc: "text-red-700 dark:text-red-300", badge: "text-red-500" },
      };

      const th = variantThemes[alertVariant] ?? defaultAlertTheme;

      return (
        <div className={`w-full max-w-sm rounded-2xl border p-4 shadow-sm flex items-start gap-3 ${th.bg} ${th.border}`}>
          <div className="flex-1 space-y-1">
            <h4 className={`text-sm font-bold ${th.title}`}>{title}</h4>
            <p className={`text-xs leading-relaxed ${th.desc}`}>{description}</p>
          </div>
          {dismissible && (
            <button
              type="button"
              onClick={() => logEvent("onClose", "Alert dismissed")}
              className={`p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 ${th.badge} text-xs font-bold`}
            >
              ✕
            </button>
          )}
        </div>
      );
    }

    if (item.id === "progress") {
      const val = Math.min(100, Math.max(0, Number(merged.value ?? 65)));
      const pSize = String(merged.size || "md");
      const pVariant = String(merged.variant || "primary");

      const sizeHeights: Record<string, string> = {
        sm: "h-1.5",
        md: "h-2.5",
        lg: "h-4",
      };

      const variantColors: Record<string, string> = {
        default: "bg-zinc-900 dark:bg-zinc-100",
        primary: "bg-sky-500",
        success: "bg-emerald-500",
        destructive: "bg-red-500",
      };

      return (
        <div className="w-full max-w-xs space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-zinc-500">Progress Task</span>
            <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{val}%</span>
          </div>
          <div className={`w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden ${sizeHeights[pSize] ?? sizeHeights.md}`}>
            <div
              className={`h-full rounded-full transition-all duration-300 ${variantColors[pVariant] ?? variantColors.primary}`}
              style={{ width: `${val}%` }}
            />
          </div>
        </div>
      );
    }

    if (item.id === "slider") {
      const val = Number(merged.value ?? 50);
      const min = Number(merged.min ?? 0);
      const max = Number(merged.max ?? 100);
      const disabled = Boolean(merged.disabled);

      return (
        <div className="w-full max-w-xs space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-zinc-500">Volume Level</span>
            <span className="font-mono font-bold text-sky-500">{val} / {max}</span>
          </div>
          <input
            type="range"
            min={min}
            max={max}
            disabled={disabled}
            value={val}
            onChange={(e) => {
              const next = Number(e.target.value);
              setValues((prev) => ({ ...prev, value: String(next) }));
              logEvent("onValueChange", `Slider value: ${next}`);
            }}
            className="w-full h-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 appearance-none cursor-pointer accent-sky-500 disabled:opacity-50"
          />
        </div>
      );
    }

    if (item.id === "tabs") {
      const active = String(merged.value || "overview");
      const tabVariant = String(merged.variant || "pill");
      const tabItems = [
        { value: "overview", label: "Overview", badge: "3" },
        { value: "activity", label: "Activity" },
        { value: "settings", label: "Settings" },
      ];

      return (
        <div className="w-full max-w-xs">
          <div
            className={`w-full flex items-center p-1 ${
              tabVariant === "pill"
                ? "rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
                : "border-b border-zinc-200 dark:border-zinc-800"
            }`}
          >
            {tabItems.map((t) => {
              const isSel = t.value === active;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => {
                    setValues((prev) => ({ ...prev, value: t.value }));
                    logEvent("onTabChange", `Tab: "${t.value}"`);
                  }}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    tabVariant === "pill"
                      ? isSel
                        ? "bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-zinc-50 font-bold"
                        : "text-zinc-500 hover:text-zinc-300"
                      : isSel
                      ? "border-b-2 border-sky-500 text-sky-600 dark:text-sky-400 pb-2 -mb-px font-bold"
                      : "text-zinc-500 hover:text-zinc-300 pb-2"
                  }`}
                >
                  <span>{t.label}</span>
                  {t.badge && (
                    <span className="text-[10px] px-1 rounded-full bg-sky-500/15 text-sky-600 font-mono">
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (item.id === "order-summary") {
      const orderNum = String(merged.orderNumber || "#NV-88219");
      const sub = String(merged.subtotal || "$108.00");
      const disc = String(merged.discount || "-$20.00");
      const code = String(merged.voucherCode || "LAUNCH50");
      const tot = String(merged.total || "$96.80");
      const btn = String(merged.buttonLabel || "Proceed to Payment");

      return (
        <div className="w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Order Summary</h3>
            <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-zinc-600 dark:text-zinc-400">
              {orderNum}
            </span>
          </div>

          <div className="mt-4 space-y-2 border-b border-zinc-100 dark:border-zinc-800 pb-4 text-xs">
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Subtotal</span>
              <span className="font-mono text-zinc-900 dark:text-zinc-100">{sub}</span>
            </div>
            {disc && (
              <div className="flex justify-between items-center">
                <span className="text-emerald-600 font-medium flex items-center gap-1">
                  Discount <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 px-1 rounded font-mono">{code}</span>
                </span>
                <span className="font-mono text-emerald-600 font-bold">{disc}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>Shipping</span>
              <span className="text-emerald-600 font-medium">Free</span>
            </div>
          </div>

          <div className="mt-4 mb-5 flex items-baseline justify-between">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Total Due</span>
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-50 font-mono">{tot}</span>
          </div>

          <button
            type="button"
            onClick={() => logEvent("onCheckout", `Processing payment for ${tot}`)}
            className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 font-bold text-white text-xs shadow-md shadow-sky-500/20 active:scale-95 transition-all"
          >
            {btn}
          </button>
        </div>
      );
    }

    if (item.id === "notification-item") {
      const sender = String(merged.senderName || "Marcus Vance");
      const action = String(merged.actionText || "requested feedback on");
      const res = String(merged.targetResource || "Design System Spec");
      const time = String(merged.timeAgo || "12m ago");
      const unread = Boolean(merged.unread !== false);
      const cat = String(merged.category || "Workspace");

      return (
        <div
          onClick={() => logEvent("onPress", `Opened notification from ${sender}`)}
          className={`w-full max-w-sm p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.98] ${
            unread
              ? "bg-sky-50/60 border-sky-200 dark:bg-sky-950/20 dark:border-sky-800/40"
              : "bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow">
                MV
              </div>
              {unread && (
                <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-sky-500 border-2 border-white dark:border-zinc-900" />
              )}
            </div>

            <div className="flex-1 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {cat}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">{time}</span>
              </div>
              <p className="text-zinc-800 dark:text-zinc-200 leading-snug">
                <strong className="text-zinc-900 dark:text-zinc-50">{sender} </strong>
                {action}{" "}
                <span className="font-semibold text-sky-600 dark:text-sky-400">{res}</span>
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (item.id === "stat-progress-card") {
      const gTitle = String(merged.goalTitle || "Weekly Workout Goal");
      const cur = String(merged.currentValue || "4");
      const tar = String(merged.targetValue || "5 sessions");
      const pct = Math.min(100, Math.max(0, Number(merged.progressPercent ?? 80)));
      const strk = String(merged.streakDays || "14");

      return (
        <div className="w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-5 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{gTitle}</span>
            <span className="rounded-full bg-sky-100 dark:bg-sky-950/60 px-2 py-0.5 text-[11px] font-bold text-sky-700 dark:text-sky-300">
              🔥 {strk}d Streak
            </span>
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-zinc-900 dark:text-zinc-50 font-mono">{cur}</span>
              <span className="text-xs text-zinc-500">/ {tar}</span>
            </div>
            <span className="text-sm font-bold text-sky-500 font-mono">{pct}%</span>
          </div>

          <div className="mt-3 h-3 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-2 text-[11px] text-zinc-500">
            <span>Sessions completed</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">On track for target</span>
          </div>
        </div>
      );
    }

    return (
      <div className="p-8 text-center text-xs text-zinc-500">
        Preview renderer for <strong>{item.name}</strong>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-zinc-800">
      {/* Top Header Bar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3 lg:px-4 backdrop-blur gap-2 lg:gap-4 overflow-hidden">
        {/* Brand Left */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-white font-black text-sm border border-zinc-700 shrink-0 shadow-sm">
            N
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 leading-tight">
              <span className="text-sm font-bold tracking-tight whitespace-nowrap text-white">Nativra Studio</span>
              <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400 border border-emerald-500/20 whitespace-nowrap hidden sm:inline-block">
                Live
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 whitespace-nowrap hidden xl:block leading-none mt-0.5">
              Source-First React Native Workbench
            </p>
          </div>
        </div>

        {/* Center Studio Tool Switcher */}
        <nav className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-950/70 p-1 shrink-0">
          {[
            { id: "components" as const, label: "Components", icon: Layers },
            { id: "playground" as const, label: "Playground", icon: Play },
            { id: "icons" as const, label: "Icons", icon: Sparkles },
          ].map(({ id: mId, label, icon: Icon }) => (
            <button
              key={mId}
              type="button"
              onClick={() => setStudioMode(mId)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                studioMode === mId
                  ? "bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700/60"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          {/* Target Switcher */}
          <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 text-xs shrink-0 whitespace-nowrap">
            <button
              onClick={() => setTarget("nativewind")}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors whitespace-nowrap ${
                target === "nativewind" ? "bg-sky-500/20 text-sky-300 border border-sky-500/30" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              NativeWind v4
            </button>
            <button
              onClick={() => setTarget("stylesheet")}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors whitespace-nowrap ${
                target === "stylesheet" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              StyleSheet
            </button>
          </div>

          {/* Theme Preset Selector */}
          <select
            value={activeTheme}
            onChange={(e) => setActiveTheme(e.target.value as ThemeKey)}
            className="rounded-lg border border-zinc-800 bg-zinc-800 px-2 py-1 text-xs text-zinc-200 outline-none hover:border-zinc-700 shrink-0"
          >
            <option value="zinc">Theme: Zinc</option>
            <option value="dark-slate">Theme: Dark Slate</option>
            <option value="midnight">Theme: Midnight</option>
          </select>

          {/* Canvas Mode Toggle */}
          <div className="flex items-center gap-0.5 rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 shrink-0">
            <button
              onClick={() => setCanvasMode("light")}
              title="Light Canvas"
              className={`p-1 rounded ${canvasMode === "light" ? "bg-zinc-800 text-amber-400" : "text-zinc-500"}`}
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setCanvasMode("dark")}
              title="Dark Canvas"
              className={`p-1 rounded ${canvasMode === "dark" ? "bg-zinc-800 text-sky-400" : "text-zinc-500"}`}
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setCanvasMode("dots")}
              title="Dot Matrix Canvas"
              className={`p-1 rounded ${canvasMode === "dots" ? "bg-zinc-800 text-emerald-400" : "text-zinc-500"}`}
            >
              <Sparkles className="h-3.5 w-3.5" />
            </button>
          </div>

          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noreferrer"
            className="hidden xl:flex items-center gap-1 rounded-lg border border-zinc-800 px-2.5 py-1 text-xs text-zinc-300 hover:bg-zinc-800 shrink-0 whitespace-nowrap"
          >
            <span>Docs</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </header>

      {/* Main Workspace Layout */}
      {studioMode === "components" && (
        <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Components Explorer */}
        <aside className="w-64 shrink-0 flex flex-col border-r border-zinc-800 bg-zinc-900/60">
          {/* Search Input */}
          <div className="p-3 border-b border-zinc-800/80">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 outline-none focus:border-zinc-700"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 mt-2">
              {(["all", "component", "block", "hook"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded px-2 py-0.5 text-[10px] font-medium capitalize transition-colors ${
                    categoryFilter === cat ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {cat === "all" ? "All" : cat + "s"}
                </button>
              ))}
            </div>
          </div>

          {/* Component List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500 flex items-center justify-between">
              <span>Components</span>
              <span className="rounded bg-zinc-800 px-1 text-[9px] text-zinc-400">{filteredItems.length}</span>
            </div>

            {filteredItems.map((i) => {
              const isSelected = i.id === id;
              return (
                <button
                  key={i.id}
                  onClick={() => {
                    setId(i.id);
                    setValues({});
                    logEvent("Select", `Inspecting ${i.name} (${i.id})`);
                  }}
                  className={`group flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-all ${
                    isSelected
                      ? "bg-zinc-800 text-white font-medium shadow-sm ring-1 ring-zinc-700/60"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isSelected ? "bg-emerald-400" : "bg-zinc-600 group-hover:bg-zinc-400"
                      }`}
                    />
                    <span className="truncate">{i.name}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 uppercase rounded bg-zinc-950/60 px-1 py-0.5 font-mono">
                    {i.type === "block" ? "blk" : i.type === "hook" ? "hook" : "ui"}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Left Footer Info */}
          <div className="p-3 border-t border-zinc-800 text-[11px] text-zinc-500 flex items-center justify-between">
            <span>Platform Target</span>
            <span className="font-mono text-zinc-400">RN 0.76+ Expo</span>
          </div>
        </aside>

        {/* Center Mobile Canvas */}
        <main
          className={`flex-1 flex flex-col items-center justify-center relative overflow-hidden p-6 transition-colors duration-200 ${
            canvasMode === "light"
              ? "bg-zinc-100 bg-dot-grid-light"
              : canvasMode === "dark"
              ? "bg-zinc-950"
              : "bg-zinc-950 bg-dot-grid"
          }`}
        >
          {/* Floating Canvas Zoom Bar */}
          <div className="absolute top-4 left-6 z-10 flex items-center gap-2">
            <span className="px-2 text-zinc-400 text-[11px] font-semibold">{item?.name}</span>
            <div className="h-3 w-px bg-zinc-800" />
            <div className="flex items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900/90 p-1 text-xs shadow-lg backdrop-blur">
              {[75, 100, 125].map((z) => (
                <button
                  key={z}
                  onClick={() => setZoom(z)}
                  className={`rounded px-1.5 py-0.5 text-[10px] font-mono ${
                    zoom === z ? "bg-zinc-800 text-sky-400" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {z}%
                </button>
              ))}
            </div>
          </div>

          {/* Clean Interactive Visual Canvas */}
          <PreviewCanvas
            zoom={zoom}
            canvasMode={canvasMode}
            appName={item?.name ?? "Component Preview"}
            onEvent={logEvent}
          >
            {renderHarness()}
          </PreviewCanvas>

          {/* Canvas Bottom Feedback Pill */}
          <div className="absolute bottom-4 flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-[11px] text-zinc-400 shadow-md backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive Visual Canvas</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-500">Dual NativeWind v4 & StyleSheet ready</span>
          </div>
        </main>

        {/* Right Sidebar: Props Inspector, Code, Usage, and Events */}
        <aside className="w-80 shrink-0 flex flex-col border-l border-zinc-800 bg-zinc-900/95">
          {/* Tab Navigation */}
          <div className="flex border-b border-zinc-800 bg-zinc-900 p-1 text-xs">
            <button
              onClick={() => setActiveTab("props")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 font-medium transition-colors ${
                activeTab === "props" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Props</span>
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 font-medium transition-colors ${
                activeTab === "code" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Code</span>
            </button>
            <button
              onClick={() => setActiveTab("usage")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 font-medium transition-colors ${
                activeTab === "usage" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Usage</span>
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 font-medium transition-colors relative ${
                activeTab === "events" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Log</span>
              {events.length > 0 && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          </div>

          {/* TAB 1: PROPERTIES INSPECTOR */}
          {activeTab === "props" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Presets Bar */}
              {fixtures.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Quick Presets</span>
                    <button
                      onClick={() => {
                        setValues({});
                        logEvent("Reset", "Props reset to defaults");
                      }}
                      className="text-[10px] text-zinc-400 hover:text-zinc-200"
                    >
                      Reset Defaults
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {fixtures.map((f) => (
                      <button
                        key={f.name}
                        onClick={() => {
                          setValues(f.props);
                          logEvent("Preset", `Applied preset: "${f.name}"`);
                        }}
                        className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-1 text-[11px] text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Editable Controls */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Properties</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{item?.id}.schema</span>
                </div>

                {item?.controls.map((c) => {
                  if (c.type === "color") return null;
                  const val = merged[c.propKey];

                  return (
                    <div key={c.propKey} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-zinc-300">{c.label}</label>
                        <span className="text-[10px] font-mono text-zinc-500">{c.propKey}</span>
                      </div>

                      {c.type === "select" && (
                        <div className="relative">
                          <select
                            value={String(val)}
                            onChange={(e) => {
                              set(c.propKey, e.target.value);
                              logEvent("PropChange", `${c.propKey} = "${e.target.value}"`);
                            }}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-200 outline-none hover:border-zinc-700 focus:border-zinc-600 appearance-none"
                          >
                            {c.options.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                          <ChevronRight className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rotate-90 text-zinc-500" />
                        </div>
                      )}

                      {c.type === "boolean" && (
                        <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-2">
                          <span className="text-xs text-zinc-400">{Boolean(val) ? "Enabled" : "Disabled"}</span>
                          <input
                            type="checkbox"
                            checked={Boolean(val)}
                            onChange={(e) => {
                              set(c.propKey, e.target.checked);
                              logEvent("PropChange", `${c.propKey} = ${e.target.checked}`);
                            }}
                            className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-sky-500 focus:ring-0 focus:ring-offset-0"
                          />
                        </div>
                      )}

                      {c.type === "text" && (
                        <input
                          type="text"
                          value={String(val ?? "")}
                          placeholder={c.placeholder}
                          onChange={(e) => {
                            set(c.propKey, e.target.value);
                            logEvent("PropChange", `${c.propKey} = "${e.target.value}"`);
                          }}
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 outline-none focus:border-zinc-600"
                        />
                      )}

                      {c.type === "slider" && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-zinc-400">
                            <span>{c.min}</span>
                            <span className="font-mono text-sky-400">{Number(val) || c.min}</span>
                            <span>{c.max}</span>
                          </div>
                          <input
                            type="range"
                            min={c.min}
                            max={c.max}
                            step={c.step}
                            value={Number(val) || c.min}
                            onChange={(e) => {
                              set(c.propKey, Number(e.target.value));
                              logEvent("PropChange", `${c.propKey} = ${e.target.value}`);
                            }}
                            className="w-full accent-sky-500"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Usage Preview */}
              <div className="pt-2 border-t border-zinc-800 space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Live JSX</span>
                <code className="block rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 font-mono text-xs text-emerald-400 break-all leading-relaxed">
                  {usage}
                </code>
              </div>
            </div>
          )}

          {/* TAB 2: CODE SOURCE */}
          {activeTab === "code" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2 bg-zinc-950/50">
                <span className="text-xs font-mono text-zinc-400 truncate">{file?.path}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => copyToClipboard(file?.content ?? "", "source")}
                    className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
                  >
                    {copiedType === "source" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>Copy source</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 bg-zinc-950">
                <pre className="font-mono text-xs leading-relaxed text-zinc-300">
                  <code>{file?.content}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: USAGE & CLI COMMANDS */}
          {activeTab === "usage" && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">JSX Invocation</span>
                <div className="mt-1.5 relative">
                  <code className="block rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-emerald-400 break-all leading-relaxed">
                    {usage}
                  </code>
                  <button
                    onClick={() => copyToClipboard(usage, "usage")}
                    className="absolute right-2 top-2 rounded bg-zinc-800 p-1 text-zinc-400 hover:text-white"
                  >
                    {copiedType === "usage" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Install via CLI</span>
                <div className="mt-1.5 relative">
                  <code className="block rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-sky-400 break-all">
                    {installCmd}
                  </code>
                  <button
                    onClick={() => copyToClipboard(installCmd, "command")}
                    className="absolute right-2 top-2 rounded bg-zinc-800 p-1 text-zinc-400 hover:text-white"
                  >
                    {copiedType === "command" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 space-y-2">
                <span className="text-xs font-semibold text-zinc-300">Source-First Ownership</span>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Installing places the raw TSX file directly into your codebase under <code>components/ui/</code>. You own the code without external package bloat.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => copyToClipboard(file?.content ?? "", "source")}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-zinc-800 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-700"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Source Code</span>
                </button>
                <button
                  onClick={() => copyToClipboard(installCmd, "command")}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-900"
                >
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Copy CLI Command</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: EVENT CONSOLE */}
          {activeTab === "events" && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2 bg-zinc-950/50">
                <span className="text-xs text-zinc-400">Interaction Stream ({events.length})</span>
                {events.length > 0 && (
                  <button
                    onClick={() => setEvents([])}
                    className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-xs">
                {events.length === 0 ? (
                  <div className="py-12 text-center text-zinc-600">
                    <Activity className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p>No interactions recorded yet.</p>
                    <p className="text-[11px] text-zinc-700 mt-1">Interact with the component in the device canvas to log events.</p>
                  </div>
                ) : (
                  events.map((e) => (
                    <div key={e.id} className="rounded border border-zinc-800/80 bg-zinc-950 p-2 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-emerald-400 font-semibold">{e.event}</span>
                        <span className="text-zinc-600">{e.time}</span>
                      </div>
                      <p className="text-zinc-300 text-[11px] break-all">{e.detail}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
      )}

      {studioMode === "playground" && <ComponentPlayground target={target} />}
      {studioMode === "icons" && <IconExplorer />}
    </div>
  );
}
