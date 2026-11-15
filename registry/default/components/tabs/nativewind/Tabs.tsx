/**
 * Nativra — Tabs (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add tabs
 */
import React from "react";
import { View, Text, Pressable, type ViewProps } from "react-native";

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
  className?: string;
}

export function Tabs({
  value,
  onValueChange,
  items,
  variant = "pill",
  className = "",
  ...props
}: TabsProps) {
  return (
    <View
      accessibilityRole="tablist"
      className={`w-full flex-row items-center p-1 ${
        variant === "pill"
          ? "rounded-control bg-muted border border-border"
          : "border-b border-border"
      } ${className}`.trim()}
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
            className={`flex-1 py-2 px-3 items-center justify-center rounded-small flex-row gap-1.5 transition-all active:opacity-75 ${
              variant === "pill"
                ? isSelected
                  ? "bg-background shadow-sm"
                  : "bg-transparent"
                : isSelected
                ? "border-b-2 border-primary pb-2.5 -mb-px"
                : "pb-2.5"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                isSelected
                  ? "text-foreground font-bold"
                  : "text-muted-foreground"
              }`}
            >
              {tab.label}
            </Text>

            {tab.badge !== undefined && (
              <View
                className={`px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? "bg-primary/15"
                    : "bg-muted"
                }`}
              >
                <Text
                  className={`text-[10px] font-mono font-bold ${
                    isSelected
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
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

