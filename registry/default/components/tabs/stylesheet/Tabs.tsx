/**
 * Nativra — Tabs (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add tabs --target stylesheet
 */
import React from "react";
import { View, Text, Pressable, StyleSheet, type ViewProps } from "react-native";

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

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  pillContainer: {
    padding: 4,
    borderRadius: 16,
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },
  underlineContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
  },
  tabPillSelected: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabUnderlineSelected: {
    borderBottomWidth: 2,
    borderBottomColor: "#0ea5e9",
    marginBottom: -1,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#71717a",
  },
  tabLabelSelected: {
    color: "#09090b",
    fontWeight: "700",
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 9999,
  },
  badgeDefault: {
    backgroundColor: "#e4e4e7",
  },
  badgeSelected: {
    backgroundColor: "#e0f2fe",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  badgeTextDefault: {
    color: "#71717a",
  },
  badgeTextSelected: {
    color: "#0284c7",
  },
});
