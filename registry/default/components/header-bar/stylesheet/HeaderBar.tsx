/** Nativra — HeaderBar (StyleSheet). Install: npx nativra-cli add header-bar */
import React from "react";
import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";

export interface HeaderBarProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightLabel?: string;
  onRightPress?: () => void;
  elevated?: boolean;
  style?: ViewStyle;
}

export function HeaderBar({
  title,
  subtitle,
  onBack,
  rightLabel,
  onRightPress,
  elevated = false,
  style,
}: HeaderBarProps) {
  return (
    <View
      accessibilityRole="header"
      style={[styles.container, elevated && styles.elevated, style]}
    >
      <View style={styles.sideLeft}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backBtn}
          >
            <Text style={styles.backChevron}>‹</Text>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.center}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.sideRight}>
        {rightLabel ? (
          <Pressable
            onPress={onRightPress}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={rightLabel}
            style={styles.rightBtn}
          >
            <Text style={styles.rightText}>{rightLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  elevated: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sideLeft: { width: 64, alignItems: "flex-start" },
  sideRight: { width: 64, alignItems: "flex-end" },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 4 },
  backChevron: { fontSize: 16, fontWeight: "700", color: "#0284c7" },
  backText: { fontSize: 12, fontWeight: "600", color: "#0284c7" },
  center: { flex: 1, alignItems: "center", paddingHorizontal: 8 },
  title: { fontSize: 14, fontWeight: "700", color: "#18181b" },
  subtitle: { fontSize: 11, color: "#71717a", marginTop: 1 },
  rightBtn: {
    borderRadius: 8,
    backgroundColor: "#f0f9ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  rightText: { fontSize: 12, fontWeight: "600", color: "#0284c7" },
});

