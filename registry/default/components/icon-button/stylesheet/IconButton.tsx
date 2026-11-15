import * as React from "react";
import {
  Pressable,
  ActivityIndicator,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { type ThemeColors, useThemeColors, themeStyle, pressedStyle } from "@/hooks/use-theme-colors";

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
  const c = useThemeColors();
  const styles = createStyles(c);
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
          color={variant === "outline" || variant === "ghost" ? c["muted-foreground"] : variant === "default" ? c.background : variant === "destructive" ? c["destructive-foreground"] : c["primary-foreground"]}
        />
      ) : (
        children
      )}
    </Pressable>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
  sm: {
    width: 36,
    height: 36,
    borderRadius: themeStyle.radius.button,
  },
  md: {
    width: 44,
    height: 44,
    borderRadius: themeStyle.radius.button,
  },
  lg: {
    width: 52,
    height: 52,
    borderRadius: themeStyle.radius.button,
  },
  full: {
    borderRadius: 9999,
  },
  default: {
    backgroundColor: c.foreground,
  },
  primary: {
    backgroundColor: c.primary,
  },
  secondary: {
    backgroundColor: c.muted,
    borderWidth: themeStyle.borderWidth,
    borderColor: c.border,
  },
  destructive: {
    backgroundColor: c.destructive,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: themeStyle.borderWidth,
    borderColor: c.input,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  pressed: { ...pressedStyle(true) },
  disabled: {
    opacity: 0.5,
  },
});

