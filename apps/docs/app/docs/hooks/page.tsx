import type { Metadata } from "next";
import { getManifest, getItem } from "@/lib/registry";
import { CodeViewer } from "@/components/CodeViewer";
import { ComponentPreview } from "@/components/ComponentPreview";

export const metadata: Metadata = {
  title: "Hooks",
  description: "Essential React Native hooks provided by Nativra",
};

export default async function HooksPage() {
  const manifest = await getManifest();
  const hookSummaries = manifest.items.filter((i) => i.type === "hook");
  const hooks = (await Promise.all(hookSummaries.map((h) => getItem(h.id)))).filter(Boolean);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-border pb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">
          State & Hardware Utilities
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Hooks
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          Source-owned React hooks tailored for mobile gestures, modal disclosures, and hardware integration.
        </p>
      </div>

      {/* Hooks List */}
      <div className="space-y-10">
        {hooks.map((h) => (
          <div
            key={h!.id}
            className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    {h!.name}
                  </h2>
                  <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                    Hook
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{h!.description}</p>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs rounded-lg border border-border bg-muted/40 px-3 py-1.5">
                <span className="text-muted-foreground">$</span>
                <span className="text-foreground">npx nativra add {h!.id}</span>
              </div>
            </div>

            {/* Interactive Preview of the Hook */}
            <ComponentPreview item={h!} />

            {/* Source Code */}
            <div className="pt-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Hook Source Code
              </h3>
              <CodeViewer files={h!.files} defaultTarget="nativewind" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
