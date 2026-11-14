/** Nativra — Textarea (NativeWind). Install: npx nativra-cli add textarea */
import React from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";

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
  ...rest
}: TextareaProps) {
  return (
    <View className="w-full gap-1.5">
      {label ? (
        <Text className="text-sm font-medium text-foreground">{label}</Text>
      ) : null}
      <TextInput
        multiline
        numberOfLines={rows}
        textAlignVertical="top"
        editable={!disabled}
        accessibilityLabel={rest.accessibilityLabel ?? label}
        accessibilityState={{ disabled }}
        placeholderTextColor="#a1a1aa"
        className={`min-h-[96px] rounded-xl border p-3 text-base text-foreground ${
          error ? "border-destructive" : "border-input"
        } ${disabled ? "opacity-50" : ""}`}
        {...rest}
      />
      {error && errorMessage ? <Text className="text-xs text-destructive">{errorMessage}</Text> : null}
    </View>
  );
}

