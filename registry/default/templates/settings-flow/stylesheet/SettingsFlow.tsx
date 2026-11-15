import * as React from "react";
import {
  View,
  Text,
  Switch,
  Pressable,
  ScrollView,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { themeStyle, useThemeColors, alpha, type ThemeColors, elevation } from "@/hooks/use-theme-colors";

export interface SettingsFlowProps {
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SettingsFlow({
  userName = "Sophia Martinez",
  userEmail = "sophia@nativra.dev",
  onLogout,
  style,
}: SettingsFlowProps) {
  const palette = useThemeColors();
  const styles = React.useMemo(() => createStyles(palette), [palette]);
  const [pushEnabled, setPushEnabled] = React.useState(true);
  const [biometrics, setBiometrics] = React.useState(true);
  const [haptics, setHaptics] = React.useState(true);
  const [offlineSync, setOfflineSync] = React.useState(false);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={[styles.container, style]}
    >
      {/* User Profile Card Header */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>SM</Text>
        </View>

        <View style={styles.profileMeta}>
          <View style={styles.nameRow}>
            <Text style={styles.nameText}>{userName}</Text>
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          </View>
          <Text style={styles.emailText}>{userEmail}</Text>
        </View>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowMeta}>
              <Text style={styles.rowTitle}>Push Notifications</Text>
              <Text style={styles.rowDesc}>Receive activity pings and release alerts</Text>
            </View>
            <Switch value={pushEnabled} onValueChange={setPushEnabled} />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowMeta}>
              <Text style={styles.rowTitle}>Biometric Login</Text>
              <Text style={styles.rowDesc}>Face ID / Fingerprint fast unlock</Text>
            </View>
            <Switch value={biometrics} onValueChange={setBiometrics} />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowMeta}>
              <Text style={styles.rowTitle}>Platform Haptics</Text>
              <Text style={styles.rowDesc}>Tactile feedback on button presses</Text>
            </View>
            <Switch value={haptics} onValueChange={setHaptics} />
          </View>
        </View>
      </View>

      {/* Storage & Sync Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage & Sync</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowMeta}>
              <Text style={styles.rowTitle}>Offline Local-First Cache</Text>
              <Text style={styles.rowDesc}>Cache full registry items locally</Text>
            </View>
            <Switch value={offlineSync} onValueChange={setOfflineSync} />
          </View>
        </View>
      </View>

      {/* Danger Zone Sign Out */}
      <Pressable accessibilityRole="button"
        onPress={onLogout}
        style={({ pressed }) => [styles.logoutBtn, pressed && styles.btnPressed]}
      >
        <Text style={styles.logoutBtnText}>Sign Out of Account</Text>
      </Pressable>
    </ScrollView>
  );
}

const createStyles = (palette: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 48,
    gap: 24,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderRadius: themeStyle.radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.card,
    padding: 20,
    ...elevation("card"),
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: themeStyle.radius.card,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: palette["primary-foreground"],
    fontSize: 18,
    fontWeight: "800",
  },
  profileMeta: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "700",
    color: palette.foreground,
  },
  proBadge: {
    borderRadius: 9999,
    backgroundColor: alpha(palette.success, 0.15),
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: palette.success,
    fontFamily: "monospace",
  },
  emailText: {
    fontSize: 12,
    color: palette["muted-foreground"],
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    paddingHorizontal: 4,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: palette["muted-foreground"],
  },
  card: {
    borderRadius: themeStyle.radius.card,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    ...elevation("card"),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  rowMeta: {
    flex: 1,
    gap: 2,
    paddingRight: 12,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.foreground,
  },
  rowDesc: {
    fontSize: 12,
    color: palette["muted-foreground"],
  },
  divider: {
    height: 1,
    backgroundColor: palette.muted,
  },
  logoutBtn: {
    width: "100%",
    borderRadius: themeStyle.radius.card,
    borderWidth: 1,
    borderColor: alpha(palette.destructive, 0.3),
    backgroundColor: alpha(palette.destructive, 0.1),
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPressed: {
    opacity: 0.8,
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: palette.destructive,
  },
});

