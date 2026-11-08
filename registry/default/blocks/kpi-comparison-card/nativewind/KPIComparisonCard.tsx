/**
 * Nativra — KPI Comparison Card Block (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add kpi-comparison-card
 */
import React from "react";
import { View } from "react-native";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Text } from "./Text";

export interface KPIComparisonCardProps {
  title?: string;
  currentValue?: string;
  targetValue?: string;
  progressPercent?: number;
  period?: string;
  deltaLabel?: string;
  isPositive?: boolean;
  className?: string;
}

export function KPIComparisonCard({
  title = "Quarterly Recurring Revenue",
  currentValue = "$184,500",
  targetValue = "$220,000",
  progressPercent = 84,
  period = "Q3 Target",
  deltaLabel = "+18.2%",
  isPositive = true,
  className = "",
}: KPIComparisonCardProps) {
  const clamped = Math.min(100, Math.max(0, progressPercent));

  return (
    <Card elevated padding="lg" className={`w-full rounded-3xl ${className}`.trim()}>
      <View className="flex-row items-center justify-between">
        <Text variant="muted" className="text-xs font-semibold uppercase tracking-wider">
          {title}
        </Text>
        <Badge
          variant={isPositive ? "primary" : "destructive"}
          size="sm"
          label={deltaLabel}
        />
      </View>

      <View className="mt-4 flex-row items-baseline justify-between">
        <View>
          <Text variant="h1" className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
            {currentValue}
          </Text>
          <Text variant="muted" className="text-xs mt-0.5">
            Target: {targetValue} ({period})
          </Text>
        </View>
        <Text className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          {clamped}%
        </Text>
      </View>

      {/* Progress Bar Container */}
      <View className="mt-4 h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
        <View
          className={`h-full rounded-full ${isPositive ? "bg-emerald-500" : "bg-rose-500"}`}
          style={{ width: `${clamped}%` }}
        />
      </View>
    </Card>
  );
}

