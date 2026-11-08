"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Layers,
  Sparkles,
  Terminal,
  Palette,
  Cpu,
  GitPullRequest,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  badge?: string;
}

interface NavSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
}

const SIDEBAR_SECTIONS: NavSection[] = [
  {
    title: "Getting Started",
    icon: BookOpen,
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Principles & Architecture", href: "/docs/principles" },
      { title: "Compatibility Matrix", href: "/docs/compatibility" },
    ],
  },
  {
    title: "Styling & Theming",
    icon: Palette,
    items: [
      { title: "Theme Engine & Tokens", href: "/docs/theming" },
      { title: "NativeWind v4 Guide", href: "/docs/styling/nativewind" },
      { title: "React Native StyleSheet", href: "/docs/styling/stylesheet" },
    ],
  },
  {
    title: "Tooling & CLI",
    icon: Terminal,
    items: [
      { title: "CLI Reference", href: "/docs/cli" },
    ],
  },
  {
    title: "Components",
    icon: Layers,
    items: [
      { title: "Overview", href: "/docs/components", badge: "39" },
      { title: "Accordion", href: "/docs/components/accordion" },
      { title: "Action Tile", href: "/docs/components/action-tile", badge: "New" },
      { title: "Alert", href: "/docs/components/alert" },
      { title: "Avatar", href: "/docs/components/avatar" },
      { title: "Badge", href: "/docs/components/badge" },
      { title: "Bottom Sheet", href: "/docs/components/bottom-sheet" },
      { title: "Bottom Tab Bar", href: "/docs/components/bottom-tab-bar", badge: "New" },
      { title: "Button", href: "/docs/components/button" },
      { title: "Card", href: "/docs/components/card" },
      { title: "Checkbox", href: "/docs/components/checkbox" },
      { title: "Chip", href: "/docs/components/chip", badge: "New" },
      { title: "Data Table", href: "/docs/components/data-table" },
      { title: "Date Picker", href: "/docs/components/date-picker", badge: "New" },
      { title: "Dialog", href: "/docs/components/dialog" },
      { title: "Error Boundary", href: "/docs/components/error-boundary", badge: "New" },
      { title: "Fab", href: "/docs/components/fab" },
      { title: "Header Bar", href: "/docs/components/header-bar", badge: "New" },
      { title: "Icon Button", href: "/docs/components/icon-button" },
      { title: "Input", href: "/docs/components/input" },
      { title: "Label", href: "/docs/components/label" },
      { title: "OTP Input", href: "/docs/components/otp-input" },
      { title: "Pagination Dots", href: "/docs/components/pagination-dots", badge: "New" },
      { title: "Progress", href: "/docs/components/progress" },
      { title: "Radio Group", href: "/docs/components/radio-group" },
      { title: "Rating Stars", href: "/docs/components/rating-stars" },
      { title: "Safe Area", href: "/docs/components/safe-area" },
      { title: "Segmented Control", href: "/docs/components/segmented-control" },
      { title: "Select", href: "/docs/components/select" },
      { title: "Separator", href: "/docs/components/separator" },
      { title: "Skeleton", href: "/docs/components/skeleton" },
      { title: "Slider", href: "/docs/components/slider" },
      { title: "Spinner", href: "/docs/components/spinner" },
      { title: "Stack", href: "/docs/components/stack" },
      { title: "Stat Tile", href: "/docs/components/stat-tile", badge: "New" },
      { title: "Switch", href: "/docs/components/switch" },
      { title: "Tabs", href: "/docs/components/tabs" },
      { title: "Text", href: "/docs/components/text" },
      { title: "Textarea", href: "/docs/components/textarea" },
      { title: "Toast", href: "/docs/components/toast" },
    ],
  },
  {
    title: "Compositions & Flows",
    icon: Cpu,
    items: [
      { title: "All Blocks", href: "/docs/blocks", badge: "18" },
      { title: "Screen Templates", href: "/docs/templates", badge: "8" },
    ],
  },
  {
    title: "Hooks & Utilities",
    icon: Sparkles,
    items: [
      { title: "All Hooks", href: "/docs/hooks", badge: "7" },
    ],
  },
  {
    title: "Project & Community",
    icon: GitPullRequest,
    items: [
      { title: "Contribution Guide", href: "/docs/contributing" },
      { title: "Changelog", href: "/docs/changelog", badge: "v0.2" },
    ],
  },
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full text-sm">
      <div className="space-y-6">
        {SIDEBAR_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="space-y-2">
              <div className="flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Icon className="h-3.5 w-3.5" />
                <span>{section.title}</span>
              </div>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`group flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                          isActive
                            ? "bg-zinc-100 font-semibold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-100"
                        }`}
                      >
                        <span className="truncate">{item.title}</span>
                        {item.badge && (
                          <span
                            className={`ml-2 rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                              isActive
                                ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mt-8 border-t border-border pt-6 px-2">
        <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <Terminal className="h-3.5 w-3.5 text-sky-500" />
            <span>Nativra CLI</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground font-mono">
            $ npx nativra-cli add &lt;item&gt;
          </p>
          <Link
            href="/docs/cli"
            className="mt-2.5 inline-flex items-center text-[11px] font-medium text-sky-600 hover:underline dark:text-sky-400"
          >
            Explore CLI Guide →
          </Link>
        </div>
      </div>
    </aside>
  );
}
