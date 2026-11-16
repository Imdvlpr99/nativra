#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const targetTag = process.argv[2] || process.env.TAG || "";
const cleanTag = targetTag.replace(/^refs\/tags\//, "").trim();

if (!cleanTag) {
  console.error("Usage: node extract-release-notes.mjs <tag> [output-file]");
  process.exit(1);
}

const changelogPath = path.resolve(process.cwd(), "CHANGELOG.md");
if (!fs.existsSync(changelogPath)) {
  console.error("CHANGELOG.md not found at", changelogPath);
  process.exit(1);
}

const content = fs.readFileSync(changelogPath, "utf8");

// Matches the version's own header: "## [v0.2.3] - 2026-11-10", "## [0.2.3]" or "## v0.2.3".
// The version is escaped and must end there, so v0.3.1 never matches "## [v0.3.10]".
const versionPattern = cleanTag.replace(/^v/, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const headerRegex = new RegExp(`^##\\s*\\[?v?${versionPattern}(?=\\]|\\s|$)\\]?(?:[ \\t]*[-–—][^\\n]*)?`, "im");

const match = headerRegex.exec(content);
if (!match) {
  // A tag without notes is a release mistake: fail so the workflow doesn't publish empty notes.
  console.error(`Version section for ${cleanTag} not found in CHANGELOG.md. Add a "## [${cleanTag}]" section before tagging.`);
  process.exit(1);
}

const startIndex = match.index + match[0].length;
// Find the next `## ` or EOF
const nextHeaderMatch = content.slice(startIndex).search(/\n##\s+/);
let sectionContent = "";
if (nextHeaderMatch === -1) {
  sectionContent = content.slice(startIndex).trim();
} else {
  sectionContent = content.slice(startIndex, startIndex + nextHeaderMatch).trim();
}

sectionContent = sectionContent.replace(/\n*---\s*$/, "").trim();

const fullNotes = `## ${cleanTag}\n\n${sectionContent}`;

const outputFile = process.argv[3];
if (outputFile) {
  const resolvedOut = path.resolve(process.cwd(), outputFile);
  fs.writeFileSync(resolvedOut, fullNotes, "utf8");
  
  // Extract subtitle if present (e.g., "### 🚀 Developer Experience & Ergonomics Upgrade")
  const subtitleMatch = sectionContent.match(/^###\s+([^\n]+)/m);
  const subtitle = subtitleMatch ? subtitleMatch[1].trim() : "Release Notes";
  const title = `${cleanTag} — ${subtitle}`;
  
  const titleFile = path.resolve(path.dirname(resolvedOut), "release-title.txt");
  fs.writeFileSync(titleFile, title, "utf8");
  console.log(`Wrote release notes to ${outputFile} and title "${title}" to ${titleFile}`);
} else {
  process.stdout.write(fullNotes);
}
