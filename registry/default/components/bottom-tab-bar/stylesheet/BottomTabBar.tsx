/** Nativra — BottomTabBar (StyleSheet). Install: npx nativra-cli add bottom-tab-bar */
import React from "react";
import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";

export interface BottomTabItem {
  id: string;
  label: string;
  icon?: string;
  badge?: number;
}

export interface BottomTabBarProps {
  tabs: BottomTabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  style?: ViewStyle;
}

export function BottomTabBar({
  tabs,
  activeTab,
  onTabChange,
  style,
}: BottomTabBarProps) {
  return (
    <View accessibilityRole="tablist" style={[styles.container, style]}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
            style={styles.tabItem}
          >
            <View style={styles.iconWrap}>
              <View style={[styles.pill, isActive && styles.pillActive]}>
                <Text style={styles.icon}>{tab.icon ?? "•"}</Text>
              </View>
              {tab.badge && tab.badge > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {tab.badge > 99 ? "99+" : tab.badge}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
    backgroundColor: "#ffffff",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  tabItem: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 4 },
  iconWrap: { position: "relative", alignItems: "center", justifyContent: "center" },
  pill: { borderRadius: 9999, paddingHorizontal: 14, paddingVertical: 4 },
  pillActive: { backgroundColor: "#f0f9ff" },
  icon: { fontSize: 14 },
  badge: {
    position: "absolute",
    right: -4,
    top: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 9999,
    backgroundColor: "#f43f5e",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: { fontSize: 9, fontWeight: "700", color: "#ffffff" },
  label: { marginTop: 4, fontSize: 11, fontWeight: "500", color: "#71717a" },
  labelActive: { fontWeight: "700", color: "#0284c7" },
});

