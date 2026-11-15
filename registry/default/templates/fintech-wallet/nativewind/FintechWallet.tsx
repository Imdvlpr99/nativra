/**
 * Nativra — Fintech Wallet Template (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add fintech-wallet
 */
import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
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
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1 sp-px-4 sp-py-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="type-2xl weight-heading text-foreground">Wallet</Text>
            <Text className="type-xs text-muted-foreground mt-1">Multi-Chain Vault</Text>
          </View>
          <TouchableOpacity
            onPress={() => setHideBalance((h) => !h)}
            className="surface sp-px-3 sp-py-1.5 rounded-control"
          >
            <Text className="type-xs weight-label text-muted-foreground">
              {hideBalance ? "Reveal" : "Hide Balance"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Total Net Worth Card */}
        <Card elevated padding="lg" className="rounded-card bg-success/15 border border-success/25 sp-p-5 mb-6">
          <View className="flex-row items-center justify-between">
            <Text className="type-xs weight-label uppercase tracking-wider text-success">
              Total Portfolio Valuation
            </Text>
            <Badge size="sm" variant="primary" label="+8.4% (24h)" />
          </View>
          <Text className="type-4xl weight-heading text-foreground mt-3">
            {hideBalance ? "••••••••" : "$160,523.00"}
          </Text>
          <Text className="type-xs text-muted-foreground mt-1">
            +$12,480.00 unrealized gains this month
          </Text>

          {/* Quick Action Pills */}
          <View className="flex-row sp-gap-2 mt-5">
            <Button variant="primary" className="flex-1 h-10">
              Send
            </Button>
            <Button variant="outline" className="flex-1 h-10 bg-card/60 border-border">
              Receive
            </Button>
            <Button variant="outline" className="flex-1 h-10 bg-card/60 border-border">
              Swap
            </Button>
          </View>
        </Card>

        {/* Assets List */}
        <View className="mb-6">
          <Text className="type-base weight-title text-foreground mb-3">Allocated Assets</Text>
          <View className="sp-gap-3">
            {assets.map((asset) => (
              <Card
                key={asset.id}
                elevated
                padding="md"
                className="rounded-card bg-card/80 border border-border sp-p-4 flex-row items-center justify-between"
              >
                <View className="flex-row items-center sp-gap-3">
                  <View className="w-10 min-h-control rounded-control bg-muted border border-border items-center justify-center">
                    <Text className="type-xs weight-heading text-foreground">{asset.symbol.slice(0, 3)}</Text>
                  </View>
                  <View>
                    <Text className="weight-title text-foreground type-sm">{asset.name}</Text>
                    <Text className="type-xs text-muted-foreground mt-0.5">{asset.balance}</Text>
                  </View>
                </View>

                <View className="items-end">
                  <Text className="weight-title text-foreground type-sm">
                    {hideBalance ? "••••" : asset.fiat}
                  </Text>
                  <Text
                    className={`type-xs weight-label mt-0.5 ${
                      asset.isPos ? "text-success" : "text-destructive"
                    }`}
                  >
                    {asset.change}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <Card elevated padding="lg" className="rounded-card bg-card/90 border border-border mb-8 sp-p-4">
          <Text className="type-base weight-title text-foreground mb-3">Recent Ledger</Text>
          <View className="sp-gap-3">
            {recentTx.map((tx, idx) => (
              <React.Fragment key={tx.id}>
                <View className="flex-row items-center justify-between sp-py-1">
                  <View>
                    <Text className="weight-label type-sm text-foreground">{tx.counterparty}</Text>
                    <Text className="type-xs text-muted-foreground mt-0.5">{tx.date}</Text>
                  </View>
                  <Text
                    className={`weight-title type-sm ${
                      tx.isIncome ? "text-success" : "text-foreground"
                    }`}
                  >
                    {tx.amount}
                  </Text>
                </View>
                {idx < recentTx.length - 1 && <Separator className="bg-muted/80 my-1" />}
              </React.Fragment>
            ))}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

