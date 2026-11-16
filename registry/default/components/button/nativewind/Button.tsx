/**
 * Nativra — Button (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add button
 */
import React from "react";
import { Pressable, Text, ActivityIndicator, type PressableProps, type ViewStyle } from "react-native";
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

export interface ButtonProps extends Omit<PressableProps, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  children: string;
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

  const containerClass = [BASE, VARIANTS[variant], SIZES[size], isDisabled && "opacity-50"]
    .filter(Boolean)
    .join(" ");

  const textClass = [TEXT_VARIANTS[variant], TEXT_SIZES[size]].join(" ");

  return (
    <Pressable
      className={containerClass}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={[solid && !isDisabled ? elevation("card") : undefined, style as ViewStyle]}
      {...rest}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === "default" ? c.background : variant === "primary" ? c["primary-foreground"] : variant === "destructive" ? c["destructive-foreground"] : c.foreground}
        />
      )}
      <Text className={textClass}>{children}</Text>
    </Pressable>
  );
}

