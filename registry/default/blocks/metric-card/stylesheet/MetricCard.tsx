/**
 * Nativra — Metric Card Block (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add metric-card
 */
import React from "react";
import { View, StyleSheet } from "react-native";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Text } from "./Text";

export interface MetricCardProps {
  title?: string;
  value?: string;
  change?: string;
  timeframe?: string;
  positive?: boolean;
  subtitle?: string;
}

export function MetricCard({
  title = "Monthly Active Users",
  value = "48,290",
  change = "+24.8%",
  timeframe = "vs last month",
  positive = true,
  subtitle = "High organic growth",
}: MetricCardProps) {
  return (
    <Card elevated padding="lg" style={styles.card}>
      <View style={styles.header}>
        <Text variant="muted" style={styles.title}>
          {title}
        </Text>
        <Badge
          variant={positive ? "primary" : "destructive"}
          size="sm"
          label={change}
        />
      </View>

      <View style={styles.valueContainer}>
        <Text variant="h1" style={styles.value}>
          {value}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text variant="muted" style={styles.timeframe}>{timeframe}</Text>
        <Text variant="muted" style={styles.subtitle}>{subtitle}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  valueContainer: {
    marginTop: 12,
  },
  value: {
    fontSize: 32,
    fontWeight: "900",
  },
  footer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f4f4f5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeframe: {
    fontSize: 11,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "500",
  },
});
