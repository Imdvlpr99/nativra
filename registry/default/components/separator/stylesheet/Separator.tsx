/** Nativra — Separator (StyleSheet). Install: npx nativra-cli add separator */
import React from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import { useThemeColors } from "@/hooks/use-theme-colors";

export interface SeparatorProps extends ViewProps {
  orientation?: "horizontal" | "vertical";
}

export function Separator({ orientation = "horizontal", style, ...rest }: SeparatorProps) {
  const c = useThemeColors();
  return (
    <View
      accessibilityRole="none"
      style={[
        orientation === "horizontal" ? styles.h : styles.v,
        { backgroundColor: c.muted },
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  h: { height: StyleSheet.hairlineWidth, width: "100%" },
  v: { width: StyleSheet.hairlineWidth, height: "100%" },
});

