/**
 * Nativra — Checkbox (React Native StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add checkbox
 */
import React from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  useColorScheme,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function Checkbox({
  checked,
  onCheckedChange,
  disabled = false,
  label,
  style,
  accessibilityLabel,
}: CheckboxProps) {
  const isDark = useColorScheme() === "dark";
  const activeColor = isDark ? "#fafafa" : "#18181b";
  const inactiveBorder = isDark ? "#52525b" : "#a1a1aa";
  const checkColor = isDark ? "#18181b" : "#ffffff";
  const labelColor = isDark ? "#f4f4f5" : "#18181b";

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={disabled}
      onPress={() => onCheckedChange(!checked)}
      style={[styles.container, disabled && styles.disabled, style]}
    >
      <View
        style={[
          styles.box,
          checked
            ? { backgroundColor: activeColor, borderColor: activeColor }
            : { borderColor: inactiveBorder, backgroundColor: "transparent" },
        ]}
      >
        {checked && (
          <Text style={[styles.checkmark, { color: checkColor }]}>✓</Text>
        )}
      </View>
      {label ? (
        <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 14,
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  disabled: {
    opacity: 0.5,
  },
});

