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
      <Pressable
        onPress={onLogout}
        style={({ pressed }) => [styles.logoutBtn, pressed && styles.btnPressed]}
      >
        <Text style={styles.logoutBtnText}>Sign Out of Account</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
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
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    backgroundColor: "#FFFFFF",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#0284C7",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
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
    color: "#18181B",
  },
  proBadge: {
    borderRadius: 9999,
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#059669",
    fontFamily: "monospace",
  },
  emailText: {
    fontSize: 12,
    color: "#71717A",
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
    color: "#71717A",
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
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
    color: "#18181B",
  },
  rowDesc: {
    fontSize: 12,
    color: "#71717A",
  },
  divider: {
    height: 1,
    backgroundColor: "#F4F4F5",
  },
  logoutBtn: {
    width: "100%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    backgroundColor: "#FEF2F2",
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
    color: "#DC2626",
  },
});

