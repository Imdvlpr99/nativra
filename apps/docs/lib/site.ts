import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const SITE = {
  name: "Nativra",
  url: "https://nativra.vercel.app",
  repo: "https://github.com/Imdvlpr99/nativra",
  npm: "https://www.npmjs.com/package/nativra-cli",
  tagline: "Native UI, built your way.",
} as const;

let cachedVersion: string | undefined;

/** The published CLI version, read from packages/cli/package.json at build time (never hand-edited). */
export function getCliVersion(): string {
  if (cachedVersion) return cachedVersion;
  try {
    const pkg = JSON.parse(
      readFileSync(resolve(process.cwd(), "../../packages/cli/package.json"), "utf8")
    ) as { version?: string };
    cachedVersion = pkg.version ?? "0.0.0";
  } catch {
    cachedVersion = "0.0.0";
  }
  return cachedVersion;
}

export interface GuideLink {
  title: string;
  href: string;
}

export interface GuideSection {
  title: string;
  links: GuideLink[];
}

/** Hand-written guide pages, in reading order. Registry items are appended from the registry. */
export const GUIDE_SECTIONS: GuideSection[] = [
  {
    title: "Getting started",
    links: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Principles", href: "/docs/principles" },
      { title: "Compatibility", href: "/docs/compatibility" },
    ],
  },
  {
    title: "Guides",
    links: [
      { title: "CLI reference", href: "/docs/cli" },
      { title: "Theming & tokens", href: "/docs/theming" },
      { title: "NativeWind v4", href: "/docs/styling/nativewind" },
      { title: "StyleSheet", href: "/docs/styling/stylesheet" },
    ],
  },
  {
    title: "Project",
    links: [
      { title: "Contributing", href: "/docs/contributing" },
      { title: "Changelog", href: "/docs/changelog" },
    ],
  },
];
