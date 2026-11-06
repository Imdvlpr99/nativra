"use client";

import { useMemo, useState } from "react";
import type { Control } from "@nativra/studio-schema";
import { generateInstallCommand, generateUsage } from "@nativra/codegen";

export interface StudioItem {
  id: string;
  name: string;
  stylingTargets: string[];
  files: { path: string; target?: string | undefined; content?: string | undefined }[];
  controls: Control[];
}

type Values = Record<string, string | boolean>;

const BTN_BG: Record<string, string> = {
  default: "#171717", primary: "#0284c7", secondary: "#f4f4f5", destructive: "#ef4444",
  outline: "transparent", ghost: "transparent", link: "transparent",
};
const BTN_FG: Record<string, string> = {
  default: "#fff", primary: "#fff", secondary: "#171717", destructive: "#fff",
  outline: "#171717", ghost: "#171717", link: "#0284c7",
};
const BADGE_BG: Record<string, string> = {
  default: "#171717", primary: "#e0f2fe", secondary: "#f4f4f5", destructive: "#fee2e2", outline: "transparent",
};
const BADGE_FG: Record<string, string> = {
  default: "#fff", primary: "#0369a1", secondary: "#3f3f46", destructive: "#b91c1c", outline: "#3f3f46",
};
const PAD: Record<string, string> = { xs: "4px 10px", sm: "6px 12px", md: "10px 16px", lg: "12px 20px", xl: "14px 24px" };

