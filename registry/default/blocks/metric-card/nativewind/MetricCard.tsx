/**
 * Nativra — Metric Card Block (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add metric-card
 */
import React from "react";
import { View } from "react-native";
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
  className?: string;
}

export function MetricCard({
  title = "Monthly Active Users",
  value = "48,290",
  change = "+24.8%",
  timeframe = "vs last month",
  positive = true,
  subtitle = "High organic growth",
  className = "",
}: MetricCardProps) {
  return (
    <Card elevated padding="lg" className={`w-full max-w-sm rounded-3xl ${className}`.trim()}>
      <View className="flex-row items-center justify-between">
        <Text variant="muted" className="text-xs font-medium uppercase tracking-wider">
          {title}
        </Text>
        <Badge
          variant={positive ? "primary" : "destructive"}
          size="sm"
          label={change}
        />
      </View>

      <View className="mt-3">
        <Text variant="h1" className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
          {value}
        </Text>
      </View>

      <View className="mt-4 flex-row items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <Text variant="muted" className="text-xs">{timeframe}</Text>
        <Text variant="muted" className="text-xs font-medium">{subtitle}</Text>
      </View>
    </Card>
  );
}
