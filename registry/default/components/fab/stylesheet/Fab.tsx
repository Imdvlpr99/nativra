import * as React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { type ThemeColors, useThemeColors, elevation, ts, sp, pressedStyle, themeStyle } from "@/hooks/use-theme-colors";

export type FabVariant = "primary" | "secondary" | "accent";
export type FabSize = "sm" | "md" | "lg";
export type FabPosition = "bottom-right" | "bottom-left" | "bottom-center";

export interface FabProps extends Omit<PressableProps, "children"> {
  accessibilityLabel: string;
  variant?: FabVariant;
  size?: FabSize;
  position?: FabPosition;
  label?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Fab({
  variant = "primary",
  size = "md",
  position = "bottom-right",
  label,
  children,
  accessibilityLabel,
  disabled,
  style,
  onPress,
  ...props
}: FabProps) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const isExtended = Boolean(label);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label || "Action"}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        styles[variant],
        styles[position],
        isExtended && styles.extended,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {children}
      {label && <Text style={styles.labelText}>{label}</Text>}
    </Pressable>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  base: {
    position: "absolute",
    zIndex: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    ...elevation("raised"),
  },
  sm: { width: 40, height: 40 },
  md: { width: 56, height: 56 },
  lg: { width: 64, height: 64 },
  extended: { width: "auto", paddingHorizontal: sp(20), gap: sp(8) },
  primary: { backgroundColor: c.primary },
  secondary: { backgroundColor: c.foreground },
  accent: { backgroundColor: c.success },
  "bottom-right": { bottom: 24, right: 24 },
  "bottom-left": { bottom: 24, left: 24 },
  "bottom-center": { bottom: 24, alignSelf: "center" },
  labelText: {
    color: c["primary-foreground"],
    fontWeight: themeStyle.fontWeight.title,
    fontSize: ts(14),
  },
  pressed: { ...pressedStyle(true) },
  disabled: {
    opacity: 0.5,
  },
});

