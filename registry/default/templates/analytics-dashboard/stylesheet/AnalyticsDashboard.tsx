/**
 * Nativra — Analytics Dashboard Template (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add analytics-dashboard
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
import { Text } from "./Text";
import { Separator } from "./Separator";
import { themeStyle, useThemeColors, type ThemeColors } from "@/hooks/use-theme-colors";

export function AnalyticsDashboard() {
  const palette = useThemeColors();
  const styles = React.useMemo(() => createStyles(palette), [palette]);
  const [activeTab, setActiveTab] = useState("7d");

  const channels = [
    { name: "Direct Traffic", share: 44, color: palette.primary, visitors: "24,800" },
    { name: "Organic Search", share: 32, color: palette.success, visitors: "18,200" },
    { name: "Social Referrals", share: 16, color: palette.primary, visitors: "9,100" },
    { name: "Email Campaigns", share: 8, color: palette.warning, visitors: "4,550" },
  ];

  const recentLogs = [
    { id: "1", action: "Stripe Payout Cleared", time: "14m ago", amount: "+$8,420.00", isPos: true },
    { id: "2", action: "Enterprise License Renewed", time: "2h ago", amount: "+$12,000.00", isPos: true },
    { id: "3", action: "AWS Infrastructure Bill", time: "5h ago", amount: "-$1,840.50", isPos: false },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Bar */}
        <View style={styles.header}>
          <View>
            <RNText style={styles.title}>Analytics</RNText>
            <RNText style={styles.subtitle}>Executive Performance Overview</RNText>
          </View>
          <Badge variant="secondary" label="Live Metrics" />
        </View>

        {/* Time Window Filter Pills */}
        <View style={styles.filterBar}>
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
                style={[styles.filterTab, active && styles.filterTabActive]}
              >
                <RNText style={[styles.filterTabText, active && styles.filterTabTextActive]}>
                  {tab.label}
                </RNText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Top 2x2 KPI Metric Cards */}
        <View style={styles.kpiContainer}>
          <View style={styles.kpiRow}>
            <Card elevated padding="md" style={styles.kpiCard}>
              <RNText style={styles.kpiLabel}>Total Revenue</RNText>
              <RNText style={styles.kpiValue}>$148,200</RNText>
              <View style={styles.kpiFooter}>
                <Badge variant="primary" size="sm" label="+14.2%" />
                <RNText style={styles.kpiSub}>vs prior</RNText>
              </View>
            </Card>

            <Card elevated padding="md" style={styles.kpiCard}>
              <RNText style={styles.kpiLabel}>Active Users</RNText>
              <RNText style={styles.kpiValue}>32,840</RNText>
              <View style={styles.kpiFooter}>
                <Badge variant="primary" size="sm" label="+8.6%" />
                <RNText style={styles.kpiSub}>vs prior</RNText>
              </View>
            </Card>
          </View>

          <View style={styles.kpiRow}>
            <Card elevated padding="md" style={styles.kpiCard}>
              <RNText style={styles.kpiLabel}>Conversion Rate</RNText>
              <RNText style={styles.kpiValue}>4.85%</RNText>
              <View style={styles.kpiFooter}>
                <Badge variant="primary" size="sm" label="+1.2%" />
                <RNText style={styles.kpiSub}>target 4.0%</RNText>
              </View>
            </Card>

            <Card elevated padding="md" style={styles.kpiCard}>
              <RNText style={styles.kpiLabel}>Churn Rate</RNText>
              <RNText style={styles.kpiValue}>0.92%</RNText>
              <View style={styles.kpiFooter}>
                <Badge variant="secondary" size="sm" label="-0.4%" />
                <RNText style={styles.kpiSub}>healthy</RNText>
              </View>
            </Card>
          </View>
        </View>

        {/* Traffic Channels Breakdown */}
        <Card elevated padding="lg" style={styles.channelCard}>
          <View style={styles.cardHeader}>
            <RNText style={styles.cardTitle}>Acquisition Channels</RNText>
            <RNText style={styles.cardSub}>56,650 Total</RNText>
          </View>

          <View style={styles.channelList}>
            {channels.map((c) => (
              <View key={c.name} style={styles.channelItem}>
                <View style={styles.channelMeta}>
                  <RNText style={styles.channelName}>{c.name}</RNText>
                  <RNText style={styles.channelShare}>
                    {c.visitors} ({c.share}%)
                  </RNText>
                </View>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${c.share}%`, backgroundColor: c.color }]} />
                </View>
              </View>
            ))}
          </View>
        </Card>

        {/* Recent Audit / Payout Logs */}
        <Card elevated padding="lg" style={styles.logCard}>
          <RNText style={styles.cardTitle}>Financial Activity</RNText>
          <View style={styles.logList}>
            {recentLogs.map((log, idx) => (
              <React.Fragment key={log.id}>
                <View style={styles.logRow}>
                  <View>
                    <RNText style={styles.logAction}>{log.action}</RNText>
                    <RNText style={styles.logTime}>{log.time}</RNText>
                  </View>
                  <RNText style={[styles.logAmount, log.isPos ? styles.logPositive : styles.logNeutral]}>
                    {log.amount}
                  </RNText>
                </View>
                {idx < recentLogs.length - 1 && <Separator style={styles.sep} />}
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
  container: { paddingHorizontal: 16, paddingVertical: 24 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: { fontSize: 24, fontWeight: "900", color: palette.foreground, letterSpacing: -0.5 },
  subtitle: { fontSize: 12, color: palette["muted-foreground"], marginTop: 4 },
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    borderRadius: themeStyle.radius.card,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: 24,
  },
  filterTab: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: themeStyle.radius.control },
  filterTabActive: { backgroundColor: palette.muted },
  filterTabText: { fontSize: 12, fontWeight: "600", color: palette["muted-foreground"] },
  filterTabTextActive: { color: palette.foreground },
  kpiContainer: { gap: 14, marginBottom: 24 },
  kpiRow: { flexDirection: "row", gap: 14 },
  kpiCard: { flex: 1, borderRadius: themeStyle.radius.card, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.border },
  kpiLabel: { fontSize: 12, fontWeight: "500", color: palette["muted-foreground"] },
  kpiValue: { fontSize: 24, fontWeight: "900", color: palette.foreground, marginTop: 8 },
  kpiFooter: { marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  kpiSub: { fontSize: 12, color: palette["muted-foreground"] },
  channelCard: { borderRadius: themeStyle.radius.card, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.border, marginBottom: 24 },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: palette.foreground },
  cardSub: { fontSize: 12, color: palette["muted-foreground"] },
  channelList: { gap: 14 },
  channelItem: { gap: 6 },
  channelMeta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  channelName: { fontSize: 12, fontWeight: "500", color: palette["muted-foreground"] },
  channelShare: { fontSize: 12, fontWeight: "600", color: palette["muted-foreground"] },
  track: { height: 8, width: "100%", borderRadius: 9999, backgroundColor: palette.muted, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 9999 },
  logCard: { borderRadius: themeStyle.radius.card, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.border, marginBottom: 32 },
  logList: { gap: 12, marginTop: 12 },
  logRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 4 },
  logAction: { fontSize: 14, fontWeight: "600", color: palette.foreground },
  logTime: { fontSize: 12, color: palette["muted-foreground"], marginTop: 2 },
  logAmount: { fontSize: 14, fontWeight: "700" },
  logPositive: { color: palette.success },
  logNeutral: { color: palette.foreground },
  sep: { backgroundColor: palette.muted, marginVertical: 4 },
});

