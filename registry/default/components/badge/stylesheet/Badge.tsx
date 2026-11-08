/**
 * Nativra — Badge (React Native StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Install: npx nativra-cli add badge
 */
import React from "react";
import { View, Text, StyleSheet, useColorScheme, type ViewStyle, type TextStyle } from "react-native";

type BadgeVariant = "default" | "primary" | "secondary" | "destructive" | "outline";
type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const styles = StyleSheet.create({
  base: { flexDirection: "row", alignItems: "center", borderRadius: 999, alignSelf: "flex-start" },
  sm:  { paddingHorizontal: 6,  paddingVertical: 2 },
  md:  { paddingHorizontal: 10, paddingVertical: 2 },
  lg:  { paddingHorizontal: 12, paddingVertical: 4 },
  textSm: { fontSize: 11 },
  textMd: { fontSize: 11, fontWeight: "500" },
  textLg: { fontSize: 13, fontWeight: "500" },
});

function getContainerStyle(variant: BadgeVariant, dark: boolean): ViewStyle {
  const map: Record<BadgeVariant, ViewStyle> = {
    default:     { backgroundColor: dark ? "#fafafa" : "#171717" },
    primary:     { backgroundColor: dark ? "#0c4a6e" : "#e0f2fe" },
    secondary:   { backgroundColor: dark ? "#27272a" : "#f4f4f5" },
    destructive: { backgroundColor: dark ? "#7f1d1d" : "#fee2e2" },
    outline:     { borderWidth: 1, borderColor: dark ? "#52525b" : "#d4d4d8", backgroundColor: "transparent" },
  };
  return map[variant];
}

function getLabelStyle(variant: BadgeVariant, dark: boolean): TextStyle {
  const map: Record<BadgeVariant, TextStyle> = {
    default:     { color: dark ? "#171717" : "#ffffff" },
    primary:     { color: dark ? "#bae6fd" : "#0369a1" },
    secondary:   { color: dark ? "#d4d4d8" : "#3f3f46" },
    destructive: { color: dark ? "#fca5a5" : "#b91c1c" },
    outline:     { color: dark ? "#d4d4d8" : "#3f3f46" },
  };
  return map[variant];
}

export function Badge({ label, variant = "default", size = "md" }: BadgeProps) {
  const dark = useColorScheme() === "dark";
  const sizeStyle = size === "sm" ? styles.sm : size === "lg" ? styles.lg : styles.md;
  const textSizeStyle = size === "sm" ? styles.textSm : size === "lg" ? styles.textLg : styles.textMd;

  return (
    <View style={[styles.base, getContainerStyle(variant, dark), sizeStyle]}>
      <Text style={[getLabelStyle(variant, dark), textSizeStyle]}>{label}</Text>
    </View>
  );
}

