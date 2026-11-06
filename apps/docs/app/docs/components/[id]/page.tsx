import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getComponents, getItem } from "@/lib/registry";
import { ComponentPreview } from "@/components/ComponentPreview";
import { CodeViewer } from "@/components/CodeViewer";
import {
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Smartphone,
  Layers,
  ShieldCheck,
} from "lucide-react";

interface ComponentPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const components = await getComponents();
  return components.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: ComponentPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await getItem(id);
  if (!item) {
    return { title: "Component Not Found" };
  }
  return {
    title: `${item.name} — Nativra Components`,
    description: item.description,
  };
}

interface PropSpec {
  name: string;
  type: string;
  default?: string;
  description: string;
}

const COMPONENT_PROPS_MAP: Record<string, PropSpec[]> = {
  button: [
    { name: "variant", type: '"default" | "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link"', default: '"default"', description: "Visual styling preset" },
    { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: "Size dimensions, padding and text scale" },
    { name: "disabled", type: "boolean", default: "false", description: "Disables user interaction and dims opacity" },
    { name: "loading", type: "boolean", default: "false", description: "Replaces or prepends spinner indicator" },
    { name: "children", type: "string", default: "required", description: "Button label text" },
    { name: "onPress", type: "() => void", default: "undefined", description: "Press event callback" },
  ],
  badge: [
    { name: "label", type: "string", default: "required", description: "Text content displayed inside badge" },
    { name: "variant", type: '"default" | "primary" | "secondary" | "destructive" | "outline"', default: '"default"', description: "Semantic color treatment" },
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Scale preset" },
  ],
  avatar: [
    { name: "src", type: "string", default: "undefined", description: "Remote image URL" },
    { name: "fallback", type: "string", default: "required", description: "Initials or text rendered when image is absent or loading" },
    { name: "size", type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: "Avatar dimension preset" },
  ],
  input: [
    { name: "label", type: "string", default: "undefined", description: "Form label displayed above input" },
    { name: "placeholder", type: "string", default: "undefined", description: "Ghost hint when input is empty" },
    { name: "value", type: "string", default: "undefined", description: "Controlled input value" },
    { name: "error", type: "boolean", default: "false", description: "Renders red border and activates error messaging" },
    { name: "errorMessage", type: "string", default: "undefined", description: "Helper text shown below input when error is true" },
    { name: "disabled", type: "boolean", default: "false", description: "Disables typing and dims styling" },
    { name: "onChangeText", type: "(text: string) => void", default: "undefined", description: "Text change callback" },
  ],
  card: [
    { name: "elevated", type: "boolean", default: "true", description: "Renders platform shadow / elevation" },
    { name: "radius", type: '"none" | "sm" | "md" | "lg" | "full"', default: '"md"', description: "Corner radius preset" },
    { name: "padding", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: "Internal surface padding" },
  ],
  checkbox: [
    { name: "checked", type: "boolean", default: "required", description: "Checked boolean state" },
    { name: "onCheckedChange", type: "(checked: boolean) => void", default: "required", description: "Callback triggered on toggle" },
    { name: "label", type: "string", default: "undefined", description: "Optional text label next to checkbox" },
    { name: "disabled", type: "boolean", default: "false", description: "Disables interaction" },
  ],
  switch: [
    { name: "value", type: "boolean", default: "required", description: "Active toggle state" },
    { name: "onValueChange", type: "(value: boolean) => void", default: "required", description: "Callback when switch toggles" },
    { name: "disabled", type: "boolean", default: "false", description: "Disables interaction" },
  ],
  skeleton: [
    { name: "width", type: "number | string", default: '"100%"', description: "Width in points or percentage" },
    { name: "height", type: "number | string", default: "16", description: "Height in points or percentage" },
    { name: "radius", type: '"none" | "sm" | "md" | "lg" | "full"', default: '"md"', description: "Border radius" },
  ],
  spinner: [
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Spinner diameter" },
    { name: "color", type: "string", default: "semantic", description: "Activity indicator hex color" },
  ],
  separator: [
    { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Layout axis" },
    { name: "decorative", type: "boolean", default: "true", description: "Whether ignored by screen readers" },
  ],
  label: [
    { name: "children", type: "string", default: "required", description: "Text displayed" },
    { name: "required", type: "boolean", default: "false", description: "Renders red asterisk indicator" },
    { name: "disabled", type: "boolean", default: "false", description: "Dims opacity" },
  ],
  text: [
    { name: "variant", type: '"h1" | "h2" | "h3" | "h4" | "p" | "lead" | "muted" | "code"', default: '"p"', description: "Semantic typography scale" },
    { name: "children", type: "React.ReactNode", default: "undefined", description: "Content text" },
  ],
};

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { id } = await params;
  const item = await getItem(id);
  if (!item) notFound();

  const propsList = COMPONENT_PROPS_MAP[item.id] || [];

  return (
    <div className="space-y-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/docs" className="hover:text-foreground transition-colors">
          Docs
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/docs/components" className="hover:text-foreground transition-colors">
          Components
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-foreground">{item.name}</span>
      </nav>

      {/* Component Header */}
      <div className="space-y-4 border-b border-border pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {item.name}
          </h1>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {item.status}
          </span>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-mono font-medium text-muted-foreground">
            v{item.version}
          </span>
        </div>

        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          {item.description}
        </p>

        {/* Compatibility & Styling Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground">
            <Smartphone className="h-3.5 w-3.5 text-sky-500" />
            <span>Android & iOS</span>
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Expo Go Ready</span>
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground">
            <Layers className="h-3.5 w-3.5 text-purple-500" />
            <span>NativeWind + StyleSheet</span>
          </div>
        </div>
      </div>

      {/* Interactive Preview Canvas */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Interactive Playground
          </h2>
        </div>
        <ComponentPreview item={item} />
      </section>

      {/* Source Code Viewer (Dual Target: NativeWind & StyleSheet) */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Source Code
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Copy the full implementation directly into your project. Zero dependencies required.
            </p>
          </div>
        </div>

        <CodeViewer files={item.files} defaultTarget="nativewind" />
      </section>

      {/* Props Specification Table */}
      {propsList.length > 0 && (
        <section className="space-y-4 pt-4">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Props Specification
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/50 text-muted-foreground font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Prop</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Default</th>
                  <th className="px-4 py-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {propsList.map((p) => (
                  <tr key={p.name} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-bold text-foreground">
                      {p.name}
                    </td>
                    <td className="px-4 py-3 text-sky-600 dark:text-sky-400">
                      {p.type}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {p.default || "-"}
                    </td>
                    <td className="px-4 py-3 font-sans text-muted-foreground">
                      {p.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Source Ownership Assurance Box */}
      <section className="rounded-xl border border-border bg-muted/30 p-5 text-xs space-y-2">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Source Ownership Guarantee</span>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          When you install <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">{item.id}</code>, the entire component source file is copied into your repository&apos;s <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">components/ui/</code> folder. You can modify animation curves, tweak accessibility labels, and style constraints with no upstream vendor locks.
        </p>
      </section>
    </div>
  );
}
