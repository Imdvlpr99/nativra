/** Nativra — ActionTile (NativeWind). Install: npx nativra-cli add action-tile */
import React from "react";
import { Pressable, Text, View, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

export interface ActionTileProps extends Omit<PressableProps, "style"> {
  label: string;
  subtitle?: string;
  icon?: string;
  variant?: "default" | "primary" | "outline";
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export function ActionTile({
  label,
  subtitle,
  icon = "⚡",
  variant = "default",
  disabled = false,
  onPress,
  className = "",
  style,
  ...rest
}: ActionTileProps) {
  const surfaceClasses =
    variant === "primary"
      ? "bg-sky-600 border-sky-600 dark:bg-sky-500 dark:border-sky-500"
      : variant === "outline"
      ? "bg-transparent border-zinc-200 dark:border-zinc-800"
      : "bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800";

  const iconWrapClasses =
    variant === "primary"
      ? "bg-white/20"
      : "bg-sky-50 dark:bg-sky-950/70";

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={label}
      style={style}
      className={`flex-1 items-center justify-center rounded-2xl border p-3.5 shadow-sm ${surfaceClasses} ${
        disabled ? "opacity-50" : "active:opacity-80"
      } ${className}`}
      {...rest}
    >
      <View className={`mb-2 h-10 w-10 items-center justify-center rounded-xl ${iconWrapClasses}`}>
        <Text className="text-base">{icon}</Text>
      </View>
      <Text
        numberOfLines={1}
        className={`text-xs font-bold ${
          variant === "primary" ? "text-white" : "text-zinc-900 dark:text-zinc-50"
        }`}
      >
        {label}
      </Text>
      {subtitle ? (
        <Text
          numberOfLines={1}
          className={`mt-0.5 text-[10px] ${
            variant === "primary" ? "text-sky-100" : "text-zinc-500 dark:text-zinc-400"
          }`}
        >
          {subtitle}
        </Text>
      ) : null}
    </Pressable>
  );
}

