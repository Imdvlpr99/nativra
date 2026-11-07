/** Nativra — RadioGroup (NativeWind). Install: npx nativra add radio-group */
import React from "react";
import { Pressable, Text, View } from "react-native";

export interface RadioOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function RadioGroup({
  options,
  value,
  onValueChange,
  disabled = false,
}: RadioGroupProps) {
  return (
    <View accessibilityRole="radiogroup" className="w-full gap-3">
      {options.map((opt) => {
        const isSelected = opt.value === value;
        const isDisabled = disabled || opt.disabled;

        return (
          <Pressable
            key={opt.value}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected, disabled: isDisabled }}
            onPress={() => !isDisabled && onValueChange(opt.value)}
            disabled={isDisabled}
            className={`flex-row items-start gap-3 rounded-xl border p-3.5 transition-colors ${
              isSelected
                ? "border-sky-500 bg-sky-500/10 dark:border-sky-400 dark:bg-sky-950/20"
                : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            } ${isDisabled ? "opacity-50" : "active:opacity-85"}`}
          >
            {/* Radio Circle */}
            <View
              className={`mt-0.5 h-5 w-5 rounded-full border items-center justify-center ${
                isSelected ? "border-sky-500 dark:border-sky-400" : "border-zinc-400 dark:border-zinc-600"
              }`}
            >
              {isSelected ? (
                <View className="h-2.5 w-2.5 rounded-full bg-sky-500 dark:bg-sky-400" />
              ) : null}
            </View>

            {/* Labels */}
            <View className="flex-1">
              <Text className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {opt.label}
              </Text>
              {opt.description ? (
                <Text className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                  {opt.description}
                </Text>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
