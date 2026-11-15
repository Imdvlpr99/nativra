/**
 * Nativra — TeamMemberRow (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add team-member-row
 */
import React from "react";
import { View, Text, Pressable, StyleSheet, type ViewProps } from "react-native";
import { MoreVertical, Shield } from "lucide-react-native";
import { useThemeColors, alpha, type ThemeColors, themeStyle, ts, sp, surface } from "@/hooks/use-theme-colors";

export interface TeamMemberRowProps extends Omit<ViewProps, "role"> {
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
  const palette = useThemeColors();
  const styles = React.useMemo(() => createStyles(palette), [palette]);
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
          {isHighPrivilege && <Shield size={12} color={palette.primary} />}
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
            <MoreVertical size={16} color={palette["muted-foreground"]} />
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const createStyles = (palette: ThemeColors) => StyleSheet.create({
  container: {
    ...surface(palette),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: themeStyle.radius.card,
    padding: sp(14),
  },
  leftCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: sp(12),
    flex: 1,
    paddingRight: sp(12),
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: palette.muted,
    borderWidth: themeStyle.borderWidth,
    borderColor: palette.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.title,
    color: palette.foreground,
  },
  textCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: sp(6),
  },
  nameText: {
    fontSize: ts(14),
    fontWeight: themeStyle.fontWeight.label,
    color: palette.foreground,
  },
  youPill: {
    fontSize: ts(10),
    fontWeight: themeStyle.fontWeight.label,
    color: palette["muted-foreground"],
  },
  emailText: {
    fontSize: ts(12),
    color: palette["muted-foreground"],
    marginTop: 2,
  },
  rightCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: sp(8),
  },
  rolePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: sp(4),
    borderRadius: 9999,
    paddingHorizontal: sp(10),
    paddingVertical: sp(4),
  },
  roleHigh: {
    backgroundColor: alpha(palette.primary, 0.1),
  },
  roleStandard: {
    backgroundColor: palette.muted,
  },
  roleText: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.label,
  },
  roleHighText: {
    color: palette.primary,
  },
  roleStandardText: {
    color: palette["muted-foreground"],
  },
  optionsBtn: {
    padding: sp(6),
  },
});

