/** Nativra — Chip (StyleSheet). Install: npx nativra-cli add chip */
import React from "react";
import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";

export interface ChipProps {
  label: string;
  selected?: boolean;
  variant?: "default" | "primary" | "outline";
  size?: "sm" | "md";
  disabled?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  style?: ViewStyle;
}

export function Chip({
  label,
  selected = false,
  variant = "default",
  size = "md",
  disabled = false,
  onPress,
  onRemove,
  style,
}: ChipProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.base,
        size === "sm" ? styles.sizeSm : styles.sizeMd,
        variant === "outline" ? styles.outline : variant === "primary" ? styles.primary : styles.default,
        selected && styles.selected,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          size === "sm" ? styles.textSm : styles.textMd,
          variant === "primary" ? styles.textPrimary : styles.textDefault,
          selected && styles.textSelected,
        ]}
      >
        {label}
      </Text>
      {onRemove ? (
        <Pressable
          onPress={disabled ? undefined : onRemove}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
          style={styles.removeBtn}
        >
          <View style={styles.removeInner}>
            <Text style={[styles.removeIcon, selected && styles.textSelected]}>✕</Text>
          </View>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 9999,
    borderWidth: 1,
  },
  sizeSm: { height: 28, paddingHorizontal: 10 },
  sizeMd: { height: 32, paddingHorizontal: 14 },
  default: { backgroundColor: "#f4f4f5", borderColor: "#e4e4e7" },
  primary: { backgroundColor: "#f0f9ff", borderColor: "#bae6fd" },
  outline: { backgroundColor: "transparent", borderColor: "#d4d4d8" },
  selected: { backgroundColor: "#0284c7", borderColor: "#0284c7" },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.8 },
  textSm: { fontSize: 12, fontWeight: "500" },
  textMd: { fontSize: 14, fontWeight: "500" },
  textDefault: { color: "#27272a" },
  textPrimary: { color: "#0369a1" },
  textSelected: { color: "#ffffff", fontWeight: "600" },
  removeBtn: {
    marginLeft: 6,
    width: 16,
    height: 16,
    borderRadius: 9999,
    backgroundColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  removeInner: { alignItems: "center", justifyContent: "center" },
  removeIcon: { fontSize: 10, color: "#52525b" },
});

