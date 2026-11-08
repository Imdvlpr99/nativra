import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { ChevronLeft, Search, Bell, X } from "lucide-react-native";

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
  return (
    <View className="bg-zinc-950 border-b border-zinc-800/80 px-4 py-3">
      {/* Top Bar: Brand, Title, Actions */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1 mr-2">
          {showBack && (
            <TouchableOpacity
              onPress={onBack}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              className="h-9 w-9 rounded-xl bg-zinc-900 border border-zinc-800 items-center justify-center active:bg-zinc-800"
            >
              <ChevronLeft size={20} color="#e4e4e7" />
            </TouchableOpacity>
          )}

          <View className="flex-1">
            <Text className="text-lg font-bold text-white tracking-tight" numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text className="text-xs text-zinc-400 mt-0.5" numberOfLines={1}>
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
              className="relative h-9 w-9 rounded-xl bg-zinc-900 border border-zinc-800 items-center justify-center"
            >
              <Bell size={18} color="#a1a1aa" />
              {unreadNotificationsCount > 0 && (
                <View className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 items-center justify-center border-2 border-zinc-950">
                  <Text className="text-[10px] font-bold text-white leading-none">
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
              className="h-9 w-9 rounded-full bg-sky-500/20 border border-sky-500/40 items-center justify-center ml-1"
            >
              <Text className="text-xs font-bold text-sky-400 font-mono">
                {avatarFallback}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Integrated Search Bar */}
      {showSearch && (
        <View className="mt-3 flex-row items-center bg-zinc-900/90 border border-zinc-800 rounded-xl px-3 h-10">
          <Search size={16} color="#71717a" />
          <TextInput
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder={searchPlaceholder}
            placeholderTextColor="#71717a"
            className="flex-1 ml-2.5 text-xs text-white"
            autoCapitalize="none"
          />
          {searchValue.length > 0 && onSearchChange && (
            <TouchableOpacity
              onPress={() => onSearchChange("")}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <X size={14} color="#a1a1aa" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

