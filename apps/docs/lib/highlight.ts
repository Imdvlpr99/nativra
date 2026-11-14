import { createHighlighter, type Highlighter } from "shiki";

/** Languages used across the docs; anything else falls back to plain text. */
const LANGS = ["tsx", "ts", "jsx", "js", "json", "bash", "css", "diff", "markdown"] as const;
export type CodeLang = (typeof LANGS)[number] | "text";
const THEME = "github-dark-default";

let highlighterPromise: Promise<Highlighter> | undefined;

function getHighlighter(): Promise<Highlighter> {
  highlighterPromise ??= createHighlighter({ themes: [THEME], langs: [...LANGS] });
  return highlighterPromise;
}

export function langFromPath(path: string): CodeLang {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "tsx":
    case "ts":
    case "jsx":
    case "js":
    case "json":
    case "css":
      return ext;
    case "sh":
      return "bash";
    case "md":
    case "mdx":
      return "markdown";
    default:
      return "text";
  }
}

/** Loads the highlighter once and returns a synchronous highlight function (for render trees). */
export async function loadHighlight(): Promise<(code: string, lang: string) => string> {
  const highlighter = await getHighlighter();
  const known = new Set<string>(LANGS);
  return (code, lang) =>
    highlighter.codeToHtml(code.replace(/\n$/, ""), {
      lang: known.has(lang) ? lang : lang === "sh" || lang === "shell" ? "bash" : "text",
      theme: THEME,
    });
}

/** Highlights `code` to HTML at build time (server only). Output is shiki's escaped markup. */
export async function highlight(code: string, lang: CodeLang = "tsx"): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code.replace(/\n$/, ""), {
    lang: lang === "text" ? "text" : lang,
    theme: THEME,
  });
}
