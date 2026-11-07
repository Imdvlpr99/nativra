/**
 * Nativra — Fintech Wallet Template (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add fintech-wallet
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
    <SafeAreaView className="flex-1 bg-zinc-950">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-black text-white">Wallet</Text>
            <Text className="text-xs text-zinc-400 mt-1">Multi-Chain Vault</Text>
          </View>
          <TouchableOpacity
            onPress={() => setHideBalance((h) => !h)}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800"
          >
            <Text className="text-xs font-semibold text-zinc-300">
              {hideBalance ? "Reveal" : "Hide Balance"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Total Net Worth Card */}
        <Card elevated padding="lg" className="rounded-3xl bg-emerald-600/15 border border-emerald-500/25 p-5 mb-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Total Portfolio Valuation
            </Text>
            <Badge size="sm" variant="primary" label="+8.4% (24h)" />
          </View>
          <Text className="text-4xl font-black text-white mt-3">
            {hideBalance ? "••••••••" : "$160,523.00"}
          </Text>
          <Text className="text-xs text-zinc-400 mt-1">
            +$12,480.00 unrealized gains this month
          </Text>

          {/* Quick Action Pills */}
          <View className="flex-row gap-2 mt-5">
            <Button variant="primary" className="flex-1 h-10">
              Send
            </Button>
            <Button variant="outline" className="flex-1 h-10 bg-zinc-900/60 border-zinc-700">
              Receive
            </Button>
            <Button variant="outline" className="flex-1 h-10 bg-zinc-900/60 border-zinc-700">
              Swap
            </Button>
          </View>
        </Card>

        {/* Assets List */}
        <View className="mb-6">
          <Text className="text-base font-bold text-white mb-3">Allocated Assets</Text>
          <View className="gap-3">
            {assets.map((asset) => (
              <Card
                key={asset.id}
                elevated
                padding="md"
                className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-4 flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 items-center justify-center">
                    <Text className="text-xs font-black text-white">{asset.symbol.slice(0, 3)}</Text>
                  </View>
                  <View>
                    <Text className="font-bold text-white text-sm">{asset.name}</Text>
                    <Text className="text-xs text-zinc-400 mt-0.5">{asset.balance}</Text>
                  </View>
                </View>

                <View className="items-end">
                  <Text className="font-bold text-white text-sm">
                    {hideBalance ? "••••" : asset.fiat}
                  </Text>
                  <Text
                    className={`text-xs font-semibold mt-0.5 ${
                      asset.isPos ? "text-emerald-400" : "text-rose-400"
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
        <Card elevated padding="lg" className="rounded-3xl bg-zinc-900/90 border border-zinc-800 mb-8 p-4">
          <Text className="text-base font-bold text-white mb-3">Recent Ledger</Text>
          <View className="gap-3">
            {recentTx.map((tx, idx) => (
              <React.Fragment key={tx.id}>
                <View className="flex-row items-center justify-between py-1">
                  <View>
                    <Text className="font-semibold text-sm text-zinc-200">{tx.counterparty}</Text>
                    <Text className="text-xs text-zinc-500 mt-0.5">{tx.date}</Text>
                  </View>
                  <Text
                    className={`font-bold text-sm ${
                      tx.isIncome ? "text-emerald-400" : "text-zinc-200"
                    }`}
                  >
                    {tx.amount}
                  </Text>
                </View>
                {idx < recentTx.length - 1 && <Separator className="bg-zinc-800/80 my-1" />}
              </React.Fragment>
            ))}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

