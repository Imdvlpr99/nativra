/**
 * Nativra — TeamMemberRow (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add team-member-row
 */
import React from "react";
import { View, Text, Pressable, StyleSheet, type ViewProps } from "react-native";
import { MoreVertical, Shield } from "lucide-react-native";

export interface TeamMemberRowProps extends ViewProps {
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member" | "Viewer" | string;
  initials?: string;
  isCurrentUser?: boolean;
  onPress?: () => void;
  onOptionsPress?: () => void;
}

export function TeamMemberRow({
  name,
  email,
  role,
  initials,
  isCurrentUser = false,
  onPress,
  onOptionsPress,
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
      style={[styles.container, style]}
      {...props}
    >
      <View style={styles.leftCol}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{displayInitials}</Text>
        </View>

        <View style={styles.textCol}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText} numberOfLines={1}>
              {name}
            </Text>
            {isCurrentUser && (
              <Text style={styles.youPill}>(You)</Text>
            )}
          </View>
          <Text style={styles.emailText} numberOfLines={1}>
            {email}
          </Text>
        </View>
      </View>

      <View style={styles.rightCol}>
        <View style={[styles.rolePill, isHighPrivilege ? styles.roleHigh : styles.roleStandard]}>
          {isHighPrivilege && <Shield size={12} color="#0284c7" />}
          <Text style={[styles.roleText, isHighPrivilege ? styles.roleHighText : styles.roleStandardText]}>
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
            style={styles.optionsBtn}
          >
            <MoreVertical size={16} color="#71717a" />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#27272a",
    backgroundColor: "#18181b",
    padding: 14,
  },
  leftCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    paddingRight: 12,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#27272a",
    borderWidth: 1,
    borderColor: "#3f3f46",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },
  textCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  nameText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  youPill: {
    fontSize: 10,
    fontWeight: "600",
    color: "#a1a1aa",
  },
  emailText: {
    fontSize: 12,
    color: "#a1a1aa",
    marginTop: 2,
  },
  rightCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rolePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  roleHigh: {
    backgroundColor: "rgba(2, 132, 199, 0.1)",
  },
  roleStandard: {
    backgroundColor: "#27272a",
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
  },
  roleHighText: {
    color: "#38bdf8",
  },
  roleStandardText: {
    color: "#d4d4d8",
  },
  optionsBtn: {
    padding: 6,
  },
});

