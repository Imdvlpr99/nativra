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
import { type ThemeColors, alpha, useThemeColors, themeStyle, elevation } from "@/hooks/use-theme-colors";

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
  const styles = createStyles(c);
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
    padding: 4,
    borderRadius: themeStyle.radius.control,
    backgroundColor: c.muted,
    borderWidth: 1,
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: themeStyle.radius.small,
    gap: 6,
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
    fontSize: 12,
    fontWeight: "600",
    color: c["muted-foreground"],
  },
  tabLabelSelected: {
    color: c.foreground,
    fontWeight: "700",
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 9999,
  },
  badgeDefault: {
    backgroundColor: c.muted,
  },
  badgeSelected: {
    backgroundColor: alpha(c.primary, 0.12),
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  badgeTextDefault: {
    color: c["muted-foreground"],
  },
  badgeTextSelected: {
    color: c.primary,
  },
});

