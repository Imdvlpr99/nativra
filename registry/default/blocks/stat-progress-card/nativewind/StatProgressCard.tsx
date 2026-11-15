/**
 * Nativra — Stat Progress Card Block (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add stat-progress-card
 */
import React from "react";
import { View } from "react-native";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Text } from "./Text";

export interface StatProgressCardProps {
  goalTitle?: string;
  currentValue?: string;
  targetValue?: string;
  progressPercent?: number;
  unit?: string;
  streakDays?: number;
  className?: string;
}

export function StatProgressCard({
  goalTitle = "Weekly Workout Goal",
  currentValue = "4",
  targetValue = "5 sessions",
  progressPercent = 80,
  unit = "sessions completed",
  streakDays = 14,
  className = "",
}: StatProgressCardProps) {
  const clamped = Math.min(100, Math.max(0, progressPercent));

  return (
    <Card elevated padding="lg" className={`w-full max-w-sm rounded-card ${className}`.trim()}>
      <View className="flex-row items-center justify-between">
        <Text variant="muted" className="type-xs weight-label uppercase tracking-wider">
          {goalTitle}
        </Text>
        <Badge variant="primary" size="sm" label={`🔥 ${streakDays}d Streak`} />
      </View>

      <View className="mt-4 flex-row items-baseline justify-between">
        <View className="flex-row items-baseline sp-gap-1.5">
          <Text variant="h1" className="type-3xl weight-heading text-foreground font-mono">
            {currentValue}
          </Text>
          <Text variant="muted" className="type-xs">
            / {targetValue}
          </Text>
        </View>

        <Text className="type-sm weight-title text-primary font-mono">
          {clamped}%
        </Text>
      </View>

      {/* Progress Track */}
      <View className="mt-3 h-3 w-full rounded-full bg-muted overflow-hidden">
        <View
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary transition-all"
          style={{ width: `${clamped}%` }}
        />
      </View>

      <View className="mt-3 flex-row items-center justify-between sp-pt-2 border-t border-border">
        <Text variant="muted" className="type-2xs font-medium">{unit}</Text>
        <Text variant="muted" className="type-2xs weight-title text-success">
          On track for target
        </Text>
      </View>
    </Card>
  );
}

