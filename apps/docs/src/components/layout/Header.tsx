import React, { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, Search, X } from "lucide-react";
import { ThemeToggle } from "@/lib/theme";
import { CLI_VERSION } from "@/lib/data";
import { SITE } from "@/lib/site";
import { SearchDialog } from "./SearchDialog";

const NAV_LINKS = [
  { name: "Docs", href: "/docs" },
  { name: "Components", href: "/docs/components" },
  { name: "Blocks", href: "/docs/blocks" },
  { name: "Templates", href: "/docs/templates" },
  { name: "Themes", href: "/docs/themes" },
  { name: "CLI", href: "/docs/cli" },
  { name: "Playground", href: "/playground" },
];
const SECTION_HREFS = NAV_LINKS.slice(1).map((l) => l.href);

function isActive(pathname: string, href: string): boolean {
  if (href === "/docs") return pathname.startsWith("/docs") && !SECTION_HREFS.some((h) => pathname === h || pathname.startsWith(`${h}/`));
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function GithubIcon({ className }: { className?: string }) {
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

const iconButton =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

export function Header() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shortcut, setShortcut] = useState("Ctrl K");
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform)) setShortcut("⌘K");
    const onKey = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 h-[var(--header-height)] border-b border-border bg-background/80 backdrop-blur-md">
        <div className="absolute inset-x-0 top-0 h-px bg-signature opacity-70" aria-hidden="true" />
        <div className="container-docs flex h-full items-center gap-6">
          <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="Nativra home">
            <img src="/icon.png" alt="" width={30} height={20} className="h-5 w-[30px] object-contain" />
            <span className="font-semibold tracking-tight">Nativra</span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <NavLink
                  key={link.href}
                  to={link.href}
                  end
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                    active ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.name}
                </NavLink>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden h-9 w-60 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm text-muted-foreground transition-colors hover:border-input hover:text-foreground md:flex"
              aria-label="Search documentation"
              aria-keyshortcuts="Control+K Meta+K /"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span>Search…</span>
              <kbd className="kbd ml-auto">{shortcut}</kbd>
            </button>
            <button type="button" onClick={() => setSearchOpen(true)} className={`${iconButton} md:hidden`} aria-label="Search documentation">
              <Search className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
            <a
              href={`${SITE.repo}/releases`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-9 items-center rounded-lg px-2 font-mono text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:inline-flex"
              aria-label={`nativra-cli version ${CLI_VERSION}, releases on GitHub`}
            >
              v{CLI_VERSION}
            </a>
            <a href={SITE.repo} target="_blank" rel="noopener noreferrer" className={iconButton} aria-label="Nativra on GitHub">
              <GithubIcon className="h-[18px] w-[18px]" />
            </a>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className={`${iconButton} lg:hidden`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-main-nav"
            >
              {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="mobile-main-nav" aria-label="Main" className="border-b border-border bg-background lg:hidden">
            <ul className="container-docs grid grid-cols-2 gap-1 py-3 sm:grid-cols-3">
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-11 items-center rounded-lg px-3 text-sm ${
                        active ? "bg-accent font-medium" : "text-muted-foreground hover:bg-accent hover:text-foreground"
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
      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </>
  );
}
