/**
 * Nativra — Settings List Block (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add settings-list
 */
import React from "react";
import { View, Pressable } from "react-native";
import { Card } from "./Card";
import { Text } from "./Text";
import { Switch } from "./Switch";
import { Badge } from "./Badge";
import { Separator } from "./Separator";

export interface SettingsListProps {
  title?: string;
  notifications?: boolean;
  onNotificationsChange?: (val: boolean) => void;
  darkMode?: boolean;
  onDarkModeChange?: (val: boolean) => void;
  biometrics?: boolean;
  onBiometricsChange?: (val: boolean) => void;
  onAccountPress?: () => void;
  className?: string;
}

export function SettingsList({
  title = "Preferences",
  notifications = true,
  onNotificationsChange,
  darkMode = false,
  onDarkModeChange,
  biometrics = true,
  onBiometricsChange,
  onAccountPress,
  className = "",
}: SettingsListProps) {
  return (
    <Card elevated padding="md" className={`w-full max-w-sm rounded-3xl ${className}`.trim()}>
      <View className="mb-2 px-1">
        <Text variant="h3">{title}</Text>
        <Text variant="muted" className="text-xs">Manage your mobile app experience</Text>
      </View>

      <View className="my-2">
        <Separator />
      </View>

      {/* Row 1: Notifications */}
      <View className="flex-row items-center justify-between py-3 px-1">
        <View className="flex-1 pr-3">
          <Text variant="p" className="font-medium text-sm">Push Notifications</Text>
          <Text variant="muted" className="text-xs">Receive updates and mentions</Text>
        </View>
        <Switch value={notifications} onValueChange={onNotificationsChange} />
      </View>

      <Separator />

      {/* Row 2: Dark Mode */}
      <View className="flex-row items-center justify-between py-3 px-1">
        <View className="flex-1 pr-3">
          <Text variant="p" className="font-medium text-sm">Dark Theme</Text>
          <Text variant="muted" className="text-xs">Switch to midnight dark palette</Text>
        </View>
        <Switch value={darkMode} onValueChange={onDarkModeChange} />
      </View>

      <Separator />

      {/* Row 3: Biometrics */}
      <View className="flex-row items-center justify-between py-3 px-1">
        <View className="flex-1 pr-3">
          <View className="flex-row items-center gap-1.5">
            <Text variant="p" className="font-medium text-sm">Face ID / Biometrics</Text>
            <Badge variant="primary" size="sm" label="Secure" />
          </View>
          <Text variant="muted" className="text-xs">Require authentication on launch</Text>
        </View>
        <Switch value={biometrics} onValueChange={onBiometricsChange} />
      </View>

      <Separator />

      {/* Row 4: Account Security navigation */}
      <Pressable
        onPress={onAccountPress}
        className="flex-row items-center justify-between py-3 px-1 active:opacity-70"
      >
        <View>
          <Text variant="p" className="font-medium text-sm">Account & Security</Text>
          <Text variant="muted" className="text-xs">Password, 2FA, session tokens</Text>
        </View>
        <Text variant="muted" className="text-sm font-semibold">›</Text>
      </Pressable>
    </Card>
  );
}
