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

/** Spoken before the title: the dot shows the variant by color alone, which a screen reader can't convey. */
const STATUS_LABEL: Record<NonNullable<ToastProps["variant"]>, string> = {
  default: "",
  success: "Success",
  error: "Error",
  warning: "Warning",
};

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
      className="w-full max-w-sm flex-row items-start justify-between rounded-surface bg-foreground px-[18px] sp-py-3.5"
      style={elevation("raised")}
    >
      <View className="flex-row items-start sp-gap-3 flex-1 sp-pr-2" accessible accessibilityLabel={[STATUS_LABEL[variant], title, description].filter(Boolean).join(". ")}>
        <View className={`mt-1.5 h-2 w-2 rounded-full ${dotColors[variant]}`} />
        <View className="flex-1">
          <Text className="type-sm weight-label text-background">{title}</Text>
          {description ? (
            <Text className="mt-0.5 type-sm leading-[18px] text-background/70">{description}</Text>
          ) : null}
        </View>
      </View>
      {onDismiss ? (
        <Pressable accessibilityRole="button"
          onPress={onDismiss}
          // 26pt circle + 9pt on every side = the 44pt minimum touch target
          hitSlop={9}
          accessibilityLabel="Dismiss toast"
          className="h-[26px] w-[26px] items-center justify-center rounded-full bg-background/10 active:opacity-70"
        >
          <Text className="type-xs weight-title text-background/80">✕</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

