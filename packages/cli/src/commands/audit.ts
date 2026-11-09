import type { Command } from "commander";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import chalk from "chalk";
import { readLock } from "../install.js";

export interface AuditFinding {
  file: string;
  line?: number;
  column?: number;
  issue: string;
  rule: string;
}

export interface AuditReport {
  scannedFiles: number;
  installedItemsCount: number;
  interactiveElements: number;
  accessibleInteractiveElements: number;
  hardcodedHexCount: number;
  legacyTouchableCount: number;
  disabledFontScalingCount: number;
  score: number;
  grade: string;
  findings: AuditFinding[];
  fixedCount?: number;
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

function getLineAndCol(content: string, index: number): { line: number; column: number } {
  const prefix = content.slice(0, index);
  const lines = prefix.split("\n");
  const line = lines.length;
  const lastLine = lines[lines.length - 1] ?? "";
  const column = lastLine.length + 1;
  return { line, column };
}

export async function fixLegacyTouchables(cwd: string): Promise<number> {
  const files = await collectSourceFiles(cwd);
  let fixedFiles = 0;

  for (const filePath of files) {
    const relPath = relative(cwd, filePath).replace(/\\/g, "/");
    if (
      relPath.includes("components/ui/") ||
      relPath.includes("blocks/") ||
      relPath.includes("templates/")
    ) {
      continue;
    }

    let content = "";
    try {
      content = await readFile(filePath, "utf8");
    } catch {
      continue;
    }

    if (!/<(TouchableOpacity|TouchableHighlight)\b/.test(content)) {
      continue;
    }

    let modified = content;

    // Replace JSX opening and closing tags
    modified = modified.replace(/<TouchableOpacity\b/g, "<Pressable");
    modified = modified.replace(/<\/TouchableOpacity>/g, "</Pressable>");
    modified = modified.replace(/<TouchableHighlight\b/g, "<Pressable");
    modified = modified.replace(/<\/TouchableHighlight>/g, "</Pressable>");

    // Update imports from react-native
    if (/from\s+["']react-native["']/.test(modified)) {
      if (!/\bPressable\b/.test(modified.match(/import\s*\{([^}]+)\}\s*from\s*["']react-native["']/)?.[1] ?? "")) {
        modified = modified.replace(
          /(import\s*\{)([^}]+)(\}\s*from\s*["']react-native["'])/,
          (m, p1, p2, p3) => {
            const cleaned = p2
              .replace(/\bTouchableOpacity\b,?\s*/g, "")
              .replace(/\bTouchableHighlight\b,?\s*/g, "")
              .trim();
            const withPressable = cleaned ? `${cleaned}, Pressable` : "Pressable";
            return `${p1} ${withPressable} ${p3}`;
          }
        );
      } else {
        modified = modified.replace(
          /(import\s*\{)([^}]+)(\}\s*from\s*["']react-native["'])/,
          (m, p1, p2, p3) => {
            const cleaned = p2
              .replace(/\bTouchableOpacity\b,?\s*/g, "")
              .replace(/\bTouchableHighlight\b,?\s*/g, "")
              .replace(/,\s*,/g, ",")
              .replace(/,\s*$/, "")
              .trim();
            return `${p1} ${cleaned} ${p3}`;
          }
        );
      }
    }

    if (modified !== content) {
      await writeFile(filePath, modified, "utf8");
      fixedFiles++;
    }
  }

  return fixedFiles;
}

export async function runProjectAudit(cwd: string): Promise<AuditReport> {
  const files = await collectSourceFiles(cwd);
  const lock = await readLock(cwd);
  const installedItemsCount = Object.keys(lock.items ?? {}).length;

  let interactiveElements = 0;
  let accessibleInteractiveElements = 0;
  let hardcodedHexCount = 0;
  let legacyTouchableCount = 0;
  let disabledFontScalingCount = 0;
  const findings: AuditFinding[] = [];

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
      } else if (findings.length < 25) {
        const { line, column } = getLineAndCol(content, match.index);
        findings.push({
          file: relPath,
          line,
          column,
          rule: "a11y-interactive-label",
          issue: "Interactive pressable missing accessibilityRole or accessibilityLabel",
        });
      }
    }

    // 2. Count legacy TouchableOpacity / TouchableHighlight outside Nativra-managed files
    if (!isNativraManaged) {
      const legacyRegex = /<(TouchableOpacity|TouchableHighlight)\b/g;
      let legacyMatch: RegExpExecArray | null;
      while ((legacyMatch = legacyRegex.exec(content)) !== null) {
        legacyTouchableCount++;
        if (findings.length < 25) {
          const { line, column } = getLineAndCol(content, legacyMatch.index);
          findings.push({
            file: relPath,
            line,
            column,
            rule: "prefer-nativra-button",
            issue: `Legacy <${legacyMatch[1]}> usage — migrate to Nativra <Button> or <Pressable> (run: nativra audit --fix)`,
          });
        }
      }
    }

    // 3. Count allowFontScaling={false} accessibility violations
    const fontScalingRegex = /allowFontScaling\s*=\s*\{\s*false\s*\}/g;
    let fontScalingMatch: RegExpExecArray | null;
    while ((fontScalingMatch = fontScalingRegex.exec(content)) !== null) {
      disabledFontScalingCount++;
      if (findings.length < 25) {
        const { line, column } = getLineAndCol(content, fontScalingMatch.index);
        findings.push({
          file: relPath,
          line,
          column,
          rule: "dynamic-type-support",
          issue: "allowFontScaling={false} breaks dynamic type & accessibility for users with vision accommodations",
        });
      }
    }

    // 4. Count hardcoded hex colors outside theme/token/ui files
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
  const fontScalingPenalty = Math.min(10, disabledFontScalingCount * 2);
  const score = Math.min(
    100,
    Math.max(0, a11yPoints + adoptionPoints + tokenPoints + modernPrimitivePoints - fontScalingPenalty)
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
    disabledFontScalingCount,
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
    .option("--fix", "Automatically migrate legacy <TouchableOpacity> usages to <Pressable>")
    .action(async (options: { cwd: string; json?: boolean; fix?: boolean }) => {
      let fixedCount = 0;
      if (options.fix) {
        fixedCount = await fixLegacyTouchables(options.cwd);
        if (!options.json) {
          console.log(chalk.green(`\n⚡ Auto-fixed legacy <Touchable*> components in ${fixedCount} file(s).`));
        }
      }

      const report = await runProjectAudit(options.cwd);
      if (fixedCount > 0) {
        report.fixedCount = fixedCount;
      }

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
      if (report.disabledFontScalingCount > 0) {
        console.log(`  Disabled Font Scaling Tags:  ${chalk.yellow(String(report.disabledFontScalingCount))}`);
      }

      const scoreColor =
        report.score >= 85 ? chalk.green : report.score >= 70 ? chalk.yellow : chalk.red;
      console.log(
        `\n  Overall Health Score:        ${scoreColor.bold(
          `${report.score}/100 (${report.grade})`
        )}\n`
      );

      if (report.findings.length > 0) {
        console.log(chalk.bold("  Top Actionable Findings:"));
        for (const f of report.findings.slice(0, 8)) {
          const loc = f.line ? `:${f.line}:${f.column}` : "";
          console.log(`    ${chalk.yellow("•")} ${chalk.cyan(f.file + loc)}: ${f.issue}`);
        }
        console.log("");
      } else {
        console.log(chalk.green("  ✓ Zero accessibility or legacy primitive issues detected!\n"));
      }
    });
}
