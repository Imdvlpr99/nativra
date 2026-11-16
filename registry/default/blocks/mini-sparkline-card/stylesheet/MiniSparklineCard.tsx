/**
 * Nativra — MiniSparklineCard (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add mini-sparkline-card
 */
import React from "react";
import { View, Text, StyleSheet, type ViewProps } from "react-native";
import { TrendingUp, TrendingDown } from "lucide-react-native";
import { themeStyle, useThemeColors, alpha, type ThemeColors, ts, sp, surface } from "@/hooks/use-theme-colors";

export interface MiniSparklineCardProps extends ViewProps {
  title: string;
  value: string;
  change: string;
  isPositive?: boolean;
  data?: number[];
  sparklineHeight?: number;
}

export function MiniSparklineCard({
  title,
  value,
  change,
  isPositive = true,
  data = [12, 16, 14, 22, 19, 28, 25, 34, 30, 42],
  sparklineHeight = 36,
  style,
  ...props
}: MiniSparklineCardProps) {
  const palette = useThemeColors();
  const styles = React.useMemo(() => createStyles(palette), [palette]);
  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;

  return (
    <View style={[styles.card, style]} {...props}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.badge, isPositive ? styles.badgePos : styles.badgeNeg]}>
          {isPositive ? (
            <TrendingUp size={12} color={palette.success} />
          ) : (
            <TrendingDown size={12} color={palette.destructive} />
          )}
          <Text style={[styles.badgeText, isPositive ? styles.textPos : styles.textNeg]}>
            {change}
          </Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.value}>{value}</Text>

        <View style={[styles.sparklineContainer, { height: sparklineHeight }]}>
          {data.map((val, idx) => {
            const normalizedHeight = Math.max(
              4,
              ((val - minVal) / range) * sparklineHeight
            );
            const isLast = idx === data.length - 1;

            return (
              <View
                key={idx}
                style={[
                  styles.sparklineBar,
                  { height: normalizedHeight },
                  isLast
                    ? isPositive
                      ? styles.barPosActive
                      : styles.barNegActive
                    : isPositive
                    ? styles.barPosFaded
                    : styles.barNegFaded,
                ]}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

const createStyles = (palette: ThemeColors) => StyleSheet.create({
  card: {
    ...surface(palette),
    borderRadius: themeStyle.radius.card,
    padding: sp(18),
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.label,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: palette["muted-foreground"],
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: sp(4),
    borderRadius: 9999,
    paddingHorizontal: sp(8),
    paddingVertical: sp(2),
  },
  badgePos: {
    backgroundColor: alpha(palette.success, 0.1),
  },
  badgeNeg: {
    backgroundColor: alpha(palette.destructive, 0.1),
  },
  badgeText: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.title,
  },
  textPos: {
    color: palette.success,
  },
  textNeg: {
    color: palette.destructive,
  },
  bottomRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  value: {
    fontSize: ts(24),
    fontWeight: themeStyle.fontWeight.heading,
    color: palette.foreground,
    letterSpacing: -0.5,
  },
  sparklineContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: sp(6),
  },
  sparklineBar: {
    width: 4,
    borderRadius: 9999,
  },
  barPosActive: {
    backgroundColor: palette.success,
  },
  barNegActive: {
    backgroundColor: palette.destructive,
  },
  barPosFaded: {
    backgroundColor: alpha(palette.success, 0.35),
  },
  barNegFaded: {
    backgroundColor: alpha(palette.destructive, 0.35),
  },
});

