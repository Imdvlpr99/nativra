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
import { type ThemeColors, useThemeColors, themeStyle, elevation, pressedStyle, ts, sp } from "@/hooks/use-theme-colors";

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
  // Size presets: md is the style's control height, the others step around it
  xs:  { minHeight: themeStyle.control.height - 16, paddingHorizontal: sp(12), gap: sp(4) },
  sm:  { minHeight: themeStyle.control.height - 8, paddingHorizontal: sp(16), gap: sp(6) },
  md:  { minHeight: themeStyle.control.height, paddingHorizontal: themeStyle.control.paddingX, gap: sp(8) },
  lg:  { minHeight: themeStyle.control.height + 6, paddingHorizontal: sp(24), gap: sp(8) },
  xl:  { minHeight: themeStyle.control.height + 12, paddingHorizontal: sp(28), gap: sp(10) },
  // Text sizes (weight comes from the theme's label weight)
  textXs:  { fontSize: ts(12), fontWeight: themeStyle.fontWeight.label },
  textSm:  { fontSize: ts(14), fontWeight: themeStyle.fontWeight.label },
  textMd:  { fontSize: ts(15), fontWeight: themeStyle.fontWeight.label },
  textLg:  { fontSize: ts(16), fontWeight: themeStyle.fontWeight.label },
  textXl:  { fontSize: ts(17), fontWeight: themeStyle.fontWeight.title },
});

function getVariantStyle(variant: ButtonVariant, c: ThemeColors): ViewStyle {
  const map: Record<ButtonVariant, ViewStyle> = {
    default:     { backgroundColor: c.foreground },
    primary:     { backgroundColor: c.primary },
    secondary:   { backgroundColor: c.muted },
    destructive: { backgroundColor: c.destructive },
    outline:     { borderWidth: themeStyle.borderWidth, borderColor: c.input, backgroundColor: "transparent" },
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

