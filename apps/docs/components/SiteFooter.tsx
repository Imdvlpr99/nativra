import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";

const COLUMNS: Array<{ title: string; links: Array<{ label: string; href: string; external?: boolean }> }> = [
  {
    title: "Docs",
    links: [
      { label: "Introduction", href: "/docs" },
      { label: "Installation", href: "/docs/installation" },
      { label: "CLI reference", href: "/docs/cli" },
      { label: "Theming", href: "/docs/theming" },
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
    title: "Project",
    links: [
      { label: "GitHub", href: SITE.repo, external: true },
      { label: "npm", href: SITE.npm, external: true },
      { label: "Contributing", href: "/docs/contributing" },
      { label: "Changelog", href: "/docs/changelog" },
    ],
  },
];

export function SiteFooter({ version }: { version: string }) {
  return (
    <footer className="border-t border-border">
      <div className="container-docs grid gap-10 py-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold">
            <Image src="/icon.png" alt="" width={24} height={24} className="rounded" />
            <span>{SITE.name}</span>
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">
            Source-first UI for React Native and Expo. You own every line you install.
          </p>
          <p className="font-mono text-xs text-muted-foreground">nativra-cli v{version} · MIT License</p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title} className="space-y-3">
            <h2 className="text-sm font-semibold">{col.title}</h2>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
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
