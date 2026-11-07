/**
 * Nativra — Alert (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add alert --target stylesheet
 */
import React from "react";
import { View, Text, Pressable, StyleSheet, type ViewProps } from "react-native";

export type AlertVariant = "default" | "info" | "success" | "warning" | "destructive";

export interface AlertProps extends ViewProps {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  children?: React.ReactNode;
}

const THEMES: Record<
  AlertVariant,
  { bg: string; border: string; title: string; desc: string }
> = {
  default: { bg: "#f4f4f5", border: "#e4e4e7", title: "#18181b", desc: "#71717a" },
  info: { bg: "#f0f9ff", border: "#bae6fd", title: "#0369a1", desc: "#0284c7" },
  success: { bg: "#f0fdf4", border: "#bbf7d0", title: "#15803d", desc: "#16a34a" },
  warning: { bg: "#fffbeb", border: "#fde68a", title: "#b45309", desc: "#d97706" },
  destructive: { bg: "#fef2f2", border: "#fecaca", title: "#b91c1c", desc: "#dc2626" },
};

export function Alert({
  variant = "default",
  title,
  description,
  icon,
  onClose,
  children,
  style,
  ...props
}: AlertProps) {
  const theme = THEMES[variant] ?? THEMES.default;

  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.container,
        { backgroundColor: theme.bg, borderColor: theme.border },
        style,
      ]}
      {...props}
    >
      {icon && <View style={styles.icon}>{icon}</View>}

      <View style={styles.content}>
        {title && <Text style={[styles.title, { color: theme.title }]}>{title}</Text>}
        {description && <Text style={[styles.description, { color: theme.desc }]}>{description}</Text>}
        {children}
      </View>

      {onClose && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss alert"
          onPress={onClose}
          style={styles.closeBtn}
        >
          <Text style={[styles.closeText, { color: theme.desc }]}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  icon: {
    marginTop: 2,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
  },
  closeBtn: {
    padding: 4,
    marginTop: -4,
    marginRight: -4,
  },
  closeText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
