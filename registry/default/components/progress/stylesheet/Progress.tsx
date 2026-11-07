/**
 * Nativra — Progress (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add progress --target stylesheet
 */
import React from "react";
import { View, StyleSheet, type ViewProps } from "react-native";

export type ProgressSize = "sm" | "md" | "lg";
export type ProgressVariant = "default" | "primary" | "success" | "destructive";

export interface ProgressProps extends ViewProps {
  value?: number; // 0 to 100
  size?: ProgressSize;
  variant?: ProgressVariant;
}

const HEIGHTS: Record<ProgressSize, number> = {
  sm: 6,
  md: 10,
  lg: 16,
};

const COLORS: Record<ProgressVariant, string> = {
  default: "#18181b",
  primary: "#0ea5e9",
  success: "#10b981",
  destructive: "#ef4444",
};

export function Progress({
  value = 0,
  size = "md",
  variant = "primary",
  style,
  ...props
}: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
      style={[
        styles.track,
        { height: HEIGHTS[size] },
        style,
      ]}
      {...props}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clamped}%`,
            backgroundColor: COLORS[variant],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    borderRadius: 9999,
    backgroundColor: "#e4e4e7",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 9999,
  },
});
