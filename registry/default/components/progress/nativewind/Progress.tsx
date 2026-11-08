/**
 * Nativra — Progress (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add progress
 */
import React from "react";
import { View, type ViewProps } from "react-native";

export type ProgressSize = "sm" | "md" | "lg";
export type ProgressVariant = "default" | "primary" | "success" | "destructive";

export interface ProgressProps extends ViewProps {
  value?: number; // 0 to 100
  size?: ProgressSize;
  variant?: ProgressVariant;
  className?: string;
}

const HEIGHT_CLASSES: Record<ProgressSize, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

const FILL_CLASSES: Record<ProgressVariant, string> = {
  default: "bg-zinc-900 dark:bg-zinc-100",
  primary: "bg-sky-500",
  success: "bg-emerald-500",
  destructive: "bg-red-500",
};

export function Progress({
  value = 0,
  size = "md",
  variant = "primary",
  className = "",
  ...props
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
      className={`w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden ${HEIGHT_CLASSES[size]} ${className}`.trim()}
      {...props}
    >
      <View
        className={`h-full rounded-full transition-all ${FILL_CLASSES[variant]}`}
        style={{ width: `${clamped}%` }}
      />
    </View>
  );
}

