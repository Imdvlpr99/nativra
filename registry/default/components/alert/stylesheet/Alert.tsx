/**
 * Nativra — Alert (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add alert --target stylesheet
 */
import React from "react";
import { View, Text, Pressable, StyleSheet, type ViewProps } from "react-native";
import { alpha, type ThemeColors, useThemeColors, themeStyle } from "@/hooks/use-theme-colors";

export type AlertVariant = "default" | "info" | "success" | "warning" | "destructive";

export interface AlertProps extends ViewProps {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  children?: React.ReactNode;
}

const THEMES = (c: ThemeColors): Record<
  AlertVariant,
  { bg: string; border: string; title: string; desc: string }
> => ({
  // Status variants: a soft tint of the status color, its title in full color, body text readable.
  default: { bg: c.muted, border: c.border, title: c.foreground, desc: c["muted-foreground"] },
  info: { bg: alpha(c.info, 0.1), border: alpha(c.info, 0.25), title: c.info, desc: alpha(c.foreground, 0.8) },
  success: { bg: alpha(c.success, 0.1), border: alpha(c.success, 0.25), title: c.success, desc: alpha(c.foreground, 0.8) },
  warning: { bg: alpha(c.warning, 0.1), border: alpha(c.warning, 0.25), title: c.warning, desc: alpha(c.foreground, 0.8) },
  destructive: { bg: alpha(c.destructive, 0.1), border: alpha(c.destructive, 0.25), title: c.destructive, desc: alpha(c.foreground, 0.8) },
});

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
  const c = useThemeColors();
  const themes = THEMES(c);
  const theme = themes[variant] ?? themes.default;

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
    borderRadius: themeStyle.radius.card,
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

