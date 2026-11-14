/** Nativra — Chip (NativeWind). Install: npx nativra-cli add chip */
import React from "react";
import { Pressable, Text, View, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

export interface ChipProps extends Omit<PressableProps, "style"> {
  label: string;
  selected?: boolean;
  variant?: "default" | "primary" | "outline";
  size?: "sm" | "md";
  disabled?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
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
  style,
  ...rest
}: ChipProps) {
  const sizeClasses = size === "sm" ? "h-7 px-2.5" : "h-8 px-3.5";
  const textSizeClasses = size === "sm" ? "text-xs" : "text-sm";

  const surfaceClasses = selected
    ? "bg-primary border-primary"
    : variant === "primary"
    ? "bg-primary/10 border-primary/30"
    : variant === "outline"
    ? "bg-transparent border-input"
    : "bg-muted border-border";

  const textClasses = selected
    ? "text-primary-foreground font-semibold"
    : variant === "primary"
    ? "text-primary font-medium"
    : "text-foreground font-medium";

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={label}
      style={style}
      className={`flex-row items-center rounded-full border ${sizeClasses} ${surfaceClasses} ${
        disabled ? "opacity-50" : "active:opacity-80"
      } ${className}`}
      {...rest}
    >
      <Text className={`${textSizeClasses} ${textClasses}`}>{label}</Text>
      {onRemove ? (
        <Pressable
          onPress={disabled ? undefined : onRemove}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
          className="ml-1.5 h-4 w-4 items-center justify-center rounded-full bg-foreground/10"
        >
          <View className="items-center justify-center">
            <Text className={`text-[10px] leading-none ${selected ? "text-primary-foreground" : "text-muted-foreground"}`}>
              ✕
            </Text>
          </View>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

