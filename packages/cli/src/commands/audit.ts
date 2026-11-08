import type { Command } from "commander";
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import chalk from "chalk";
import { readLock } from "../install.js";

export interface AuditReport {
  scannedFiles: number;
  installedItemsCount: number;
  interactiveElements: number;
  accessibleInteractiveElements: number;
  hardcodedHexCount: number;
  legacyTouchableCount: number;
  score: number;
  grade: string;
  findings: Array<{
    file: string;
    issue: string;
  }>;
}

const IGNORED_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  ".expo",
  ".turbo",
  "dist",
  "build",
  "out",
  "android",
  "ios",
  "coverage",
]);

async function collectSourceFiles(dir: string, results: string[] = []): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectSourceFiles(fullPath, results);
    } else if (entry.isFile() && /\.(tsx|jsx)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

export async function runProjectAudit(cwd: string): Promise<AuditReport> {
  const files = await collectSourceFiles(cwd);
  const lock = await readLock(cwd);
  const installedItemsCount = Object.keys(lock.items ?? {}).length;

  let interactiveElements = 0;
  let accessibleInteractiveElements = 0;
  let hardcodedHexCount = 0;
  let legacyTouchableCount = 0;
  const findings: Array<{ file: string; issue: string }> = [];

  for (const filePath of files) {
    const relPath = relative(cwd, filePath).replace(/\\/g, "/");
    let content = "";
    try {
      content = await readFile(filePath, "utf8");
    } catch {
      continue;
    }

    const isNativraManaged =
      relPath.includes("components/ui/") ||
      relPath.includes("blocks/") ||
      relPath.includes("templates/");

    // 1. Count interactive JSX tags (<Pressable, <TouchableOpacity, <TouchableHighlight)
    const tagRegex = /<(Pressable|TouchableOpacity|TouchableHighlight)\b/g;
    let match: RegExpExecArray | null;
    while ((match = tagRegex.exec(content)) !== null) {
      interactiveElements++;
      const snippet = content.slice(match.index, match.index + 500);
      if (
        isNativraManaged ||
        /accessibilityRole|accessibilityLabel|accessible|\.\.\.props|\.\.\.rest/.test(snippet)
      ) {
        accessibleInteractiveElements++;
      } else if (findings.length < 15) {
        findings.push({
          file: relPath,
          issue: "Interactive pressable missing accessibilityRole or accessibilityLabel",
        });
      }
    }

    // 2. Count legacy TouchableOpacity / TouchableHighlight outside Nativra-managed files
    if (!isNativraManaged) {
      const legacyMatches = content.match(/<(TouchableOpacity|TouchableHighlight)\b/g) ?? [];
      if (legacyMatches.length > 0) {
        legacyTouchableCount += legacyMatches.length;
        if (findings.length < 15) {
          findings.push({
            file: relPath,
            issue: `${legacyMatches.length} legacy <Touchable*> usage(s) — prefer Nativra <Button> or <Pressable>`,
          });
        }
      }
    }

    // 3. Count hardcoded hex colors outside theme/token/ui files
    if (
      !relPath.includes("theme") &&
      !relPath.includes("tokens") &&
      !relPath.includes("components/ui") &&
      !relPath.includes("blocks/") &&
      !relPath.includes("templates/")
    ) {
      const hexMatches = content.match(/#[0-9a-fA-F]{6}\b/g) ?? [];
      if (hexMatches.length > 0) {
        hardcodedHexCount += hexMatches.length;
      }
    }
  }

  const a11yRatio =
    interactiveElements === 0 ? 1 : accessibleInteractiveElements / interactiveElements;
  const a11yPoints = Math.round(a11yRatio * 40);
  const adoptionPoints = installedItemsCount > 0 ? 20 : 10;
  const tokenPoints = Math.max(0, 20 - Math.min(20, Math.floor(hardcodedHexCount / 2)));
  const modernPrimitivePoints = Math.max(0, 20 - Math.min(20, legacyTouchableCount * 4));
  const score = Math.min(
    100,
    Math.max(0, a11yPoints + adoptionPoints + tokenPoints + modernPrimitivePoints)
  );

  const grade =
    score >= 95
      ? "A+"
      : score >= 85
      ? "A"
      : score >= 75
      ? "B"
      : score >= 60
      ? "C"
      : "D";

  return {
    scannedFiles: files.length,
    installedItemsCount,
    interactiveElements,
    accessibleInteractiveElements,
    hardcodedHexCount,
    legacyTouchableCount,
    score,
    grade,
    findings,
  };
}

export function registerAuditCommand(program: Command) {
  program
    .command("audit")
    .description(
      "Audit your React Native codebase for Nativra adoption, design token hygiene, and mobile accessibility coverage"
    )
    .option("--cwd <dir>", "Project root directory", process.cwd())
    .option("--json", "Output structured JSON report for CI pipelines")
    .action(async (options: { cwd: string; json?: boolean }) => {
      const report = await runProjectAudit(options.cwd);

      if (options.json) {
        console.log(JSON.stringify(report, null, 2));
        return;
      }

      console.log(chalk.bold("\n🔍 Nativra Audit — Design System & Accessibility Health\n"));
      console.log(`  Scanned Files (.tsx/.jsx):   ${chalk.cyan(String(report.scannedFiles))}`);
      console.log(`  Installed Nativra Items:     ${chalk.cyan(String(report.installedItemsCount))}`);
      console.log(
        `  Accessible Pressables:       ${chalk.cyan(
          `${report.accessibleInteractiveElements}/${report.interactiveElements}`
        )}`
      );
      console.log(`  Hardcoded Hex Colors:        ${chalk.cyan(String(report.hardcodedHexCount))}`);
      console.log(`  Legacy <Touchable*> Tags:    ${chalk.cyan(String(report.legacyTouchableCount))}`);

      const scoreColor =
        report.score >= 85 ? chalk.green : report.score >= 70 ? chalk.yellow : chalk.red;
      console.log(
        `\n  Overall Health Score:        ${scoreColor.bold(
          `${report.score}/100 (${report.grade})`
        )}\n`
      );

      if (report.findings.length > 0) {
        console.log(chalk.bold("  Top Actionable Findings:"));
        for (const f of report.findings.slice(0, 6)) {
          console.log(`    ${chalk.yellow("•")} ${chalk.dim(f.file)}: ${f.issue}`);
        }
        console.log("");
      } else {
        console.log(chalk.green("  ✓ Zero accessibility or legacy primitive issues detected!\n"));
      }
    });
}

