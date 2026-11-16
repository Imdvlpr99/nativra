import React, { useEffect, useRef } from "react";
import type { EditorView } from "@codemirror/view";

/**
 * CodeMirror 6, loaded on the client only. Keyed by file path in the parent, so each file gets a
 * fresh editor; outside changes to the open file (the CLI rewriting it) are applied in place.
 */
export function Editor({
  path,
  value,
  onChange,
}: {
  path: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    let disposed = false;
    void (async () => {
      const [{ basicSetup }, { EditorView: View }, { EditorState }, js, json, css, theme] = await Promise.all([
        import("codemirror"),
        import("@codemirror/view"),
        import("@codemirror/state"),
        import("@codemirror/lang-javascript"),
        import("@codemirror/lang-json"),
        import("@codemirror/lang-css"),
        import("@codemirror/theme-one-dark"),
      ]);
      if (disposed || !host.current) return;
      const language = path.endsWith(".json")
        ? json.json()
        : path.endsWith(".css")
          ? css.css()
          : js.javascript({ jsx: true, typescript: /\.tsx?$/.test(path) });
      view.current = new View({
        parent: host.current,
        state: EditorState.create({
          doc: value,
          extensions: [
            basicSetup,
            language,
            // Code panels are dark in both site modes (like the docs' code blocks).
            theme.oneDark,
            View.lineWrapping,
            View.theme(
              {
                "&": { height: "100%", fontSize: "13px", backgroundColor: "hsl(var(--code-bg))" },
                ".cm-scroller": { fontFamily: "var(--font-mono, ui-monospace, monospace)", lineHeight: "1.65" },
                ".cm-gutters": { backgroundColor: "hsl(var(--code-bg))", borderRight: "1px solid hsl(var(--code-border))" },
                ".cm-activeLine, .cm-activeLineGutter": { backgroundColor: "rgba(255,255,255,0.04)" },
                "&.cm-focused": { outline: "none" },
                ".cm-content": { paddingBlock: "12px" },
              },
              { dark: true }
            ),
            View.updateListener.of((u) => {
              if (u.docChanged) onChangeRef.current(u.state.doc.toString());
            }),
          ],
        }),
      });
    })();
    return () => {
      disposed = true;
      view.current?.destroy();
      view.current = null;
    };
    // The editor is rebuilt per file; value changes are synced below.
  }, [path]);

  // Apply outside edits (e.g. `nativra add --overwrite` rewriting the open file).
  useEffect(() => {
    const v = view.current;
    if (v && v.state.doc.toString() !== value) {
      v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } });
    }
  }, [value]);

  return <div ref={host} className="h-full min-h-0 overflow-hidden" aria-label={`Editor: ${path}`} />;
}
