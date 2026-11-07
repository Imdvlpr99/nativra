/** Nativra — Textarea (NativeWind). Install: npx nativra add textarea */
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
        <Text className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{label}</Text>
      ) : null}
      <TextInput
        multiline
        numberOfLines={rows}
        textAlignVertical="top"
        editable={!disabled}
        accessibilityLabel={rest.accessibilityLabel ?? label}
        accessibilityState={{ disabled }}
        placeholderTextColor="#a1a1aa"
        className={`min-h-[96px] rounded-xl border p-3 text-base text-zinc-900 dark:text-zinc-50 ${
          error ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
        } ${disabled ? "opacity-50" : ""}`}
        {...rest}
      />
      {error && errorMessage ? <Text className="text-xs text-red-500">{errorMessage}</Text> : null}
    </View>
  );
}
