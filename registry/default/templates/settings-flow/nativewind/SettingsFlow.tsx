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
      contentContainerClassName="sp-p-5 sp-pb-12 space-y-6"
      className={cn("flex-1 bg-background", className)}
    >
      {/* User Profile Card Header */}
      <View className="surface rounded-card sp-p-5 shadow-sm">
        <View className="flex-row items-center sp-gap-4">
          <View className="h-14 w-14 rounded-card bg-gradient-to-tr from-primary to-primary items-center justify-center shadow-md">
            <Text className="type-lg weight-heading text-primary-foreground">SM</Text>
          </View>

          <View className="flex-1 space-y-0.5">
            <View className="flex-row items-center sp-gap-2">
              <Text className="type-base weight-title text-foreground">
                {userName}
              </Text>
              <Text className="rounded-full bg-success/15 sp-px-2 sp-py-0.5 type-2xs weight-title text-success font-mono">
                PRO
              </Text>
            </View>
            <Text className="type-xs text-muted-foreground">{userEmail}</Text>
          </View>
        </View>
      </View>

      {/* Preferences Section */}
      <View className="space-y-2">
        <Text className="sp-px-1 type-2xs weight-title uppercase tracking-wider text-muted-foreground">
          Preferences
        </Text>

        <View className="surface rounded-card sp-p-4 shadow-sm divide-y divide-border">
          <View className="flex-row items-center justify-between sp-py-2.5">
            <View className="space-y-0.5">
              <Text className="type-sm weight-label text-foreground">
                Push Notifications
              </Text>
              <Text className="type-xs text-muted-foreground">
                Receive activity pings and release alerts
              </Text>
            </View>
            <Switch value={pushEnabled} onValueChange={setPushEnabled} />
          </View>

          <View className="flex-row items-center justify-between sp-py-2.5">
            <View className="space-y-0.5">
              <Text className="type-sm weight-label text-foreground">
                Biometric Login
              </Text>
              <Text className="type-xs text-muted-foreground">
                Face ID / Fingerprint fast unlock
              </Text>
            </View>
            <Switch value={biometrics} onValueChange={setBiometrics} />
          </View>

          <View className="flex-row items-center justify-between sp-py-2.5">
            <View className="space-y-0.5">
              <Text className="type-sm weight-label text-foreground">
                Platform Haptics
              </Text>
              <Text className="type-xs text-muted-foreground">
                Tactile feedback on button presses
              </Text>
            </View>
            <Switch value={haptics} onValueChange={setHaptics} />
          </View>
        </View>
      </View>

      {/* Data & Network Section */}
      <View className="space-y-2">
        <Text className="sp-px-1 type-2xs weight-title uppercase tracking-wider text-muted-foreground">
          Storage & Sync
        </Text>

        <View className="surface rounded-card sp-p-4 shadow-sm">
          <View className="flex-row items-center justify-between sp-py-1">
            <View className="space-y-0.5">
              <Text className="type-sm weight-label text-foreground">
                Offline Local-First Cache
              </Text>
              <Text className="type-xs text-muted-foreground">
                Cache full registry items locally
              </Text>
            </View>
            <Switch value={offlineSync} onValueChange={setOfflineSync} />
          </View>
        </View>
      </View>

      {/* Danger Zone */}
      <View className="sp-pt-2">
        <Pressable accessibilityRole="button"
          onPress={onLogout}
          className="w-full items-center justify-center rounded-card border border-destructive/30 bg-destructive/70 sp-p-3.5 active:bg-destructive/15"
        >
          <Text className="type-xs weight-title text-destructive">
            Sign Out of Account
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

