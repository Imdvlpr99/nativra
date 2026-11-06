/**
 * Nativra — Text (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add text
 */
import React from "react";
import { Text as RNText, type TextProps as RNTextProps } from "react-native";

export type TextVariant = "h1" | "h2" | "h3" | "h4" | "p" | "lead" | "muted" | "code";

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  className?: string;
}

const VARIANTS: Record<TextVariant, string> = {
  h1: "text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50",
  h2: "text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50",
  h3: "text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50",
  h4: "text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50",
  p: "text-base leading-7 text-zinc-800 dark:text-zinc-200",
  lead: "text-lg text-zinc-600 dark:text-zinc-300",
  muted: "text-sm text-zinc-500 dark:text-zinc-400",
  code: "font-mono text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-1 py-0.5 rounded",
};

export function Text({ variant = "p", className = "", style, ...props }: TextProps) {
  const variantClass = VARIANTS[variant] ?? VARIANTS.p;
  return <RNText className={`${variantClass} ${className}`.trim()} style={style} {...props} />;
}
