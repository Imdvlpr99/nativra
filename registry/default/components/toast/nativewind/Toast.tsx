/** Nativra — Toast (NativeWind). Install: npx nativra-cli add toast */
import React from "react";
import { Pressable, Text, View } from "react-native";

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
  const variantStyles = {
    default: "border-zinc-800 bg-zinc-900 text-zinc-100",
    success: "border-emerald-600/50 bg-emerald-950/90 text-emerald-100",
    error: "border-red-600/50 bg-red-950/90 text-red-100",
    warning: "border-amber-600/50 bg-amber-950/90 text-amber-100",
  };

  const dotColors = {
    default: "bg-zinc-400",
    success: "bg-emerald-400",
    error: "bg-red-400",
    warning: "bg-amber-400",
  };

  return (
    <View
      accessibilityRole="alert"
      className={`w-full max-w-sm flex-row items-start justify-between rounded-2xl border p-4 shadow-xl backdrop-blur-md ${variantStyles[variant]}`}
    >
      <View className="flex-row items-start gap-3 flex-1 pr-2">
        <View className={`mt-1.5 h-2 w-2 rounded-full ${dotColors[variant]}`} />
        <View className="flex-1">
          <Text className="text-sm font-semibold text-white">{title}</Text>
          {description ? (
            <Text className="mt-0.5 text-xs text-zinc-300 leading-normal">{description}</Text>
          ) : null}
        </View>
      </View>
      {onDismiss ? (
        <Pressable
          onPress={onDismiss}
          accessibilityLabel="Dismiss toast"
          className="h-6 w-6 items-center justify-center rounded-lg bg-white/10 active:opacity-70"
        >
          <Text className="text-xs font-bold text-zinc-300">✕</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

