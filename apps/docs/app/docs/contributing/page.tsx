import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contribution Guide",
  description:
    "How to author, test, and contribute new React Native components to the Nativra registry",
};

export default function ContributingPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-border pb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">
          Open Source
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Contribution Guide
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          Nativra welcomes contributions! Learn how to author new mobile components that satisfy our dual styling targets (NativeWind + StyleSheet) and quality bar.
        </p>
      </div>

      <div className="space-y-8 text-foreground">
        {/* Step 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900">
              1
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Define the Component Contract
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            All components begin with a framework-agnostic TypeScript contract in <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">packages/component-contracts/src/index.ts</code>. This guarantees both styling targets share identical prop interfaces.
          </p>
          <div className="rounded-xl border border-border bg-zinc-950 p-4 font-mono text-xs text-zinc-200 overflow-x-auto">
{`export interface SliderBaseProps extends AccessibleProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onValueChange?: (val: number) => void;
}`}
          </div>
        </section>

        {/* Step 2 */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900">
              2
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Implement Dual Source Files
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Create both implementations in the registry directory:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted-foreground">
            <li>
              <code className="font-mono text-foreground">registry/default/components/nativewind/Slider.tsx</code> (Tailwind CSS v4 classes via NativeWind)
            </li>
            <li>
              <code className="font-mono text-foreground">registry/default/components/stylesheet/Slider.tsx</code> (Pure React Native StyleSheet and useColorScheme)
            </li>
          </ul>
        </section>

        {/* Step 3 */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900">
              3
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Export Component Metadata
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Each component file exports a typed <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">componentMeta</code> object so tooling can introspect without parsing arbitrary JSX:
          </p>
          <div className="rounded-xl border border-border bg-zinc-950 p-4 font-mono text-xs text-zinc-200 overflow-x-auto">
{`export const componentMeta: ComponentMeta = {
  id: "slider",
  name: "Slider",
  description: "Accessible continuous range slider control.",
  stylingTarget: "nativewind",
  platforms: { android: true, ios: true },
  version: "0.1.0",
};`}
          </div>
        </section>

        {/* Step 4 */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900">
              4
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Compile & Validate the Registry
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Run the automated registry builder to generate JSON metadata and compute SHA-256 integrity hashes:
          </p>
          <pre className="rounded-xl border border-border bg-zinc-950 p-4 font-mono text-xs text-sky-400 overflow-x-auto">
            pnpm registry:build{"\n"}
            pnpm test
          </pre>
        </section>

        {/* Step 5 */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-bold text-white dark:bg-white dark:text-zinc-900">
              5
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Pull Request Quality Checklist
            </h2>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 space-y-2 text-xs">
            <label className="flex items-center gap-2">
              <input type="checkbox" readOnly checked className="rounded text-sky-600" />
              <span>Minimum 44x44pt touch area for interactive elements</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" readOnly checked className="rounded text-sky-600" />
              <span>Semantic <code className="font-mono">accessibilityRole</code> and <code className="font-mono">accessibilityState</code> defined</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" readOnly checked className="rounded text-sky-600" />
              <span>Verified in both Light and Dark appearances</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" readOnly checked className="rounded text-sky-600" />
              <span>Zero external runtime package dependencies beyond react-native / nativewind</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" readOnly checked className="rounded text-sky-600" />
              <span>TypeScript compiles cleanly with no `any` types</span>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}

