/**
 * Nativra — Fintech Wallet Template (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add fintech-wallet
 */
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Text as RNText,
} from "react-native";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Text } from "./Text";
import { Separator } from "./Separator";
import { themeStyle, useThemeColors, alpha, type ThemeColors, ts, sp, surface, pressedStyle } from "@/hooks/use-theme-colors";

export function FintechWallet() {
  const palette = useThemeColors();
  const styles = React.useMemo(() => createStyles(palette), [palette]);
  const [hideBalance, setHideBalance] = useState(false);

  const assets = [
    { id: "1", name: "Bitcoin", symbol: "BTC", balance: "1.4280 BTC", fiat: "$94,248.00", change: "+4.2%", isPos: true },
    { id: "2", name: "Ethereum", symbol: "ETH", balance: "12.8000 ETH", fiat: "$38,400.00", change: "+6.8%", isPos: true },
    { id: "3", name: "USD Coin", symbol: "USDC", balance: "15,200.00 USDC", fiat: "$15,200.00", change: "0.0%", isPos: true },
    { id: "4", name: "Solana", symbol: "SOL", balance: "84.5000 SOL", fiat: "$12,675.00", change: "-2.1%", isPos: false },
  ];

  const recentTx = [
    { id: "t1", counterparty: "Coinbase Pro Transfer", date: "Today, 15:42", amount: "+$4,500.00", isIncome: true },
    { id: "t2", counterparty: "Binance Staking Yield", date: "Yesterday, 00:00", amount: "+$124.80", isIncome: true },
    { id: "t3", counterparty: "Hardware Wallet Withdraw", date: "02 Nov, 18:20", amount: "-$10,000.00", isIncome: false },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <RNText style={styles.title}>Wallet</RNText>
            <RNText style={styles.subtitle}>Multi-Chain Vault</RNText>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => setHideBalance((h) => !h)}
            style={({ pressed }) => [styles.hideBtn, pressedStyle(pressed)]}
          >
            <RNText style={styles.hideText}>
              {hideBalance ? "Reveal" : "Hide Balance"}
            </RNText>
          </Pressable>
        </View>

        {/* Total Net Worth Card */}
        <Card elevated padding="lg" style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <RNText style={styles.heroLabel}>Total Portfolio Valuation</RNText>
            <Badge size="sm" variant="primary" label="+8.4% (24h)" />
          </View>
          <RNText style={styles.heroAmount}>
            {hideBalance ? "••••••••" : "$160,523.00"}
          </RNText>
          <RNText style={styles.heroSub}>
            +$12,480.00 unrealized gains this month
          </RNText>

          {/* Quick Action Pills */}
          <View style={styles.actionRow}>
            <View style={styles.flexOne}>
              <Button variant="primary">Send</Button>
            </View>
            <View style={styles.flexOne}>
              <Button variant="outline">Receive</Button>
            </View>
            <View style={styles.flexOne}>
              <Button variant="outline">Swap</Button>
            </View>
          </View>
        </Card>

        {/* Assets List */}
        <View style={styles.section}>
          <RNText style={styles.sectionTitle}>Allocated Assets</RNText>
          <View style={styles.assetList}>
            {assets.map((asset) => (
              <Card key={asset.id} elevated padding="md" style={styles.assetCard}>
                <View style={styles.assetLeft}>
                  <View style={styles.symbolAvatar}>
                    <RNText style={styles.symbolText}>{asset.symbol.slice(0, 3)}</RNText>
                  </View>
                  <View>
                    <RNText style={styles.assetName}>{asset.name}</RNText>
                    <RNText style={styles.assetBal}>{asset.balance}</RNText>
                  </View>
                </View>

                <View style={styles.assetRight}>
                  <RNText style={styles.assetFiat}>
                    {hideBalance ? "••••" : asset.fiat}
                  </RNText>
                  <RNText style={[styles.assetChange, asset.isPos ? styles.posText : styles.negText]}>
                    {asset.change}
                  </RNText>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <Card elevated padding="lg" style={styles.txCard}>
          <RNText style={styles.sectionTitle}>Recent Ledger</RNText>
          <View style={styles.txList}>
            {recentTx.map((tx, idx) => (
              <React.Fragment key={tx.id}>
                <View style={styles.txRow}>
                  <View>
                    <RNText style={styles.txCounterparty}>{tx.counterparty}</RNText>
                    <RNText style={styles.txDate}>{tx.date}</RNText>
                  </View>
                  <RNText style={[styles.txAmount, tx.isIncome ? styles.posText : styles.txNeutral]}>
                    {tx.amount}
                  </RNText>
                </View>
                {idx < recentTx.length - 1 && <Separator style={styles.sep} />}
              </React.Fragment>
            ))}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (palette: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  scroll: { flex: 1 },
  container: { paddingHorizontal: sp(16), paddingVertical: sp(24) },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: { fontSize: ts(24), fontWeight: themeStyle.fontWeight.heading, color: palette.foreground, letterSpacing: -0.5 },
  subtitle: { fontSize: ts(12), color: palette["muted-foreground"], marginTop: 4 },
  hideBtn: {
    ...surface(palette),
    paddingHorizontal: sp(12),
    paddingVertical: sp(6),
    borderRadius: themeStyle.radius.control,
  },
  hideText: { fontSize: ts(12), fontWeight: themeStyle.fontWeight.label, color: palette["muted-foreground"] },
  heroCard: {
    borderRadius: themeStyle.radius.card,
    backgroundColor: alpha(palette.success, 0.12),
    borderWidth: themeStyle.borderWidth,
    borderColor: alpha(palette.success, 0.25),
    padding: sp(20),
    marginBottom: 24,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroLabel: { fontSize: ts(12), fontWeight: themeStyle.fontWeight.label, textTransform: "uppercase", color: palette.success, letterSpacing: 0.5 },
  heroAmount: { fontSize: ts(32), fontWeight: themeStyle.fontWeight.heading, color: palette.foreground, marginTop: 12 },
  heroSub: { fontSize: ts(12), color: palette["muted-foreground"], marginTop: 4 },
  actionRow: { flexDirection: "row", gap: sp(8), marginTop: 20 },
  flexOne: { flex: 1 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: ts(16), fontWeight: themeStyle.fontWeight.title, color: palette.foreground, marginBottom: 12 },
  assetList: { gap: sp(12) },
  assetCard: {
    ...surface(palette),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: sp(16),
    borderRadius: themeStyle.radius.card,
  },
  assetLeft: { flexDirection: "row", alignItems: "center", gap: sp(12) },
  symbolAvatar: {
    width: 40,
    height: 40,
    borderRadius: themeStyle.radius.control,
    backgroundColor: palette.muted,
    borderWidth: themeStyle.borderWidth,
    borderColor: palette.border,
    alignItems: "center",
    justifyContent: "center",
  },
  symbolText: { fontSize: ts(12), fontWeight: themeStyle.fontWeight.heading, color: palette.foreground },
  assetName: { fontSize: ts(14), fontWeight: themeStyle.fontWeight.title, color: palette.foreground },
  assetBal: { fontSize: ts(12), color: palette["muted-foreground"], marginTop: 2 },
  assetRight: { alignItems: "flex-end" },
  assetFiat: { fontSize: ts(14), fontWeight: themeStyle.fontWeight.title, color: palette.foreground },
  assetChange: { fontSize: ts(12), fontWeight: themeStyle.fontWeight.label, marginTop: 2 },
  posText: { color: palette.success },
  negText: { color: palette.destructive },
  txCard: { ...surface(palette), borderRadius: themeStyle.radius.card, padding: sp(16), marginBottom: 32 },
  txList: { gap: sp(12), marginTop: 4 },
  txRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: sp(4) },
  txCounterparty: { fontSize: ts(14), fontWeight: themeStyle.fontWeight.label, color: palette.foreground },
  txDate: { fontSize: ts(12), color: palette["muted-foreground"], marginTop: 2 },
  txAmount: { fontSize: ts(14), fontWeight: themeStyle.fontWeight.title },
  txNeutral: { color: palette.foreground },
  sep: { backgroundColor: palette.muted, marginVertical: 4 },
});

