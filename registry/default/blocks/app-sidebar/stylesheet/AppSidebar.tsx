import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react-native";
import { themeStyle, useThemeColors, alpha, type ThemeColors } from "@/hooks/use-theme-colors";

export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
  badgeVariant?: "default" | "primary" | "destructive";
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

export interface AppSidebarProps {
  activeId?: string;
  onSelect?: (id: string) => void;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  avatarFallback?: string;
  onProfilePress?: () => void;
  onLogoutPress?: () => void;
  groups?: NavGroup[];
}

const DEFAULT_GROUPS: NavGroup[] = [
  {
    title: "MAIN MENU",
    items: [
      { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
      { id: "analytics", label: "Analytics", icon: "BarChart3", badge: "Live", badgeVariant: "primary" },
      { id: "team", label: "Team Members", icon: "Users", badge: 8 },
      { id: "billing", label: "Billing & Plans", icon: "CreditCard" },
    ],
  },
  {
    title: "PREFERENCES",
    items: [
      { id: "settings", label: "Settings", icon: "Settings" },
      { id: "support", label: "Help & Support", icon: "HelpCircle" },
    ],
  },
];

/** Sidebar icon in the given theme color (active: primary, otherwise muted). */
function renderIcon(name: string | undefined, color: string) {
  const size = 18;
  switch (name) {
    case "LayoutDashboard":
      return <LayoutDashboard size={size} color={color} />;
    case "BarChart3":
      return <BarChart3 size={size} color={color} />;
    case "Users":
      return <Users size={size} color={color} />;
    case "CreditCard":
      return <CreditCard size={size} color={color} />;
    case "Settings":
      return <Settings size={size} color={color} />;
    case "HelpCircle":
      return <HelpCircle size={size} color={color} />;
    default:
      return <LayoutDashboard size={size} color={color} />;
  }
}

export function AppSidebar({
  activeId = "dashboard",
  onSelect,
  userName = "Alex Mercer",
  userEmail = "alex.mercer@company.com",
  userRole = "Enterprise Admin",
  avatarFallback = "AM",
  onProfilePress,
  onLogoutPress,
  groups = DEFAULT_GROUPS,
}: AppSidebarProps) {
  const palette = useThemeColors();
  const styles = React.useMemo(() => createStyles(palette), [palette]);
  return (
    <View style={styles.container}>
      {/* Brand Header */}
      <View style={styles.brandHeader}>
        <View style={styles.brandLogo}>
          <Text style={styles.brandLogoText}>N</Text>
        </View>
        <View>
          <Text style={styles.brandTitle}>Nativra Workspace</Text>
          <Text style={styles.brandSubtitle}>v4.0.0 Enterprise</Text>
        </View>
      </View>

      {/* Navigation Groups List */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {groups.map((group, gIdx) => (
          <View key={gIdx} style={styles.groupContainer}>
            {group.title && <Text style={styles.groupTitle}>{group.title}</Text>}
            {group.items.map((item) => {
              const isActive = item.id === activeId;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => onSelect?.(item.id)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  style={[styles.navItem, isActive && styles.navItemActive]}
                >
                  <View style={styles.navItemLeft}>
                    {renderIcon(item.icon, isActive ? palette.primary : palette["muted-foreground"])}
                    <Text style={[styles.navItemLabel, isActive && styles.navItemLabelActive]}>
                      {item.label}
                    </Text>
                  </View>

                  <View style={styles.navItemRight}>
                    {item.badge !== undefined && (
                      <View
                        style={[
                          styles.badge,
                          item.badgeVariant === "primary" && styles.badgePrimary,
                          item.badgeVariant === "destructive" && styles.badgeDestructive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.badgeText,
                            item.badgeVariant === "primary" && styles.badgeTextPrimary,
                            item.badgeVariant === "destructive" && styles.badgeTextDestructive,
                          ]}
                        >
                          {item.badge}
                        </Text>
                      </View>
                    )}
                    {isActive && <ChevronRight size={14} color={palette.primary} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>

      {/* User Profile & Actions Footer */}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          onPress={onProfilePress}
          activeOpacity={0.7}
          style={styles.profileCard}
        >
          <View style={styles.profileLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarFallback}</Text>
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.profileName} numberOfLines={1}>
                {userName}
              </Text>
              <Text style={styles.profileEmail} numberOfLines={1}>
                {userEmail}
              </Text>
            </View>
          </View>

          {onLogoutPress && (
            <TouchableOpacity
              onPress={onLogoutPress}
              accessibilityRole="button"
              accessibilityLabel="Log out"
              style={styles.logoutBtn}
            >
              <LogOut size={14} color={palette["muted-foreground"]} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (palette: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 300,
    backgroundColor: palette.background,
    borderRightWidth: 1,
    borderRightColor: palette.border,
    justifyContent: "space-between",
  },
  brandHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: alpha(palette.border, 0.8),
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  brandLogo: {
    height: 36,
    width: 36,
    borderRadius: themeStyle.radius.control,
    backgroundColor: alpha(palette.primary, 0.15),
    borderWidth: 1,
    borderColor: alpha(palette.primary, 0.4),
    alignItems: "center",
    justifyContent: "center",
  },
  brandLogoText: {
    fontSize: 16,
    fontWeight: "800",
    color: palette.primary,
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: palette.foreground,
    letterSpacing: -0.2,
  },
  brandSubtitle: {
    fontSize: 11,
    color: palette["muted-foreground"],
    marginTop: 2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 20,
  },
  groupContainer: {
    gap: 4,
  },
  groupTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: palette["muted-foreground"],
    letterSpacing: 0.8,
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: themeStyle.radius.control,
  },
  navItemActive: {
    backgroundColor: alpha(palette.primary, 0.12),
    borderWidth: 1,
    borderColor: alpha(palette.primary, 0.3),
  },
  navItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  navItemLabel: {
    fontSize: 13,
    color: palette["muted-foreground"],
  },
  navItemLabelActive: {
    color: palette.foreground,
    fontWeight: "600",
  },
  navItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: themeStyle.radius.small,
    backgroundColor: palette.muted,
    borderWidth: 1,
    borderColor: palette.border,
  },
  badgePrimary: {
    backgroundColor: alpha(palette.primary, 0.15),
    borderColor: alpha(palette.primary, 0.35),
  },
  badgeDestructive: {
    backgroundColor: alpha(palette.destructive, 0.15),
    borderColor: alpha(palette.destructive, 0.35),
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: palette["muted-foreground"],
  },
  badgeTextPrimary: {
    color: palette.primary,
  },
  badgeTextDestructive: {
    color: palette.destructive,
  },
  footerContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: alpha(palette.border, 0.8),
    backgroundColor: alpha(palette.card, 0.4),
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    borderRadius: themeStyle.radius.control,
    backgroundColor: alpha(palette.card, 0.8),
    borderWidth: 1,
    borderColor: palette.border,
  },
  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    marginRight: 8,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: alpha(palette.success, 0.15),
    borderWidth: 1,
    borderColor: alpha(palette.success, 0.35),
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "700",
    color: palette.success,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 12,
    fontWeight: "700",
    color: palette.foreground,
  },
  profileEmail: {
    fontSize: 10,
    color: palette["muted-foreground"],
  },
  logoutBtn: {
    height: 32,
    width: 32,
    borderRadius: themeStyle.radius.control,
    backgroundColor: alpha(palette.muted, 0.8),
    alignItems: "center",
    justifyContent: "center",
  },
});

