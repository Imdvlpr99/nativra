import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

/**
 * One small Shiki instance shared by every code block. Grammars load as separate chunks, the
 * JavaScript regex engine avoids shipping WASM, and the same code runs during prerendering, so
 * the static HTML is already highlighted and hydration reuses it.
 */
export type CodeLang = "tsx" | "ts" | "jsx" | "js" | "json" | "bash" | "css" | "diff" | "markdown" | "text";

const THEME = "github-dark-default";
let promise: Promise<HighlighterCore> | undefined;

export function getHighlighter(): Promise<HighlighterCore> {
  promise ??= createHighlighterCore({
    themes: [import("shiki/themes/github-dark-default.mjs")],
    langs: [
      import("shiki/langs/tsx.mjs"),
      import("shiki/langs/typescript.mjs"),
      import("shiki/langs/jsx.mjs"),
      import("shiki/langs/javascript.mjs"),
      import("shiki/langs/json.mjs"),
      import("shiki/langs/bash.mjs"),
      import("shiki/langs/css.mjs"),
      import("shiki/langs/diff.mjs"),
      import("shiki/langs/markdown.mjs"),
    ],
    engine: createJavaScriptRegexEngine(),
  });
  return promise;
}

const ALIASES: Record<string, CodeLang> = {
  ts: "ts",
  typescript: "ts",
  tsx: "tsx",
  js: "js",
  javascript: "js",
  jsx: "jsx",
  json: "json",
  bash: "bash",
  sh: "bash",
  shell: "bash",
  css: "css",
  diff: "diff",
  md: "markdown",
  mdx: "markdown",
  markdown: "markdown",
};

export function normalizeLang(lang: string | undefined): CodeLang {
  return (lang && ALIASES[lang.toLowerCase()]) || "text";
}

export function langFromPath(path: string): CodeLang {
  return normalizeLang(path.split(".").pop());
}

/** Shiki's escaped HTML for `code`. */
export function toHtml(highlighter: HighlighterCore, code: string, lang: CodeLang): string {
  const shikiLang = lang === "ts" ? "typescript" : lang === "js" ? "javascript" : lang;
  return highlighter.codeToHtml(code.replace(/\n$/, ""), { lang: shikiLang === "text" ? "text" : shikiLang, theme: THEME });
}
