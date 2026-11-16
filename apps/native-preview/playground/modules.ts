/**
 * npm packages a playground project can import. They are bundled into the preview export once;
 * user code is compiled in the browser and resolved against this map.
 */
import * as React from "react";
import * as JsxRuntime from "react/jsx-runtime";
import * as ReactNative from "react-native";
import * as Svg from "react-native-svg";
import * as Lucide from "lucide-react-native";
import * as SafeArea from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import * as Clsx from "clsx";
import * as TailwindMerge from "tailwind-merge";
import * as Cva from "class-variance-authority";

/** An ES-module-shaped namespace: named exports plus `default`, flagged for Sucrase's interop. */
function esm(ns: Record<string, unknown>, fallbackDefault?: unknown): Record<string, unknown> {
  return { ...ns, default: ns.default ?? fallbackDefault ?? ns, __esModule: true };
}

/**
 * NativeWind on the web: a className becomes a react-native-web CSS class (`$$css` style), and
 * the classes themselves come from Tailwind's browser build plus the project's global.css.
 */
function classNameToStyle(className: unknown, style: unknown): unknown {
  if (typeof className !== "string" || !className.trim()) return style;
  const css = { $$css: true, nativewind: className };
  return typeof style === "function"
    ? (state: unknown) => [css, (style as (s: unknown) => unknown)(state)]
    : [css, style];
}

function withClassNames(props: Record<string, unknown> | null): Record<string, unknown> | null {
  if (!props || (props.className === undefined && props.contentContainerClassName === undefined)) return props;
  const { className, contentContainerClassName, ...rest } = props;
  if (className !== undefined) rest.style = classNameToStyle(className, rest.style);
  if (contentContainerClassName !== undefined) {
    rest.contentContainerStyle = classNameToStyle(contentContainerClassName, rest.contentContainerStyle);
  }
  return rest;
}

type JsxFn = (type: unknown, props: Record<string, unknown> | null, key?: unknown) => unknown;
const wrapJsx = (fn: JsxFn): JsxFn => (type, props, key) => fn(type, withClassNames(props), key);

const jsxRuntime = JsxRuntime as unknown as { jsx: JsxFn; jsxs: JsxFn; Fragment: unknown };

/** Overridden per run so ?scheme / the docs toggle decide light or dark. */
export const scheme = { current: "light" as "light" | "dark" };

export const MODULES: Record<string, unknown> = {
  react: esm(React as unknown as Record<string, unknown>),
  "react/jsx-runtime": esm({ jsx: wrapJsx(jsxRuntime.jsx), jsxs: wrapJsx(jsxRuntime.jsxs), Fragment: jsxRuntime.Fragment }),
  "react-native": esm({
    ...(ReactNative as unknown as Record<string, unknown>),
    useColorScheme: () => scheme.current,
  }),
  "react-native-svg": esm(Svg as unknown as Record<string, unknown>),
  "lucide-react-native": esm(Lucide as unknown as Record<string, unknown>),
  "react-native-safe-area-context": esm(SafeArea as unknown as Record<string, unknown>),
  "expo-haptics": esm(Haptics as unknown as Record<string, unknown>),
  clsx: esm(Clsx as unknown as Record<string, unknown>, (Clsx as unknown as { clsx: unknown }).clsx),
  "tailwind-merge": esm(TailwindMerge as unknown as Record<string, unknown>),
  "class-variance-authority": esm(Cva as unknown as Record<string, unknown>),
};
