/**
 * Nativra — Transaction Row Block (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add transaction-row
 */
import React from "react";
import { Pressable, StyleSheet, View, Text as RNText } from "react-native";
import { Badge } from "./Badge";
import { Text } from "./Text";
import { themeStyle, useThemeColors, alpha, type ThemeColors, ts, sp, pressedStyle } from "@/hooks/use-theme-colors";

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
  const palette = useThemeColors();
  const styles = React.useMemo(() => createStyles(palette), [palette]);
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
      style={({ pressed }) => [styles.container, style, pressedStyle(pressed)]}
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
    </Pressable>
  );
}

const createStyles = (palette: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: sp(14),
    paddingHorizontal: sp(16),
    borderRadius: themeStyle.radius.card,
    backgroundColor: alpha(palette.card, 0.7),
    borderWidth: themeStyle.borderWidth,
    borderColor: alpha(palette.border, 0.8),
  },
  leftCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: sp(12),
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: themeStyle.radius.control,
    backgroundColor: palette.muted,
    borderWidth: themeStyle.borderWidth,
    borderColor: palette.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.title,
    color: palette.foreground,
  },
  metaCol: {
    flex: 1,
  },
  title: {
    fontWeight: themeStyle.fontWeight.label,
    color: palette.foreground,
    fontSize: ts(14),
  },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: sp(6),
    marginTop: 4,
  },
  categoryText: {
    fontSize: ts(12),
    color: palette["muted-foreground"],
  },
  dot: {
    fontSize: ts(12),
    color: palette["muted-foreground"],
  },
  dateText: {
    fontSize: ts(12),
    color: palette["muted-foreground"],
  },
  rightCol: {
    alignItems: "flex-end",
    gap: sp(4),
  },
  amountText: {
    fontSize: ts(14),
    fontWeight: themeStyle.fontWeight.title,
  },
  incomeText: {
    color: palette.success,
  },
  expenseText: {
    color: palette.foreground,
  },
});

