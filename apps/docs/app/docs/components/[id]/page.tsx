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
  const title = `React Native ${item.name} Component (NativeWind & StyleSheet)`;
  const description = `${item.description} Copy-paste React Native & Expo ${item.name} component source code with full NativeWind v4 and StyleSheet parity, accessibility, and TypeScript types. Install with npx nativra-cli add ${item.id}.`;

  return {
    title,
    description,
    keywords: [
      item.name,
      `React Native ${item.name}`,
      `React Native ${item.name} component`,
      `Expo ${item.name} component`,
      `NativeWind ${item.name}`,
      `React Native StyleSheet ${item.name}`,
      `Nativra ${item.name}`,
      ...(item.tags ?? []),
    ],
    alternates: {
      canonical: `/docs/components/${item.id}`,
    },
    openGraph: {
      type: "article",
      url: `https://nativra.vercel.app/docs/components/${item.id}`,
      title: `${title} | Nativra`,
      description,
      images: [
        {
          url: "/nativra-banner.png",
          width: 1024,
          height: 576,
          alt: `Nativra React Native ${item.name} Component`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Nativra`,
      description,
      images: ["/nativra-banner.png"],
    },
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
  "icon-button": [
    { name: "accessibilityLabel", type: "string", default: "required", description: "Screen reader accessibility label" },
    { name: "variant", type: '"default" | "primary" | "secondary" | "destructive" | "outline" | "ghost"', default: '"default"', description: "Visual color and depth preset" },
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Target dimensions (sm: 36pt, md: 44pt, lg: 52pt)" },
    { name: "rounded", type: '"default" | "full"', default: '"default"', description: "Corner radius preset" },
    { name: "loading", type: "boolean", default: "false", description: "Shows spinning activity indicator" },
    { name: "disabled", type: "boolean", default: "false", description: "Disables interaction and dims opacity" },
    { name: "children", type: "React.ReactNode", default: "required", description: "Icon component (e.g. from lucide-react-native)" },
    { name: "onPress", type: "() => void", default: "undefined", description: "Press event callback" },
  ],
  fab: [
    { name: "accessibilityLabel", type: "string", default: "required", description: "Screen reader accessibility label" },
    { name: "variant", type: '"primary" | "secondary" | "accent"', default: '"primary"', description: "Semantic elevation color treatment" },
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "FAB dimensions (sm: 44pt, md: 56pt, lg: 64pt)" },
    { name: "position", type: '"bottom-right" | "bottom-left" | "bottom-center"', default: '"bottom-right"', description: "Fixed viewport anchor position" },
    { name: "label", type: "string", default: "undefined", description: "Optional extended FAB text label" },
    { name: "disabled", type: "boolean", default: "false", description: "Disables interaction" },
    { name: "children", type: "React.ReactNode", default: "required", description: "Icon component" },
    { name: "onPress", type: "() => void", default: "undefined", description: "Press action callback" },
  ],
  textarea: [
    { name: "label", type: "string", default: "undefined", description: "Form label displayed above textarea" },
    { name: "placeholder", type: "string", default: "undefined", description: "Placeholder guidance text" },
    { name: "value", type: "string", default: "undefined", description: "Controlled text value" },
    { name: "rows", type: "number", default: "4", description: "Initial vertical line height count" },
    { name: "error", type: "boolean", default: "false", description: "Highlights border in destructive red" },
    { name: "errorMessage", type: "string", default: "undefined", description: "Validation error description" },
    { name: "disabled", type: "boolean", default: "false", description: "Disables input" },
    { name: "onChangeText", type: "(text: string) => void", default: "undefined", description: "Text input change callback" },
  ],
  "radio-group": [
    { name: "value", type: "string", default: "required", description: "Active selected option value" },
    { name: "onValueChange", type: "(value: string) => void", default: "required", description: "Callback when a radio option is selected" },
    { name: "options", type: "Array<{ label: string; value: string; description?: string }>", default: "required", description: "List of radio options" },
    { name: "disabled", type: "boolean", default: "false", description: "Disables all radio options" },
  ],
  select: [
    { name: "label", type: "string", default: "undefined", description: "Form label above select picker" },
    { name: "placeholder", type: "string", default: '"Select an option"', description: "Placeholder when no item is selected" },
    { name: "value", type: "string", default: "undefined", description: "Currently selected option value" },
    { name: "options", type: "Array<{ label: string; value: string }>", default: "required", description: "Options available in picker sheet" },
    { name: "onValueChange", type: "(value: string) => void", default: "required", description: "Callback triggered on item selection" },
    { name: "disabled", type: "boolean", default: "false", description: "Disables picker interaction" },
  ],
  slider: [
    { name: "value", type: "number", default: "required", description: "Current slider position value" },
    { name: "minimumValue", type: "number", default: "0", description: "Lower boundary value" },
    { name: "maximumValue", type: "number", default: "100", description: "Upper boundary value" },
    { name: "step", type: "number", default: "1", description: "Granular step increment" },
    { name: "disabled", type: "boolean", default: "false", description: "Disables slider drag interaction" },
    { name: "onValueChange", type: "(value: number) => void", default: "required", description: "Value update event handler" },
  ],
  "otp-input": [
    { name: "length", type: "number", default: "6", description: "Total number of PIN digit boxes" },
    { name: "value", type: "string", default: "required", description: "Controlled numeric PIN code" },
    { name: "onChangeText", type: "(value: string) => void", default: "required", description: "Callback when PIN digits change" },
    { name: "error", type: "boolean", default: "false", description: "Highlights input boxes in destructive color" },
    { name: "secureTextEntry", type: "boolean", default: "false", description: "Obscures entered PIN with dots" },
    { name: "disabled", type: "boolean", default: "false", description: "Disables PIN input" },
  ],
  progress: [
    { name: "value", type: "number", default: "required", description: "Progress percentage between 0 and 100" },
    { name: "variant", type: '"default" | "primary" | "success" | "warning" | "destructive"', default: '"default"', description: "Semantic color treatment" },
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Progress bar thickness" },
    { name: "showLabel", type: "boolean", default: "false", description: "Displays percentage text" },
  ],
  alert: [
    { name: "title", type: "string", default: "required", description: "Header title of the banner" },
    { name: "description", type: "string", default: "undefined", description: "Body text providing context" },
    { name: "variant", type: '"default" | "info" | "success" | "warning" | "destructive"', default: '"default"', description: "Severity treatment" },
    { name: "icon", type: "React.ReactNode", default: "undefined", description: "Leading status icon" },
  ],
  dialog: [
    { name: "isOpen", type: "boolean", default: "required", description: "Modal visibility state" },
    { name: "onClose", type: "() => void", default: "required", description: "Dismiss callback triggered on backdrop press" },
    { name: "title", type: "string", default: "undefined", description: "Header title" },
    { name: "description", type: "string", default: "undefined", description: "Supporting message" },
    { name: "children", type: "React.ReactNode", default: "undefined", description: "Dialog content and action buttons" },
  ],
  toast: [
    { name: "title", type: "string", default: "required", description: "Primary notification message" },
    { name: "description", type: "string", default: "undefined", description: "Secondary detail" },
    { name: "variant", type: '"default" | "success" | "error" | "warning"', default: '"default"', description: "Status variant" },
    { name: "onDismiss", type: "() => void", default: "undefined", description: "Callback when toast is dismissed" },
  ],
  tabs: [
    { name: "tabs", type: "Array<{ id: string; label: string; badge?: string }>", default: "required", description: "Tab headers list" },
    { name: "activeTab", type: "string", default: "required", description: "ID of currently active tab" },
    { name: "onTabChange", type: "(tabId: string) => void", default: "required", description: "Tab selection callback" },
  ],
  accordion: [
    { name: "items", type: "Array<{ id: string; title: string; content: string }>", default: "required", description: "Collapsible panel list" },
    { name: "allowMultiple", type: "boolean", default: "false", description: "Allows opening multiple panels simultaneously" },
  ],
  "bottom-sheet": [
    { name: "isOpen", type: "boolean", default: "required", description: "Drawer open state" },
    { name: "onClose", type: "() => void", default: "required", description: "Callback when drawer is dragged or closed" },
    { name: "title", type: "string", default: "undefined", description: "Header title" },
    { name: "snapPoints", type: "string[]", default: '["25%", "50%", "90%"]', description: "Modal height snap points" },
    { name: "children", type: "React.ReactNode", default: "undefined", description: "Drawer content surface" },
  ],
  stack: [
    { name: "direction", type: '"row" | "column"', default: '"column"', description: "Flex layout direction" },
    { name: "align", type: '"start" | "center" | "end" | "stretch"', default: '"stretch"', description: "Cross-axis alignment" },
    { name: "justify", type: '"start" | "center" | "end" | "between" | "around"', default: '"start"', description: "Main-axis distribution" },
    { name: "gap", type: 'number | "sm" | "md" | "lg"', default: '"md"', description: "Spacing between children" },
    { name: "wrap", type: "boolean", default: "false", description: "Enables flex wrapping" },
    { name: "children", type: "React.ReactNode", default: "required", description: "Stacked child elements" },
  ],
  "safe-area": [
    { name: "edges", type: 'Array<"top" | "bottom" | "left" | "right">', default: '["top", "bottom", "left", "right"]', description: "Window insets to respect" },
    { name: "backgroundColor", type: "string", default: '"transparent"', description: "Surface background color" },
    { name: "children", type: "React.ReactNode", default: "required", description: "Safe area protected content" },
  ],
  "data-table": [
    { name: "columns", type: "ColumnDef<T>[]", default: "required", description: "Array of column definitions with header and accessor" },
    { name: "data", type: "T[]", default: "required", description: "Data records array to render in table rows" },
    { name: "striped", type: "boolean", default: "false", description: "Applies alternating zebra-stripe background shading to rows" },
    { name: "onRowPress", type: "(row: T) => void", default: "undefined", description: "Callback triggered when a table row is pressed" },
  ],
  "rating-stars": [
    { name: "rating", type: "number", default: "5", description: "Current rating value between 1 and 5" },
    { name: "maxStars", type: "number", default: "5", description: "Total number of stars rendered" },
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Star icon size preset" },
    { name: "readOnly", type: "boolean", default: "false", description: "Prevents user interaction when used as static score display" },
    { name: "onRatingChange", type: "(rating: number) => void", default: "undefined", description: "Callback triggered when a star is pressed" },
  ],
  "segmented-control": [
    { name: "values", type: "string[]", default: "required", description: "Array of segment tab labels" },
    { name: "selectedIndex", type: "number", default: "0", description: "Currently active segment index" },
    { name: "onChange", type: "(index: number) => void", default: "required", description: "Callback fired when active segment changes" },
    { name: "disabled", type: "boolean", default: "false", description: "Disables user selection" },
  ],
  chip: [
    { name: "label", type: "string", default: "required", description: "Text displayed inside the chip" },
    { name: "selected", type: "boolean", default: "false", description: "Highlights the chip in active selected state" },
    { name: "variant", type: '"default" | "primary" | "outline"', default: '"default"', description: "Visual surface style" },
    { name: "size", type: '"sm" | "md"', default: '"md"', description: "Height and horizontal padding preset" },
    { name: "onPress", type: "() => void", default: "undefined", description: "Callback fired when chip is tapped" },
    { name: "onRemove", type: "() => void", default: "undefined", description: "Renders a trailing remove button and fires on press" },
  ],
  "date-picker": [
    { name: "label", type: "string", default: "undefined", description: "Form field label above the date trigger" },
    { name: "value", type: "string", default: '"2026-11-09"', description: "Selected ISO date string" },
    { name: "onChange", type: "(dateIso: string) => void", default: "undefined", description: "Callback fired when a date is chosen" },
    { name: "disabled", type: "boolean", default: "false", description: "Disables date picker interaction" },
  ],
  "header-bar": [
    { name: "title", type: "string", default: "required", description: "Centered primary screen title" },
    { name: "subtitle", type: "string", default: "undefined", description: "Optional secondary subtitle below title" },
    { name: "onBack", type: "() => void", default: "undefined", description: "Renders leading Back button when provided" },
    { name: "rightLabel", type: "string", default: "undefined", description: "Trailing action button label" },
    { name: "onRightPress", type: "() => void", default: "undefined", description: "Callback for trailing action button" },
  ],
  "bottom-tab-bar": [
    { name: "tabs", type: "Array<{ id: string; label: string; icon?: string; badge?: number }>", default: "required", description: "Navigation tab definitions" },
    { name: "activeTab", type: "string", default: "required", description: "ID of currently active tab" },
    { name: "onTabChange", type: "(tabId: string) => void", default: "required", description: "Callback when user switches tab" },
  ],
  "action-tile": [
    { name: "label", type: "string", default: "required", description: "Primary action title" },
    { name: "subtitle", type: "string", default: "undefined", description: "Secondary helper caption" },
    { name: "icon", type: "string", default: '"⚡"', description: "Icon or emoji glyph rendered inside tile badge" },
    { name: "variant", type: '"default" | "primary" | "outline"', default: '"default"', description: "Visual emphasis preset" },
    { name: "onPress", type: "() => void", default: "undefined", description: "Press handler" },
  ],
  "stat-tile": [
    { name: "label", type: "string", default: "required", description: "Metric title" },
    { name: "value", type: "string", default: "required", description: "Primary formatted KPI value" },
    { name: "delta", type: "string", default: "undefined", description: "Percentage or numeric change pill" },
    { name: "trend", type: '"up" | "down" | "neutral"', default: '"up"', description: "Semantic color of the delta badge" },
    { name: "caption", type: "string", default: "undefined", description: "Supporting comparison text" },
  ],
  "pagination-dots": [
    { name: "total", type: "number", default: "required", description: "Total number of steps or slides" },
    { name: "currentIndex", type: "number", default: "required", description: "Zero-based active slide index" },
    { name: "onDotPress", type: "(index: number) => void", default: "undefined", description: "Optional callback when a dot is tapped" },
  ],
  "error-boundary": [
    { name: "fallbackTitle", type: "string", default: '"Something went wrong"', description: "Alert heading shown when an error is caught" },
    { name: "fallbackMessage", type: "string", default: "undefined", description: "Custom recovery message" },
    { name: "onReset", type: "() => void", default: "undefined", description: "Callback invoked when user presses Try Again" },
  ],

};

export default async function ComponentPage({ params }: ComponentPageProps) {
  const { id } = await params;
  const item = await getItem(id);
  if (!item) notFound();

  const propsList = COMPONENT_PROPS_MAP[item.id] || [];

  const componentJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://nativra.vercel.app",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Docs",
            item: "https://nativra.vercel.app/docs",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Components",
            item: "https://nativra.vercel.app/docs/components",
          },
          {
            "@type": "ListItem",
            position: 4,
            name: item.name,
            item: `https://nativra.vercel.app/docs/components/${item.id}`,
          },
        ],
      },
      {
        "@type": "TechArticle",
        headline: `React Native ${item.name} Component — Nativra`,
        description: item.description,
        url: `https://nativra.vercel.app/docs/components/${item.id}`,
        author: {
          "@type": "Organization",
          name: "Nativra",
          url: "https://nativra.vercel.app",
        },
        about: {
          "@type": "SoftwareSourceCode",
          name: item.name,
          programmingLanguage: "TypeScript",
          runtimePlatform: "React Native & Expo",
          codeRepository: "https://github.com/Imdvlpr99/nativra",
        },
      },
    ],
  };

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(componentJsonLd) }}
      />
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
