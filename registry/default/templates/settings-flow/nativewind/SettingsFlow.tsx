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
      className={cn("flex-1 bg-zinc-50 dark:bg-zinc-950", className)}
    >
      {/* User Profile Card Header */}
      <View className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <View className="flex-row items-center gap-4">
          <View className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 items-center justify-center shadow-md">
            <Text className="text-lg font-black text-white">SM</Text>
          </View>

          <View className="flex-1 space-y-0.5">
            <View className="flex-row items-center gap-2">
              <Text className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                {userName}
              </Text>
              <Text className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-600 font-mono">
                PRO
              </Text>
            </View>
            <Text className="text-xs text-zinc-500">{userEmail}</Text>
          </View>
        </View>
      </View>

      {/* Preferences Section */}
      <View className="space-y-2">
        <Text className="px-1 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
          Preferences
        </Text>

        <View className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800">
          <View className="flex-row items-center justify-between py-2.5">
            <View className="space-y-0.5">
              <Text className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Push Notifications
              </Text>
              <Text className="text-xs text-zinc-500">
                Receive activity pings and release alerts
              </Text>
            </View>
            <Switch value={pushEnabled} onValueChange={setPushEnabled} />
          </View>

          <View className="flex-row items-center justify-between py-2.5">
            <View className="space-y-0.5">
              <Text className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Biometric Login
              </Text>
              <Text className="text-xs text-zinc-500">
                Face ID / Fingerprint fast unlock
              </Text>
            </View>
            <Switch value={biometrics} onValueChange={setBiometrics} />
          </View>

          <View className="flex-row items-center justify-between py-2.5">
            <View className="space-y-0.5">
              <Text className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Platform Haptics
              </Text>
              <Text className="text-xs text-zinc-500">
                Tactile feedback on button presses
              </Text>
            </View>
            <Switch value={haptics} onValueChange={setHaptics} />
          </View>
        </View>
      </View>

      {/* Data & Network Section */}
      <View className="space-y-2">
        <Text className="px-1 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
          Storage & Sync
        </Text>

        <View className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <View className="flex-row items-center justify-between py-1">
            <View className="space-y-0.5">
              <Text className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Offline Local-First Cache
              </Text>
              <Text className="text-xs text-zinc-500">
                Cache full registry items locally
              </Text>
            </View>
            <Switch value={offlineSync} onValueChange={setOfflineSync} />
          </View>
        </View>
      </View>

      {/* Danger Zone */}
      <View className="pt-2">
        <Pressable
          onPress={onLogout}
          className="w-full items-center justify-center rounded-2xl border border-red-200 bg-red-50/70 p-3.5 active:bg-red-100 dark:border-red-900/50 dark:bg-red-950/20"
        >
          <Text className="text-xs font-bold text-red-600 dark:text-red-400">
            Sign Out of Account
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

