import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, FileCode2, FileJson, FileText, Folder } from "lucide-react";

interface Node {
  name: string;
  path: string;
  children?: Node[];
}

function buildTree(paths: string[]): Node[] {
  const root: Node = { name: "", path: "", children: [] };
  for (const path of paths) {
    let node = root;
    const parts = path.split("/");
    parts.forEach((part, i) => {
      const isFile = i === parts.length - 1;
      const childPath = parts.slice(0, i + 1).join("/");
      let child = node.children!.find((c) => c.name === part && Boolean(c.children) !== isFile);
      if (!child) {
        child = { name: part, path: childPath, ...(isFile ? {} : { children: [] }) };
        node.children!.push(child);
      }
      node = child;
    });
  }
  const sort = (nodes: Node[]): Node[] =>
    nodes
      .sort((a, b) => Number(Boolean(b.children)) - Number(Boolean(a.children)) || a.name.localeCompare(b.name))
      .map((n) => (n.children ? { ...n, children: sort(n.children) } : n));
  return sort(root.children!);
}

function FileIcon({ name }: { name: string }) {
  const cls = "h-3.5 w-3.5 shrink-0";
  if (name.endsWith(".json")) return <FileJson className={`${cls} text-amber-500`} aria-hidden="true" />;
  if (/\.(tsx?|jsx?)$/.test(name)) return <FileCode2 className={`${cls} text-sky-500`} aria-hidden="true" />;
  return <FileText className={`${cls} text-muted-foreground`} aria-hidden="true" />;
}

/** The project's files as a collapsible tree; folders start open. */
export function FileTree({ paths, selected, onSelect }: { paths: string[]; selected: string; onSelect: (path: string) => void }) {
  const tree = useMemo(() => buildTree(paths), [paths]);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const render = (nodes: Node[], depth: number): React.ReactNode =>
    nodes.map((node) => {
      const pad = { paddingLeft: `${depth * 12 + 8}px` };
      if (node.children) {
        const open = !collapsed.has(node.path);
        return (
          <li key={node.path}>
            <button
              type="button"
              style={pad}
              aria-expanded={open}
              onClick={() =>
                setCollapsed((s) => {
                  const next = new Set(s);
                  if (open) next.add(node.path);
                  else next.delete(node.path);
                  return next;
                })
              }
              className="flex w-full items-center gap-1 rounded py-1 pr-2 text-left text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {open ? <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" /> : <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
              <Folder className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              <span className="truncate">{node.name}</span>
            </button>
            {open && <ul>{render(node.children, depth + 1)}</ul>}
          </li>
        );
      }
      const active = node.path === selected;
      return (
        <li key={node.path}>
          <button
            type="button"
            style={pad}
            aria-current={active ? "true" : undefined}
            onClick={() => onSelect(node.path)}
            className={`flex w-full items-center gap-1.5 rounded py-1 pl-5 pr-2 text-left text-[13px] ${
              active ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <FileIcon name={node.name} />
            <span className="truncate">{node.name}</span>
          </button>
        </li>
      );
    });

  return (
    <nav aria-label="Project files" className="h-full overflow-y-auto py-2">
      <ul>{render(tree, 0)}</ul>
    </nav>
  );
}
