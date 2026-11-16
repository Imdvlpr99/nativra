/** Nativra — Toast (StyleSheet). Install: npx nativra-cli add toast */
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { type ThemeColors, useThemeColors, themeStyle, alpha, elevation, ts, sp } from "@/hooks/use-theme-colors";

export interface ToastProps {
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning";
  onDismiss?: () => void;
}

/** Spoken before the title: the dot shows the variant by color alone, which a screen reader can't convey. */
const STATUS_LABEL: Record<NonNullable<ToastProps["variant"]>, string> = {
  default: "",
  success: "Success",
  error: "Error",
  warning: "Warning",
};

export function Toast({
  title,
  description,
  variant = "default",
  onDismiss,
}: ToastProps) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  // Status shows as the dot; the surface is the same inverted card for every variant.
  const dotColors = {
    default: alpha(c.background, 0.6),
    success: c.success,
    error: c.destructive,
    warning: c.warning,
  };

  return (
    <View
      accessibilityRole="alert"
      style={styles.toast}
    >
      <View style={styles.content} accessible accessibilityLabel={[STATUS_LABEL[variant], title, description].filter(Boolean).join(". ")}>
        <View style={[styles.dot, { backgroundColor: dotColors[variant] }]} />
        <View style={styles.textWrap}>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>
      </View>
      {onDismiss ? (
        <Pressable
          accessibilityRole="button"
          onPress={onDismiss}
          // 26pt circle + 9pt on every side = the 44pt minimum touch target
          hitSlop={9}
          accessibilityLabel="Dismiss toast"
          style={styles.closeBtn}
        >
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  toast: { width: "100%", maxWidth: 360, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", borderRadius: themeStyle.radius.surface, backgroundColor: c.foreground, paddingVertical: sp(14), paddingHorizontal: sp(18), ...elevation("raised") },
  content: { flexDirection: "row", alignItems: "flex-start", gap: sp(12), flex: 1, paddingRight: sp(8) },
  dot: { width: 8, height: 8, borderRadius: 9999, marginTop: 5 },
  textWrap: { flex: 1 },
  title: { fontSize: ts(14), fontWeight: themeStyle.fontWeight.title, color: c.background },
  description: { fontSize: ts(13), color: alpha(c.background, 0.7), marginTop: 2, lineHeight: ts(18) },
  closeBtn: { width: 26, height: 26, borderRadius: 9999, backgroundColor: alpha(c.background, 0.12), alignItems: "center", justifyContent: "center" },
  closeText: { fontSize: ts(11), fontWeight: themeStyle.fontWeight.title, color: alpha(c.background, 0.8) },
});

