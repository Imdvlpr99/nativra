/**
 * Nativra — Notification Item Block (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add notification-item --target stylesheet
 */
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

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

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  cardUnread: {
    backgroundColor: "#f0f9ff",
    borderColor: "#bae6fd",
  },
  cardRead: {
    backgroundColor: "#ffffff",
    borderColor: "#e4e4e7",
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
    backgroundColor: "#0ea5e9",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  unreadDot: {
    position: "absolute",
    top: -2,
    right: -2,
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#0ea5e9",
    borderWidth: 2,
    borderColor: "#ffffff",
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
    backgroundColor: "#e0f2fe",
  },
  badgeRead: {
    backgroundColor: "#f4f4f5",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  badgeTextUnread: {
    color: "#0369a1",
  },
  badgeTextRead: {
    color: "#71717a",
  },
  timeAgo: {
    fontSize: 11,
    color: "#a1a1aa",
    fontFamily: "monospace",
  },
  message: {
    fontSize: 12,
    lineHeight: 18,
    color: "#3f3f46",
  },
  sender: {
    fontWeight: "700",
    color: "#09090b",
  },
  resource: {
    fontWeight: "600",
    color: "#0ea5e9",
  },
});

