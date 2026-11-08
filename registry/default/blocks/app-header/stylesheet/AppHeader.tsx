import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from "react-native";
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
    <View style={styles.container}>
      {/* Top Bar: Brand, Title, Actions */}
      <View style={styles.topBar}>
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity
              onPress={onBack}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              style={styles.iconBtn}
            >
              <ChevronLeft size={20} color="#e4e4e7" />
            </TouchableOpacity>
          )}

          <View style={styles.titleSection}>
            <Text style={styles.titleText} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text style={styles.subtitleText} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {/* Right Action Icons & Avatar */}
        <View style={styles.rightSection}>
          {rightAction}

          {onNotificationsPress && (
            <TouchableOpacity
              onPress={onNotificationsPress}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              style={styles.iconBtn}
            >
              <Bell size={18} color="#a1a1aa" />
              {unreadNotificationsCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
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
              style={styles.avatarBtn}
            >
              <Text style={styles.avatarText}>
                {avatarFallback}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Integrated Search Bar */}
      {showSearch && (
        <View style={styles.searchBar}>
          <Search size={16} color="#71717a" />
          <TextInput
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder={searchPlaceholder}
            placeholderTextColor="#71717a"
            style={styles.searchInput}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#09090b",
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  titleSection: {
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: -0.2,
  },
  subtitleText: {
    fontSize: 12,
    color: "#a1a1aa",
    marginTop: 2,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    height: 36,
    width: 36,
    borderRadius: 10,
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: "#f43f5e",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#09090b",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ffffff",
    lineHeight: 12,
  },
  avatarBtn: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: "rgba(56, 189, 248, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#38bdf8",
  },
  searchBar: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: "#ffffff",
  },
});

