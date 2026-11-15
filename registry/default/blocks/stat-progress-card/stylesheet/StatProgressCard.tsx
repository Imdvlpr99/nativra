/**
 * Nativra — Stat Progress Card Block (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add stat-progress-card --target stylesheet
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { themeStyle, useThemeColors, alpha, type ThemeColors, elevation, ts, sp, surface } from "@/hooks/use-theme-colors";

export interface StatProgressCardProps {
  goalTitle?: string;
  currentValue?: string;
  targetValue?: string;
  progressPercent?: number;
  unit?: string;
  streakDays?: number;
}

export function StatProgressCard({
  goalTitle = "Weekly Workout Goal",
  currentValue = "4",
  targetValue = "5 sessions",
  progressPercent = 80,
  unit = "sessions completed",
  streakDays = 14,
}: StatProgressCardProps) {
  const palette = useThemeColors();
  const styles = React.useMemo(() => createStyles(palette), [palette]);
  const clamped = Math.min(100, Math.max(0, progressPercent));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{goalTitle}</Text>
        <View style={styles.streakBadge}>
          <Text style={styles.streakText}>🔥 {streakDays}d Streak</Text>
        </View>
      </View>

      <View style={styles.numbersRow}>
        <View style={styles.leftNumbers}>
          <Text style={styles.current}>{currentValue}</Text>
          <Text style={styles.target}>/ {targetValue}</Text>
        </View>
        <Text style={styles.percent}>{clamped}%</Text>
      </View>

      {/* Progress Track */}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clamped}%` }]} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{unit}</Text>
        <Text style={styles.statusText}>On track for target</Text>
      </View>
    </View>
  );
}

const createStyles = (palette: ThemeColors) => StyleSheet.create({
  card: {
    ...surface(palette),
    width: "100%",
    maxWidth: 360,
    borderRadius: themeStyle.radius.card,
    padding: sp(24),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.title,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: palette["muted-foreground"],
  },
  streakBadge: {
    paddingHorizontal: sp(8),
    paddingVertical: sp(3),
    borderRadius: 9999,
    backgroundColor: alpha(palette.primary, 0.15),
  },
  streakText: {
    fontSize: ts(11),
    fontWeight: themeStyle.fontWeight.title,
    color: palette.primary,
  },
  numbersRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  leftNumbers: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: sp(6),
  },
  current: {
    fontSize: ts(30),
    fontWeight: themeStyle.fontWeight.heading,
    color: palette.foreground,
  },
  target: {
    fontSize: ts(12),
    color: palette["muted-foreground"],
  },
  percent: {
    fontSize: ts(14),
    fontWeight: themeStyle.fontWeight.title,
    color: palette.primary,
  },
  track: {
    marginTop: 12,
    height: 10,
    width: "100%",
    borderRadius: 9999,
    backgroundColor: palette.muted,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 9999,
    backgroundColor: palette.primary,
  },
  footer: {
    marginTop: 14,
    paddingTop: sp(10),
    borderTopWidth: 1,
    borderTopColor: palette.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: ts(11),
    color: palette["muted-foreground"],
  },
  statusText: {
    fontSize: ts(11),
    fontWeight: themeStyle.fontWeight.title,
    color: palette.success,
  },
});

