/** Nativra — Toast (StyleSheet). Install: npx nativra add toast */
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export interface ToastProps {
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning";
  onDismiss?: () => void;
}

export function Toast({
  title,
  description,
  variant = "default",
  onDismiss,
}: ToastProps) {
  const bgColors = {
    default: "#18181b",
    success: "#064e3b",
    error: "#7f1d1d",
    warning: "#78350f",
  };

  const borderColors = {
    default: "#27272a",
    success: "#059669",
    error: "#dc2626",
    warning: "#d97706",
  };

  const dotColors = {
    default: "#a1a1aa",
    success: "#34d399",
    error: "#f87171",
    warning: "#fbbf24",
  };

  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.toast,
        { backgroundColor: bgColors[variant], borderColor: borderColors[variant] },
      ]}
    >
      <View style={styles.content}>
        <View style={[styles.dot, { backgroundColor: dotColors[variant] }]} />
        <View style={styles.textWrap}>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>
      </View>
      {onDismiss ? (
        <Pressable onPress={onDismiss} accessibilityLabel="Dismiss toast" style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  toast: { width: "100%", maxWidth: 360, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", borderRadius: 16, borderWidth: 1, padding: 16, shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 8, elevation: 5 },
  content: { flexDirection: "row", alignItems: "flex-start", gap: 12, flex: 1, paddingRight: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  textWrap: { flex: 1 },
  title: { fontSize: 14, fontWeight: "600", color: "#ffffff" },
  description: { fontSize: 12, color: "#d4d4d8", marginTop: 2, lineHeight: 16 },
  closeBtn: { width: 24, height: 24, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center" },
  closeText: { fontSize: 11, fontWeight: "700", color: "#d4d4d8" },
});

