import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Metadata } from "next";
import { MarkdownDocs } from "@/components/MarkdownDocs";
import { DocsHeader, DocsSection } from "@/components/docs/Prose";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Changelog — Nativra and nativra-cli releases",
  description: "Release notes for every Nativra and nativra-cli version, rendered from CHANGELOG.md.",
  alternates: { canonical: "/docs/changelog" },
};

interface Release {
  version: string;
  date?: string;
  body: string;
}

/** Splits CHANGELOG.md ("## [v1.2.3] - 2026-01-01" sections) into releases. */
function parseChangelog(md: string): Release[] {
  return md
    .split(/^## /m)
    .slice(1)
    .map((section) => {
      const [heading = "", ...rest] = section.split(/\r?\n/);
      const m = heading.match(/^\[?([^\]\s]+)\]?(?:\s*-\s*(\S+))?/);
      return {
        version: m?.[1] ?? heading.trim(),
        ...(m?.[2] ? { date: m[2] } : {}),
        body: rest.join("\n").replace(/^\s*---\s*$/gm, "").trim(),
      };
    })
    .filter((r) => r.body.length > 0);
}

export default async function ChangelogPage() {
  const md = await readFile(resolve(process.cwd(), "../../CHANGELOG.md"), "utf8");
  const releases = parseChangelog(md);

  return (
    <>
      <DocsHeader
        eyebrow="Project"
        title="Changelog"
        description={
          <>
            Every release of the registry and <code className="font-mono text-foreground">nativra-cli</code>. The latest version
            on npm is what <code className="font-mono text-foreground">npx nativra-cli</code> runs.
          </>
        }
        meta={`${releases.length} releases · from CHANGELOG.md`}
      />
      {releases.map((r) => (
        <DocsSection key={r.version} id={r.version.replace(/\./g, "-")} title={r.version}>
          {r.date && (
            <p className="-mt-2 font-mono text-xs text-muted-foreground">
              <time dateTime={r.date}>{r.date}</time>
            </p>
          )}
          <MarkdownDocs source={r.body} />
        </DocsSection>
      ))}
      <p className="mt-12 text-sm text-muted-foreground">
        Full history on{" "}
        <a className="link" href={`${SITE.repo}/releases`} target="_blank" rel="noopener noreferrer">
          GitHub Releases
        </a>
        .
      </p>
    </>
  );
}
