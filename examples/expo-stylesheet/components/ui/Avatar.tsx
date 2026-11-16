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
  type ViewProps,
} from "react-native";
import { useThemeColors, themeStyle } from "@/hooks/use-theme-colors";

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
  const c = useThemeColors();
  const [hasError, setHasError] = useState(false);
  const dimension = SIZE_PX[size];
  const fontSize = FONT_PX[size];

  const bg = c.muted;
  const fg = c.foreground;

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
    fontWeight: themeStyle.fontWeight.label,
  },
});

