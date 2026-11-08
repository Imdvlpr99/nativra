/** Nativra — StatTile (NativeWind). Install: npx nativra-cli add stat-tile */
import React from "react";
import { Text, View } from "react-native";

export interface StatTileProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  caption?: string;
  className?: string;
}

export function StatTile({
  label,
  value,
  delta,
  trend = "up",
  caption,
  className = "",
}: StatTileProps) {
  const badgeClasses =
    trend === "up"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
      : trend === "down"
      ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
      : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";

  return (
    <View
      accessibilityRole="summary"
      className={`rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 ${className}`}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </Text>
        {delta ? (
          <View className={`rounded-full px-2 py-0.5 ${badgeClasses}`}>
            <Text className={`text-[10px] font-bold ${badgeClasses}`}>
              {delta}
            </Text>
          </View>
        ) : null}
      </View>

      <Text className="mt-1.5 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
        {value}
      </Text>

      {caption ? (
        <Text className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

