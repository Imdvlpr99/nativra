/**
 * Nativra — Skeleton (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add skeleton
 */
import React, { useEffect, useRef } from "react";
import { Animated, type ViewProps } from "react-native";

export interface SkeletonProps extends ViewProps {
  width?: number | string;
  height?: number | string;
  radius?: "none" | "sm" | "md" | "lg" | "full";
  className?: string;
}

const RADIUS_MAP = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
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
      className={`bg-zinc-200 dark:bg-zinc-800 ${RADIUS_MAP[radius]} ${className}`.trim()}
      style={[
        {
          width: width as any,
          height: height as any,
          opacity,
        },
        style,
      ]}
      {...props}
    />
  );
}

