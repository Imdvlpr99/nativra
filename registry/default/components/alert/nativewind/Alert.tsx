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
  info: "bg-primary/10 border-primary/30",
  success: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/60",
  warning: "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/60",
  destructive: "bg-destructive/10 border-destructive/30",
};

const TITLE_VARIANTS: Record<AlertVariant, string> = {
  default: "text-foreground",
  info: "text-foreground",
  success: "text-emerald-900 dark:text-emerald-200",
  warning: "text-amber-900 dark:text-amber-200",
  destructive: "text-destructive",
};

const DESC_VARIANTS: Record<AlertVariant, string> = {
  default: "text-muted-foreground",
  info: "text-primary",
  success: "text-emerald-700 dark:text-emerald-300",
  warning: "text-amber-700 dark:text-amber-300",
  destructive: "text-destructive",
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
      className={`w-full rounded-2xl border p-4 flex-row items-start gap-3 ${CONTAINER_VARIANTS[variant]} ${className}`.trim()}
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
          className="p-1 -mr-1 -mt-1 rounded-lg active:opacity-60"
        >
          <Text className={`text-xs font-bold ${DESC_VARIANTS[variant]}`}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

