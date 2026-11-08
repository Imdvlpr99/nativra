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

function renderIcon(name?: string, active = false) {
  const color = active ? "#38bdf8" : "#a1a1aa";
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
  return (
    <View className="flex-1 w-full max-w-xs bg-zinc-950 border-r border-zinc-800 flex-col justify-between">
      {/* Brand Header */}
      <View className="p-4 border-b border-zinc-800/80 flex-row items-center gap-3">
        <View className="h-9 w-9 rounded-xl bg-sky-500/20 border border-sky-500/40 items-center justify-center">
          <Text className="text-base font-extrabold text-sky-400 font-mono">N</Text>
        </View>
        <View>
          <Text className="text-sm font-bold text-white tracking-tight">Nativra Studio</Text>
          <Text className="text-[11px] text-zinc-400 font-mono">v4.0.0 Enterprise</Text>
        </View>
      </View>

      {/* Navigation Groups List */}
      <ScrollView className="flex-1 px-3 py-4" contentContainerStyle={{ gap: 20 }}>
        {groups.map((group, gIdx) => (
          <View key={gIdx} className="space-y-1">
            {group.title && (
              <Text className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase px-2 mb-1.5">
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
                  className={`flex-row items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                    isActive
                      ? "bg-sky-500/15 border border-sky-500/30 text-white font-semibold"
                      : "bg-transparent text-zinc-400 active:bg-zinc-900"
                  }`}
                >
                  <View className="flex-row items-center gap-2.5">
                    {renderIcon(item.icon, isActive)}
                    <Text
                      className={`text-xs ${
                        isActive ? "text-white font-semibold" : "text-zinc-300 font-normal"
                      }`}
                    >
                      {item.label}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-1.5">
                    {item.badge !== undefined && (
                      <View
                        className={`px-1.5 py-0.5 rounded-md ${
                          item.badgeVariant === "primary"
                            ? "bg-sky-500/20 border border-sky-500/40"
                            : item.badgeVariant === "destructive"
                            ? "bg-rose-500/20 border border-rose-500/40"
                            : "bg-zinc-800 border border-zinc-700"
                        }`}
                      >
                        <Text
                          className={`text-[10px] font-bold ${
                            item.badgeVariant === "primary"
                              ? "text-sky-400"
                              : item.badgeVariant === "destructive"
                              ? "text-rose-400"
                              : "text-zinc-400"
                          }`}
                        >
                          {item.badge}
                        </Text>
                      </View>
                    )}
                    {isActive && <ChevronRight size={14} color="#38bdf8" />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>

      {/* User Profile & Actions Footer */}
      <View className="p-3 border-t border-zinc-800/80 bg-zinc-900/40">
        <TouchableOpacity
          onPress={onProfilePress}
          activeOpacity={0.7}
          className="flex-row items-center justify-between p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700"
        >
          <View className="flex-row items-center gap-2.5 flex-1 mr-2">
            <View className="h-9 w-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 items-center justify-center">
              <Text className="text-xs font-bold text-emerald-400 font-mono">
                {avatarFallback}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-white truncate" numberOfLines={1}>
                {userName}
              </Text>
              <Text className="text-[10px] text-zinc-400 truncate" numberOfLines={1}>
                {userEmail}
              </Text>
            </View>
          </View>

          {onLogoutPress && (
            <TouchableOpacity
              onPress={onLogoutPress}
              accessibilityRole="button"
              accessibilityLabel="Log out"
              className="h-8 w-8 rounded-lg bg-zinc-800/80 items-center justify-center active:bg-rose-500/20"
            >
              <LogOut size={14} color="#a1a1aa" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

