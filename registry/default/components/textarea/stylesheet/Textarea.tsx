/** Nativra — Textarea (StyleSheet). Install: npx nativra-cli add textarea */
import React from "react";
import { StyleSheet, Text, TextInput, View, useColorScheme, type TextInputProps } from "react-native";
import { type ThemeColors, field, useThemeColors, themeStyle, ts, sp } from "@/hooks/use-theme-colors";

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
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const dark = useColorScheme() === "dark";
  const fg = c.foreground;

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
        placeholderTextColor={c["muted-foreground"]}
        style={[
          styles.textarea,
          field(c),
          { color: fg },
          error && (themeStyle.field === "filled"
            ? { borderBottomWidth: 2, borderBottomColor: c.destructive }
            : { borderColor: c.destructive }),
          disabled && styles.disabled,
          style,
        ]}
        {...rest}
      />
      {error && errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  wrap: { width: "100%", gap: sp(6) },
  label: { fontSize: ts(14), fontWeight: "500" },
  textarea: { minHeight: sp(96), borderWidth: themeStyle.borderWidth, borderRadius: themeStyle.radius.control, padding: sp(12), fontSize: ts(16) },
  disabled: { opacity: 0.5 },
  error: { fontSize: ts(12), color: c.destructive },
});

