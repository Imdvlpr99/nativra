/**
 * Nativra — Spinner (React Native StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add spinner
 */
import React from "react";
import {
  ActivityIndicator,
  useColorScheme,
  type ActivityIndicatorProps,
} from "react-native";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps extends Omit<ActivityIndicatorProps, "size"> {
  size?: SpinnerSize;
}

const SIZE_MAP: Record<SpinnerSize, "small" | "large"> = {
  sm: "small",
  md: "small",
  lg: "large",
};

export function Spinner({
  size = "md",
  color,
  style,
  ...props
}: SpinnerProps) {
  const isDark = useColorScheme() === "dark";
  const defaultColor = isDark ? "#fafafa" : "#18181b";

  return (
    <ActivityIndicator
      size={SIZE_MAP[size]}
      color={color ?? defaultColor}
      accessibilityRole="progressbar"
      style={style}
      {...props}
    />
  );
}

