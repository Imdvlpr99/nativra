/**
 * Nativra — Analytics Dashboard Template (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add analytics-dashboard
 */
import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Text } from "./Text";
import { Separator } from "./Separator";

export function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("7d");

  const channels = [
    { name: "Direct Traffic", share: 44, color: "bg-sky-500", visitors: "24,800" },
    { name: "Organic Search", share: 32, color: "bg-emerald-500", visitors: "18,200" },
    { name: "Social Referrals", share: 16, color: "bg-purple-500", visitors: "9,100" },
    { name: "Email Campaigns", share: 8, color: "bg-amber-500", visitors: "4,550" },
  ];

  const recentLogs = [
    { id: "1", action: "Stripe Payout Cleared", time: "14m ago", amount: "+$8,420.00", isPos: true },
    { id: "2", action: "Enterprise License Renewed", time: "2h ago", amount: "+$12,000.00", isPos: true },
    { id: "3", action: "AWS Infrastructure Bill", time: "5h ago", amount: "-$1,840.50", isPos: false },
  ];

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        {/* Header Bar */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-black tracking-tight text-white">Analytics</Text>
            <Text className="text-xs text-zinc-400 mt-1">Executive Performance Overview</Text>
          </View>
          <Badge variant="secondary" label="Live Metrics" />
        </View>

        {/* Time Window Filter Pills */}
        <View className="flex-row items-center p-1 rounded-2xl bg-zinc-900 border border-zinc-800 mb-6">
          {[
            { id: "24h", label: "24h" },
            { id: "7d", label: "7 Days" },
            { id: "30d", label: "30 Days" },
            { id: "ytd", label: "YTD" },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 items-center rounded-xl ${
                  active ? "bg-zinc-800 shadow" : ""
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    active ? "text-white" : "text-zinc-400"
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Top 2x2 KPI Metric Cards */}
        <View className="gap-3.5 mb-6">
          <View className="flex-row gap-3.5">
            <Card elevated padding="md" className="flex-1 rounded-2xl bg-zinc-900/80 border border-zinc-800">
              <Text className="text-xs font-medium text-zinc-400">Total Revenue</Text>
              <Text className="text-2xl font-black text-white mt-2">$148,200</Text>
              <View className="mt-3 flex-row items-center justify-between">
                <Badge variant="primary" size="sm" label="+14.2%" />
                <Text className="text-xs text-zinc-500">vs prior</Text>
              </View>
            </Card>

            <Card elevated padding="md" className="flex-1 rounded-2xl bg-zinc-900/80 border border-zinc-800">
              <Text className="text-xs font-medium text-zinc-400">Active Users</Text>
              <Text className="text-2xl font-black text-white mt-2">32,840</Text>
              <View className="mt-3 flex-row items-center justify-between">
                <Badge variant="primary" size="sm" label="+8.6%" />
                <Text className="text-xs text-zinc-500">vs prior</Text>
              </View>
            </Card>
          </View>

          <View className="flex-row gap-3.5">
            <Card elevated padding="md" className="flex-1 rounded-2xl bg-zinc-900/80 border border-zinc-800">
              <Text className="text-xs font-medium text-zinc-400">Conversion Rate</Text>
              <Text className="text-2xl font-black text-white mt-2">4.85%</Text>
              <View className="mt-3 flex-row items-center justify-between">
                <Badge variant="primary" size="sm" label="+1.2%" />
                <Text className="text-xs text-zinc-500">target 4.0%</Text>
              </View>
            </Card>

            <Card elevated padding="md" className="flex-1 rounded-2xl bg-zinc-900/80 border border-zinc-800">
              <Text className="text-xs font-medium text-zinc-400">Churn Rate</Text>
              <Text className="text-2xl font-black text-white mt-2">0.92%</Text>
              <View className="mt-3 flex-row items-center justify-between">
                <Badge variant="secondary" size="sm" label="-0.4%" />
                <Text className="text-xs text-zinc-500">healthy</Text>
              </View>
            </Card>
          </View>
        </View>

        {/* Traffic Channels Breakdown */}
        <Card elevated padding="lg" className="rounded-3xl bg-zinc-900/90 border border-zinc-800 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base font-bold text-white">Acquisition Channels</Text>
            <Text className="text-xs text-zinc-400">56,650 Total</Text>
          </View>

          <View className="gap-3.5">
            {channels.map((c) => (
              <View key={c.name} className="gap-1.5">
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs font-medium text-zinc-300">{c.name}</Text>
                  <Text className="text-xs font-semibold text-zinc-400">
                    {c.visitors} ({c.share}%)
                  </Text>
                </View>
                <View className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <View className={`h-full ${c.color} rounded-full`} style={{ width: `${c.share}%` }} />
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Recent Audit / Payout Logs */}
        <Card elevated padding="lg" className="rounded-3xl bg-zinc-900/90 border border-zinc-800 mb-8">
          <Text className="text-base font-bold text-white mb-4">Financial Activity</Text>
          <View className="gap-3">
            {recentLogs.map((log, idx) => (
              <React.Fragment key={log.id}>
                <View className="flex-row items-center justify-between py-1">
                  <View>
                    <Text className="font-semibold text-sm text-zinc-100">{log.action}</Text>
                    <Text className="text-xs text-zinc-500 mt-0.5">{log.time}</Text>
                  </View>
                  <Text
                    className={`font-bold text-sm ${
                      log.isPos ? "text-emerald-400" : "text-zinc-200"
                    }`}
                  >
                    {log.amount}
                  </Text>
                </View>
                {idx < recentLogs.length - 1 && <Separator className="bg-zinc-800/80 my-1" />}
              </React.Fragment>
            ))}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

