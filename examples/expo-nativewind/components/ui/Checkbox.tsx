/**
 * Nativra — Checkbox (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add checkbox
 */
import React from "react";
import { Pressable, View, Text } from "react-native";

export interface CheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  accessibilityLabel?: string;
}

export function Checkbox({
  checked,
  onCheckedChange,
  disabled = false,
  label,
  className = "",
  accessibilityLabel,
}: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={disabled}
      onPress={() => onCheckedChange(!checked)}
      className={`flex-row items-center ${disabled ? "opacity-50" : ""} ${className}`.trim()}
    >
      <View
        className={`h-5 w-5 rounded border items-center justify-center ${
          checked
            ? "bg-zinc-900 border-zinc-900 dark:bg-zinc-50 dark:border-zinc-50"
            : "border-zinc-400 bg-transparent dark:border-zinc-600"
        }`}
      >
        {checked && (
          <Text className="text-white dark:text-zinc-900 text-xs font-bold leading-none">
            ✓
          </Text>
        )}
      </View>
      {label ? (
        <Text className="ml-2 text-sm text-zinc-900 dark:text-zinc-100 font-medium">
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}
