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
      className={`w-full max-w-sm p-4 rounded-2xl border transition-all active:scale-[0.98] ${
        unread
          ? "bg-sky-50/50 border-sky-200 dark:bg-sky-950/20 dark:border-sky-800/40"
          : "bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"
      } ${className}`.trim()}
    >
      <View className="flex-row items-start gap-3">
        <View className="relative">
          <Avatar fallback={avatarFallback} size="md" />
          {unread && (
            <View className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-sky-500 border-2 border-white dark:border-zinc-900" />
          )}
        </View>

        <View className="flex-1 space-y-1">
          <View className="flex-row items-center justify-between">
            <Badge variant={unread ? "primary" : "secondary"} size="sm" label={category} />
            <Text variant="muted" className="text-[11px] font-mono">{timeAgo}</Text>
          </View>

          <Text className="text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
            <Text className="font-bold text-zinc-900 dark:text-zinc-50">{senderName} </Text>
            {actionText}{" "}
            <Text className="font-semibold text-sky-600 dark:text-sky-400">{targetResource}</Text>
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

