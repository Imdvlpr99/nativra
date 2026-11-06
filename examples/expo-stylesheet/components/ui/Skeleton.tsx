/**
 * Nativra — Skeleton (React Native StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add skeleton
 */
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  useColorScheme,
  type ViewProps,
} from "react-native";

export interface SkeletonProps extends ViewProps {
  width?: number | string;
  height?: number | string;
  radius?: "none" | "sm" | "md" | "lg" | "full";
}

const RADIUS_PX = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
} as const;

export function Skeleton({
  width = "100%",
  height = 20,
  radius = "md",
  style,
  ...props
}: SkeletonProps) {
  const isDark = useColorScheme() === "dark";
  const bg = isDark ? "#27272a" : "#e4e4e7";
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
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
  }, [opacity]);

  return (
    <Animated.View
      accessibilityRole="none"
      style={[
        styles.base,
        {
          width: width as any,
          height: height as any,
          borderRadius: RADIUS_PX[radius],
          backgroundColor: bg,
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
