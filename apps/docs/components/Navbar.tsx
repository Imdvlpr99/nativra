"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/app/contexts/ThemeContext";
import { Search, Menu, X, ExternalLink } from "lucide-react";
import { SearchDialog } from "./SearchDialog";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Docs", href: "/docs" },
    { name: "Components", href: "/docs/components" },
    { name: "Blocks", href: "/docs/blocks" },
    { name: "Hooks", href: "/docs/hooks" },
    { name: "Theming", href: "/docs/theming" },
    { name: "CLI", href: "/docs/cli" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm font-black text-sm">
                N
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-foreground">Nativra</span>
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                  v0.1
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/docs" && pathname.startsWith(link.href)) ||
                  (link.href === "/docs" && pathname === "/docs");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-zinc-100 text-foreground dark:bg-zinc-800 font-semibold"
                        : "text-muted-foreground hover:bg-zinc-50 hover:text-foreground dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex h-9 items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 text-xs text-muted-foreground transition-colors hover:border-zinc-400 hover:bg-muted/70 sm:w-56 justify-between"
              aria-label="Search documentation"
            >
              <span className="flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Search docs...</span>
                <span className="sm:hidden">Search</span>
              </span>
              <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground sm:inline-block">
                ⌘K
              </kbd>
            </button>

            {/* Studio Link */}
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
              title="Open Nativra Studio visual editor"
            >
              <span>Studio</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>

            {/* GitHub Link */}
            <a
              href="https://github.com/nativra/nativra"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-zinc-100 hover:text-foreground dark:hover:bg-zinc-800"
              aria-label="GitHub Repository"
            >
              <GithubIcon className="h-4 w-4" />
            </a>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile Menu Toggle Button */}
            <button
              className="rounded-lg p-2 text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="border-t border-border bg-background px-4 py-4 lg:hidden animate-in slide-in-from-top-2">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <a
                  href="https://github.com/nativra/nativra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
                >
                  <GithubIcon className="h-4 w-4" />
                  GitHub Repository
                </a>
                <a
                  href="http://localhost:3001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-medium text-sky-600 dark:text-sky-400"
                >
                  Open Studio <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Global Search Dialog */}
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
