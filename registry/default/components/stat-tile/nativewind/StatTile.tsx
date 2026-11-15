/** Nativra — StatTile (NativeWind). Install: npx nativra-cli add stat-tile */
import React from "react";
import { Text, View, type ViewProps } from "react-native";

export interface StatTileProps extends ViewProps {
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
  style,
  ...rest
}: StatTileProps) {
  const badgeClasses =
    trend === "up"
      ? "bg-success/10 text-success"
      : trend === "down"
      ? "bg-destructive/10 text-destructive"
      : "bg-muted text-foreground";

  return (
    <View
      accessibilityRole="summary"
      style={style}
      className={`rounded-card border border-border bg-card p-4 shadow-sm ${className}`}
      {...rest}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-medium text-muted-foreground">
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

      <Text className="mt-1.5 text-2xl font-extrabold tracking-tight text-foreground">
        {value}
      </Text>

      {caption ? (
        <Text className="mt-1 text-[11px] text-muted-foreground">
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