function Harness({ id, v }: { id: string; v: Values }) {
  const variant = String(v.variant ?? "default");
  if (id === "input") {
    const err = Boolean(v.error);
    return (
      <div style={{ width: 240, opacity: v.disabled ? 0.5 : 1, color: "#18181b", fontSize: 14 }}>
        <div style={{ fontWeight: 500, marginBottom: 6 }}>{String(v.label ?? "")}</div>
        <div style={{ border: `1px solid ${err ? "#ef4444" : "#d4d4d8"}`, borderRadius: 8, padding: "10px 12px", color: "#a1a1aa" }}>
          {String(v.placeholder ?? "")}
        </div>
        {err && v.errorMessage ? <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>{String(v.errorMessage)}</div> : null}
      </div>
    );
  }
  if (id === "card") {
    const pad = { sm: 12, md: 16, lg: 24 }[String(v.padding ?? "md") as "sm" | "md" | "lg"];
    return (
      <div style={{
        border: "1px solid #e4e4e7", borderRadius: 12, padding: pad, width: 220, color: "#18181b", fontSize: 14,
        boxShadow: v.elevated ? "0 4px 12px rgba(0,0,0,.15)" : "none",
      }}>Card content</div>
    );
  }
  if (id === "separator") {
    const vertical = v.orientation === "vertical";
    return (
      <div style={{ width: 200, height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={vertical ? { width: 1, height: "100%", background: "#e4e4e7" } : { height: 1, width: "100%", background: "#e4e4e7" }} />
      </div>
    );
  }
  if (id === "text") {
    const textVariant = String(v.variant ?? "p");
    const styleMap: Record<string, React.CSSProperties> = {
      h1: { fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", color: "#09090b" },
      h2: { fontSize: 22, fontWeight: 600, letterSpacing: "-0.01em", color: "#09090b" },
      h3: { fontSize: 18, fontWeight: 600, color: "#09090b" },
      h4: { fontSize: 16, fontWeight: 600, color: "#09090b" },
      p: { fontSize: 15, lineHeight: 1.6, color: "#27272a" },
      lead: { fontSize: 18, color: "#52525b" },
      muted: { fontSize: 13, color: "#71717a" },
      code: { fontSize: 13, fontFamily: "monospace", background: "#f4f4f5", padding: "2px 6px", borderRadius: 4, color: "#27272a" },
    };
    return (
      <div style={{ maxWidth: 300, textAlign: "center", ...(styleMap[textVariant] ?? styleMap.p) }}>
        {String(v.children ?? "")}
      </div>
    );
  }
  if (id === "label") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 4, opacity: v.disabled ? 0.5 : 1, fontSize: 14, fontWeight: 500, color: "#18181b" }}>
        <span>{String(v.children ?? "Label")}</span>
        {v.required ? <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span> : null}
      </div>
    );
  }
  if (id === "checkbox") {
    const checked = Boolean(v.checked);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: v.disabled ? 0.5 : 1, cursor: "pointer", fontSize: 14, color: "#18181b" }}>
        <div style={{
          width: 20, height: 20, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
          background: checked ? "#18181b" : "transparent", border: `1.5px solid ${checked ? "#18181b" : "#a1a1aa"}`,
          color: "#fff", fontSize: 12, fontWeight: 700,
        }}>
          {checked ? "✓" : ""}
        </div>
        <span>{String(v.label ?? "")}</span>
      </div>
    );
  }
  if (id === "switch") {
    const on = Boolean(v.value);
    return (
      <div style={{
        width: 44, height: 24, borderRadius: 999, background: on ? "#18181b" : "#e4e4e7",
        padding: 2, display: "flex", alignItems: "center", opacity: v.disabled ? 0.5 : 1,
        justifyContent: on ? "flex-end" : "flex-start", transition: "all 0.2s",
      }}>
        <div style={{ width: 20, height: 20, borderRadius: 999, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
      </div>
    );
  }
  if (id === "skeleton") {
    const rMap: Record<string, number> = { none: 0, sm: 4, md: 8, lg: 12, full: 999 };
    return (
      <div style={{
        width: Number(v.width) || 180, height: Number(v.height) || 24,
        borderRadius: rMap[String(v.radius ?? "md")] ?? 8, background: "#e4e4e7",
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }} />
    );
  }
  if (id === "spinner") {
    const sMap: Record<string, number> = { sm: 16, md: 24, lg: 32 };
    const dim = sMap[String(v.size ?? "md")] ?? 24;
    return (
      <div style={{
        width: dim, height: dim, border: "2px solid #e4e4e7", borderTopColor: "#18181b",
        borderRadius: "50%", animation: "spin 1s linear infinite",
      }} />
    );
  }
  if (id === "avatar") {
    const sMap: Record<string, number> = { sm: 32, md: 40, lg: 56, xl: 80 };
    const fMap: Record<string, number> = { sm: 12, md: 14, lg: 18, xl: 24 };
    const dim = sMap[String(v.size ?? "md")] ?? 40;
    const font = fMap[String(v.size ?? "md")] ?? 14;
    return (
      <div style={{
        width: dim, height: dim, borderRadius: "50%", background: "#e4e4e7",
        color: "#3f3f46", display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 600, fontSize: font,
      }}>
        {String(v.fallback ?? "NV").slice(0, 2).toUpperCase()}
      </div>
    );
  }
  if (id === "badge") {
    return (
      <span style={{
        background: BADGE_BG[variant], color: BADGE_FG[variant], padding: PAD[String(v.size ?? "md")],
        borderRadius: 999, fontSize: 12, fontWeight: 500, border: variant === "outline" ? "1px solid #d4d4d8" : "none",
      }}>{String(v.label ?? "Badge")}</span>
    );
  }
  return (
    <button disabled style={{
      background: BTN_BG[variant], color: BTN_FG[variant], padding: PAD[String(v.size ?? "md")], borderRadius: 8,
      fontWeight: 600, fontSize: 14, border: variant === "outline" ? "1px solid #d4d4d8" : "none",
      textDecoration: variant === "link" ? "underline" : "none", opacity: v.disabled || v.loading ? 0.5 : 1,
    }}>{v.loading ? "⏳ " : ""}{String(v.children ?? "Button")}</button>
  );
}

export default function StudioClient({ items }: { items: StudioItem[] }) {
  const [id, setId] = useState(items[0]?.id ?? "");
  const [target, setTarget] = useState("nativewind");
  const [values, setValues] = useState<Values>({});
  const item = items.find((i) => i.id === id);

  const merged = useMemo<Values>(() => {
    const out: Values = {};
    for (const c of item?.controls ?? []) {
      if (c.type === "color") continue;
      out[c.propKey] = (values[c.propKey] ?? c.defaultValue ?? (c.type === "boolean" ? false : "")) as string | boolean;
    }
    return out;
  }, [item, values]);

  const file = item?.files.find((f) => !f.target || f.target === target) ?? item?.files[0];
  const set = (k: string, val: string | boolean) => setValues((p) => ({ ...p, [k]: val }));

  const usage = item ? generateUsage(item.id, merged) : "";

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-12 items-center justify-between border-b border-zinc-800 px-4">
        <span className="text-sm font-bold">Nativra Studio <span className="ml-2 rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-400">MVP</span></span>
        <label className="flex items-center gap-2 text-xs text-zinc-400">
          Target
          <select value={target} onChange={(e) => setTarget(e.target.value)} className="rounded bg-zinc-800 px-2 py-1 text-zinc-200">
            <option value="nativewind">NativeWind</option>
            <option value="stylesheet">StyleSheet</option>
          </select>
        </label>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 overflow-y-auto border-r border-zinc-800 bg-zinc-900 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">Components</p>
          {items.map((i) => (
            <button key={i.id} onClick={() => { setId(i.id); setValues({}); }}
              className={`mb-1 w-full rounded px-3 py-1.5 text-left text-sm ${i.id === id ? "bg-zinc-800 text-zinc-50" : "text-zinc-300 hover:bg-zinc-800"}`}>
              {i.name}
            </button>
          ))}
        </aside>
        <main className="flex flex-1 flex-col overflow-hidden bg-zinc-950">
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
            <p className="text-xs text-zinc-500">Deterministic web harness — verify real behavior in apps/native-preview (Expo)</p>
            <div className="rounded-xl bg-white p-12">{item && <Harness id={item.id} v={merged} />}</div>
          </div>
          <div className="h-64 overflow-auto border-t border-zinc-800 p-4">
            <p className="mb-1 text-xs text-zinc-500">{file?.path}</p>
            <pre className="text-xs text-zinc-300"><code>{file?.content}</code></pre>
          </div>
        </main>
        <aside className="w-72 overflow-y-auto border-l border-zinc-800 bg-zinc-900 p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">Properties</p>
          <div className="space-y-4">
            {item?.controls.map((c) => {
              if (c.type === "color") return null;
              const val = merged[c.propKey];
              return (
                <div key={c.propKey} className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-400">{c.label}</label>
                  {c.type === "select" && (
                    <select value={String(val)} onChange={(e) => set(c.propKey, e.target.value)} className="rounded bg-zinc-800 px-2 py-1.5 text-sm">
                      {c.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  )}
                  {c.type === "boolean" && <input type="checkbox" checked={Boolean(val)} onChange={(e) => set(c.propKey, e.target.checked)} className="h-4 w-4" />}
                  {c.type === "text" && <input value={String(val)} onChange={(e) => set(c.propKey, e.target.value)} className="rounded bg-zinc-800 px-2 py-1.5 text-sm" />}
                  {c.type === "slider" && <input type="range" min={c.min} max={c.max} step={c.step} value={Number(val) || c.min} onChange={(e) => set(c.propKey, e.target.value)} />}
                </div>
              );
            })}
          </div>
          <div className="mt-6 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Usage</p>
            <code className="block rounded bg-zinc-800 p-2 font-mono text-xs text-emerald-400">{usage}</code>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Install</p>
            <code className="block rounded bg-zinc-800 p-2 font-mono text-xs text-sky-400">{generateInstallCommand(id)}</code>
            <button onClick={() => navigator.clipboard.writeText(file?.content ?? "")} className="w-full rounded bg-zinc-800 py-1.5 text-xs hover:bg-zinc-700">Copy source</button>
            <button onClick={() => navigator.clipboard.writeText(generateInstallCommand(id))} className="w-full rounded bg-zinc-800 py-1.5 text-xs hover:bg-zinc-700">Copy command</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

