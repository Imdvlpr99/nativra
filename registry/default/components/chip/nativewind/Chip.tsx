/** Nativra — Chip (NativeWind). Install: npx nativra-cli add chip */
import React from "react";
import { Pressable, Text, View } from "react-native";

export interface ChipProps {
  label: string;
  selected?: boolean;
  variant?: "default" | "primary" | "outline";
  size?: "sm" | "md";
  disabled?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  className?: string;
}

export function Chip({
  label,
  selected = false,
  variant = "default",
  size = "md",
  disabled = false,
  onPress,
  onRemove,
  className = "",
}: ChipProps) {
  const sizeClasses = size === "sm" ? "h-7 px-2.5" : "h-8 px-3.5";
  const textSizeClasses = size === "sm" ? "text-xs" : "text-sm";

  const surfaceClasses = selected
    ? "bg-sky-600 border-sky-600 dark:bg-sky-500 dark:border-sky-500"
    : variant === "primary"
    ? "bg-sky-50 border-sky-200 dark:bg-sky-950/60 dark:border-sky-800"
    : variant === "outline"
    ? "bg-transparent border-zinc-300 dark:border-zinc-700"
    : "bg-zinc-100 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700";

  const textClasses = selected
    ? "text-white font-semibold"
    : variant === "primary"
    ? "text-sky-700 dark:text-sky-300 font-medium"
    : "text-zinc-800 dark:text-zinc-200 font-medium";

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={label}
      className={`flex-row items-center rounded-full border ${sizeClasses} ${surfaceClasses} ${
        disabled ? "opacity-50" : "active:opacity-80"
      } ${className}`}
    >
      <Text className={`${textSizeClasses} ${textClasses}`}>{label}</Text>
      {onRemove ? (
        <Pressable
          onPress={disabled ? undefined : onRemove}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
          className="ml-1.5 h-4 w-4 items-center justify-center rounded-full bg-black/10 dark:bg-white/15"
        >
          <View className="items-center justify-center">
            <Text className={`text-[10px] leading-none ${selected ? "text-white" : "text-zinc-600 dark:text-zinc-300"}`}>
              ✕
            </Text>
          </View>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

