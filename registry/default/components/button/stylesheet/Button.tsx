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
  type PressableProps,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { type ThemeColors, useThemeColors, themeStyle, elevation, pressedStyle } from "@/hooks/use-theme-colors";

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
    borderRadius: themeStyle.radius.button,
  },
  disabled: { opacity: 0.5 },
  // Size presets
  xs:  { paddingHorizontal: 12, paddingVertical: 6,  gap: 4 },
  sm:  { paddingHorizontal: 16, paddingVertical: 8,  gap: 6 },
  md:  { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  lg:  { paddingHorizontal: 24, paddingVertical: 14, gap: 8 },
  xl:  { paddingHorizontal: 28, paddingVertical: 16, gap: 10 },
  // Text sizes (weight comes from the theme's label weight)
  textXs:  { fontSize: 12, fontWeight: themeStyle.fontWeight.label },
  textSm:  { fontSize: 14, fontWeight: themeStyle.fontWeight.label },
  textMd:  { fontSize: 15, fontWeight: themeStyle.fontWeight.label },
  textLg:  { fontSize: 16, fontWeight: themeStyle.fontWeight.label },
  textXl:  { fontSize: 17, fontWeight: themeStyle.fontWeight.title },
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
  const isDisabled = disabled || loading;
  // Solid buttons get the theme's soft resting shadow.
  const solid = variant === "default" || variant === "primary" || variant === "destructive";

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
      style={({ pressed }) => [
        styles.base,
        getVariantStyle(variant, c),
        SIZE_STYLES[size],
        solid && !isDisabled && elevation("card"),
        isDisabled && styles.disabled,
        pressedStyle(pressed && !isDisabled),
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

