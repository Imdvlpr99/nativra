/**
 * Nativra — Fintech Wallet Template (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add fintech-wallet
 */
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Text as RNText,
} from "react-native";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Text } from "./Text";
import { Separator } from "./Separator";

export function FintechWallet() {
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
          <TouchableOpacity
            onPress={() => setHideBalance((h) => !h)}
            style={styles.hideBtn}
          >
            <RNText style={styles.hideText}>
              {hideBalance ? "Reveal" : "Hide Balance"}
            </RNText>
          </TouchableOpacity>
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#09090b" },
  scroll: { flex: 1 },
  container: { paddingHorizontal: 16, paddingVertical: 24 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: { fontSize: 24, fontWeight: "900", color: "#ffffff", letterSpacing: -0.5 },
  subtitle: { fontSize: 12, color: "#a1a1aa", marginTop: 4 },
  hideBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  hideText: { fontSize: 12, fontWeight: "600", color: "#d4d4d8" },
  heroCard: {
    borderRadius: 24,
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(52, 211, 153, 0.25)",
    padding: 20,
    marginBottom: 24,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroLabel: { fontSize: 12, fontWeight: "600", textTransform: "uppercase", color: "#34d399", letterSpacing: 0.5 },
  heroAmount: { fontSize: 32, fontWeight: "900", color: "#ffffff", marginTop: 12 },
  heroSub: { fontSize: 12, color: "#a1a1aa", marginTop: 4 },
  actionRow: { flexDirection: "row", gap: 8, marginTop: 20 },
  flexOne: { flex: 1 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#ffffff", marginBottom: 12 },
  assetList: { gap: 12 },
  assetCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
  },
  assetLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  symbolAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#27272a",
    borderWidth: 1,
    borderColor: "#3f3f46",
    alignItems: "center",
    justifyContent: "center",
  },
  symbolText: { fontSize: 12, fontWeight: "900", color: "#ffffff" },
  assetName: { fontSize: 14, fontWeight: "700", color: "#ffffff" },
  assetBal: { fontSize: 12, color: "#a1a1aa", marginTop: 2 },
  assetRight: { alignItems: "flex-end" },
  assetFiat: { fontSize: 14, fontWeight: "700", color: "#ffffff" },
  assetChange: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  posText: { color: "#34d399" },
  negText: { color: "#fb7185" },
  txCard: { borderRadius: 24, backgroundColor: "#18181b", borderWidth: 1, borderColor: "#27272a", padding: 16, marginBottom: 32 },
  txList: { gap: 12, marginTop: 4 },
  txRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 4 },
  txCounterparty: { fontSize: 14, fontWeight: "600", color: "#f4f4f5" },
  txDate: { fontSize: 12, color: "#71717a", marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: "700" },
  txNeutral: { color: "#e4e4e7" },
  sep: { backgroundColor: "#27272a", marginVertical: 4 },
});

