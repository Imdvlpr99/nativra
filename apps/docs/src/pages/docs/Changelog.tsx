import React from "react";
import { Seo } from "@/lib/head";
import changelog from "../../../../../CHANGELOG.md?raw";
import { MarkdownDocs } from "@/components/MarkdownDocs";
import { C, PageHeader, Section } from "@/components/ui/Prose";
import { SITE } from "@/lib/site";


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

const RELEASES = parseChangelog(changelog);

export default function Changelog() {
  const releases = RELEASES;

  return (
    <>
      <Seo title={"Changelog"} description={"Release notes for every Nativra and nativra-cli version, rendered from CHANGELOG.md."} path="/docs/changelog" />
      <PageHeader
        eyebrow="Reference"
        title="Changelog"
        description={
          <>
            Every release of the registry and <C>nativra-cli</C>. The latest version
            on npm is what <C>npx nativra-cli</C> runs.
          </>
        }
        meta={`${releases.length} releases · from CHANGELOG.md`.split(" · ")}
      />
      {releases.map((r) => (
        <Section key={r.version} id={r.version.replace(/\./g, "-")} title={r.version}>
          {r.date && (
            <p className="-mt-2 font-mono text-xs text-muted-foreground">
              <time dateTime={r.date}>{r.date}</time>
            </p>
          )}
          <MarkdownDocs source={r.body} />
        </Section>
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
