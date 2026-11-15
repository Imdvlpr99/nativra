/** Nativra — Toast (NativeWind). Install: npx nativra-cli add toast */
import React from "react";
import { Pressable, Text, View } from "react-native";
import { elevation } from "@/hooks/use-theme-colors";

export interface ToastProps {
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning";
  onDismiss?: () => void;
}

export function Toast({
  title,
  description,
  variant = "default",
  onDismiss,
}: ToastProps) {
  // Status shows as the dot; the surface is the same inverted card for every variant.
  const dotColors = {
    default: "bg-background/60",
    success: "bg-success",
    error: "bg-destructive",
    warning: "bg-warning",
  };

  return (
    <View
      accessibilityRole="alert"
      className="w-full max-w-sm flex-row items-start justify-between rounded-surface bg-foreground px-[18px] py-3.5"
      style={elevation("raised")}
    >
      <View className="flex-row items-start gap-3 flex-1 pr-2">
        <View className={`mt-1.5 h-2 w-2 rounded-full ${dotColors[variant]}`} />
        <View className="flex-1">
          <Text className="text-sm font-semibold text-background">{title}</Text>
          {description ? (
            <Text className="mt-0.5 text-[13px] leading-[18px] text-background/70">{description}</Text>
          ) : null}
        </View>
      </View>
      {onDismiss ? (
        <Pressable accessibilityRole="button"
          onPress={onDismiss}
          accessibilityLabel="Dismiss toast"
          className="h-[26px] w-[26px] items-center justify-center rounded-full bg-background/10 active:opacity-70"
        >
          <Text className="text-xs font-bold text-background/80">✕</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

