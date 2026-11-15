/**
 * Nativra — Notification Item Block (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add notification-item --target stylesheet
 */
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { themeStyle, useThemeColors, alpha, type ThemeColors } from "@/hooks/use-theme-colors";

export interface NotificationItemProps {
  avatarFallback?: string;
  senderName?: string;
  actionText?: string;
  targetResource?: string;
  timeAgo?: string;
  unread?: boolean;
  category?: string;
  onPress?: () => void;
}

export function NotificationItem({
  avatarFallback = "NV",
  senderName = "Marcus Vance",
  actionText = "requested feedback on",
  targetResource = "Design System Spec",
  timeAgo = "12m ago",
  unread = true,
  category = "Workspace",
  onPress,
}: NotificationItemProps) {
  const palette = useThemeColors();
  const styles = React.useMemo(() => createStyles(palette), [palette]);
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.card,
        unread ? styles.cardUnread : styles.cardRead,
      ]}
    >
      <View style={styles.contentRow}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarFallback}</Text>
          </View>
          {unread && <View style={styles.unreadDot} />}
        </View>

        <View style={styles.details}>
          <View style={styles.topRow}>
            <View style={[styles.badge, unread ? styles.badgeUnread : styles.badgeRead]}>
              <Text style={[styles.badgeText, unread ? styles.badgeTextUnread : styles.badgeTextRead]}>
                {category}
              </Text>
            </View>
            <Text style={styles.timeAgo}>{timeAgo}</Text>
          </View>

          <Text style={styles.message}>
            <Text style={styles.sender}>{senderName} </Text>
            {actionText}{" "}
            <Text style={styles.resource}>{targetResource}</Text>
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const createStyles = (palette: ThemeColors) => StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: themeStyle.radius.card,
    borderWidth: 1,
    padding: 14,
  },
  cardUnread: {
    backgroundColor: alpha(palette.primary, 0.1),
    borderColor: alpha(palette.primary, 0.3),
  },
  cardRead: {
    backgroundColor: palette.card,
    borderColor: palette.border,
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: palette["primary-foreground"],
    fontSize: 14,
    fontWeight: "700",
  },
  unreadDot: {
    position: "absolute",
    top: -2,
    right: -2,
    height: 12,
    width: 12,
    borderRadius: themeStyle.radius.small,
    backgroundColor: palette.primary,
    borderWidth: 2,
    borderColor: alpha(palette["primary-foreground"], 0.2),
  },
  details: {
    flex: 1,
    gap: 4,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  badgeUnread: {
    backgroundColor: alpha(palette.primary, 0.15),
  },
  badgeRead: {
    backgroundColor: palette.muted,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  badgeTextUnread: {
    color: palette.primary,
  },
  badgeTextRead: {
    color: palette["muted-foreground"],
  },
  timeAgo: {
    fontSize: 11,
    color: palette["muted-foreground"],
    fontFamily: "monospace",
  },
  message: {
    fontSize: 12,
    lineHeight: 18,
    color: palette.foreground,
  },
  sender: {
    fontWeight: "700",
    color: palette.foreground,
  },
  resource: {
    fontWeight: "600",
    color: palette.primary,
  },
});

