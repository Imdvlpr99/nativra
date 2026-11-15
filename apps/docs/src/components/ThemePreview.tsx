import React from "react";
import type { NativraThemeTokens, SemanticColors } from "@nativra/theme-engine";

const SWATCHES: Array<keyof SemanticColors> = [
  "background",
  "foreground",
  "primary",
  "secondary",
  "muted",
  "accent",
  "destructive",
  "border",
];

function Sample({ colors, label }: { colors: SemanticColors; label: string }) {
  const c = (k: keyof SemanticColors) => String(colors[k]);
  return (
    <figure className="overflow-hidden rounded-xl border border-border">
      <div className="space-y-3 p-5" style={{ background: c("background"), color: c("foreground") }}>
        <div className="rounded-lg p-4" style={{ background: c("card"), color: c("card-foreground"), border: `1px solid ${c("border")}` }}>
          <p className="text-sm font-semibold">Weekly summary</p>
          <p className="mt-1 text-xs" style={{ color: c("muted-foreground") }}>
            12 tasks completed · 3 due tomorrow
          </p>
          <div className="mt-4 flex gap-2">
            <span className="rounded-md px-3 py-1.5 text-xs font-medium" style={{ background: c("primary"), color: c("primary-foreground") }}>
              Continue
            </span>
            <span className="rounded-md px-3 py-1.5 text-xs font-medium" style={{ background: c("secondary"), color: c("secondary-foreground") }}>
              Later
            </span>
            <span className="ml-auto rounded-md px-2 py-1.5 text-xs font-medium" style={{ background: c("destructive"), color: c("destructive-foreground") }}>
              Delete
            </span>
          </div>
        </div>
        <div className="flex gap-1.5">
          {SWATCHES.map((k) => (
            <span
              key={k}
              title={`${k}: ${c(k)}`}
              className="h-6 flex-1 rounded"
              style={{ background: c(k), boxShadow: `inset 0 0 0 1px ${c("border")}` }}
            />
          ))}
        </div>
      </div>
      <figcaption className="border-t border-border px-4 py-2 text-xs text-muted-foreground">{label}</figcaption>
    </figure>
  );
}

/** Renders a theme preset with its own tokens (not the docs site's), in light and dark. */
export function ThemePreview({ theme }: { theme: NativraThemeTokens }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Sample colors={theme.light} label="Light" />
      <Sample colors={theme.dark} label="Dark" />
    </div>
  );
}

export function ThemeTokenTable({ theme }: { theme: NativraThemeTokens }) {
  const keys = Object.keys(theme.light) as Array<keyof SemanticColors>;
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-surface text-xs text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-2 font-medium">Token</th>
            <th scope="col" className="px-4 py-2 font-medium">Light</th>
            <th scope="col" className="px-4 py-2 font-medium">Dark</th>
          </tr>
        </thead>
        <tbody className="font-mono text-xs">
          {keys.map((k) => (
            <tr key={k} className="border-t border-border first:border-t-0">
              <th scope="row" className="px-4 py-2 font-normal text-foreground">{k}</th>
              {(["light", "dark"] as const).map((mode) => (
                <td key={mode} className="px-4 py-2 text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-3.5 w-3.5 rounded-sm border border-border" style={{ background: String(theme[mode][k]) }} aria-hidden="true" />
                    {String(theme[mode][k])}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
