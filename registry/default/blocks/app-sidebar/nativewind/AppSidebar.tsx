import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
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
import { useThemeColors } from "@/hooks/use-theme-colors";

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
  return (
    <View className="flex-1 w-full max-w-xs bg-background border-r border-border flex-col justify-between">
      {/* Brand Header */}
      <View className="sp-p-4 border-b border-border/80 flex-row items-center sp-gap-3">
        <View className="h-9 w-9 rounded-control bg-primary/20 border border-primary/40 items-center justify-center">
          <Text className="type-base weight-heading text-primary font-mono">N</Text>
        </View>
        <View>
          <Text className="type-sm weight-title text-foreground tracking-tight">Nativra Workspace</Text>
          <Text className="type-2xs text-muted-foreground font-mono">v4.0.0 Enterprise</Text>
        </View>
      </View>

      {/* Navigation Groups List */}
      <ScrollView className="flex-1 sp-px-3 sp-py-4" contentContainerStyle={{ gap: 20 }}>
        {groups.map((group, gIdx) => (
          <View key={gIdx} className="space-y-1">
            {group.title && (
              <Text className="type-2xs weight-title text-muted-foreground tracking-wider uppercase sp-px-2 mb-1.5">
                {group.title}
              </Text>
            )}
            {group.items.map((item) => {
              const isActive = item.id === activeId;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => onSelect?.(item.id)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  className={`flex-row items-center justify-between sp-px-3 sp-py-2.5 rounded-control transition-colors ${
                    isActive
                      ? "bg-primary/15 border border-primary/30 text-foreground weight-label"
                      : "bg-transparent text-muted-foreground active:bg-card"
                  }`}
                >
                  <View className="flex-row items-center sp-gap-2.5">
                    {renderIcon(item.icon, isActive ? palette.primary : palette["muted-foreground"])}
                    <Text
                      className={`type-xs ${
                        isActive ? "text-foreground weight-label" : "text-muted-foreground font-normal"
                      }`}
                    >
                      {item.label}
                    </Text>
                  </View>

                  <View className="flex-row items-center sp-gap-1.5">
                    {item.badge !== undefined && (
                      <View
                        className={`sp-px-1.5 sp-py-0.5 rounded-small ${
                          item.badgeVariant === "primary"
                            ? "bg-primary/20 border border-primary/40"
                            : item.badgeVariant === "destructive"
                            ? "bg-destructive/20 border border-destructive/40"
                            : "bg-muted border border-border"
                        }`}
                      >
                        <Text
                          className={`type-2xs weight-title ${
                            item.badgeVariant === "primary"
                              ? "text-primary"
                              : item.badgeVariant === "destructive"
                              ? "text-destructive"
                              : "text-muted-foreground"
                          }`}
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
      <View className="sp-p-3 border-t border-border/80 bg-card/40">
        <TouchableOpacity
          onPress={onProfilePress}
          activeOpacity={0.7}
          className="flex-row items-center justify-between sp-p-2 rounded-control bg-card/80 border border-border hover:border-border"
        >
          <View className="flex-row items-center sp-gap-2.5 flex-1 mr-2">
            <View className="h-9 w-9 rounded-full bg-success/20 border border-success/40 items-center justify-center">
              <Text className="type-xs weight-title text-success font-mono">
                {avatarFallback}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="type-xs weight-title text-foreground truncate" numberOfLines={1}>
                {userName}
              </Text>
              <Text className="type-2xs text-muted-foreground truncate" numberOfLines={1}>
                {userEmail}
              </Text>
            </View>
          </View>

          {onLogoutPress && (
            <TouchableOpacity
              onPress={onLogoutPress}
              accessibilityRole="button"
              accessibilityLabel="Log out"
              className="h-8 w-8 rounded-control bg-muted/80 items-center justify-center active:bg-destructive/20"
            >
              <LogOut size={14} color={palette["muted-foreground"]} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

