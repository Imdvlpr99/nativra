/**
 * Nativra — Text (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add text
 */
import React from "react";
import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from "react-native";
import { themeStyle } from "@/hooks/use-theme-colors";

export type TextVariant = "h1" | "h2" | "h3" | "h4" | "p" | "lead" | "muted" | "code";

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  className?: string;
}

const VARIANTS: Record<TextVariant, string> = {
  h1: "text-3xl text-foreground",
  h2: "text-2xl text-foreground",
  h3: "text-xl text-foreground",
  h4: "text-lg text-foreground",
  p: "text-base leading-7 text-foreground",
  lead: "text-lg text-muted-foreground",
  muted: "text-sm text-muted-foreground",
  code: "font-mono text-sm bg-muted text-foreground px-1 py-0.5 rounded-small",
};

/** Heading weight and tracking from the installed theme's style tokens. */
const HEADING_STYLE: Partial<Record<TextVariant, TextStyle>> = {
  h1: { fontWeight: themeStyle.fontWeight.heading, letterSpacing: themeStyle.headingLetterSpacing * 1.25 },
  h2: { fontWeight: themeStyle.fontWeight.heading, letterSpacing: themeStyle.headingLetterSpacing },
  h3: { fontWeight: themeStyle.fontWeight.title, letterSpacing: themeStyle.headingLetterSpacing * 0.5 },
  h4: { fontWeight: themeStyle.fontWeight.title },
};

export function Text({ variant = "p", className = "", style, ...props }: TextProps) {
  const variantClass = VARIANTS[variant] ?? VARIANTS.p;
  return <RNText className={`${variantClass} ${className}`.trim()} style={[HEADING_STYLE[variant], style]} {...props} />;
}

