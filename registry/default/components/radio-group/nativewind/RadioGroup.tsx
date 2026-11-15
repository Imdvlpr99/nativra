/** Nativra — RadioGroup (NativeWind). Install: npx nativra-cli add radio-group */
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
            className={`flex-row items-start gap-3 rounded-control border p-3.5 transition-colors ${
              isSelected
                ? "border-primary bg-primary/10"
                : "border-border bg-card"
            } ${isDisabled ? "opacity-50" : "active:opacity-85"}`}
          >
            {/* Radio Circle */}
            <View
              className={`mt-0.5 h-5 w-5 rounded-full border items-center justify-center ${
                isSelected ? "border-primary" : "border-input"
              }`}
            >
              {isSelected ? (
                <View className="h-2.5 w-2.5 rounded-full bg-primary" />
              ) : null}
            </View>

            {/* Labels */}
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground">
                {opt.label}
              </Text>
              {opt.description ? (
                <Text className="mt-0.5 text-xs text-muted-foreground leading-normal">
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

