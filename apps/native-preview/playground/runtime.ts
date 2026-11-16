/**
 * Compiles and runs a playground project in the browser: every .ts/.tsx file is transformed with
 * Sucrase (TypeScript + JSX + ES modules -> CommonJS) and loaded through a tiny module system.
 * Bare imports resolve to the bundled packages in ./modules; "./x" and "@/x" resolve to project
 * files ("@/" is the project root, matching the playground's tsconfig alias).
 */
import type { ComponentType } from "react";
import { transform } from "sucrase";
import { MODULES } from "./modules";

export type ProjectFiles = Record<string, string>;

export class PlaygroundError extends Error {
  constructor(
    message: string,
    readonly file?: string
  ) {
    super(message);
    this.name = "PlaygroundError";
  }
}

const EXTENSIONS = ["", ".tsx", ".ts", ".jsx", ".js", "/index.tsx", "/index.ts", "/index.js"];

function normalize(path: string): string {
  const out: string[] = [];
  for (const part of path.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") out.pop();
    else out.push(part);
  }
  return out.join("/");
}

const dirname = (path: string) => path.split("/").slice(0, -1).join("/");

function resolveFile(files: ProjectFiles, spec: string, from: string): string | null {
  const base = spec.startsWith("@/") ? normalize(spec.slice(2)) : normalize(`${dirname(from)}/${spec}`);
  for (const ext of EXTENSIONS) {
    if (Object.prototype.hasOwnProperty.call(files, base + ext)) return base + ext;
  }
  return null;
}

/** Runs the project and returns its App component (default export of App.tsx). */
export function loadApp(files: ProjectFiles, entry = "App.tsx"): ComponentType {
  const cache = new Map<string, { exports: Record<string, unknown> }>();

  const load = (spec: string, from: string): unknown => {
    if (spec.endsWith(".css")) return {};
    if (Object.prototype.hasOwnProperty.call(MODULES, spec)) return MODULES[spec];
    if (!spec.startsWith(".") && !spec.startsWith("@/")) {
      throw new PlaygroundError(
        `Cannot import "${spec}" in ${from}: the playground provides react, react-native, react-native-svg, ` +
          `lucide-react-native, react-native-safe-area-context, expo-haptics, clsx, tailwind-merge and class-variance-authority.`,
        from
      );
    }
    const path = resolveFile(files, spec, from);
    if (!path) {
      throw new PlaygroundError(`Cannot find "${spec}" from ${from}. Did you run "npx nativra-cli add" for it?`, from);
    }
    const cached = cache.get(path);
    if (cached) return cached.exports;

    const module = { exports: {} as Record<string, unknown> };
    cache.set(path, module);
    let code: string;
    try {
      code = transform(files[path]!, {
        transforms: ["typescript", "jsx", "imports"],
        jsxRuntime: "automatic",
        production: true,
        filePath: path,
      }).code;
    } catch (err) {
      cache.delete(path);
      // Sucrase prefixes "Error transforming <file>:"; the file is reported separately.
      throw new PlaygroundError((err as Error).message.replace(/^Error transforming [^:]+:\s*/, ""), path);
    }
    // eslint-disable-next-line @typescript-eslint/no-implied-eval -- running the user's own code is the point
    const run = new Function("require", "module", "exports", `${code}\n//# sourceURL=playground/${path}`);
    run((s: string) => load(s, path), module, module.exports);
    return module.exports;
  };

  const exports = load(`./${entry}`, "") as { default?: unknown; App?: unknown };
  const App = exports.default ?? exports.App;
  if (typeof App !== "function" && typeof App !== "object") {
    throw new PlaygroundError(`${entry} must export a component: export default function App() { … }`, entry);
  }
  return App as ComponentType;
}
