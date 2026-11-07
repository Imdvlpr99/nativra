import * as React from "react";
import {
  Pressable,
  ActivityIndicator,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type IconButtonVariant = "default" | "primary" | "secondary" | "destructive" | "outline" | "ghost";
export type IconButtonSize = "sm" | "md" | "lg";

export interface IconButtonProps extends Omit<PressableProps, "children"> {
  accessibilityLabel: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  roundedFull?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  variant = "default",
  size = "md",
  roundedFull = false,
  loading = false,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  children,
  style,
  onPress,
  ...props
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      hitSlop={size === "sm" ? 4 : 0}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        styles[variant],
        roundedFull && styles.full,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" || variant === "ghost" ? "#71717A" : "#FFFFFF"}
        />
      ) : (
        children
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
  sm: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  md: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  lg: {
    width: 52,
    height: 52,
    borderRadius: 16,
  },
  full: {
    borderRadius: 9999,
  },
  default: {
    backgroundColor: "#18181B",
  },
  primary: {
    backgroundColor: "#0284C7",
  },
  secondary: {
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#E4E4E7",
  },
  destructive: {
    backgroundColor: "#DC2626",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#D4D4D8",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.5,
  },
});
