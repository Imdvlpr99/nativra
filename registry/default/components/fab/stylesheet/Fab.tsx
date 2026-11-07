import * as React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

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

const styles = StyleSheet.create({
  base: {
    position: "absolute",
    zIndex: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  sm: { width: 40, height: 40 },
  md: { width: 56, height: 56 },
  lg: { width: 64, height: 64 },
  extended: { width: "auto", paddingHorizontal: 20, gap: 8 },
  primary: { backgroundColor: "#0284C7" },
  secondary: { backgroundColor: "#18181B" },
  accent: { backgroundColor: "#10B981" },
  "bottom-right": { bottom: 24, right: 24 },
  "bottom-left": { bottom: 24, left: 24 },
  "bottom-center": { bottom: 24, alignSelf: "center" },
  labelText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.5,
  },
});

