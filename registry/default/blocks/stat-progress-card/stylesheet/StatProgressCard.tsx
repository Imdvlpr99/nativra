/**
 * Nativra — Stat Progress Card Block (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add stat-progress-card --target stylesheet
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";

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

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    backgroundColor: "#ffffff",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "#71717a",
  },
  streakBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    backgroundColor: "#e0f2fe",
  },
  streakText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0284c7",
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
    gap: 6,
  },
  current: {
    fontSize: 30,
    fontWeight: "900",
    color: "#09090b",
  },
  target: {
    fontSize: 12,
    color: "#71717a",
  },
  percent: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0ea5e9",
  },
  track: {
    marginTop: 12,
    height: 10,
    width: "100%",
    borderRadius: 9999,
    backgroundColor: "#f4f4f5",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 9999,
    backgroundColor: "#0ea5e9",
  },
  footer: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f4f4f5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 11,
    color: "#71717a",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16a34a",
  },
});
