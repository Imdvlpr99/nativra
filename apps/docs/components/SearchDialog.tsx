"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  X,
  Box,
  Layers,
  Code,
  Terminal,
  BookOpen,
  Smartphone,
  Palette,
} from "lucide-react";
import searchCatalog from "./searchItems.json";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  name: string;
  category: "Component" | "Block" | "Template" | "Hook" | "Theme" | "Documentation" | "CLI";
  href: string;
  description: string;
}

const ITEMS: SearchItem[] = searchCatalog as SearchItem[];

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
      case "Template":
        return <Smartphone className="h-4 w-4 text-indigo-500" />;
      case "Hook":
        return <Code className="h-4 w-4 text-purple-500" />;
      case "Theme":
        return <Palette className="h-4 w-4 text-rose-500" />;
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
                  key={`${item.category}-${item.id}`}
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

