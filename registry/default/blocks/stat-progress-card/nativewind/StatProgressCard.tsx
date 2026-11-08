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
    <Card elevated padding="lg" className={`w-full max-w-sm rounded-3xl ${className}`.trim()}>
      <View className="flex-row items-center justify-between">
        <Text variant="muted" className="text-xs font-semibold uppercase tracking-wider">
          {goalTitle}
        </Text>
        <Badge variant="primary" size="sm" label={`🔥 ${streakDays}d Streak`} />
      </View>

      <View className="mt-4 flex-row items-baseline justify-between">
        <View className="flex-row items-baseline gap-1.5">
          <Text variant="h1" className="text-3xl font-black text-zinc-900 dark:text-zinc-50 font-mono">
            {currentValue}
          </Text>
          <Text variant="muted" className="text-xs">
            / {targetValue}
          </Text>
        </View>

        <Text className="text-sm font-bold text-sky-600 dark:text-sky-400 font-mono">
          {clamped}%
        </Text>
      </View>

      {/* Progress Track */}
      <View className="mt-3 h-3 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <View
          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all"
          style={{ width: `${clamped}%` }}
        />
      </View>

      <View className="mt-3 flex-row items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <Text variant="muted" className="text-[11px] font-medium">{unit}</Text>
        <Text variant="muted" className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
          On track for target
        </Text>
      </View>
    </Card>
  );
}

