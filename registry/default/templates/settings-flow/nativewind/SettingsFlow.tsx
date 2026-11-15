import * as React from "react";
import { View, Text, Switch, Pressable, ScrollView } from "react-native";
import { cn } from "@/lib/utils";

export interface SettingsFlowProps {
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
  className?: string;
}

export function SettingsFlow({
  userName = "Sophia Martinez",
  userEmail = "sophia@nativra.dev",
  onLogout,
  className,
}: SettingsFlowProps) {
  const [pushEnabled, setPushEnabled] = React.useState(true);
  const [biometrics, setBiometrics] = React.useState(true);
  const [haptics, setHaptics] = React.useState(true);
  const [offlineSync, setOfflineSync] = React.useState(false);

  return (
    <ScrollView
      contentContainerClassName="p-5 pb-12 space-y-6"
      className={cn("flex-1 bg-background", className)}
    >
      {/* User Profile Card Header */}
      <View className="rounded-card border border-border bg-card p-5 shadow-sm">
        <View className="flex-row items-center gap-4">
          <View className="h-14 w-14 rounded-card bg-gradient-to-tr from-primary to-primary items-center justify-center shadow-md">
            <Text className="text-lg font-black text-primary-foreground">SM</Text>
          </View>

          <View className="flex-1 space-y-0.5">
            <View className="flex-row items-center gap-2">
              <Text className="text-base font-bold text-foreground">
                {userName}
              </Text>
              <Text className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success font-mono">
                PRO
              </Text>
            </View>
            <Text className="text-xs text-muted-foreground">{userEmail}</Text>
          </View>
        </View>
      </View>

      {/* Preferences Section */}
      <View className="space-y-2">
        <Text className="px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Preferences
        </Text>

        <View className="rounded-card border border-border bg-card p-4 shadow-sm divide-y divide-border">
          <View className="flex-row items-center justify-between py-2.5">
            <View className="space-y-0.5">
              <Text className="text-sm font-semibold text-foreground">
                Push Notifications
              </Text>
              <Text className="text-xs text-muted-foreground">
                Receive activity pings and release alerts
              </Text>
            </View>
            <Switch value={pushEnabled} onValueChange={setPushEnabled} />
          </View>

          <View className="flex-row items-center justify-between py-2.5">
            <View className="space-y-0.5">
              <Text className="text-sm font-semibold text-foreground">
                Biometric Login
              </Text>
              <Text className="text-xs text-muted-foreground">
                Face ID / Fingerprint fast unlock
              </Text>
            </View>
            <Switch value={biometrics} onValueChange={setBiometrics} />
          </View>

          <View className="flex-row items-center justify-between py-2.5">
            <View className="space-y-0.5">
              <Text className="text-sm font-semibold text-foreground">
                Platform Haptics
              </Text>
              <Text className="text-xs text-muted-foreground">
                Tactile feedback on button presses
              </Text>
            </View>
            <Switch value={haptics} onValueChange={setHaptics} />
          </View>
        </View>
      </View>

      {/* Data & Network Section */}
      <View className="space-y-2">
        <Text className="px-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          Storage & Sync
        </Text>

        <View className="rounded-card border border-border bg-card p-4 shadow-sm">
          <View className="flex-row items-center justify-between py-1">
            <View className="space-y-0.5">
              <Text className="text-sm font-semibold text-foreground">
                Offline Local-First Cache
              </Text>
              <Text className="text-xs text-muted-foreground">
                Cache full registry items locally
              </Text>
            </View>
            <Switch value={offlineSync} onValueChange={setOfflineSync} />
          </View>
        </View>
      </View>

      {/* Danger Zone */}
      <View className="pt-2">
        <Pressable accessibilityRole="button"
          onPress={onLogout}
          className="w-full items-center justify-center rounded-card border border-destructive/30 bg-destructive/70 p-3.5 active:bg-destructive/15"
        >
          <Text className="text-xs font-bold text-destructive">
            Sign Out of Account
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

