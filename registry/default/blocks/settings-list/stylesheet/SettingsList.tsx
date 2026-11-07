/**
 * Nativra — Settings List Block (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add settings-list
 */
import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
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
}: SettingsListProps) {
  return (
    <Card elevated padding="md" style={styles.card}>
      <View style={styles.header}>
        <Text variant="h3">{title}</Text>
        <Text variant="muted" style={styles.headerSub}>Manage your mobile app experience</Text>
      </View>

      <View style={styles.separatorContainer}>
        <Separator />
      </View>

      {/* Row 1: Notifications */}
      <View style={styles.row}>
        <View style={styles.rowInfo}>
          <Text variant="p" style={styles.rowTitle}>Push Notifications</Text>
          <Text variant="muted" style={styles.rowDesc}>Receive updates and mentions</Text>
        </View>
        <Switch value={notifications} onValueChange={onNotificationsChange} />
      </View>

      <Separator />

      {/* Row 2: Dark Mode */}
      <View style={styles.row}>
        <View style={styles.rowInfo}>
          <Text variant="p" style={styles.rowTitle}>Dark Theme</Text>
          <Text variant="muted" style={styles.rowDesc}>Switch to midnight dark palette</Text>
        </View>
        <Switch value={darkMode} onValueChange={onDarkModeChange} />
      </View>

      <Separator />

      {/* Row 3: Biometrics */}
      <View style={styles.row}>
        <View style={styles.rowInfo}>
          <View style={styles.badgeRow}>
            <Text variant="p" style={styles.rowTitle}>Face ID / Biometrics</Text>
            <Badge variant="primary" size="sm" label="Secure" />
          </View>
          <Text variant="muted" style={styles.rowDesc}>Require authentication on launch</Text>
        </View>
        <Switch value={biometrics} onValueChange={onBiometricsChange} />
      </View>

      <Separator />

      {/* Row 4: Account Security */}
      <Pressable onPress={onAccountPress} style={styles.navRow}>
        <View>
          <Text variant="p" style={styles.rowTitle}>Account & Security</Text>
          <Text variant="muted" style={styles.rowDesc}>Password, 2FA, session tokens</Text>
        </View>
        <Text variant="muted" style={styles.chevron}>›</Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 24,
  },
  header: {
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  headerSub: {
    fontSize: 12,
    marginTop: 2,
  },
  separatorContainer: {
    marginVertical: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  rowInfo: {
    flex: 1,
    paddingRight: 12,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: "500",
  },
  rowDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  chevron: {
    fontSize: 18,
    fontWeight: "600",
  },
});
