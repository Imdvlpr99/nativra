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
import { type ThemeColors, useThemeColors } from "@/hooks/use-theme-colors";

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
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "600",
  },
  h4: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600",
  },
  p: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
  },
  lead: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "400",
  },
  muted: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
  },
  code: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    fontFamily: "Courier",
  },
});

