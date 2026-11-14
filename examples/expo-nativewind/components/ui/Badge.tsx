/**
 * Nativra — Badge (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Install: npx nativra-cli add badge
 */
import React from "react";
import { View, Text } from "react-native";

type BadgeVariant = "default" | "primary" | "secondary" | "destructive" | "outline";
type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const CONTAINER: Record<BadgeVariant, string> = {
  default:     "bg-zinc-900 dark:bg-zinc-50",
  primary:     "bg-sky-100 dark:bg-sky-900",
  secondary:   "bg-zinc-100 dark:bg-zinc-800",
  destructive: "bg-red-100 dark:bg-red-900",
  outline:     "border border-zinc-300 bg-transparent dark:border-zinc-600",
};

const LABEL: Record<BadgeVariant, string> = {
  default:     "text-white dark:text-zinc-900",
  primary:     "text-sky-800 dark:text-sky-200",
  secondary:   "text-zinc-700 dark:text-zinc-300",
  destructive: "text-red-800 dark:text-red-200",
  outline:     "text-zinc-700 dark:text-zinc-300",
};

const SIZE: Record<BadgeSize, string> = {
  sm: "px-1.5 py-0.5",
  md: "px-2.5 py-0.5",
  lg: "px-3 py-1",
};

const TEXT_SIZE: Record<BadgeSize, string> = {
  sm: "text-xs",
  md: "text-xs font-medium",
  lg: "text-sm font-medium",
};

export function Badge({ label, variant = "default", size = "md" }: BadgeProps) {
  return (
    <View className={`flex-row items-center rounded-full ${CONTAINER[variant]} ${SIZE[size]}`}>
      <Text className={`${LABEL[variant]} ${TEXT_SIZE[size]}`}>{label}</Text>
    </View>
  );
}

