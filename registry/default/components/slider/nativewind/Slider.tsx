/**
 * Nativra — Slider (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add slider
 */
import React from "react";
import { View, Pressable, type GestureResponderEvent, type ViewProps } from "react-native";

export interface SliderProps extends ViewProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onValueChange?: (value: number) => void;
  className?: string;
}

export function Slider({
  value = 50,
  min = 0,
  max = 100,
  disabled = false,
  onValueChange,
  className = "",
  ...props
}: SliderProps) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const handlePress = (e: GestureResponderEvent) => {
    if (disabled || !onValueChange) return;
    const { locationX } = e.nativeEvent;
    // Normalized touch ratio estimation for quick taps
    const ratio = Math.max(0, Math.min(1, locationX / 200));
    const nextVal = Math.round(min + ratio * (max - min));
    onValueChange(nextVal);
  };

  return (
    <Pressable
      accessibilityRole="adjustable"
      accessibilityValue={{ min, max, now: value }}
      disabled={disabled}
      onPress={handlePress}
      className={`w-full py-3 justify-center relative select-none ${disabled ? "opacity-50" : ""} ${className}`.trim()}
      {...props}
    >
      {/* Background Track */}
      <View className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
        {/* Active Fill Track */}
        <View
          className="h-full rounded-full bg-sky-500"
          style={{ width: `${percentage}%` }}
        />
      </View>

      {/* Draggable Thumb Knob */}
      <View
        className="absolute top-1/2 -mt-3.5 h-7 w-7 rounded-full bg-white dark:bg-zinc-100 shadow-md border-2 border-sky-500 items-center justify-center -ml-3.5"
        style={{ left: `${percentage}%` }}
      />
    </Pressable>
  );
}

