/**
 * Nativra — MiniSparklineCard (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add mini-sparkline-card
 */
import React from "react";
import { View, Text, type ViewProps } from "react-native";
import { TrendingUp, TrendingDown } from "lucide-react-native";
import { useThemeColors } from "@/hooks/use-theme-colors";

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
  const palette = useThemeColors();
  const minVal = Math.min(...data);
  const maxVal = Math.max(...data);
  const range = maxVal - minVal || 1;

  return (
    <View
      className={`surface rounded-card sp-p-4.5 shadow-sm ${className}`.trim()}
      style={style}
      {...props}
    >
      <View className="flex-row items-center justify-between">
        <Text className="type-xs weight-label uppercase tracking-wider text-muted-foreground">
          {title}
        </Text>
        <View
          className={`flex-row items-center sp-gap-1 rounded-full sp-px-2 sp-py-0.5 ${
            isPositive
              ? "bg-success/10 text-success"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {isPositive ? (
            <TrendingUp size={12} color={palette.success} />
          ) : (
            <TrendingDown size={12} color={palette.destructive} />
          )}
          <Text
            className={`type-xs weight-title ${
              isPositive
                ? "text-success"
                : "text-destructive"
            }`}
          >
            {change}
          </Text>
        </View>
      </View>

      <View className="mt-3 flex-row items-end justify-between">
        <Text className="type-2xl weight-heading tracking-tight text-foreground">
          {value}
        </Text>

        {/* Zero-dependency Micro Sparkline Bar Series */}
        <View
          style={{ height: sparklineHeight }}
          className="flex-row items-end sp-gap-1.5"
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
                      ? "bg-success"
                      : "bg-destructive"
                    : isPositive
                    ? "bg-success/30"
                    : "bg-destructive/30"
                }`}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}

