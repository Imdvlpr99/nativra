/**
 * Nativra — Text (React Native StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add text
 */
import React from "react";
import {
  Text as RNText,
  StyleSheet,
  useColorScheme,
  type TextProps as RNTextProps,
  type TextStyle,
} from "react-native";

export type TextVariant = "h1" | "h2" | "h3" | "h4" | "p" | "lead" | "muted" | "code";

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
}

export function Text({ variant = "p", style, ...props }: TextProps) {
  const isDark = useColorScheme() === "dark";
  const color = isDark ? colorsDark[variant] : colorsLight[variant];

  return (
    <RNText
      style={[styles.base, variantStyles[variant], { color }, style]}
      {...props}
    />
  );
}

const colorsLight: Record<TextVariant, string> = {
  h1: "#09090b",
  h2: "#09090b",
  h3: "#09090b",
  h4: "#09090b",
  p: "#27272a",
  lead: "#52525b",
  muted: "#71717a",
  code: "#27272a",
};

const colorsDark: Record<TextVariant, string> = {
  h1: "#fafafa",
  h2: "#fafafa",
  h3: "#fafafa",
  h4: "#fafafa",
  p: "#e4e4e7",
  lead: "#d4d4d8",
  muted: "#a1a1aa",
  code: "#e4e4e7",
};

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

