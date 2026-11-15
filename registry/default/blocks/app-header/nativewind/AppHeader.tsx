import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { ChevronLeft, Search, Bell, X } from "lucide-react-native";
import { useThemeColors } from "@/hooks/use-theme-colors";

export interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  unreadNotificationsCount?: number;
  onNotificationsPress?: () => void;
  avatarUrl?: string;
  avatarFallback?: string;
  onAvatarPress?: () => void;
  rightAction?: React.ReactNode;
}

export function AppHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  showSearch = false,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  unreadNotificationsCount = 0,
  onNotificationsPress,
  avatarFallback = "JD",
  onAvatarPress,
  rightAction,
}: AppHeaderProps) {
  const palette = useThemeColors();
  return (
    <View className="bg-background border-b border-border/80 px-4 py-3">
      {/* Top Bar: Brand, Title, Actions */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1 mr-2">
          {showBack && (
            <TouchableOpacity
              onPress={onBack}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              className="h-9 w-9 rounded-control bg-card border border-border items-center justify-center active:bg-muted"
            >
              <ChevronLeft size={20} color={palette.foreground} />
            </TouchableOpacity>
          )}

          <View className="flex-1">
            <Text className="text-lg font-bold text-foreground tracking-tight" numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text className="text-xs text-muted-foreground mt-0.5" numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {/* Right Action Icons & Avatar */}
        <View className="flex-row items-center gap-2">
          {rightAction}

          {onNotificationsPress && (
            <TouchableOpacity
              onPress={onNotificationsPress}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              className="relative h-9 w-9 rounded-control bg-card border border-border items-center justify-center"
            >
              <Bell size={18} color={palette["muted-foreground"]} />
              {unreadNotificationsCount > 0 && (
                <View className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive items-center justify-center border-2 border-border">
                  <Text className="text-[10px] font-bold text-destructive-foreground leading-none">
                    {unreadNotificationsCount > 99 ? "99+" : unreadNotificationsCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {onAvatarPress && (
            <TouchableOpacity
              onPress={onAvatarPress}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="User profile"
              className="h-9 w-9 rounded-full bg-primary/20 border border-primary/40 items-center justify-center ml-1"
            >
              <Text className="text-xs font-bold text-primary font-mono">
                {avatarFallback}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Integrated Search Bar */}
      {showSearch && (
        <View className="mt-3 flex-row items-center bg-card/90 border border-border rounded-control px-3 h-10">
          <Search size={16} color={palette["muted-foreground"]} />
          <TextInput
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder={searchPlaceholder}
            placeholderTextColor={palette["muted-foreground"]}
            className="flex-1 ml-2.5 text-xs text-foreground"
            autoCapitalize="none"
          />
          {searchValue.length > 0 && onSearchChange && (
            <TouchableOpacity
              onPress={() => onSearchChange("")}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <X size={14} color={palette["muted-foreground"]} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

