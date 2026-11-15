/**
 * Nativra — Alert (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add alert
 */
import React from "react";
import { View, Text, Pressable, type ViewProps } from "react-native";

export type AlertVariant = "default" | "info" | "success" | "warning" | "destructive";

export interface AlertProps extends ViewProps {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const CONTAINER_VARIANTS: Record<AlertVariant, string> = {
  default: "bg-muted border-border",
  info: "bg-info/10 border-info/25",
  success: "bg-success/10 border-success/25",
  warning: "bg-warning/10 border-warning/25",
  destructive: "bg-destructive/10 border-destructive/25",
};

const TITLE_VARIANTS: Record<AlertVariant, string> = {
  default: "text-foreground",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

const DESC_VARIANTS: Record<AlertVariant, string> = {
  default: "text-muted-foreground",
  info: "text-foreground/80",
  success: "text-foreground/80",
  warning: "text-foreground/80",
  destructive: "text-foreground/80",
};

export function Alert({
  variant = "default",
  title,
  description,
  icon,
  onClose,
  children,
  className = "",
  ...props
}: AlertProps) {
  return (
    <View
      accessibilityRole="alert"
      className={`w-full rounded-card border p-4 flex-row items-start gap-3 ${CONTAINER_VARIANTS[variant]} ${className}`.trim()}
      {...props}
    >
      {icon && <View className="mt-0.5 shrink-0">{icon}</View>}

      <View className="flex-1 space-y-1">
        {title && (
          <Text className={`text-sm font-bold ${TITLE_VARIANTS[variant]}`}>
            {title}
          </Text>
        )}
        {description && (
          <Text className={`text-xs leading-relaxed ${DESC_VARIANTS[variant]}`}>
            {description}
          </Text>
        )}
        {children}
      </View>

      {onClose && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss alert"
          onPress={onClose}
          className="p-1 -mr-1 -mt-1 rounded-control active:opacity-60"
        >
          <Text className={`text-xs font-bold ${DESC_VARIANTS[variant]}`}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

