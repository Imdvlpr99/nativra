/**
 * Nativra — TeamMemberRow (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add team-member-row
 */
import React from "react";
import { View, Text, Pressable, type ViewProps } from "react-native";
import { MoreVertical, Shield } from "lucide-react-native";

export interface TeamMemberRowProps extends ViewProps {
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member" | "Viewer" | string;
  initials?: string;
  isCurrentUser?: boolean;
  onPress?: () => void;
  onOptionsPress?: () => void;
  className?: string;
}

export function TeamMemberRow({
  name,
  email,
  role,
  initials,
  isCurrentUser = false,
  onPress,
  onOptionsPress,
  className = "",
  style,
  ...props
}: TeamMemberRowProps) {
  const displayInitials =
    initials ||
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const isHighPrivilege = role === "Owner" || role === "Admin";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Team member ${name}, ${role}, email ${email}`}
      onPress={onPress}
      disabled={!onPress}
      className={`flex-row items-center justify-between rounded-xl border border-zinc-200 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900 active:opacity-75 ${className}`.trim()}
      style={style}
      {...props}
    >
      <View className="flex-row items-center gap-3 flex-1 pr-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
          <Text className="text-xs font-bold text-zinc-900 dark:text-white">
            {displayInitials}
          </Text>
        </View>

        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text
              className="text-sm font-semibold text-zinc-950 dark:text-white"
              numberOfLines={1}
            >
              {name}
            </Text>
            {isCurrentUser && (
              <Text className="text-[10px] font-semibold text-zinc-400">
                (You)
              </Text>
            )}
          </View>
          <Text
            className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5"
            numberOfLines={1}
          >
            {email}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <View
          className={`flex-row items-center gap-1 rounded-full px-2.5 py-1 ${
            isHighPrivilege
              ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
              : "bg-zinc-100 dark:bg-zinc-800"
          }`}
        >
          {isHighPrivilege && <Shield size={12} color="#0284c7" />}
          <Text
            className={`text-xs font-semibold ${
              isHighPrivilege
                ? "text-sky-600 dark:text-sky-400"
                : "text-zinc-600 dark:text-zinc-300"
            }`}
          >
            {role}
          </Text>
        </View>

        {onOptionsPress && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Options for ${name}`}
            onPress={(e) => {
              e.stopPropagation?.();
              onOptionsPress();
            }}
            className="p-1.5 rounded-lg active:bg-zinc-100 dark:active:bg-zinc-800"
          >
            <MoreVertical size={16} color="#71717a" />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

