/**
 * Nativra — Button (NativeWind)
 * @version 0.3.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add button
 */
import React from "react";
import { Pressable, Text, ActivityIndicator, type PressableProps } from "react-native";
import { elevation, useThemeColors } from "@/hooks/use-theme-colors";

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
  /** Extra classes, added after the variant and size classes. */
  className?: string;
  /**
   * The label. Text and numbers are wrapped in a themed <Text>; any other node renders as is
   * (give an icon-only button an `accessibilityLabel`).
   */
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Class maps (NativeWind)
// ---------------------------------------------------------------------------

const BASE =
  "flex-row items-center justify-center rounded-button active:opacity-90 active:scale-[0.97]";

const VARIANTS: Record<ButtonVariant, string> = {
  default:     "bg-foreground",
  primary:     "bg-primary",
  secondary:   "bg-muted",
  destructive: "bg-destructive",
  outline:     "border border-input bg-transparent",
  ghost:       "bg-transparent",
  link:        "bg-transparent",
};

const TEXT_VARIANTS: Record<ButtonVariant, string> = {
  default:     "text-background",
  primary:     "text-primary-foreground",
  secondary:   "text-foreground",
  destructive: "text-destructive-foreground",
  outline:     "text-foreground",
  ghost:       "text-foreground",
  link:        "text-primary underline",
};

const SIZES: Record<ButtonSize, string> = {
  xs: "sp-px-3 sp-py-1.5 sp-gap-1",
  sm: "sp-px-4 sp-py-2 sp-gap-1.5",
  md: "min-h-control px-control sp-gap-2",
  lg: "sp-px-6 sp-py-3.5 sp-gap-2",
  xl: "sp-px-7 sp-py-4 sp-gap-2.5",
};

const TEXT_SIZES: Record<ButtonSize, string> = {
  xs: "type-xs weight-label",
  sm: "type-sm weight-label",
  md: "type-sm weight-label",
  lg: "type-base weight-label",
  xl: "type-base weight-label",
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
  className,
  ...rest
}: ButtonProps) {
  const c = useThemeColors();
  const isDisabled = disabled || loading;
  // Solid buttons get the theme's soft resting shadow.
  const solid = variant === "default" || variant === "primary" || variant === "destructive";

  // A caller's className is added to the button's own classes, never replaces them.
  const containerClass = [BASE, VARIANTS[variant], SIZES[size], isDisabled && "opacity-50", className]
    .filter(Boolean)
    .join(" ");

  const textClass = [TEXT_VARIANTS[variant], TEXT_SIZES[size]].join(" ");
  const contentColor =
    variant === "default" ? c.background : variant === "primary" ? c["primary-foreground"] : variant === "destructive" ? c["destructive-foreground"] : c.foreground;

  return (
    <Pressable
      className={containerClass}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={(state) => [solid && !isDisabled ? elevation("card") : undefined, typeof style === "function" ? style(state) : style]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={contentColor} style={{ transform: [{ scale: SPINNER_SCALE[size] }] }} />
      ) : (
        renderIcon(leftIcon, contentColor)
      )}
      {children == null || children === false ? null : isTextLabel(children) ? <Text className={textClass}>{children}</Text> : children}
      {renderIcon(rightIcon, contentColor)}
    </Pressable>
  );
}

