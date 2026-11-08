/** Nativra — Input (NativeWind). Install: npx nativra-cli add input */
import React from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
}

export function Input({ label, error = false, errorMessage, disabled = false, ...rest }: InputProps) {
  return (
    <View className="w-full gap-1.5">
      {label ? <Text className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{label}</Text> : null}
      <TextInput
        editable={!disabled}
        accessibilityLabel={rest.accessibilityLabel ?? label}
        accessibilityState={{ disabled }}
        placeholderTextColor="#a1a1aa"
        className={`rounded-lg border px-3 py-2.5 text-base text-zinc-900 dark:text-zinc-50 ${
          error ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"
        } ${disabled ? "opacity-50" : ""}`}
        {...rest}
      />
      {error && errorMessage ? <Text className="text-xs text-red-500">{errorMessage}</Text> : null}
    </View>
  );
}

