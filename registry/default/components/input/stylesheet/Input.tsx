/** Nativra — Input (StyleSheet). Install: npx nativra-cli add input */
import React from "react";
import { StyleSheet, Text, TextInput, View, useColorScheme, type TextInputProps } from "react-native";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
}

export function Input({ label, error = false, errorMessage, disabled = false, style, ...rest }: InputProps) {
  const dark = useColorScheme() === "dark";
  const fg = dark ? "#fafafa" : "#18181b";
  return (
    <View style={styles.wrap}>
      {label ? <Text style={[styles.label, { color: fg }]}>{label}</Text> : null}
      <TextInput
        editable={!disabled}
        accessibilityLabel={rest.accessibilityLabel ?? label}
        accessibilityState={{ disabled }}
        placeholderTextColor="#a1a1aa"
        style={[
          styles.input,
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
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 },
  disabled: { opacity: 0.5 },
  error: { fontSize: 12, color: "#ef4444" },
});

