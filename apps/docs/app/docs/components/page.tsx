import Link from "next/link";
import type { Metadata } from "next";
import { getManifest } from "@/lib/registry";
import { ChevronRight, Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "Components Catalog",
  description: "Browse all 31 production-ready Nativra React Native components",
};

interface ComponentCategory {
  name: string;
  description: string;
  componentIds: string[];
}

const CATEGORIES: ComponentCategory[] = [
  {
    name: "Inputs & Actions",
    description: "Interactive controls for user forms, taps, and gestures",
    componentIds: [
      "button",
      "icon-button",
      "fab",
      "input",
      "textarea",
      "select",
      "segmented-control",
      "slider",
      "checkbox",
      "switch",
      "radio-group",
      "otp-input",
      "rating-stars",
    ],
  },
  {
    name: "Data Display & Content",
    description: "Surfaces, typography, tables, and profile representations",
    componentIds: [
      "avatar",
      "badge",
      "card",
      "data-table",
      "label",
      "separator",
      "text",
      "accordion",
      "tabs",
    ],
  },
  {
    name: "Layout & Surfaces",
    description: "Containers, safe area insets, and flexible structural layout",
    componentIds: ["stack", "safe-area"],
  },
  {
    name: "Feedback & Overlays",
    description: "Modals, bottom sheets, alerts, toasts, and loading indicators",
    componentIds: [
      "dialog",
      "bottom-sheet",
      "alert",
      "toast",
      "progress",
      "skeleton",
      "spinner",
    ],
  },
];

export default async function ComponentsPage() {
  const manifest = await getManifest();
  const components = manifest.items.filter((i) => i.type === "component");
  const componentMap = new Map(components.map((c) => [c.id, c]));

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-border pb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">
          Component Catalog
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Components
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          {components.length} production-ready React Native components with dual styling targets (NativeWind + StyleSheet). Copy the source, own the code.
        </p>

        {/* Global Install Hint */}
        <div className="flex items-center gap-2 pt-2">
          <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 font-mono text-xs">
            <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">$</span>
            <span className="text-foreground">npx nativra add &lt;component-name&gt;</span>
          </div>
        </div>
      </div>

      {/* Category Groups */}
      <div className="space-y-12">
        {CATEGORIES.map((category) => {
          const categoryItems = category.componentIds
            .map((id) => componentMap.get(id))
            .filter(Boolean);

          return (
            <div key={category.name} className="space-y-4">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  {category.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {category.description}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {categoryItems.map((c) => {
                  if (!c) return null;
                  return (
                    <Link
                      key={c.id}
                      href={`/docs/components/${c.id}`}
                      className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-zinc-400 hover:shadow-sm dark:hover:border-zinc-700"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                            {c.name}
                          </h3>
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {c.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {c.description}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                        <span className="font-mono text-[11px] text-muted-foreground">
                          nativra add {c.id}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
