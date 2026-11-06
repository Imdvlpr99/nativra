/**
 * Nativra — Button (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add button
 */
import React from "react";
import { Pressable, Text, ActivityIndicator, type PressableProps } from "react-native";

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
  "flex-row items-center justify-center rounded-lg active:opacity-80";

const VARIANTS: Record<ButtonVariant, string> = {
  default:     "bg-zinc-900 dark:bg-zinc-50",
  primary:     "bg-sky-600 dark:bg-sky-500",
  secondary:   "bg-zinc-100 dark:bg-zinc-800",
  destructive: "bg-red-500 dark:bg-red-600",
  outline:     "border border-zinc-300 bg-transparent dark:border-zinc-700",
  ghost:       "bg-transparent",
  link:        "bg-transparent",
};

const TEXT_VARIANTS: Record<ButtonVariant, string> = {
  default:     "text-white dark:text-zinc-900",
  primary:     "text-white",
  secondary:   "text-zinc-900 dark:text-zinc-50",
  destructive: "text-white",
  outline:     "text-zinc-900 dark:text-zinc-50",
  ghost:       "text-zinc-900 dark:text-zinc-50",
  link:        "text-sky-600 underline dark:text-sky-400",
};

const SIZES: Record<ButtonSize, string> = {
  xs: "px-2.5 py-1 gap-1",
  sm: "px-3 py-1.5 gap-1.5",
  md: "px-4 py-2.5 gap-2",
  lg: "px-5 py-3 gap-2",
  xl: "px-6 py-3.5 gap-2.5",
};

const TEXT_SIZES: Record<ButtonSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-sm font-semibold",
  lg: "text-base font-semibold",
  xl: "text-base font-bold",
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
  const isDisabled = disabled || loading;

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
      style={style}
      {...rest}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === "default" || variant === "primary" || variant === "destructive" ? "#fff" : "#18181b"}
        />
      )}
      <Text className={textClass}>{children}</Text>
    </Pressable>
  );
}

