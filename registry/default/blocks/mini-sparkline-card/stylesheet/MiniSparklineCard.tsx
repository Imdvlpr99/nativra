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
  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;

  return (
    <View style={[styles.card, style]} {...props}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.badge, isPositive ? styles.badgePos : styles.badgeNeg]}>
          {isPositive ? (
            <TrendingUp size={12} color="#10b981" />
          ) : (
            <TrendingDown size={12} color="#f43f5e" />
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

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#27272a",
    backgroundColor: "#18181b",
    padding: 18,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#a1a1aa",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgePos: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  badgeNeg: {
    backgroundColor: "rgba(244, 63, 94, 0.1)",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  textPos: {
    color: "#34d399",
  },
  textNeg: {
    color: "#fb7185",
  },
  bottomRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  value: {
    fontSize: 24,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  sparklineContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  sparklineBar: {
    width: 4,
    borderRadius: 9999,
  },
  barPosActive: {
    backgroundColor: "#10b981",
  },
  barNegActive: {
    backgroundColor: "#f43f5e",
  },
  barPosFaded: {
    backgroundColor: "rgba(16, 185, 129, 0.35)",
  },
  barNegFaded: {
    backgroundColor: "rgba(244, 63, 94, 0.35)",
  },
});

