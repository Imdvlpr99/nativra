/**
 * Nativra — Checkbox (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add checkbox
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
      accessibilityState={{ checked, disabled }} aria-checked={checked}
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={disabled}
      onPress={() => onCheckedChange(!checked)}
      className={`flex-row items-center ${disabled ? "opacity-50" : ""} ${className}`.trim()}
    >
      <View
        className={`h-5 w-5 rounded-small border items-center justify-center ${
          checked
            ? "bg-foreground border-foreground"
            : "border-input bg-transparent"
        }`}
      >
        {checked && (
          <Text className="text-background type-xs weight-title leading-none">
            ✓
          </Text>
        )}
      </View>
      {label ? (
        <Text className="ml-2 type-sm text-foreground font-medium">
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}

