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
  default:     "bg-foreground",
  primary:     "bg-primary/10",
  secondary:   "bg-muted",
  destructive: "bg-destructive/10",
  outline:     "border border-input bg-transparent",
};

const LABEL: Record<BadgeVariant, string> = {
  default:     "text-background",
  primary:     "text-foreground",
  secondary:   "text-foreground",
  destructive: "text-destructive",
  outline:     "text-foreground",
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

