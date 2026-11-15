/**
 * Nativra — TeamMemberRow (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add team-member-row
 */
import React from "react";
import { View, Text, Pressable, type ViewProps } from "react-native";
import { MoreVertical, Shield } from "lucide-react-native";
import { useThemeColors } from "@/hooks/use-theme-colors";

export interface TeamMemberRowProps extends Omit<ViewProps, "role"> {
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
  const palette = useThemeColors();
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
      className={`flex-row items-center justify-between rounded-control border border-border bg-card p-3.5 active:opacity-75 ${className}`.trim()}
      style={style}
      {...props}
    >
      <View className="flex-row items-center gap-3 flex-1 pr-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-muted border border-border">
          <Text className="text-xs font-bold text-foreground">
            {displayInitials}
          </Text>
        </View>

        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text
              className="text-sm font-semibold text-foreground"
              numberOfLines={1}
            >
              {name}
            </Text>
            {isCurrentUser && (
              <Text className="text-[10px] font-semibold text-muted-foreground">
                (You)
              </Text>
            )}
          </View>
          <Text
            className="text-xs text-muted-foreground mt-0.5"
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
              ? "bg-primary/10 text-primary"
              : "bg-muted"
          }`}
        >
          {isHighPrivilege && <Shield size={12} color={palette.primary} />}
          <Text
            className={`text-xs font-semibold ${
              isHighPrivilege
                ? "text-primary"
                : "text-muted-foreground"
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
            className="p-1.5 rounded-control active:bg-muted"
          >
            <MoreVertical size={16} color={palette["muted-foreground"]} />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

