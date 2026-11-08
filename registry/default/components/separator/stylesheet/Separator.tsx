/** Nativra — Separator (StyleSheet). Install: npx nativra-cli add separator */
import React from "react";
import { StyleSheet, View, useColorScheme } from "react-native";

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
}

export function Separator({ orientation = "horizontal" }: SeparatorProps) {
  const dark = useColorScheme() === "dark";
  return (
    <View
      accessibilityRole="none"
      style={[
        orientation === "horizontal" ? styles.h : styles.v,
        { backgroundColor: dark ? "#27272a" : "#e4e4e7" },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  h: { height: StyleSheet.hairlineWidth, width: "100%" },
  v: { width: StyleSheet.hairlineWidth, height: "100%" },
});

