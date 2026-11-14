/**
 * Nativra — Badge (React Native StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Install: npx nativra-cli add badge
 */
import React from "react";
import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from "react-native";
import { type ThemeColors, alpha, useThemeColors } from "@/hooks/use-theme-colors";

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

function getContainerStyle(variant: BadgeVariant, c: ThemeColors): ViewStyle {
  const map: Record<BadgeVariant, ViewStyle> = {
    default:     { backgroundColor: c.foreground },
    primary:     { backgroundColor: alpha(c.primary, 0.12) },
    secondary:   { backgroundColor: c.muted },
    destructive: { backgroundColor: alpha(c.destructive, 0.12) },
    outline:     { borderWidth: 1, borderColor: c.input, backgroundColor: "transparent" },
  };
  return map[variant];
}

function getLabelStyle(variant: BadgeVariant, c: ThemeColors): TextStyle {
  const map: Record<BadgeVariant, TextStyle> = {
    default:     { color: c.background },
    primary:     { color: c.primary },
    secondary:   { color: c.foreground },
    destructive: { color: c.destructive },
    outline:     { color: c.foreground },
  };
  return map[variant];
}

export function Badge({ label, variant = "default", size = "md" }: BadgeProps) {
  const c = useThemeColors();
  const sizeStyle = size === "sm" ? styles.sm : size === "lg" ? styles.lg : styles.md;
  const textSizeStyle = size === "sm" ? styles.textSm : size === "lg" ? styles.textLg : styles.textMd;

  return (
    <View style={[styles.base, getContainerStyle(variant, c), sizeStyle]}>
      <Text style={[getLabelStyle(variant, c), textSizeStyle]}>{label}</Text>
    </View>
  );
}

