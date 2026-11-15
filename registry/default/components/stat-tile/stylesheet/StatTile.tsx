/** Nativra — StatTile (StyleSheet). Install: npx nativra-cli add stat-tile */
import React from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { type ThemeColors, alpha, useThemeColors, themeStyle } from "@/hooks/use-theme-colors";

export interface StatTileProps extends ViewProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  caption?: string;
  style?: StyleProp<ViewStyle>;
}

export function StatTile({
  label,
  value,
  delta,
  trend = "up",
  caption,
  style,
  ...rest
}: StatTileProps) {
  const c = useThemeColors();
  const styles = createStyles(c);
  return (
    <View accessibilityRole="summary" style={[styles.container, style]} {...rest}>
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

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    borderRadius: themeStyle.radius.card,
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: c.background,
    padding: 16,
  },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { fontSize: 12, fontWeight: "500", color: c["muted-foreground"] },
  badge: { borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 2 },
  badgeUp: { backgroundColor: alpha(c.success, 0.1) },
  badgeDown: { backgroundColor: alpha(c.destructive, 0.08) },
  badgeNeutral: { backgroundColor: c.muted },
  badgeText: { fontSize: 10, fontWeight: "700" },
  badgeTextUp: { color: c.success },
  badgeTextDown: { color: c.destructive },
  badgeTextNeutral: { color: c.foreground },
  value: { marginTop: 6, fontSize: 24, fontWeight: "800", color: c.foreground },
  caption: { marginTop: 4, fontSize: 11, color: c["muted-foreground"] },
});

