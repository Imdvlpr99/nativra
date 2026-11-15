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
import { View, TouchableOpacity } from "react-native";
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
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`flex-row items-center justify-between py-3.5 px-4 rounded-card bg-card/60 border border-border/80 active:bg-muted/50 ${className}`.trim()}
    >
      <View className="flex-row items-center gap-3 flex-1 mr-3">
        {/* Avatar / Icon Chip */}
        <View className="w-10 h-10 rounded-control bg-muted border border-border items-center justify-center">
          <Text className="text-xs font-bold text-foreground">
            {iconText.slice(0, 3).toUpperCase()}
          </Text>
        </View>

        {/* Labels */}
        <View className="flex-1">
          <Text className="font-semibold text-foreground text-sm leading-tight" numberOfLines={1}>
            {title}
          </Text>
          <View className="flex-row items-center gap-2 mt-1">
            <Text className="text-xs text-muted-foreground">{category}</Text>
            <Text className="text-xs text-muted-foreground">•</Text>
            <Text className="text-xs text-muted-foreground">{date}</Text>
          </View>
        </View>
      </View>

      {/* Amount & Status */}
      <View className="items-end gap-1">
        <Text
          className={`font-bold text-sm ${
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
    </TouchableOpacity>
  );
}

