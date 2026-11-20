/**
 * Nativra — Account Settings Flow Template (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add account-settings-flow
 */
import React, { useState } from "react";
import {
  Pressable,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Switch,
  StyleSheet,
} from "react-native";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Text } from "./Text";
import { Separator } from "./Separator";
import { themeStyle, useThemeColors, alpha, type ThemeColors, ts, sp, surface, pressedStyle } from "@/hooks/use-theme-colors";

export function AccountSettingsFlow() {
  const palette = useThemeColors();
  const styles = React.useMemo(() => createStyles(palette), [palette]);
  const [activeTab, setActiveTab] = useState<"profile" | "team" | "security" | "billing">("profile");

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const teamMembers = [
    { id: "1", name: "Jane Doe", role: "Owner", email: "jane.doe@enterprise.corp", initials: "JD", isCurrent: true },
    { id: "2", name: "Alex River", role: "Admin", email: "alex.r@enterprise.corp", initials: "AR" },
    { id: "3", name: "Carlos Gomez", role: "Billing", email: "carlos.g@enterprise.corp", initials: "CG" },
    { id: "4", name: "Elena Rostova", role: "Member", email: "elena.r@enterprise.corp", initials: "ER" },
  ];

  const sessions = [
    { id: "s1", device: "iPhone 16 Pro", location: "New York, USA", active: "Current Session", isCurrent: true },
    { id: "s2", device: "MacBook Pro 16\"", location: "New York, USA", active: "2 hours ago" },
    { id: "s3", device: "Edge on Windows", location: "Austin, USA", active: "3 days ago" },
  ];

  const invoices = [
    { id: "INV-2026-011", date: "Nov 1, 2026", amount: "$499.00", status: "Paid" },
    { id: "INV-2026-010", date: "Oct 1, 2026", amount: "$499.00", status: "Paid" },
    { id: "INV-2026-009", date: "Sep 1, 2026", amount: "$499.00", status: "Paid" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Profile Summary */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <View style={styles.headerTextCol}>
            <View style={styles.row}>
              <Text style={styles.userName}>Jane Doe</Text>
              <Badge variant="outline" label="Enterprise" />
            </View>
            <Text style={styles.userEmail}>jane.doe@enterprise.corp</Text>
          </View>
        </View>

        {/* Section Navigation Pills */}
        <View style={styles.navBar}>
          {(
            [
              { id: "profile", label: "Profile" },
              { id: "team", label: "Team" },
              { id: "security", label: "Security" },
              { id: "billing", label: "Billing" },
            ] as const
          ).map((tab) => {
            const active = activeTab === tab.id;
            return (
              <Pressable
                accessibilityRole="button"
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={({ pressed }) => [styles.navTab, active && styles.navTabActive, pressedStyle(pressed)]}
              >
                <Text style={[styles.navTabText, active ? styles.navTabTextActive : styles.navTabTextInactive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* TAB 1: PROFILE */}
        {activeTab === "profile" && (
          <View style={styles.tabContent}>
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Organization Details</Text>
              <Text style={styles.cardSubtitle}>Manage corporate entity and timezone</Text>
              <Separator style={styles.separator} />

              <View style={styles.fieldGroup}>
                <View>
                  <Text style={styles.fieldLabel}>Company Name</Text>
                  <View style={styles.fieldInput}>
                    <Text style={styles.fieldTextBold}>Acme Global Technologies Ltd.</Text>
                  </View>
                </View>

                <View>
                  <Text style={styles.fieldLabel}>Billing Contact Email</Text>
                  <View style={styles.fieldInput}>
                    <Text style={styles.fieldText}>finance@acme.corp</Text>
                  </View>
                </View>

                <View>
                  <Text style={styles.fieldLabel}>Timezone</Text>
                  <View style={styles.fieldInput}>
                    <Text style={styles.fieldText}>UTC-05:00 (Eastern Time)</Text>
                  </View>
                </View>
              </View>
            </Card>

            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Email Notifications</Text>
              <Separator style={styles.separator} />

              <View style={styles.fieldGroup}>
                <View style={styles.toggleRow}>
                  <View style={styles.toggleTextCol}>
                    <Text style={styles.toggleTitle}>Product Releases</Text>
                    <Text style={styles.toggleSub}>Weekly digest of features</Text>
                  </View>
                  <Switch
                    value={emailAlerts}
                    onValueChange={setEmailAlerts}
                    trackColor={{ false: palette.muted, true: palette.primary }}
                  />
                </View>

                <View style={styles.toggleRow}>
                  <View style={styles.toggleTextCol}>
                    <Text style={styles.toggleTitle}>Security Alerts</Text>
                    <Text style={styles.toggleSub}>Immediate notice on login attempts</Text>
                  </View>
                  <Switch
                    value={securityAlerts}
                    onValueChange={setSecurityAlerts}
                    trackColor={{ false: palette.muted, true: palette.primary }}
                  />
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* TAB 2: TEAM */}
        {activeTab === "team" && (
          <View style={styles.tabContent}>
            <Card style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardTitle}>Team Seats</Text>
                <Badge variant="outline" label="8 / 10 Active" />
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: "80%" }]} />
              </View>
              <Text style={styles.cardSubtitle}>
                You have 2 seats remaining on your Enterprise plan.
              </Text>
            </Card>

            <Card style={styles.card}>
              <View style={[styles.rowBetween, { marginBottom: 16 }]}>
                <Text style={styles.cardTitle}>Assigned Members</Text>
                <Button size="sm" variant="default">+ Invite</Button>
              </View>

              <View style={styles.listCol}>
                {teamMembers.map((member) => (
                  <View key={member.id} style={styles.memberRow}>
                    <View style={styles.row}>
                      <View style={styles.memberAvatar}>
                        <Text style={styles.memberAvatarText}>{member.initials}</Text>
                      </View>
                      <View>
                        <Text style={styles.memberName}>{member.name}</Text>
                        <Text style={styles.memberEmail}>{member.email}</Text>
                      </View>
                    </View>
                    <Badge
                      variant={member.role === "Owner" ? "default" : "secondary"}
                      label={member.role}
                    />
                  </View>
                ))}
              </View>
            </Card>
          </View>
        )}

        {/* TAB 3: SECURITY */}
        {activeTab === "security" && (
          <View style={styles.tabContent}>
            <Card style={styles.card}>
              <View style={styles.rowBetween}>
                <View style={{ flex: 1, paddingRight: sp(16) }}>
                  <Text style={styles.cardTitle}>Two-Factor Auth (2FA)</Text>
                  <Text style={styles.cardSubtitle}>Require TOTP code on every sign-in</Text>
                </View>
                <Switch
                  value={twoFactorEnabled}
                  onValueChange={setTwoFactorEnabled}
                  trackColor={{ false: palette.muted, true: palette.success }}
                />
              </View>
            </Card>

            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Active Device Sessions</Text>
              <Text style={styles.cardSubtitle}>Devices authorized with persistent tokens</Text>
              <Separator style={styles.separator} />

              <View style={styles.listCol}>
                {sessions.map((sess) => (
                  <View key={sess.id} style={styles.memberRow}>
                    <View>
                      <View style={styles.row}>
                        <Text style={styles.memberName}>{sess.device}</Text>
                        {sess.isCurrent && (
                          <Badge variant="outline" label="This Device" />
                        )}
                      </View>
                      <Text style={styles.memberEmail}>{sess.location} • {sess.active}</Text>
                    </View>
                    {!sess.isCurrent && (
                      <Pressable accessibilityRole="button" style={({ pressed }) => [styles.revokeBtn, pressedStyle(pressed)]}>
                        <Text style={styles.revokeBtnText}>Revoke</Text>
                      </Pressable>
                    )}
                  </View>
                ))}
              </View>

              <Pressable accessibilityRole="button" style={({ pressed }) => [styles.signOutAllBtn, pressedStyle(pressed)]}>
                <Text style={styles.signOutAllText}>Sign Out All Other Sessions</Text>
              </Pressable>
            </Card>
          </View>
        )}

        {/* TAB 4: BILLING */}
        {activeTab === "billing" && (
          <View style={styles.tabContent}>
            <Card style={styles.card}>
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.planKicker}>Current Plan</Text>
                  <Text style={styles.planTitle}>Enterprise Tier</Text>
                </View>
                <Badge variant="default" label="Active" />
              </View>
              <Text style={styles.planPrice}>$499.00 / month</Text>
              <Text style={styles.cardSubtitle}>Next invoice scheduled for Dec 1, 2026</Text>
              <Separator style={styles.separator} />

              <Text style={styles.fieldLabel}>Payment Method</Text>
              <View style={styles.paymentBox}>
                <View style={styles.row}>
                  <View style={styles.cardBrand}>
                    <Text style={styles.cardBrandText}>VISA</Text>
                  </View>
                  <View>
                    <Text style={styles.cardNumber}>•••• 4242</Text>
                    <Text style={styles.cardExp}>Expires 09/28</Text>
                  </View>
                </View>
                <Badge variant="outline" label="Default" />
              </View>
            </Card>

            <Card style={styles.card}>
              <Text style={[styles.cardTitle, { marginBottom: 12 }]}>Invoice History</Text>
              <View style={styles.listCol}>
                {invoices.map((inv) => (
                  <View key={inv.id} style={styles.memberRow}>
                    <View>
                      <Text style={styles.invoiceId}>{inv.id}</Text>
                      <Text style={styles.invoiceDate}>{inv.date}</Text>
                    </View>
                    <View style={styles.row}>
                      <Text style={styles.invoiceAmount}>{inv.amount}</Text>
                      <Badge variant="secondary" label={inv.status} />
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (palette: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: sp(16),
    paddingVertical: sp(24),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: sp(16),
    marginBottom: 24,
  },
  avatar: {
    height: 56,
    width: 56,
    borderRadius: themeStyle.radius.card,
    backgroundColor: palette.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: palette["primary-foreground"],
    fontSize: ts(18),
    fontWeight: themeStyle.fontWeight.title,
  },
  headerTextCol: {
    flex: 1,
  },
  userName: {
    fontSize: ts(20),
    fontWeight: themeStyle.fontWeight.heading,
    color: palette.foreground,
    marginRight: 8,
  },
  userEmail: {
    fontSize: ts(12),
    color: palette["muted-foreground"],
    marginTop: 2,
  },
  navBar: {
    ...surface(palette),
    flexDirection: "row",
    alignItems: "center",
    borderRadius: themeStyle.radius.card,
    padding: sp(4),
    marginBottom: 24,
  },
  navTab: {
    flex: 1,
    alignItems: "center",
    borderRadius: themeStyle.radius.control,
    paddingVertical: sp(8),
  },
  navTabActive: {
    backgroundColor: palette.muted,
  },
  navTabText: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.label,
  },
  navTabTextActive: {
    color: palette.foreground,
  },
  navTabTextInactive: {
    color: palette["muted-foreground"],
  },
  tabContent: {
    gap: sp(16),
  },
  card: {
    ...surface(palette),
    borderRadius: themeStyle.radius.card,
    padding: sp(20),
  },
  cardTitle: {
    fontSize: ts(16),
    fontWeight: themeStyle.fontWeight.title,
    color: palette.foreground,
  },
  cardSubtitle: {
    fontSize: ts(12),
    color: palette["muted-foreground"],
    marginTop: 4,
  },
  separator: {
    marginVertical: 16,
    backgroundColor: palette.muted,
  },
  fieldGroup: {
    gap: sp(12),
  },
  fieldLabel: {
    fontSize: ts(12),
    fontWeight: "500",
    color: palette["muted-foreground"],
    marginBottom: 4,
  },
  fieldInput: {
    borderRadius: themeStyle.radius.control,
    borderWidth: themeStyle.borderWidth,
    borderColor: palette.border,
    backgroundColor: palette.background,
    paddingHorizontal: sp(14),
    paddingVertical: sp(10),
  },
  fieldText: {
    fontSize: ts(14),
    color: palette["muted-foreground"],
  },
  fieldTextBold: {
    fontSize: ts(14),
    fontWeight: themeStyle.fontWeight.label,
    color: palette.foreground,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleTextCol: {
    flex: 1,
    paddingRight: sp(16),
  },
  toggleTitle: {
    fontSize: ts(14),
    fontWeight: "500",
    color: palette.foreground,
  },
  toggleSub: {
    fontSize: ts(12),
    color: palette["muted-foreground"],
  },
  progressBarBg: {
    height: 8,
    width: "100%",
    borderRadius: 9999,
    backgroundColor: palette.muted,
    overflow: "hidden",
    marginTop: 12,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 9999,
    backgroundColor: palette.primary,
  },
  listCol: {
    gap: sp(12),
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: themeStyle.radius.control,
    borderWidth: themeStyle.borderWidth,
    borderColor: alpha(palette.border, 0.6),
    backgroundColor: alpha(palette.background, 0.6),
    padding: sp(12),
  },
  memberAvatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: palette.muted,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  memberAvatarText: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.title,
    color: palette.foreground,
  },
  memberName: {
    fontSize: ts(14),
    fontWeight: themeStyle.fontWeight.label,
    color: palette.foreground,
    marginRight: 8,
  },
  memberEmail: {
    fontSize: ts(12),
    color: palette["muted-foreground"],
  },
  revokeBtn: {
    borderRadius: themeStyle.radius.control,
    borderWidth: themeStyle.borderWidth,
    borderColor: alpha(palette.destructive, 0.3),
    backgroundColor: alpha(palette.destructive, 0.1),
    paddingHorizontal: sp(10),
    paddingVertical: sp(4),
  },
  revokeBtnText: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.label,
    color: palette.destructive,
  },
  signOutAllBtn: {
    marginTop: 16,
    alignItems: "center",
    borderRadius: themeStyle.radius.control,
    borderWidth: themeStyle.borderWidth,
    borderColor: alpha(palette.destructive, 0.4),
    backgroundColor: alpha(palette.destructive, 0.1),
    paddingVertical: sp(12),
  },
  signOutAllText: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.title,
    color: palette.destructive,
  },
  planKicker: {
    fontSize: ts(12),
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: palette["muted-foreground"],
  },
  planTitle: {
    fontSize: ts(22),
    fontWeight: themeStyle.fontWeight.heading,
    color: palette.foreground,
    marginTop: 4,
  },
  planPrice: {
    fontSize: ts(16),
    fontWeight: themeStyle.fontWeight.title,
    color: palette.foreground,
    marginTop: 8,
  },
  paymentBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: themeStyle.radius.control,
    borderWidth: themeStyle.borderWidth,
    borderColor: palette.border,
    backgroundColor: palette.background,
    padding: sp(12),
  },
  cardBrand: {
    height: 28,
    width: 40,
    borderRadius: themeStyle.radius.small,
    backgroundColor: palette.muted,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardBrandText: {
    fontSize: ts(10),
    fontWeight: themeStyle.fontWeight.title,
    color: palette.foreground,
  },
  cardNumber: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.title,
    color: palette.foreground,
  },
  cardExp: {
    fontSize: ts(10),
    color: palette["muted-foreground"],
  },
  invoiceId: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.label,
    color: palette.foreground,
  },
  invoiceDate: {
    fontSize: ts(10),
    color: palette["muted-foreground"],
  },
  invoiceAmount: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.title,
    color: palette.foreground,
    marginRight: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

