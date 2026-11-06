import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Screen Templates",
  description:
    "Full-screen composite mobile patterns and screen flows built with Nativra components",
};

interface ScreenTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  componentsUsed: string[];
  installCommand: string;
  previewHighlights: string[];
}

const TEMPLATES: ScreenTemplate[] = [
  {
    id: "auth-flow",
    name: "Authentication Flow",
    category: "Onboarding & Auth",
    description:
      "A complete sign-in and account creation screen with input validation, password reveal state, social provider separator, and primary press actions.",
    componentsUsed: ["button", "input", "card", "separator", "text"],
    installCommand: "npx nativra add button input card separator text",
    previewHighlights: [
      "Auto-capitalization and keyboardType presets",
      "Inline error validation and helper messages",
      "Semantic primary button with loading state",
    ],
  },
  {
    id: "profile-settings",
    name: "Account & Settings",
    category: "User Profile",
    description:
      "User settings dashboard featuring profile avatar, notification toggle switches, dark mode preference, and security options.",
    componentsUsed: ["avatar", "badge", "card", "switch", "separator", "button"],
    installCommand: "npx nativra add avatar badge card switch separator button",
    previewHighlights: [
      "Avatar with fallback initials",
      "Accessible toggle switches for push alerts",
      "Destructive logout action with confirmation state",
    ],
  },
  {
    id: "metrics-dashboard",
    name: "Mobile Activity Dashboard",
    category: "Analytics & Stats",
    description:
      "Executive overview with elevated metric summary cards, recent activity feed with status badges, and quick action buttons.",
    componentsUsed: ["card", "badge", "button", "text", "skeleton"],
    installCommand: "npx nativra add card badge button text skeleton",
    previewHighlights: [
      "Elevated depth cards with customizable padding",
      "Skeleton pulse placeholders for loading state",
      "Status indicator badges for completed tasks",
    ],
  },
  {
    id: "empty-workspace",
    name: "Zero-Data Empty State",
    category: "Feedback & Guidance",
    description:
      "Friendly empty state card with vector icon placeholder, helpful onboarding copy, and primary action to create the first resource.",
    componentsUsed: ["card", "button", "text"],
    installCommand: "npx nativra add card button text",
    previewHighlights: [
      "Clean dashed surface container",
      "Guided call-to-action button",
      "Semantic muted helper typography",
    ],
  },
];

export default function TemplatesPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-border pb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">
          Screen Architecture
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Screen Templates
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
          Pre-assembled full mobile screen flows built exclusively with Nativra foundation components. Copy the screen code, own the layout, and adapt to your routing solution.
        </p>
      </div>

      {/* Templates Grid */}
      <div className="space-y-8">
        {TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.id}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-foreground">
                    {tmpl.name}
                  </h2>
                  <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-semibold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                    {tmpl.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 max-w-xl">
                  {tmpl.description}
                </p>
              </div>

              {/* Install Command */}
              <div className="flex items-center gap-2 font-mono text-xs rounded-lg border border-border bg-muted/40 px-3 py-1.5">
                <span className="text-muted-foreground">$</span>
                <span className="text-foreground">{tmpl.installCommand}</span>
              </div>
            </div>

            {/* Architecture Details */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Components Used
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {tmpl.componentsUsed.map((comp) => (
                    <Link
                      key={comp}
                      href={`/docs/components/${comp}`}
                      className="rounded-md border border-border bg-muted/30 px-2.5 py-1 text-xs font-mono text-foreground hover:bg-muted transition-colors"
                    >
                      {comp}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Pattern Features
                </span>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {tmpl.previewHighlights.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
