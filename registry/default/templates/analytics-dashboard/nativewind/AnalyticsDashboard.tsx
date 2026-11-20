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
import { Pressable, View, ScrollView, SafeAreaView, StatusBar } from "react-native";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Text } from "./Text";
import { Separator } from "./Separator";

export function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("7d");

  const channels = [
    { name: "Direct Traffic", share: 44, color: "bg-primary", visitors: "24,800" },
    { name: "Organic Search", share: 32, color: "bg-success", visitors: "18,200" },
    { name: "Social Referrals", share: 16, color: "bg-primary", visitors: "9,100" },
    { name: "Email Campaigns", share: 8, color: "bg-warning", visitors: "4,550" },
  ];

  const recentLogs = [
    { id: "1", action: "Stripe Payout Cleared", time: "14m ago", amount: "+$8,420.00", isPos: true },
    { id: "2", action: "Enterprise License Renewed", time: "2h ago", amount: "+$12,000.00", isPos: true },
    { id: "3", action: "AWS Infrastructure Bill", time: "5h ago", amount: "-$1,840.50", isPos: false },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1 sp-px-4 sp-py-6" showsVerticalScrollIndicator={false}>
        {/* Header Bar */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="type-2xl weight-heading tracking-tight text-foreground">Analytics</Text>
            <Text className="type-xs text-muted-foreground mt-1">Executive Performance Overview</Text>
          </View>
          <Badge variant="secondary" label="Live Metrics" />
        </View>

        {/* Time Window Filter Pills */}
        <View className="surface flex-row items-center sp-p-1 rounded-card mb-6">
          {[
            { id: "24h", label: "24h" },
            { id: "7d", label: "7 Days" },
            { id: "30d", label: "30 Days" },
            { id: "ytd", label: "YTD" },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <Pressable
                accessibilityRole="button"
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                className={`${`flex-1 sp-py-2 items-center rounded-control ${
                  active ? "bg-muted shadow" : ""
                }`} active:opacity-20`}
              >
                <Text
                  className={`type-xs weight-label ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Top 2x2 KPI Metric Cards */}
        <View className="sp-gap-3.5 mb-6">
          <View className="flex-row sp-gap-3.5">
            <Card elevated padding="md" className="flex-1">
              <Text className="type-xs font-medium text-muted-foreground">Total Revenue</Text>
              <Text className="type-2xl weight-heading text-foreground mt-2">$148,200</Text>
              <View className="mt-3 flex-row items-center justify-between">
                <Badge variant="primary" size="sm" label="+14.2%" />
                <Text className="type-xs text-muted-foreground">vs prior</Text>
              </View>
            </Card>

            <Card elevated padding="md" className="flex-1">
              <Text className="type-xs font-medium text-muted-foreground">Active Users</Text>
              <Text className="type-2xl weight-heading text-foreground mt-2">32,840</Text>
              <View className="mt-3 flex-row items-center justify-between">
                <Badge variant="primary" size="sm" label="+8.6%" />
                <Text className="type-xs text-muted-foreground">vs prior</Text>
              </View>
            </Card>
          </View>

          <View className="flex-row sp-gap-3.5">
            <Card elevated padding="md" className="flex-1">
              <Text className="type-xs font-medium text-muted-foreground">Conversion Rate</Text>
              <Text className="type-2xl weight-heading text-foreground mt-2">4.85%</Text>
              <View className="mt-3 flex-row items-center justify-between">
                <Badge variant="primary" size="sm" label="+1.2%" />
                <Text className="type-xs text-muted-foreground">target 4.0%</Text>
              </View>
            </Card>

            <Card elevated padding="md" className="flex-1">
              <Text className="type-xs font-medium text-muted-foreground">Churn Rate</Text>
              <Text className="type-2xl weight-heading text-foreground mt-2">0.92%</Text>
              <View className="mt-3 flex-row items-center justify-between">
                <Badge variant="secondary" size="sm" label="-0.4%" />
                <Text className="type-xs text-muted-foreground">healthy</Text>
              </View>
            </Card>
          </View>
        </View>

        {/* Traffic Channels Breakdown */}
        <Card elevated padding="lg" className="rounded-card bg-card/90 border border-border mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="type-base weight-title text-foreground">Acquisition Channels</Text>
            <Text className="type-xs text-muted-foreground">56,650 Total</Text>
          </View>

          <View className="sp-gap-3.5">
            {channels.map((c) => (
              <View key={c.name} className="sp-gap-1.5">
                <View className="flex-row items-center justify-between">
                  <Text className="type-xs font-medium text-muted-foreground">{c.name}</Text>
                  <Text className="type-xs weight-label text-muted-foreground">
                    {c.visitors} ({c.share}%)
                  </Text>
                </View>
                <View className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <View className={`h-full ${c.color} rounded-full`} style={{ width: `${c.share}%` }} />
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Recent Audit / Payout Logs */}
        <Card elevated padding="lg" className="rounded-card bg-card/90 border border-border mb-8">
          <Text className="type-base weight-title text-foreground mb-4">Financial Activity</Text>
          <View className="sp-gap-3">
            {recentLogs.map((log, idx) => (
              <React.Fragment key={log.id}>
                <View className="flex-row items-center justify-between sp-py-1">
                  <View>
                    <Text className="weight-label type-sm text-foreground">{log.action}</Text>
                    <Text className="type-xs text-muted-foreground mt-0.5">{log.time}</Text>
                  </View>
                  <Text
                    className={`weight-title type-sm ${
                      log.isPos ? "text-success" : "text-foreground"
                    }`}
                  >
                    {log.amount}
                  </Text>
                </View>
                {idx < recentLogs.length - 1 && <Separator className="bg-muted/80 my-1" />}
              </React.Fragment>
            ))}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

