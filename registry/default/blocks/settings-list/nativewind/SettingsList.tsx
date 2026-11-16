/**
 * Nativra — Settings List Block (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add settings-list
 */
import React from "react";
import { View, Pressable } from "react-native";
import { Card } from "./Card";
import { Text } from "./Text";
import { Switch } from "./Switch";
import { Badge } from "./Badge";
import { Separator } from "./Separator";

const noop = () => {};

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
    <Card elevated padding="md" className={`w-full max-w-sm rounded-card ${className}`.trim()}>
      <View className="mb-2 sp-px-1">
        <Text variant="h3">{title}</Text>
        <Text variant="muted" className="type-xs">Manage your mobile app experience</Text>
      </View>

      <View className="my-2">
        <Separator />
      </View>

      {/* Row 1: Notifications */}
      <View className="flex-row items-center justify-between sp-py-3 sp-px-1">
        <View className="flex-1 sp-pr-3">
          <Text variant="p" className="font-medium type-sm">Push Notifications</Text>
          <Text variant="muted" className="type-xs">Receive updates and mentions</Text>
        </View>
        <Switch value={notifications} onValueChange={onNotificationsChange ?? noop} />
      </View>

      <Separator />

      {/* Row 2: Dark Mode */}
      <View className="flex-row items-center justify-between sp-py-3 sp-px-1">
        <View className="flex-1 sp-pr-3">
          <Text variant="p" className="font-medium type-sm">Dark Theme</Text>
          <Text variant="muted" className="type-xs">Switch to midnight dark palette</Text>
        </View>
        <Switch value={darkMode} onValueChange={onDarkModeChange ?? noop} />
      </View>

      <Separator />

      {/* Row 3: Biometrics */}
      <View className="flex-row items-center justify-between sp-py-3 sp-px-1">
        <View className="flex-1 sp-pr-3">
          <View className="flex-row items-center sp-gap-1.5">
            <Text variant="p" className="font-medium type-sm">Face ID / Biometrics</Text>
            <Badge variant="primary" size="sm" label="Secure" />
          </View>
          <Text variant="muted" className="type-xs">Require authentication on launch</Text>
        </View>
        <Switch value={biometrics} onValueChange={onBiometricsChange ?? noop} />
      </View>

      <Separator />

      {/* Row 4: Account Security navigation */}
      <Pressable accessibilityRole="button"
        onPress={onAccountPress}
        className="flex-row items-center justify-between sp-py-3 sp-px-1 active:opacity-70"
      >
        <View>
          <Text variant="p" className="font-medium type-sm">Account & Security</Text>
          <Text variant="muted" className="type-xs">Password, 2FA, session tokens</Text>
        </View>
        <Text variant="muted" className="type-sm weight-label">›</Text>
      </Pressable>
    </Card>
  );
}
