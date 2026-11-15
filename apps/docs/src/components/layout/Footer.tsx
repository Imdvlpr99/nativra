import React from "react";
import { Link } from "react-router";
import { CLI_VERSION } from "@/lib/data";
import { SITE } from "@/lib/site";

const COLUMNS: Array<{ title: string; links: Array<{ label: string; href: string; external?: boolean }> }> = [
  {
    title: "Learn",
    links: [
      { label: "Introduction", href: "/docs" },
      { label: "Installation", href: "/docs/installation" },
      { label: "Quick start", href: "/docs/quickstart" },
      { label: "How it works", href: "/docs/principles" },
    ],
  },
  {
    title: "Library",
    links: [
      { label: "Components", href: "/docs/components" },
      { label: "Blocks", href: "/docs/blocks" },
      { label: "Templates", href: "/docs/templates" },
      { label: "Hooks", href: "/docs/hooks" },
      { label: "Themes", href: "/docs/themes" },
    ],
  },
  {
    title: "Reference",
    links: [
      { label: "CLI commands", href: "/docs/cli" },
      { label: "nativra.json", href: "/docs/configuration" },
      { label: "Compatibility", href: "/docs/compatibility" },
      { label: "Changelog", href: "/docs/changelog" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "GitHub", href: SITE.repo, external: true },
      { label: "npm", href: SITE.npm, external: true },
      { label: "Contributing", href: "/docs/contributing" },
      { label: "Report an issue", href: `${SITE.repo}/issues`, external: true },
    ],
  },
];

const linkClass = "text-sm text-muted-foreground transition-colors hover:text-foreground";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container-docs grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="space-y-3 sm:col-span-2 lg:col-span-1">
          <p className="flex items-center gap-2 font-semibold">
            <img src="/icon.png" alt="" width={24} height={16} className="h-4 w-6 object-contain" />
            {SITE.name}
          </p>
          <p className="max-w-xs text-sm text-muted-foreground">Source-first UI for React Native and Expo. The code you install is yours.</p>
          <p className="font-mono text-xs text-muted-foreground">nativra-cli v{CLI_VERSION} · MIT License</p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title} className="space-y-3">
            <h2 className="text-sm font-semibold">{col.title}</h2>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </footer>
  );
}
