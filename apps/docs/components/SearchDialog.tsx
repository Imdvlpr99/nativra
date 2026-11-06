"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, X, Box, Layers, Code, Terminal, BookOpen } from "lucide-react";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  name: string;
  category: "Component" | "Block" | "Hook" | "Documentation" | "CLI";
  href: string;
  description: string;
}

const ITEMS: SearchItem[] = [
  // Documentation
  { id: "intro", name: "Introduction", category: "Documentation", href: "/docs", description: "Source-first UI philosophy & core principles" },
  { id: "install", name: "Installation Guide", category: "Documentation", href: "/docs/installation", description: "Expo SDK 51/52, NativeWind, and StyleSheet setup" },
  { id: "principles", name: "Principles & Architecture", category: "Documentation", href: "/docs/principles", description: "Deep dive into source ownership and dual targets" },
  { id: "compatibility", name: "Platform Compatibility Matrix", category: "Documentation", href: "/docs/compatibility", description: "Android, iOS, Expo Go, and Fabric verification table" },
  { id: "cli", name: "CLI Reference", category: "CLI", href: "/docs/cli", description: "Commands for init, add, diff, update, doctor" },
  { id: "theming", name: "Theming & Tokens", category: "Documentation", href: "/docs/theming", description: "Semantic color tokens and theme gallery" },
  { id: "nativewind", name: "NativeWind Guide", category: "Documentation", href: "/docs/styling/nativewind", description: "Tailwind CSS styling for React Native" },
  { id: "stylesheet", name: "StyleSheet Guide", category: "Documentation", href: "/docs/styling/stylesheet", description: "Pure React Native StyleSheet without dependencies" },
  { id: "templates", name: "Screen Templates", category: "Block", href: "/docs/templates", description: "Full-screen mobile flows: Auth, Settings, Dashboard" },
  { id: "contributing", name: "Contribution Guide", category: "Documentation", href: "/docs/contributing", description: "How to author dual-target components and build the registry" },
  { id: "changelog", name: "Changelog", category: "Documentation", href: "/docs/changelog", description: "Release notes and roadmap history for v0.1.0" },

  // Components
  { id: "button", name: "Button", category: "Component", href: "/docs/components/button", description: "Pressable button with variant and size presets" },
  { id: "badge", name: "Badge", category: "Component", href: "/docs/components/badge", description: "Status badge with rounded full pill styling" },
  { id: "card", name: "Card", category: "Component", href: "/docs/components/card", description: "Elevated or outlined content container" },
  { id: "input", name: "Input", category: "Component", href: "/docs/components/input", description: "Text input with label, placeholder, and error states" },
  { id: "separator", name: "Separator", category: "Component", href: "/docs/components/separator", description: "Horizontal and vertical divider lines" },
  { id: "text", name: "Text", category: "Component", href: "/docs/components/text", description: "Typography component with semantic heading and body variants" },
  { id: "label", name: "Label", category: "Component", href: "/docs/components/label", description: "Accessible form label with required asterisk" },
  { id: "checkbox", name: "Checkbox", category: "Component", href: "/docs/components/checkbox", description: "Accessible toggleable checkmark" },
  { id: "switch", name: "Switch", category: "Component", href: "/docs/components/switch", description: "Accessible toggle switch with themed colors" },
  { id: "skeleton", name: "Skeleton", category: "Component", href: "/docs/components/skeleton", description: "Loading placeholder with pulse animation" },
  { id: "spinner", name: "Spinner", category: "Component", href: "/docs/components/spinner", description: "Activity indicator with size presets" },
  { id: "avatar", name: "Avatar", category: "Component", href: "/docs/components/avatar", description: "Profile avatar with image and text fallback" },

  // Blocks
  { id: "login-form", name: "Login Form", category: "Block", href: "/docs/blocks", description: "Full authentication block with email and password" },
  { id: "empty-state", name: "Empty State", category: "Block", href: "/docs/blocks", description: "Empty state card with title and action button" },

  // Hooks
  { id: "use-disclosure", name: "useDisclosure", category: "Hook", href: "/docs/hooks", description: "Hook for managing boolean disclosure states" },
];

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
          const searchBtn = document.querySelector('[aria-label="Search documentation"]') as HTMLButtonElement | null;
          searchBtn?.click();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim() === ""
    ? ITEMS
    : ITEMS.filter(
        (i) =>
          i.name.toLowerCase().includes(query.toLowerCase()) ||
          i.description.toLowerCase().includes(query.toLowerCase()) ||
          i.category.toLowerCase().includes(query.toLowerCase())
      );

  const getCategoryIcon = (category: SearchItem["category"]) => {
    switch (category) {
      case "Component":
        return <Box className="h-4 w-4 text-sky-500" />;
      case "Block":
        return <Layers className="h-4 w-4 text-emerald-500" />;
      case "Hook":
        return <Code className="h-4 w-4 text-purple-500" />;
      case "CLI":
        return <Terminal className="h-4 w-4 text-amber-500" />;
      default:
        return <BookOpen className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-20 backdrop-blur-sm animate-in fade-in-0">
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a component, block, hook, or guide..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-xl p-3 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800/60 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-muted/60 p-2 group-hover:bg-background">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                        {item.name}
                        <span className="rounded-md bg-secondary/80 px-1.5 py-0.2 text-[10px] font-normal text-muted-foreground">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/30 px-4 py-2.5 text-[11px] text-muted-foreground flex items-center justify-between">
          <span>Navigate with click or arrow keys</span>
          <span>Press <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px]">ESC</kbd> to exit</span>
        </div>
      </div>
    </div>
  );
}

