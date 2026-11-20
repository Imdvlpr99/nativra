/**
 * Nativra — Transaction History Block (React Native StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add transaction-history
 */
import React from "react";
import { StyleSheet, Text, View, type SectionListProps } from "react-native";
import { SectionList, type ListSection } from "./SectionList";
import { TransactionRow } from "./TransactionRow";
import { type ThemeColors, sp, themeStyle, ts, useThemeColors } from "@/hooks/use-theme-colors";

export interface Transaction {
  id: string;
  title: string;
  category?: string;
  /** Signed amount: positive is money in, negative is money out. */
  amount: number;
  /** ISO 8601 date-time, e.g. "2026-11-20T14:20:00Z". */
  timestamp: string;
  status?: "completed" | "pending" | "failed";
  /** Short text in the row's icon, e.g. a merchant initial. */
  iconText?: string;
}

export interface TransactionHistoryProps {
  transactions: readonly Transaction[];
  /** ISO 4217 code for formatting, e.g. "USD" or "IDR". */
  currency: string;
  /** BCP 47 locale for dates and money (default: the device's). */
  locale?: string;
  /** Current balance: each day then shows the balance at its end. Pending and failed items don't count. */
  balance?: number;
  onPressTransaction?: (transaction: Transaction) => void;
  onEndReached?: SectionListProps<Transaction>["onEndReached"];
  ListFooterComponent?: SectionListProps<Transaction>["ListFooterComponent"];
  ListEmptyComponent?: SectionListProps<Transaction>["ListEmptyComponent"];
  /** Text for another language; anything left out stays English. */
  labels?: Partial<TransactionHistoryLabels>;
}

export interface TransactionHistoryLabels {
  today: string;
  yesterday: string;
  empty: string;
}

const DEFAULT_LABELS: TransactionHistoryLabels = { today: "Today", yesterday: "Yesterday", empty: "No transactions yet" };

interface Day extends ListSection<Transaction> {
  net: number;
  closing?: number;
}

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

function dayLabel(d: Date, locale: string | undefined, labels: TransactionHistoryLabels, now = new Date()): string {
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (dayKey(d) === dayKey(now)) return labels.today;
  if (dayKey(d) === dayKey(yesterday)) return labels.yesterday;
  return d.toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    ...(d.getFullYear() !== now.getFullYear() ? { year: "numeric" } : {}),
  });
}

/** Newest-first days, each with its net total and, given a balance, its closing balance. */
export function groupByDay(
  transactions: readonly Transaction[],
  locale?: string,
  balance?: number,
  labels: TransactionHistoryLabels = DEFAULT_LABELS
): Day[] {
  const sorted = [...transactions].sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
  const days: Day[] = [];
  for (const t of sorted) {
    const d = new Date(t.timestamp);
    const title = dayLabel(d, locale, labels);
    const last = days[days.length - 1];
    const counts = (t.status ?? "completed") === "completed";
    if (last && last.title === title) {
      (last.data as Transaction[]).push(t);
      if (counts) last.net += t.amount;
    } else {
      days.push({ title, data: [t], net: counts ? t.amount : 0 });
    }
  }
  if (balance !== undefined) {
    let running = balance;
    for (const day of days) {
      day.closing = running;
      running -= day.net;
    }
  }
  return days;
}

/** A transaction list grouped by day, with each day's net total and optional running balance. */
export function TransactionHistory({
  transactions,
  currency,
  locale,
  balance,
  onPressTransaction,
  onEndReached,
  ListFooterComponent,
  ListEmptyComponent,
  labels: labelOverrides,
}: TransactionHistoryProps) {
  const labels = React.useMemo(() => ({ ...DEFAULT_LABELS, ...labelOverrides }), [labelOverrides]);
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const days = React.useMemo(() => groupByDay(transactions, locale, balance, labels), [transactions, locale, balance, labels]);
  const money = React.useMemo(() => new Intl.NumberFormat(locale, { style: "currency", currency }), [locale, currency]);
  const signed = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${money.format(Math.abs(n))}`;
  const time = (iso: string) => new Date(iso).toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });

  return (
    <SectionList
      sections={days}
      keyExtractor={(t) => t.id}
      onEndReached={onEndReached}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={ListEmptyComponent ?? <Text style={styles.empty}>{labels.empty}</Text>}
      renderSectionHeader={({ section }) => {
        const day = section as Day;
        return (
          <View style={styles.header}>
            <Text accessibilityRole="header" style={styles.day}>
              {day.title}
            </Text>
            <Text style={styles.total}>
              {signed(day.net)}
              {day.closing !== undefined ? ` · ${money.format(day.closing)}` : ""}
            </Text>
          </View>
        );
      }}
      renderItem={({ item }) => (
        <TransactionRow
          title={item.title}
          category={item.category ?? ""}
          date={time(item.timestamp)}
          amount={signed(item.amount)}
          type={item.amount >= 0 ? "income" : "expense"}
          status={item.status ?? "completed"}
          iconText={item.iconText ?? item.title.slice(0, 1).toUpperCase()}
          {...(onPressTransaction ? { onPress: () => onPressTransaction(item) } : {})}
        />
      )}
    />
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      paddingHorizontal: sp(16),
      paddingTop: sp(16),
      paddingBottom: sp(6),
      backgroundColor: c.background,
    },
    day: { fontSize: ts(13), fontWeight: themeStyle.fontWeight.label, color: c["muted-foreground"], textTransform: "uppercase", letterSpacing: 0.4 },
    total: { fontSize: ts(13), color: c["muted-foreground"], fontVariant: ["tabular-nums"] },
    empty: { padding: sp(32), textAlign: "center", fontSize: ts(15), color: c["muted-foreground"] },
  });
