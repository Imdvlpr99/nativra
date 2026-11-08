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

function getVariantStyle(variant: ButtonVariant, dark: boolean): ViewStyle {
  const map: Record<ButtonVariant, ViewStyle> = {
    default:     { backgroundColor: dark ? "#fafafa" : "#171717" },
    primary:     { backgroundColor: dark ? "#0ea5e9" : "#0284c7" },
    secondary:   { backgroundColor: dark ? "#27272a" : "#f4f4f5" },
    destructive: { backgroundColor: dark ? "#7f1d1d" : "#ef4444" },
    outline:     { borderWidth: 1, borderColor: dark ? "#3f3f46" : "#d4d4d8", backgroundColor: "transparent" },
    ghost:       { backgroundColor: "transparent" },
    link:        { backgroundColor: "transparent" },
  };
  return map[variant];
}

function getTextStyle(variant: ButtonVariant, dark: boolean): TextStyle {
  const map: Record<ButtonVariant, TextStyle> = {
    default:     { color: dark ? "#171717" : "#ffffff" },
    primary:     { color: "#ffffff" },
    secondary:   { color: dark ? "#fafafa" : "#171717" },
    destructive: { color: "#ffffff" },
    outline:     { color: dark ? "#fafafa" : "#171717" },
    ghost:       { color: dark ? "#fafafa" : "#171717" },
    link:        { color: dark ? "#38bdf8" : "#0284c7", textDecorationLine: "underline" },
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
  const colorScheme = useColorScheme();
  const dark = colorScheme === "dark";
  const isDisabled = disabled || loading;

  const loaderColor =
    variant === "default" || variant === "primary" || variant === "destructive"
      ? "#fff"
      : dark
      ? "#fafafa"
      : "#171717";

  return (
    <Pressable
      style={[
        styles.base,
        getVariantStyle(variant, dark),
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
      <Text style={[getTextStyle(variant, dark), TEXT_SIZE_STYLES[size]]}>{children}</Text>
    </Pressable>
  );
}

