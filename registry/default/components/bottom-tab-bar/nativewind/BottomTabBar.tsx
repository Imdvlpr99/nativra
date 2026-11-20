/** Nativra — BottomTabBar (NativeWind). Install: npx nativra-cli add bottom-tab-bar */
import React from "react";
import { Pressable, Text, View, type ViewProps } from "react-native";

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
  className?: string;
}

export function BottomTabBar({
  tabs,
  activeTab,
  onTabChange,
  className = "",
  style,
  ...rest
}: BottomTabBarProps) {
  return (
    <View
      accessibilityRole="tablist"
      style={style}
      className={`flex-row items-center justify-around border-t border-border bg-card sp-px-2 sp-py-2 ${className}`}
      {...rest}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }} aria-selected={isActive}
            accessibilityLabel={tab.label}
            className="flex-1 items-center justify-center sp-py-1 active:opacity-75"
          >
            <View className="relative items-center justify-center">
              <View
                className={`rounded-full sp-px-3.5 sp-py-1 ${
                  isActive ? "bg-primary/10" : ""
                }`}
              >
                <Text className="type-sm">{tab.icon ?? "•"}</Text>
              </View>
              {tab.badge && tab.badge > 0 ? (
                <View className="absolute -right-1 -top-1 min-w-[16px] h-4 items-center justify-center rounded-full bg-destructive sp-px-1">
                  <Text className="type-2xs weight-title text-destructive-foreground">
                    {tab.badge > 99 ? "99+" : tab.badge}
                  </Text>
                </View>
              ) : null}
            </View>
            <Text
              className={`mt-1 type-2xs ${
                isActive
                  ? "weight-title text-primary"
                  : "font-medium text-muted-foreground"
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

