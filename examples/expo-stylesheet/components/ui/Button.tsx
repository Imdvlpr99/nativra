/**
 * Nativra — Button (React Native StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add button
 */
import React from "react";
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  type PressableProps,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { type ThemeColors, useThemeColors } from "@/hooks/use-theme-colors";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link";

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends Omit<PressableProps, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  children: string;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  disabled: { opacity: 0.5 },
  // Size presets
  xs:  { paddingHorizontal: 10, paddingVertical: 4,  gap: 4 },
  sm:  { paddingHorizontal: 12, paddingVertical: 6,  gap: 6 },
  md:  { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  lg:  { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  xl:  { paddingHorizontal: 24, paddingVertical: 14, gap: 10 },
  // Text sizes
  textXs:  { fontSize: 12 },
  textSm:  { fontSize: 14 },
  textMd:  { fontSize: 14, fontWeight: "600" },
  textLg:  { fontSize: 16, fontWeight: "600" },
  textXl:  { fontSize: 16, fontWeight: "700" },
});

function getVariantStyle(variant: ButtonVariant, c: ThemeColors): ViewStyle {
  const map: Record<ButtonVariant, ViewStyle> = {
    default:     { backgroundColor: c.foreground },
    primary:     { backgroundColor: c.primary },
    secondary:   { backgroundColor: c.muted },
    destructive: { backgroundColor: c.destructive },
    outline:     { borderWidth: 1, borderColor: c.input, backgroundColor: "transparent" },
    ghost:       { backgroundColor: "transparent" },
    link:        { backgroundColor: "transparent" },
  };
  return map[variant];
}

function getTextStyle(variant: ButtonVariant, c: ThemeColors): TextStyle {
  const map: Record<ButtonVariant, TextStyle> = {
    default:     { color: c.background },
    primary:     { color: c["primary-foreground"] },
    secondary:   { color: c.foreground },
    destructive: { color: c["destructive-foreground"] },
    outline:     { color: c.foreground },
    ghost:       { color: c.foreground },
    link:        { color: c.primary, textDecorationLine: "underline" },
  };
  return map[variant];
}

const SIZE_STYLES: Record<ButtonSize, ViewStyle> = {
  xs: styles.xs,
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
};

const TEXT_SIZE_STYLES: Record<ButtonSize, TextStyle> = {
  xs: styles.textXs,
  sm: styles.textSm,
  md: styles.textMd,
  lg: styles.textLg,
  xl: styles.textXl,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Button({
  variant = "default",
  size = "md",
  disabled = false,
  loading = false,
  children,
  style,
  ...rest
}: ButtonProps) {
  const c = useThemeColors();
  const colorScheme = useColorScheme();
  const dark = colorScheme === "dark";
  const isDisabled = disabled || loading;

  const loaderColor =
    variant === "default"
      ? c.background
      : variant === "primary"
      ? c["primary-foreground"]
      : variant === "destructive"
      ? c["destructive-foreground"]
      : c.foreground;

  return (
    <Pressable
      style={[
        styles.base,
        getVariantStyle(variant, c),
        SIZE_STYLES[size],
        isDisabled && styles.disabled,
        style as ViewStyle,
      ]}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...rest}
    >
      {loading && <ActivityIndicator size="small" color={loaderColor} />}
      <Text style={[getTextStyle(variant, c), TEXT_SIZE_STYLES[size]]}>{children}</Text>
    </Pressable>
  );
}

