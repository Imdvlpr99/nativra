/**
 * Nativra — Transaction Row Block (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add transaction-row
 */
import React from "react";
import { Pressable, View } from "react-native";
import { Badge } from "./Badge";
import { Text } from "./Text";

export interface TransactionRowProps {
  title: string;
  category?: string;
  date?: string;
  amount: string;
  type?: "income" | "expense" | "transfer";
  status?: "completed" | "pending" | "failed";
  iconText?: string;
  onPress?: () => void;
  className?: string;
}

export function TransactionRow({
  title = "Apple Store Subscription",
  category = "Software & Tech",
  date = "Today, 14:20",
  amount = "-$14.99",
  type = "expense",
  status = "completed",
  iconText = "AAPL",
  onPress,
  className = "",
}: TransactionRowProps) {
  const isIncome = type === "income";

  const statusVariant =
    status === "completed"
      ? "secondary"
      : status === "pending"
      ? "outline"
      : "destructive";

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`${`flex-row items-center justify-between sp-py-3.5 sp-px-4 rounded-card bg-card/60 border border-border/80 active:bg-muted/50 ${className}`.trim()} active:opacity-80`}
    >
      <View className="flex-row items-center sp-gap-3 flex-1 mr-3">
        {/* Avatar / Icon Chip */}
        <View className="w-10 min-h-control rounded-control bg-muted border border-border items-center justify-center">
          <Text className="type-xs weight-title text-foreground">
            {iconText.slice(0, 3).toUpperCase()}
          </Text>
        </View>

        {/* Labels */}
        <View className="flex-1">
          <Text className="weight-label text-foreground type-sm leading-tight" numberOfLines={1}>
            {title}
          </Text>
          <View className="flex-row items-center sp-gap-2 mt-1">
            <Text className="type-xs text-muted-foreground">{category}</Text>
            <Text className="type-xs text-muted-foreground">•</Text>
            <Text className="type-xs text-muted-foreground">{date}</Text>
          </View>
        </View>
      </View>

      {/* Amount & Status */}
      <View className="items-end sp-gap-1">
        <Text
          className={`weight-title type-sm ${
            isIncome ? "text-success" : "text-foreground"
          }`}
        >
          {isIncome && !amount.startsWith("+") ? `+${amount}` : amount}
        </Text>
        <Badge
          size="sm"
          variant={statusVariant}
          label={status}
        />
      </View>
    </Pressable>
  );
}

