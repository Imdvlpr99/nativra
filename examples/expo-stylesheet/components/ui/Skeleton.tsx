/**
 * Nativra — Skeleton (React Native StyleSheet)
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add skeleton
 */
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  type DimensionValue,
  type ViewProps,
} from "react-native";
import { themeStyle, useThemeColors } from "@/hooks/use-theme-colors";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface SkeletonProps extends ViewProps {
  width?: DimensionValue;
  height?: DimensionValue;
  /** sm, md and lg follow the style's small, control and card radii; full is a circle or pill. */
  radius?: "none" | "sm" | "md" | "lg" | "full";
}

const RADIUS = {
  none: 0,
  sm: themeStyle.radius.small,
  md: themeStyle.radius.control,
  lg: themeStyle.radius.card,
  full: 9999,
} as const;

export function Skeleton({
  width = "100%",
  height = 20,
  radius = "md",
  style,
  ...props
}: SkeletonProps) {
  const c = useThemeColors();
  const reduceMotion = useReducedMotion();
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // With Reduce Motion on, the placeholder holds still instead of pulsing.
    if (reduceMotion) {
      opacity.setValue(0.7);
      return;
    }
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity, reduceMotion]);

  return (
    <Animated.View
      accessibilityRole="none"
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius: RADIUS[radius],
          backgroundColor: c.muted,
          opacity,
        },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
  },
});
