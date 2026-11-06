import type { Metadata } from "next";
import { ThemeGallery } from "@/components/ThemeGallery";

export const metadata: Metadata = {
  title: "Theme Engine & Design Tokens",
  description: "Semantic tokens, interactive theme gallery, and styling adapters in Nativra",
};

export default function ThemingPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-border pb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">
          Design System
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Theming & Semantic Tokens
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          Learn how Nativra maps design intent to semantic slots, inspect themes in our live gallery, and compile tokens for both NativeWind v4 and React Native StyleSheet.
        </p>
      </div>

      {/* Interactive Theme Gallery */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Theme Presets Gallery
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Explore ready-to-use palettes with live swatch inspectors and installation commands.
          </p>
        </div>
        <ThemeGallery />
      </section>

      <div className="space-y-8 text-foreground pt-4 border-t border-border">
        {/* Semantic Model */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Semantic Token Model
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Instead of hardcoding color hexes or arbitrary shades like &ldquo;blue-600&rdquo;, Nativra maps all component styles to semantic intent tokens:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { slot: "background", desc: "Main app background screen surface" },
              { slot: "foreground", desc: "Default high-contrast text color" },
              { slot: "card", desc: "Elevated surface for cards, sheets, and popovers" },
              { slot: "primary", desc: "Primary brand accent for key actions and buttons" },
              { slot: "secondary", desc: "Subtle backgrounds for chips, tags, and badges" },
              { slot: "muted", desc: "Helper text, placeholders, and subtle borders" },
              { slot: "destructive", desc: "Errors, destructive buttons, and alerts" },
              { slot: "border", desc: "Default stroke color for inputs, cards, and dividers" },
            ].map((t) => (
              <div
                key={t.slot}
                className="rounded-xl border border-border bg-card p-3.5"
              >
                <code className="font-mono text-xs font-semibold text-sky-600 dark:text-sky-400">
                  {t.slot}
                </code>
                <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Dual Adapters */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Dual Output Adapters
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <h3 className="font-semibold text-foreground text-sm">
                NativeWind Adapter
              </h3>
              <p className="text-xs text-muted-foreground">
                Converts tokens into CSS variables in your <code className="font-mono text-foreground">global.css</code> and maps them in Tailwind.
              </p>
              <div className="rounded-lg bg-zinc-950 p-3 font-mono text-[11px] text-zinc-200 overflow-x-auto">
{`:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
}`}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <h3 className="font-semibold text-foreground text-sm">
                StyleSheet Adapter
              </h3>
              <p className="text-xs text-muted-foreground">
                Exports a typed theme object that components consume alongside <code className="font-mono text-foreground">useColorScheme()</code>.
              </p>
              <div className="rounded-lg bg-zinc-950 p-3 font-mono text-[11px] text-zinc-200 overflow-x-auto">
{`export const midnight = {
  background: "#0b0f19",
  foreground: "#f8fafc",
  primary: "#38bdf8",
};`}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
