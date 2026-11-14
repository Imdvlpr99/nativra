/**
 * Nativra — Spinner (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add spinner
 */
import React from "react";
import { ActivityIndicator, type ActivityIndicatorProps } from "react-native";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps extends Omit<ActivityIndicatorProps, "size"> {
  size?: SpinnerSize;
  className?: string;
}

const SIZE_MAP: Record<SpinnerSize, "small" | "large"> = {
  sm: "small",
  md: "small",
  lg: "large",
};

export function Spinner({
  size = "md",
  color = "#18181b",
  className = "",
  style,
  ...props
}: SpinnerProps) {
  return (
    <ActivityIndicator
      size={SIZE_MAP[size]}
      color={color}
      className={className}
      style={style}
      accessibilityRole="progressbar"
      {...props}
    />
  );
}

