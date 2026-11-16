/**
 * Nativra — Text (React Native StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add text
 */
import React from "react";
import {
  Text as RNText,
  StyleSheet,
  type TextProps as RNTextProps,
  type TextStyle,
} from "react-native";
import { type ThemeColors, useThemeColors, themeStyle, ts } from "@/hooks/use-theme-colors";

export type TextVariant = "h1" | "h2" | "h3" | "h4" | "p" | "lead" | "muted" | "code";

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
}

export function Text({ variant = "p", style, ...props }: TextProps) {
  const color = variantColor(useThemeColors(), variant);

  return (
    <RNText
      style={[styles.base, variantStyles[variant], { color }, style]}
      {...props}
    />
  );
}

function variantColor(c: ThemeColors, variant: TextVariant): string {
  switch (variant) {
    case "lead":
    case "muted":
      return c["muted-foreground"];
    default:
      return c.foreground;
  }
}

const styles = StyleSheet.create({
  base: {
    fontFamily: "System",
  },
});

const variantStyles: Record<TextVariant, TextStyle> = StyleSheet.create({
  h1: {
    fontSize: ts(30),
    lineHeight: ts(36),
    fontWeight: themeStyle.fontWeight.heading,
    letterSpacing: themeStyle.headingLetterSpacing * 1.25,
  },
  h2: {
    fontSize: ts(24),
    lineHeight: ts(30),
    fontWeight: themeStyle.fontWeight.heading,
    letterSpacing: themeStyle.headingLetterSpacing,
  },
  h3: {
    fontSize: ts(20),
    lineHeight: ts(26),
    fontWeight: themeStyle.fontWeight.title,
    letterSpacing: themeStyle.headingLetterSpacing * 0.5,
  },
  h4: {
    fontSize: ts(18),
    lineHeight: ts(24),
    fontWeight: themeStyle.fontWeight.title,
  },
  p: {
    fontSize: ts(16),
    lineHeight: ts(24),
    fontWeight: "400",
  },
  lead: {
    fontSize: ts(18),
    lineHeight: ts(26),
    fontWeight: "400",
  },
  muted: {
    fontSize: ts(14),
    lineHeight: ts(20),
    fontWeight: "400",
  },
  code: {
    fontSize: ts(14),
    lineHeight: ts(20),
    fontWeight: "400",
    fontFamily: "Courier",
  },
});

