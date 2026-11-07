/** Nativra — Textarea (StyleSheet). Install: npx nativra add textarea */
import React from "react";
import { StyleSheet, Text, TextInput, View, useColorScheme, type TextInputProps } from "react-native";

export interface TextareaProps extends TextInputProps {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  rows?: number;
}

export function Textarea({
  label,
  error = false,
  errorMessage,
  disabled = false,
  rows = 4,
  style,
  ...rest
}: TextareaProps) {
  const dark = useColorScheme() === "dark";
  const fg = dark ? "#fafafa" : "#18181b";

  return (
    <View style={styles.wrap}>
      {label ? <Text style={[styles.label, { color: fg }]}>{label}</Text> : null}
      <TextInput
        multiline
        numberOfLines={rows}
        textAlignVertical="top"
        editable={!disabled}
        accessibilityLabel={rest.accessibilityLabel ?? label}
        accessibilityState={{ disabled }}
        placeholderTextColor="#a1a1aa"
        style={[
          styles.textarea,
          { color: fg, borderColor: error ? "#ef4444" : dark ? "#3f3f46" : "#d4d4d8" },
          disabled && styles.disabled,
          style,
        ]}
        {...rest}
      />
      {error && errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: "100%", gap: 6 },
  label: { fontSize: 14, fontWeight: "500" },
  textarea: { minHeight: 96, borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16 },
  disabled: { opacity: 0.5 },
  error: { fontSize: 12, color: "#ef4444" },
});

