/**
 * Nativra — Avatar (React Native StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add avatar
 */
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  useColorScheme,
  type ViewProps,
} from "react-native";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

export interface AvatarProps extends ViewProps {
  src?: string;
  fallback: string;
  size?: AvatarSize;
  accessibilityLabel?: string;
}

const SIZE_PX: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

const FONT_PX: Record<AvatarSize, number> = {
  sm: 12,
  md: 14,
  lg: 18,
  xl: 24,
};

export function Avatar({
  src,
  fallback,
  size = "md",
  style,
  accessibilityLabel,
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  const isDark = useColorScheme() === "dark";
  const dimension = SIZE_PX[size];
  const fontSize = FONT_PX[size];

  const bg = isDark ? "#27272a" : "#e4e4e7";
  const fg = isDark ? "#e4e4e7" : "#3f3f46";

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? fallback}
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: bg,
        },
        style,
      ]}
      {...props}
    >
      {src && !hasError ? (
        <Image
          source={{ uri: src }}
          onError={() => setHasError(true)}
          style={{ width: dimension, height: dimension, borderRadius: dimension / 2 }}
        />
      ) : (
        <Text style={[styles.fallback, { fontSize, color: fg }]}>
          {fallback.slice(0, 2).toUpperCase()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  fallback: {
    fontWeight: "600",
  },
});

