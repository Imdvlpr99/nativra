/**
 * Nativra — Label (React Native StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add label
 */
import React from "react";
import {
  Text,
  View,
  StyleSheet,
  type TextProps,
} from "react-native";
import { type ThemeColors, useThemeColors, ts, themeStyle } from "@/hooks/use-theme-colors";

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
  const c = useThemeColors();
  const styles = createStyles(c);
  const textColor = c.foreground;

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

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: ts(14),
    fontWeight: "500",
    letterSpacing: -0.1,
  },
  disabled: {
    opacity: 0.5,
  },
  required: {
    color: c.destructive,
    marginLeft: 4,
    fontSize: ts(14),
    fontWeight: themeStyle.fontWeight.title,
  },
});

