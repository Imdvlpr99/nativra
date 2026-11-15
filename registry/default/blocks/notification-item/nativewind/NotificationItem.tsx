/**
 * Nativra — Notification Item Block (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add notification-item
 */
import React from "react";
import { View, Pressable } from "react-native";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Text } from "./Text";

export interface NotificationItemProps {
  avatarFallback?: string;
  senderName?: string;
  actionText?: string;
  targetResource?: string;
  timeAgo?: string;
  unread?: boolean;
  category?: string;
  onPress?: () => void;
  className?: string;
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
  className = "",
}: NotificationItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`w-full max-w-sm sp-p-4 rounded-card border transition-all active:scale-[0.98] ${
        unread
          ? "bg-primary/50 border-primary/30"
          : "surface"
      } ${className}`.trim()}
    >
      <View className="flex-row items-start sp-gap-3">
        <View className="relative">
          <Avatar fallback={avatarFallback} size="md" />
          {unread && (
            <View className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-primary border-2 border-primary-foreground/20" />
          )}
        </View>

        <View className="flex-1 space-y-1">
          <View className="flex-row items-center justify-between">
            <Badge variant={unread ? "primary" : "secondary"} size="sm" label={category} />
            <Text variant="muted" className="type-2xs font-mono">{timeAgo}</Text>
          </View>

          <Text className="type-xs leading-relaxed text-foreground">
            <Text className="weight-title text-foreground">{senderName} </Text>
            {actionText}{" "}
            <Text className="weight-label text-primary">{targetResource}</Text>
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

