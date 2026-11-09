"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ArrowRight,
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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const listRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLAnchorElement>(null);

  const filtered = query.trim() === ""
    ? ITEMS
    : ITEMS.filter(
        (i) =>
          i.name.toLowerCase().includes(query.toLowerCase()) ||
          i.description.toLowerCase().includes(query.toLowerCase()) ||
          i.category.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
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

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filtered[selectedIndex];
      if (target) {
        onClose();
        router.push(target.href);
      }
    }
  };

  if (!isOpen) return null;

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
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-20 backdrop-blur-sm animate-in fade-in-0"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search dialog"
    >
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
            role="combobox"
            aria-expanded={isOpen}
            aria-controls="search-results-list"
            aria-activedescendant={filtered[selectedIndex]?.id}
            placeholder="Type a component, block, hook, or guide..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div
          id="search-results-list"
          ref={listRef}
          role="listbox"
          className="max-h-96 overflow-y-auto p-2"
        >
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <Link
                    key={`${item.category}-${item.id}`}
                    id={item.id}
                    ref={isSelected ? activeItemRef : undefined}
                    href={item.href}
                    onClick={onClose}
                    onMouseEnter={() => setSelectedIndex(index)}
                    role="option"
                    aria-selected={isSelected}
                    className={`flex items-center justify-between rounded-xl p-3 text-left transition-colors ${
                      isSelected
                        ? "bg-zinc-100 dark:bg-zinc-800 text-foreground shadow-xs"
                        : "text-muted-foreground hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    } group`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`rounded-lg p-2 shrink-0 transition-colors ${
                          isSelected
                            ? "bg-background shadow-xs text-foreground"
                            : "bg-muted/60"
                        }`}
                      >
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <span className="truncate">{item.name}</span>
                          <span className="rounded-md bg-secondary/80 px-1.5 py-0.2 text-[10px] font-normal text-muted-foreground shrink-0">
                            {item.category}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1 truncate">
                          {item.description}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-2" />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/30 px-4 py-2.5 text-[11px] text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px]">↑</kbd>{" "}
              <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px]">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px]">↵</kbd> to select
            </span>
          </div>
          <span>
            <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px]">ESC</kbd> to exit
          </span>
        </div>
      </div>
    </div>
  );
}

