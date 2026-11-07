/**
 * Nativra — Tabs (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add tabs
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
          ? "rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          : "border-b border-zinc-200 dark:border-zinc-800"
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
            className={`flex-1 py-2 px-3 items-center justify-center rounded-xl flex-row gap-1.5 transition-all active:opacity-75 ${
              variant === "pill"
                ? isSelected
                  ? "bg-white dark:bg-zinc-800 shadow-sm"
                  : "bg-transparent"
                : isSelected
                ? "border-b-2 border-sky-500 pb-2.5 -mb-px"
                : "pb-2.5"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                isSelected
                  ? "text-zinc-900 dark:text-zinc-50 font-bold"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              {tab.label}
            </Text>

            {tab.badge !== undefined && (
              <View
                className={`px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? "bg-sky-500/15 dark:bg-sky-500/20"
                    : "bg-zinc-200 dark:bg-zinc-800"
                }`}
              >
                <Text
                  className={`text-[10px] font-mono font-bold ${
                    isSelected
                      ? "text-sky-600 dark:text-sky-400"
                      : "text-zinc-600 dark:text-zinc-400"
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

