/** Nativra — StatTile (StyleSheet). Install: npx nativra-cli add stat-tile */
import React from "react";
import { StyleSheet, Text, View, type ViewStyle } from "react-native";

export interface StatTileProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  caption?: string;
  style?: ViewStyle;
}

export function StatTile({
  label,
  value,
  delta,
  trend = "up",
  caption,
  style,
}: StatTileProps) {
  return (
    <View accessibilityRole="summary" style={[styles.container, style]}>
      <View style={styles.topRow}>
        <Text style={styles.label}>{label}</Text>
        {delta ? (
          <View
            style={[
              styles.badge,
              trend === "up"
                ? styles.badgeUp
                : trend === "down"
                ? styles.badgeDown
                : styles.badgeNeutral,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                trend === "up"
                  ? styles.badgeTextUp
                  : trend === "down"
                  ? styles.badgeTextDown
                  : styles.badgeTextNeutral,
              ]}
            >
              {delta}
            </Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.value}>{value}</Text>

      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    backgroundColor: "#ffffff",
    padding: 16,
  },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { fontSize: 12, fontWeight: "500", color: "#71717a" },
  badge: { borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 2 },
  badgeUp: { backgroundColor: "#ecfdf5" },
  badgeDown: { backgroundColor: "#fff1f2" },
  badgeNeutral: { backgroundColor: "#f4f4f5" },
  badgeText: { fontSize: 10, fontWeight: "700" },
  badgeTextUp: { color: "#047857" },
  badgeTextDown: { color: "#be123c" },
  badgeTextNeutral: { color: "#3f3f46" },
  value: { marginTop: 6, fontSize: 24, fontWeight: "800", color: "#18181b" },
  caption: { marginTop: 4, fontSize: 11, color: "#71717a" },
});

