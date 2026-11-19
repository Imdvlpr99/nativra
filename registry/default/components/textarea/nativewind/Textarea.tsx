/** Nativra — Textarea (NativeWind). Install: npx nativra-cli add textarea */
import React from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";
import { useThemeColors } from "@/hooks/use-theme-colors";

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
  className = "",
  ...rest
}: TextareaProps) {
  const palette = useThemeColors();
  return (
    <View className="w-full sp-gap-1.5">
      {label ? (
        <Text className="type-sm font-medium text-foreground">{label}</Text>
      ) : null}
      <TextInput
        multiline
        numberOfLines={rows}
        textAlignVertical="top"
        editable={!disabled}
        accessibilityLabel={rest.accessibilityLabel ?? label}
        accessibilityState={{ disabled }}
        placeholderTextColor={palette["muted-foreground"]}
        className={`field min-h-[96px] rounded-control sp-p-3 type-base text-foreground ${
          error ? "border-destructive" : "border-input"
        } ${disabled ? "opacity-50" : ""} ${className}`}
        {...rest}
      />
      {error && errorMessage ? <Text className="type-xs text-destructive">{errorMessage}</Text> : null}
    </View>
  );
}

