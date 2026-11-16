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
  /** Extra classes for the container, e.g. "self-start mb-2" */
  className?: string;
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
  sm: "sp-px-1.5 sp-py-0.5",
  md: "sp-px-2.5 sp-py-0.5",
  lg: "sp-px-3 sp-py-1",
};

const TEXT_SIZE: Record<BadgeSize, string> = {
  sm: "type-xs",
  md: "type-xs font-medium",
  lg: "type-sm font-medium",
};

export function Badge({ label, variant = "default", size = "md", className }: BadgeProps) {
  return (
    <View className={`flex-row items-center rounded-chip ${CONTAINER[variant]} ${SIZE[size]}${className ? ` ${className}` : ""}`}>
      <Text className={`${LABEL[variant]} ${TEXT_SIZE[size]}`}>{label}</Text>
    </View>
  );
}

