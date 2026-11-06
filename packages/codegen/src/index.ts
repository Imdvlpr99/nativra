/**
 * @nativra/codegen — generates project-specific snippets from schema-defined prop values.
 * Pure string generation; never parses TSX.
 */
export type PropValues = Record<string, string | boolean | number>;

/** Convert "use-disclosure" / "button" to a JSX component name. */
function componentName(name: string): string {
  return name.replace(/(^|[-_ ])(\w)/g, (_, __, c: string) => c.toUpperCase());
}

/**
 * Generate a JSX usage snippet. `children` becomes element content; `false`/empty
 * props are omitted; `true` props use shorthand.
 */
export function generateUsage(name: string, props: PropValues): string {
  const tag = componentName(name);
  const attrs = Object.entries(props)
    .filter(([k, v]) => k !== "children" && v !== "" && v !== false)
    .map(([k, v]) => (v === true ? k : typeof v === "number" ? `${k}={${v}}` : `${k}="${v}"`));
  const open = [tag, ...attrs].join(" ");
  const children = props["children"];
  return children !== undefined && children !== ""
    ? `<${open}>${children}</${tag}>`
    : `<${open} />`;
}

export function generateInstallCommand(ids: string | string[], registry?: string): string {
  const list = Array.isArray(ids) ? ids.join(" ") : ids;
  return `npx nativra add ${list}${registry ? ` --registry ${registry}` : ""}`;
}

