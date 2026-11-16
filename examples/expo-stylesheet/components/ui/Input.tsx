/** Nativra — Input (StyleSheet). Install: npx nativra-cli add input */
import React from "react";
import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import { type ThemeColors, field, sp, themeStyle, ts, useThemeColors } from "@/hooks/use-theme-colors";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
}

export function Input({ label, error = false, errorMessage, disabled = false, style, onFocus, onBlur, ...rest }: InputProps) {
  const c = useThemeColors();
  const styles = createStyles(c);
  const [focused, setFocused] = React.useState(false);
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        editable={!disabled}
        accessibilityLabel={rest.accessibilityLabel ?? label}
        accessibilityState={{ disabled }}
        placeholderTextColor={c["muted-foreground"]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          styles.input,
          field(c, focused),
          error && errorEdge(c),
          disabled && styles.disabled,
          style,
        ]}
        {...rest}
      />
      {error && errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
}

/** Error state on the field's edge: the whole outline, or a filled field's bottom edge. */
function errorEdge(c: ThemeColors) {
  return themeStyle.field === "filled"
    ? { borderBottomWidth: 2, borderBottomColor: c.destructive }
    : { borderColor: c.destructive, borderWidth: Math.max(themeStyle.borderWidth, 1) };
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  wrap: { width: "100%", gap: sp(6) },
  label: { fontSize: ts(14), fontWeight: themeStyle.fontWeight.label, color: c.foreground },
  input: {
    minHeight: themeStyle.control.height,
    borderRadius: themeStyle.radius.control,
    paddingHorizontal: sp(14),
    paddingVertical: sp(10),
    fontSize: ts(16),
    color: c.foreground,
  },
  disabled: { opacity: 0.5 },
  error: { fontSize: ts(12), color: c.destructive },
});
