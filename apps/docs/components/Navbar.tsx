"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { ThemeToggle } from "@/app/contexts/ThemeContext";
import { SearchDialog } from "./SearchDialog";

const REPO_URL = "https://github.com/Imdvlpr99/nativra";

const NAV_LINKS = [
  { name: "Docs", href: "/docs" },
  { name: "Components", href: "/docs/components" },
  { name: "Blocks", href: "/docs/blocks" },
  { name: "Templates", href: "/docs/templates" },
  { name: "Themes", href: "/docs/themes" },
  { name: "CLI", href: "/docs/cli" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/docs") return pathname === "/docs" || /^\/docs\/(installation|principles|compatibility|styling|theming|contributing|changelog)/.test(pathname);
  return pathname === href || pathname.startsWith(`${href}/`);
}

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

export function Navbar({ version }: { version: string }) {
  const pathname = usePathname() ?? "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shortcut, setShortcut] = useState("Ctrl K");

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform)) setShortcut("⌘K");
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((open) => !open);
      } else if (e.key === "/" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 h-[var(--header-height)] border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <div className="container-docs flex h-full items-center gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="Nativra home">
            <Image src="/icon.png" alt="" width={28} height={28} priority className="rounded-md" />
            <span className="text-[15px] font-semibold tracking-tight">Nativra</span>
          </Link>
          <Link
            href="/docs/changelog"
            className="hidden rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
            aria-label={`Version ${version}, view changelog`}
          >
            v{version}
          </Link>

          <nav aria-label="Main" className="ml-4 hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    active ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={openSearch}
              className="hidden h-9 w-60 items-center gap-2 rounded-md border border-border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted md:flex"
              aria-label="Search documentation"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span>Search docs…</span>
              <kbd className="kbd ml-auto">{shortcut}</kbd>
            </button>
            <button
              type="button"
              onClick={openSearch}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
              aria-label="Search documentation"
            >
              <Search className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Nativra on GitHub"
            >
              <GithubIcon className="h-[18px] w-[18px]" />
            </a>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-main-nav"
            >
              {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-main-nav"
            aria-label="Main"
            className="border-b border-border bg-background shadow-sm lg:hidden"
          >
            <ul className="container-docs grid gap-1 py-3">
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-11 items-center rounded-md px-3 text-sm ${
                        active ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </header>
      <SearchDialog isOpen={searchOpen} onClose={closeSearch} />
    </>
  );
}
