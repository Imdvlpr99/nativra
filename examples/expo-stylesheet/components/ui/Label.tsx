/**
 * Nativra — Label (React Native StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add label
 */
import React from "react";
import {
  Text,
  View,
  StyleSheet,
  useColorScheme,
  type TextProps,
} from "react-native";

export interface LabelProps extends TextProps {
  children: string;
  required?: boolean;
  disabled?: boolean;
}

export function Label({
  children,
  required = false,
  disabled = false,
  style,
  ...props
}: LabelProps) {
  const isDark = useColorScheme() === "dark";
  const textColor = isDark ? "#f4f4f5" : "#18181b";

  return (
    <View style={styles.container}>
      <Text
        accessibilityRole="text"
        style={[
          styles.label,
          { color: textColor },
          disabled && styles.disabled,
          style,
        ]}
        {...props}
      >
        {children}
      </Text>
      {required ? (
        <Text style={styles.required} accessibilityLabel="required">
          *
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: -0.1,
  },
  disabled: {
    opacity: 0.5,
  },
  required: {
    color: "#ef4444",
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "700",
  },
});
