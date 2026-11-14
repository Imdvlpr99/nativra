import type { Command } from "commander";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import chalk from "chalk";
import prompts from "prompts";
import { loadConfig } from "../config.js";
import { createBackup, readLock } from "../install.js";

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

/** Project-relative directory prefixes whose files are Nativra-managed (installed from the registry). */
export async function managedDirs(cwd: string): Promise<string[]> {
  const dirs = ["components/ui", "blocks", "templates"];
  try {
    const config = await loadConfig(cwd);
    dirs.push(config.componentsDir, config.blocksDir ?? config.componentsDir, config.hooksDir, config.themesDir);
  } catch {
    // No nativra.json: fall back to the default layout
  }
  return [...new Set(dirs.map((d) => d.replace(/\\/g, "/").replace(/\/+$/, "")))];
}

function isManagedPath(relPath: string, dirs: string[]): boolean {
  return dirs.some((d) => relPath.startsWith(`${d}/`) || relPath.includes(`/${d}/`));
}

const TOUCHABLE_TAG = /<(TouchableOpacity|TouchableHighlight)\b/;
/** Props that only exist on Touchable* and would be silently dropped (or fail typecheck) on Pressable. */
const TOUCHABLE_ONLY_PROPS = /\b(activeOpacity|underlayColor|onShowUnderlay|onHideUnderlay|touchSoundDisabled)\s*=/;
const RN_NAMED_IMPORT = /import\s*\{([^}]*)\}\s*from\s*["']react-native["']\s*;?/;

export interface TouchableMigration {
  /** Rewritten file content, or null if the file must be migrated by hand. */
  content: string | null;
  reason?: string;
}

/**
 * Rewrites <TouchableOpacity>/<TouchableHighlight> imported from "react-native" to <Pressable>.
 * Refuses (content: null) whenever the rewrite could change behavior or produce invalid code.
 */
export function migrateTouchables(content: string): TouchableMigration {
  if (!TOUCHABLE_TAG.test(content)) return { content: null, reason: "no legacy touchables" };

  const importMatch = content.match(RN_NAMED_IMPORT);
  const specifiers = (importMatch?.[1] ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const usedTouchables = ["TouchableOpacity", "TouchableHighlight"].filter((t) =>
    new RegExp(`<${t}\\b`).test(content)
  );
  if (!importMatch || !usedTouchables.every((t) => specifiers.includes(t))) {
    return { content: null, reason: "touchables are not imported from react-native (or are aliased)" };
  }
  if (TOUCHABLE_ONLY_PROPS.test(content)) {
    return { content: null, reason: "uses Touchable-only props (activeOpacity, underlayColor, ...)" };
  }

  const nextSpecifiers = specifiers.filter((s) => !usedTouchables.includes(s));
  if (!nextSpecifiers.includes("Pressable")) nextSpecifiers.push("Pressable");

  let modified = content.replace(importMatch[0], `import { ${nextSpecifiers.join(", ")} } from "react-native";`);
  for (const t of usedTouchables) {
    modified = modified
      .replace(new RegExp(`<${t}\\b`, "g"), "<Pressable")
      .replace(new RegExp(`</${t}>`, "g"), "</Pressable>");
  }
  return { content: modified };
}

export interface FixResult {
  changed: Array<{ file: string; content: string }>;
  skipped: Array<{ file: string; reason: string }>;
}

/** Plans the Touchable -> Pressable migration without writing anything. */
export async function planLegacyTouchableFix(cwd: string): Promise<FixResult> {
  const files = await collectSourceFiles(cwd);
  const dirs = await managedDirs(cwd);
  const result: FixResult = { changed: [], skipped: [] };

  for (const filePath of files) {
    const relPath = relative(cwd, filePath).replace(/\\/g, "/");
    if (isManagedPath(relPath, dirs)) continue;

    let content: string;
    try {
      content = await readFile(filePath, "utf8");
    } catch (err) {
      result.skipped.push({ file: relPath, reason: `unreadable: ${(err as Error).message}` });
      continue;
    }
    if (!TOUCHABLE_TAG.test(content)) continue;

    const migration = migrateTouchables(content);
    if (migration.content === null) {
      result.skipped.push({ file: relPath, reason: migration.reason ?? "unsupported" });
    } else if (migration.content !== content) {
      result.changed.push({ file: filePath, content: migration.content });
    }
  }
  return result;
}

/** Applies a planned fix, backing every file up first (`nativra rollback audit-fix` restores it). */
export async function applyLegacyTouchableFix(cwd: string, plan: FixResult): Promise<number> {
  if (plan.changed.length === 0) return 0;
  await createBackup(
    cwd,
    "audit-fix",
    plan.changed.map((c) => ({ destPath: c.file, exists: true }))
  );
  for (const { file, content } of plan.changed) {
    await writeFile(file, content, "utf8");
  }
  return plan.changed.length;
}

export async function runProjectAudit(cwd: string): Promise<AuditReport> {
  const files = await collectSourceFiles(cwd);
  const dirs = await managedDirs(cwd);
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

    const isNativraManaged = isManagedPath(relPath, dirs);

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
      !isNativraManaged
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
    .option("--fix", "Migrate legacy <TouchableOpacity>/<TouchableHighlight> to <Pressable> (files are backed up first)")
    .option("--dry-run", "With --fix: list the files that would change without writing them")
    .option("--yes", "With --fix: skip the confirmation prompt")
    .action(async (options: { cwd: string; json?: boolean; fix?: boolean; dryRun?: boolean; yes?: boolean }) => {
      let fixedCount = 0;
      if (options.fix) {
        const plan = await planLegacyTouchableFix(options.cwd);
        if (!options.json) {
          for (const c of plan.changed) console.log(chalk.cyan(`  ~ ${relative(options.cwd, c.file)}`));
          for (const s of plan.skipped) console.log(chalk.yellow(`  ! ${s.file}: skipped — ${s.reason}; migrate manually`));
        }

        let proceed = plan.changed.length > 0 && !options.dryRun;
        if (proceed && !options.yes) {
          if (!process.stdin.isTTY) {
            console.error(chalk.red("\n✗ audit --fix rewrites source files; pass --yes to confirm in non-interactive mode.\n"));
            process.exit(1);
          }
          ({ proceed } = await prompts({
            type: "confirm",
            name: "proceed",
            message: `Rewrite ${plan.changed.length} file(s)? Pressable has no default press feedback, so review the result.`,
            initial: false,
          }));
        }
        if (proceed) {
          fixedCount = await applyLegacyTouchableFix(options.cwd, plan);
          if (!options.json) {
            console.log(chalk.green(`\n⚡ Migrated ${fixedCount} file(s). Undo with: nativra rollback audit-fix`));
          }
        } else if (!options.json && options.dryRun) {
          console.log(chalk.gray(`\n[Dry Run] ${plan.changed.length} file(s) would change.`));
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
