import React from "react";
import { Pressable, StyleSheet, View, Text, TextInput } from "react-native";
import { ChevronLeft, Search, Bell, X } from "lucide-react-native";
import { themeStyle, useThemeColors, alpha, type ThemeColors, ts, sp, surface, pressedStyle } from "@/hooks/use-theme-colors";

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
  const styles = React.useMemo(() => createStyles(palette), [palette]);
  return (
    <View style={styles.container}>
      {/* Top Bar: Brand, Title, Actions */}
      <View style={styles.topBar}>
        <View style={styles.leftSection}>
          {showBack && (
            <Pressable
              onPress={onBack}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              style={({ pressed }) => [styles.iconBtn, pressedStyle(pressed)]}
            >
              <ChevronLeft size={20} color={palette.foreground} />
            </Pressable>
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
            <Pressable
              onPress={onNotificationsPress}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              style={({ pressed }) => [styles.iconBtn, pressedStyle(pressed)]}
            >
              <Bell size={18} color={palette["muted-foreground"]} />
              {unreadNotificationsCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadNotificationsCount > 99 ? "99+" : unreadNotificationsCount}
                  </Text>
                </View>
              )}
            </Pressable>
          )}

          {onAvatarPress && (
            <Pressable
              onPress={onAvatarPress}
              accessibilityRole="button"
              accessibilityLabel="User profile"
              style={({ pressed }) => [styles.avatarBtn, pressedStyle(pressed)]}
            >
              <Text style={styles.avatarText}>
                {avatarFallback}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Integrated Search Bar */}
      {showSearch && (
        <View style={styles.searchBar}>
          <Search size={16} color={palette["muted-foreground"]} />
          <TextInput
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder={searchPlaceholder}
            placeholderTextColor={palette["muted-foreground"]}
            style={styles.searchInput}
            autoCapitalize="none"
          />
          {searchValue.length > 0 && onSearchChange && (
            <Pressable
              onPress={() => onSearchChange("")}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              style={({ pressed }) => pressedStyle(pressed)}
            >
              <X size={14} color={palette["muted-foreground"]} />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const createStyles = (palette: ThemeColors) => StyleSheet.create({
  container: {
    backgroundColor: palette.background,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    paddingHorizontal: sp(16),
    paddingVertical: sp(12),
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: sp(12),
    flex: 1,
    marginRight: 8,
  },
  titleSection: {
    flex: 1,
  },
  titleText: {
    fontSize: ts(18),
    fontWeight: themeStyle.fontWeight.title,
    color: palette.foreground,
    letterSpacing: -0.2,
  },
  subtitleText: {
    fontSize: ts(12),
    color: palette["muted-foreground"],
    marginTop: 2,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: sp(8),
  },
  iconBtn: {
    ...surface(palette),
    height: 36,
    width: 36,
    borderRadius: themeStyle.radius.button,
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
    paddingHorizontal: sp(4),
    borderRadius: 9,
    backgroundColor: palette.destructive,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: palette.border,
  },
  badgeText: {
    fontSize: ts(10),
    fontWeight: themeStyle.fontWeight.title,
    color: palette["destructive-foreground"],
    lineHeight: ts(12),
  },
  avatarBtn: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: alpha(palette.primary, 0.15),
    borderWidth: themeStyle.borderWidth,
    borderColor: alpha(palette.primary, 0.4),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  avatarText: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.title,
    color: palette.primary,
  },
  searchBar: {
    ...surface(palette),
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: themeStyle.radius.control,
    paddingHorizontal: sp(12),
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: ts(13),
    color: palette.foreground,
  },
});

