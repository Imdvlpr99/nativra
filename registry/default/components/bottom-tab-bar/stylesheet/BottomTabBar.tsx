/** Nativra — BottomTabBar (StyleSheet). Install: npx nativra-cli add bottom-tab-bar */
import React from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { type ThemeColors, alpha, useThemeColors, ts, sp, themeStyle } from "@/hooks/use-theme-colors";

export interface BottomTabItem {
  id: string;
  label: string;
  icon?: string;
  badge?: number;
}

export interface BottomTabBarProps extends ViewProps {
  tabs: BottomTabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  style?: StyleProp<ViewStyle>;
}

export function BottomTabBar({
  tabs,
  activeTab,
  onTabChange,
  style,
  ...rest
}: BottomTabBarProps) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  return (
    <View accessibilityRole="tablist" style={[styles.container, style]} {...rest}>
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

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: c.border,
    backgroundColor: c.background,
    paddingHorizontal: sp(8),
    paddingVertical: sp(8),
  },
  tabItem: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: sp(4) },
  iconWrap: { position: "relative", alignItems: "center", justifyContent: "center" },
  pill: { borderRadius: 9999, paddingHorizontal: sp(14), paddingVertical: sp(4) },
  pillActive: { backgroundColor: alpha(c.primary, 0.08) },
  icon: { fontSize: ts(14) },
  badge: {
    position: "absolute",
    right: -4,
    top: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 9999,
    backgroundColor: c.destructive,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: sp(4),
  },
  badgeText: { fontSize: ts(9), fontWeight: themeStyle.fontWeight.title, color: c["primary-foreground"] },
  label: { marginTop: 4, fontSize: ts(11), fontWeight: "500", color: c["muted-foreground"] },
  labelActive: { fontWeight: themeStyle.fontWeight.title, color: c.primary },
});

