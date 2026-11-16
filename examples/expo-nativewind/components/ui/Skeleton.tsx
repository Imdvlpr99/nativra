/**
 * Nativra — Skeleton (NativeWind)
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add skeleton
 */
import React, { useEffect, useRef } from "react";
import { Animated, type DimensionValue, type ViewProps } from "react-native";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export interface SkeletonProps extends ViewProps {
  width?: DimensionValue;
  height?: DimensionValue;
  /** sm, md and lg follow the style's small, control and card radii; full is a circle or pill. */
  radius?: "none" | "sm" | "md" | "lg" | "full";
  className?: string;
}

const RADIUS_MAP = {
  none: "rounded-none",
  sm: "rounded-small",
  md: "rounded-control",
  lg: "rounded-card",
  full: "rounded-full",
};

export function Skeleton({
  width = "100%",
  height = 20,
  radius = "md",
  className = "",
  style,
  ...props
}: SkeletonProps) {
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
      className={`bg-muted ${RADIUS_MAP[radius]} ${className}`.trim()}
      style={[{ width, height, opacity }, style]}
      {...props}
    />
  );
}
