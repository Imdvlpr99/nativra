import { ITEM_TYPE_ORDER, TYPE_META, catalogHref, itemHref } from "./item-types";
import { itemsOfType } from "./data";

export const SITE = {
  name: "Nativra",
  url: "https://nativra.vercel.app",
  repo: "https://github.com/Imdvlpr99/nativra",
  npm: "https://www.npmjs.com/package/nativra-cli",
} as const;

export interface NavLink {
  title: string;
  href: string;
  /** One-line summary, used by search */
  description?: string;
  tag?: string;
}

export interface NavSection {
  title: string;
  /** Catalog page for library sections */
  href?: string;
  library?: boolean;
  links: NavLink[];
}

/**
 * Hand-written pages in reading order. Sidebar, pager and search all follow it,
 * so the docs read like a course: start → concepts → day-to-day work → reference.
 */
export const GUIDES: NavSection[] = [
  {
    title: "Get started",
    links: [
      { title: "Introduction", href: "/docs", description: "What Nativra is and who it is for" },
      { title: "Installation", href: "/docs/installation", description: "Run init and add your first component" },
      { title: "Quick start", href: "/docs/quickstart", description: "Build, edit, theme and update a sign-in screen" },
    ],
  },
  {
    title: "Concepts",
    links: [
      { title: "How it works", href: "/docs/principles", description: "Registry, CLI, import rewriting and the lockfile" },
      { title: "Theming", href: "/docs/theming", description: "Semantic tokens, presets and switching themes" },
      { title: "NativeWind", href: "/docs/styling/nativewind", description: "Set up NativeWind v4 for Nativra components" },
      { title: "StyleSheet", href: "/docs/styling/stylesheet", description: "The zero-configuration styling target" },
    ],
  },
  {
    title: "Guides",
    links: [
      { title: "Updating & rollback", href: "/docs/updating", description: "diff, update, rollback and remove" },
      { title: "Doctor & audit", href: "/docs/doctor-audit", description: "Check your setup and your UI code" },
      { title: "Custom registries", href: "/docs/registries", description: "Host and install your own items" },
      { title: "AI agents (MCP)", href: "/docs/ai-agents", description: "Let Claude Code, Cursor and other agents install components" },
    ],
  },
  {
    title: "Reference",
    links: [
      { title: "CLI commands", href: "/docs/cli", description: "Every command and flag" },
      { title: "nativra.json", href: "/docs/configuration", description: "Every configuration key" },
      { title: "Compatibility", href: "/docs/compatibility", description: "Supported versions and platforms" },
      { title: "Changelog", href: "/docs/changelog", description: "Release notes" },
      { title: "Contributing", href: "/docs/contributing", description: "Add an item to the registry" },
    ],
  },
];

/** Full sidebar: guides, then one section per registry item type. */
export const NAV: NavSection[] = [
  ...GUIDES,
  ...ITEM_TYPE_ORDER.map((type) => ({
    title: TYPE_META[type].plural,
    href: catalogHref(type),
    library: true,
    links: itemsOfType(type).map((i) => ({
      title: i.name,
      href: itemHref(type, i.id),
      description: i.description,
      ...(i.status !== "stable" ? { tag: i.status } : {}),
    })),
  })).filter((s) => s.links.length > 0),
];

/** Pages in reading order, for previous/next links. */
export const READING_ORDER: Array<NavLink & { section: string }> = NAV.flatMap((s) => [
  ...(s.href ? [{ title: `All ${s.title.toLowerCase()}`, href: s.href, section: s.title }] : []),
  ...s.links.map((l) => ({ ...l, section: s.title })),
]);

/** Repository path of the file behind a docs URL, for "Edit this page" links. */
export function sourcePathFor(pathname: string): string | null {
  const item = /^\/docs\/(components|blocks|templates|hooks|utilities|themes)\/([a-z0-9-]+)$/.exec(pathname);
  if (item) return `registry/default/${item[1]}/${item[2]}`;
  const page = PAGE_FILES[pathname];
  return page ? `apps/docs/src/pages/${page}` : null;
}

const PAGE_FILES: Record<string, string> = {
  "/docs": "docs/Introduction.tsx",
  "/docs/installation": "docs/Installation.tsx",
  "/docs/quickstart": "docs/Quickstart.tsx",
  "/docs/principles": "docs/HowItWorks.tsx",
  "/docs/theming": "docs/Theming.tsx",
  "/docs/styling/nativewind": "docs/NativeWind.tsx",
  "/docs/styling/stylesheet": "docs/StyleSheet.tsx",
  "/docs/updating": "docs/Updating.tsx",
  "/docs/doctor-audit": "docs/DoctorAudit.tsx",
  "/docs/registries": "docs/Registries.tsx",
  "/docs/ai-agents": "docs/AiAgents.tsx",
  "/docs/cli": "docs/Cli.tsx",
  "/docs/configuration": "docs/Configuration.tsx",
  "/docs/compatibility": "docs/Compatibility.tsx",
  "/docs/changelog": "docs/Changelog.tsx",
  "/docs/contributing": "docs/Contributing.tsx",
};
