/**
 * Nativra — KPI Comparison Card Block (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add kpi-comparison-card
 */
import React from "react";
import { StyleSheet, View, Text as RNText } from "react-native";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Text } from "./Text";
import { themeStyle, useThemeColors, type ThemeColors, ts, surface } from "@/hooks/use-theme-colors";

export interface KPIComparisonCardProps {
  title?: string;
  currentValue?: string;
  targetValue?: string;
  progressPercent?: number;
  period?: string;
  deltaLabel?: string;
  isPositive?: boolean;
  style?: object;
}

export function KPIComparisonCard({
  title = "Quarterly Recurring Revenue",
  currentValue = "$184,500",
  targetValue = "$220,000",
  progressPercent = 84,
  period = "Q3 Target",
  deltaLabel = "+18.2%",
  isPositive = true,
  style,
}: KPIComparisonCardProps) {
  const palette = useThemeColors();
  const styles = React.useMemo(() => createStyles(palette), [palette]);
  const clamped = Math.min(100, Math.max(0, progressPercent));

  return (
    <Card elevated padding="lg" style={[styles.card, style]}>
      <View style={styles.topRow}>
        <Text variant="muted" style={styles.titleText}>
          {title}
        </Text>
        <Badge
          variant={isPositive ? "primary" : "destructive"}
          size="sm"
          label={deltaLabel}
        />
      </View>

      <View style={styles.middleRow}>
        <View>
          <Text variant="h1" style={styles.currentText}>
            {currentValue}
          </Text>
          <Text variant="muted" style={styles.targetText}>
            Target: {targetValue} ({period})
          </Text>
        </View>
        <RNText style={styles.percentText}>{clamped}%</RNText>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            isPositive ? styles.fillPositive : styles.fillNegative,
            { width: `${clamped}%` },
          ]}
        />
      </View>
    </Card>
  );
}

const createStyles = (palette: ThemeColors) => StyleSheet.create({
  card: {
    ...surface(palette),
    width: "100%",
    borderRadius: themeStyle.radius.card,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleText: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.label,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  middleRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  currentText: {
    fontSize: ts(28),
    fontWeight: themeStyle.fontWeight.heading,
    color: palette.foreground,
  },
  targetText: {
    fontSize: ts(12),
    marginTop: 2,
    color: palette["muted-foreground"],
  },
  percentText: {
    fontSize: ts(16),
    fontWeight: themeStyle.fontWeight.title,
    color: palette.foreground,
  },
  track: {
    marginTop: 16,
    height: 8,
    width: "100%",
    borderRadius: 9999,
    backgroundColor: palette.muted,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 9999,
  },
  fillPositive: {
    backgroundColor: palette.success,
  },
  fillNegative: {
    backgroundColor: palette.destructive,
  },
});

