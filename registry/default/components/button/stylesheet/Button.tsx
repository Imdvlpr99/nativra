/**
 * Nativra — Button (React Native StyleSheet)
 * @version 0.3.0
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

/** An icon node, or a function that receives the label color so the icon matches the variant. */
export type ButtonIcon = React.ReactNode | ((color: string) => React.ReactNode);

export interface ButtonProps extends Omit<PressableProps, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  /** Shown before the label (replaced by the spinner while loading). */
  leftIcon?: ButtonIcon;
  /** Shown after the label. */
  rightIcon?: ButtonIcon;
  /**
   * The label. Text and numbers are wrapped in a themed <Text>; any other node renders as is
   * (give an icon-only button an `accessibilityLabel`).
   */
  children?: React.ReactNode;
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

// ActivityIndicator only takes a numeric size on Android, so the "small" spinner is scaled to
// follow the button size on every platform.
const SPINNER_SCALE: Record<ButtonSize, number> = { xs: 0.7, sm: 0.8, md: 0.9, lg: 1, xl: 1.1 };

/** True when every child is text or a number, so the whole label can sit in one <Text>. */
function isTextLabel(children: React.ReactNode): boolean {
  return React.Children.toArray(children).every((child) => typeof child === "string" || typeof child === "number");
}

const renderIcon = (icon: ButtonIcon | undefined, color: string) => (typeof icon === "function" ? icon(color) : icon);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Button({
  variant = "default",
  size = "md",
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
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
      style={(state) => [
        styles.base,
        getVariantStyle(variant, c),
        SIZE_STYLES[size],
        solid && !isDisabled && elevation("card"),
        isDisabled && styles.disabled,
        pressedStyle(state.pressed && !isDisabled),
        typeof style === "function" ? style(state) : style,
      ]}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={loaderColor} style={{ transform: [{ scale: SPINNER_SCALE[size] }] }} />
      ) : (
        renderIcon(leftIcon, loaderColor)
      )}
      {children == null || children === false ? null : isTextLabel(children) ? (
        <Text style={[getTextStyle(variant, c), TEXT_SIZE_STYLES[size]]}>{children}</Text>
      ) : (
        children
      )}
      {renderIcon(rightIcon, loaderColor)}
    </Pressable>
  );
}

