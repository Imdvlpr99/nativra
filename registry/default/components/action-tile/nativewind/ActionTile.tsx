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
      ? "bg-primary border-primary"
      : variant === "outline"
      ? "bg-transparent border-border"
      : "bg-card border-border";

  const iconWrapClasses =
    variant === "primary"
      ? "bg-primary-foreground/20"
      : "bg-primary/10";

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
          variant === "primary" ? "text-primary-foreground" : "text-foreground"
        }`}
      >
        {label}
      </Text>
      {subtitle ? (
        <Text
          numberOfLines={1}
          className={`mt-0.5 text-[10px] ${
            variant === "primary" ? "text-primary-foreground/80" : "text-muted-foreground"
          }`}
        >
          {subtitle}
        </Text>
      ) : null}
    </Pressable>
  );
}

