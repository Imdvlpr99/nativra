/**
 * Nativra — MiniSparklineCard (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add mini-sparkline-card
 */
import React from "react";
import { View, Text, type ViewProps } from "react-native";
import { TrendingUp, TrendingDown } from "lucide-react-native";

export interface MiniSparklineCardProps extends ViewProps {
  title: string;
  value: string;
  change: string;
  isPositive?: boolean;
  data?: number[];
  sparklineHeight?: number;
  className?: string;
}

export function MiniSparklineCard({
  title,
  value,
  change,
  isPositive = true,
  data = [12, 16, 14, 22, 19, 28, 25, 34, 30, 42],
  sparklineHeight = 36,
  className = "",
  style,
  ...props
}: MiniSparklineCardProps) {
  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;

  return (
    <View
      className={`rounded-2xl border border-zinc-200 bg-white p-4.5 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm ${className}`.trim()}
      style={style}
      {...props}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {title}
        </Text>
        <View
          className={`flex-row items-center gap-1 rounded-full px-2 py-0.5 ${
            isPositive
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
          }`}
        >
          {isPositive ? (
            <TrendingUp size={12} color="#10b981" />
          ) : (
            <TrendingDown size={12} color="#f43f5e" />
          )}
          <Text
            className={`text-xs font-bold ${
              isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {change}
          </Text>
        </View>
      </View>

      <View className="mt-3 flex-row items-end justify-between">
        <Text className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
          {value}
        </Text>

        {/* Zero-dependency Micro Sparkline Bar Series */}
        <View
          style={{ height: sparklineHeight }}
          className="flex-row items-end gap-1.5"
        >
          {data.map((val, idx) => {
            const normalizedHeight = Math.max(
              4,
              ((val - minVal) / range) * sparklineHeight
            );
            const isLast = idx === data.length - 1;

            return (
              <View
                key={idx}
                style={{
                  height: normalizedHeight,
                  width: 4,
                }}
                className={`rounded-full ${
                  isLast
                    ? isPositive
                      ? "bg-emerald-500"
                      : "bg-rose-500"
                    : isPositive
                    ? "bg-emerald-500/30 dark:bg-emerald-500/40"
                    : "bg-rose-500/30 dark:bg-rose-500/40"
                }`}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

