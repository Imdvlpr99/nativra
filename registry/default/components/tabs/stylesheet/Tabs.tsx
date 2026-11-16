/**
 * Nativra — Tabs (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add tabs --target stylesheet
 */
import React from "react";
import { View, Text, Pressable, StyleSheet, type ViewProps } from "react-native";
import { type ThemeColors, alpha, useThemeColors, themeStyle, elevation, ts, sp } from "@/hooks/use-theme-colors";

export interface TabItem {
  value: string;
  label: string;
  badge?: string | number;
}

export interface TabsProps extends ViewProps {
  value: string;
  onValueChange: (value: string) => void;
  items: TabItem[];
  variant?: "pill" | "underline";
}

export function Tabs({
  value,
  onValueChange,
  items,
  variant = "pill",
  style,
  ...props
}: TabsProps) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const isPill = variant === "pill";

  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.container,
        isPill ? styles.pillContainer : styles.underlineContainer,
        style,
      ]}
      {...props}
    >
      {items.map((tab) => {
        const isSelected = tab.value === value;
        return (
          <Pressable
            key={tab.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onValueChange(tab.value)}
            style={[
              styles.tab,
              isPill && isSelected && styles.tabPillSelected,
              !isPill && isSelected && styles.tabUnderlineSelected,
            ]}
          >
            <Text
              style={[
                styles.tabLabel,
                isSelected && styles.tabLabelSelected,
              ]}
            >
              {tab.label}
            </Text>

            {tab.badge !== undefined && (
              <View
                style={[
                  styles.badge,
                  isSelected ? styles.badgeSelected : styles.badgeDefault,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    isSelected ? styles.badgeTextSelected : styles.badgeTextDefault,
                  ]}
                >
                  {tab.badge}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  pillContainer: {
    padding: sp(4),
    borderRadius: themeStyle.radius.control,
    backgroundColor: c.muted,
    borderWidth: themeStyle.borderWidth,
    borderColor: c.border,
  },
  underlineContainer: {
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: sp(8),
    paddingHorizontal: sp(12),
    borderRadius: themeStyle.radius.small,
    gap: sp(6),
  },
  tabPillSelected: {
    backgroundColor: c.background,
    ...elevation("card"),
  },
  tabUnderlineSelected: {
    borderBottomWidth: 2,
    borderBottomColor: c.primary,
    marginBottom: -1,
  },
  tabLabel: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.label,
    color: c["muted-foreground"],
  },
  tabLabelSelected: {
    color: c.foreground,
    fontWeight: themeStyle.fontWeight.title,
  },
  badge: {
    paddingHorizontal: sp(6),
    paddingVertical: sp(1),
    borderRadius: 9999,
  },
  badgeDefault: {
    backgroundColor: c.muted,
  },
  badgeSelected: {
    backgroundColor: alpha(c.primary, 0.12),
  },
  badgeText: {
    fontSize: ts(10),
    fontWeight: themeStyle.fontWeight.title,
  },
  badgeTextDefault: {
    color: c["muted-foreground"],
  },
  badgeTextSelected: {
    color: c.primary,
  },
});

