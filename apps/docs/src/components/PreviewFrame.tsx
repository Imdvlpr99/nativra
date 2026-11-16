import React, { useEffect, useId, useRef, useState } from "react";
import { ExternalLink, Moon, Sun } from "lucide-react";
import { PREVIEW_FIXTURES } from "@nativra/preview-runtime";
import { itemsOfType, type ItemType } from "@/lib/data";
import { PhoneMockup } from "@/components/PhoneMockup";

const THEMES = itemsOfType("theme").map((t) => ({ id: t.id, name: t.name }));
const STYLES = itemsOfType("style").map((s) => ({ id: s.id, name: s.name.replace(/ style$/, "") }));
const STYLE_KEY = "nativra-preview-style";

/** The style chosen in any preview, remembered across pages (per browser). */
function storedStyle(): string {
  try {
    const value = typeof window !== "undefined" ? window.localStorage.getItem(STYLE_KEY) : null;
    return value && STYLES.some((s) => s.id === value) ? value : "soft";
  } catch {
    return "soft";
  }
}

/** Overlays cover the whole screen, so they get the phone-frame layout like templates. */
const SCREEN_ITEMS = new Set(["bottom-sheet", "dialog", "filter-sheet"]);

/**
 * Live preview of a registry item: the real StyleSheet source rendered with react-native-web,
 * from the native-preview app's static export (/preview/). Theme, light/dark mode and fixture
 * travel in the URL; the preview reports its height back so the frame fits the content.
 */
export function PreviewFrame({ id, type, fixedStyle }: { id: string; type: ItemType; fixedStyle?: string }) {
  const isScreen = type === "template" || SCREEN_ITEMS.has(id);
  const fixtures = PREVIEW_FIXTURES[id] ?? [];
  const [fixture, setFixture] = useState(0);
  const [theme, setTheme] = useState("zinc");
  // Starts as "soft" so the prerendered HTML matches; the remembered style is applied after mount.
  const [chosenStyle, setStyle] = useState("soft");
  useEffect(() => setStyle(storedStyle()), []);
  const style = fixedStyle ?? chosenStyle;
  const chooseStyle = (next: string) => {
    setStyle(next);
    try {
      window.localStorage.setItem(STYLE_KEY, next);
    } catch {
      // Storage unavailable (private mode): the choice lasts for this page only.
    }
  };
  const [scheme, setScheme] = useState<"light" | "dark">("light");
  const [height, setHeight] = useState(isScreen ? 720 : 240);
  const [loaded, setLoaded] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const baseId = useId();

  // Start in the docs site's own mode.
  useEffect(() => {
    setScheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  // Only the preview this component owns may resize it.
  useEffect(() => {
    if (isScreen) return;
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frameRef.current?.contentWindow) return;
      const data = e.data as { type?: string; height?: number } | null;
      if (data?.type === "nativra-preview:height" && typeof data.height === "number") {
        setHeight(Math.min(Math.max(data.height, 120), 1200));
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [isScreen]);

  const query = new URLSearchParams({
    item: id,
    theme,
    style,
    scheme,
    ...(fixture ? { fixture: String(fixture) } : {}),
    ...(isScreen && type !== "template" ? { layout: "screen" } : {}),
  });
  const src = `/preview/index.html?${query.toString()}`;

  useEffect(() => setLoaded(false), [src]);

  const segment = (active: boolean) =>
    `rounded-md px-2.5 py-1 text-xs transition-colors ${
      active ? "bg-background font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-3 py-2">
        {fixtures.length > 1 && (
          <div role="tablist" aria-label="Example" className="flex flex-wrap gap-0.5 rounded-lg border border-border bg-muted/50 p-0.5">
            {fixtures.map((f, i) => (
              <button key={f.name} type="button" role="tab" aria-selected={fixture === i} onClick={() => setFixture(i)} className={segment(fixture === i)}>
                {f.name}
              </button>
            ))}
          </div>
        )}
        <div className="ml-auto flex items-center gap-2">
          {!fixedStyle && (
            <>
              <label htmlFor={`${baseId}-style`} className="sr-only">
                Style
              </label>
              <select
                id={`${baseId}-style`}
                value={style}
                onChange={(e) => chooseStyle(e.target.value)}
                className="h-8 rounded-lg border border-border bg-background px-2 text-xs text-foreground"
                title="Style: shape, type, density and surfaces"
              >
                {STYLES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </>
          )}
          <label htmlFor={`${baseId}-theme`} className="sr-only">
            Theme
          </label>
          <select
            id={`${baseId}-theme`}
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="h-8 rounded-lg border border-border bg-background px-2 text-xs text-foreground"
          >
            {THEMES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setScheme((s) => (s === "dark" ? "light" : "dark"))}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
            aria-label={`Preview in ${scheme === "dark" ? "light" : "dark"} mode`}
            title={`Preview in ${scheme === "dark" ? "light" : "dark"} mode`}
          >
            {scheme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
          </button>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Open preview in a new tab"
            title="Open preview in a new tab"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      {isScreen ? (
        // Templates and overlays render inside a phone, as they would on a device.
        <div className="flex justify-center bg-muted/40 px-4 py-8">
          <div className="h-[780px] w-full">
            <PhoneMockup scheme={scheme}>
              {!loaded && <div className="absolute inset-0 animate-pulse bg-muted/40 motion-reduce:animate-none" aria-hidden="true" />}
              <iframe
                ref={frameRef}
                key={src}
                src={src}
                title={`Live preview of ${id}`}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                className="absolute inset-x-0 top-0 h-[calc(100%+1px)] w-full border-0"
                style={{ opacity: loaded ? 1 : 0, transition: "opacity 150ms" }}
              />
            </PhoneMockup>
          </div>
        </div>
      ) : (
        <div className="relative">
          {!loaded && <div className="absolute inset-0 animate-pulse bg-muted/60 motion-reduce:animate-none" aria-hidden="true" />}
          <iframe
            ref={frameRef}
            key={src}
            src={src}
            title={`Live preview of ${id}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className="block w-full"
            style={{ height, opacity: loaded ? 1 : 0, transition: "opacity 150ms" }}
          />
        </div>
      )}
      <p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
        Live render of the StyleSheet source with react-native-web. The NativeWind version looks the same.
      </p>
    </div>
  );
}
