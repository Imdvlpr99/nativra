/**
 * Nativra — Transaction Row Block (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add transaction-row
 */
import React from "react";
import { StyleSheet, View, TouchableOpacity, Text as RNText } from "react-native";
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
  style?: object;
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
  style,
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
      style={[styles.container, style]}
    >
      <View style={styles.leftCol}>
        <View style={styles.avatar}>
          <RNText style={styles.avatarText}>
            {iconText.slice(0, 3).toUpperCase()}
          </RNText>
        </View>

        <View style={styles.metaCol}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.subRow}>
            <RNText style={styles.categoryText}>{category}</RNText>
            <RNText style={styles.dot}>•</RNText>
            <RNText style={styles.dateText}>{date}</RNText>
          </View>
        </View>
      </View>

      <View style={styles.rightCol}>
        <RNText style={[styles.amountText, isIncome ? styles.incomeText : styles.expenseText]}>
          {isIncome && !amount.startsWith("+") ? `+${amount}` : amount}
        </RNText>
        <Badge size="sm" variant={statusVariant} label={status} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "rgba(24, 24, 27, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(39, 39, 42, 0.8)",
  },
  leftCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#27272a",
    borderWidth: 1,
    borderColor: "#3f3f46",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#e4e4e7",
  },
  metaCol: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    color: "#f4f4f5",
    fontSize: 14,
  },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  categoryText: {
    fontSize: 12,
    color: "#a1a1aa",
  },
  dot: {
    fontSize: 12,
    color: "#52525b",
  },
  dateText: {
    fontSize: 12,
    color: "#71717a",
  },
  rightCol: {
    alignItems: "flex-end",
    gap: 4,
  },
  amountText: {
    fontSize: 14,
    fontWeight: "700",
  },
  incomeText: {
    color: "#34d399",
  },
  expenseText: {
    color: "#f4f4f5",
  },
});

