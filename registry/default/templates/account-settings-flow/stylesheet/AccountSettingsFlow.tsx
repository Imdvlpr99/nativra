/**
 * Nativra — Account Settings Flow Template (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add account-settings-flow
 */
import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
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

export function AccountSettingsFlow() {
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
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[styles.navTab, active && styles.navTabActive]}
              >
                <Text style={[styles.navTabText, active ? styles.navTabTextActive : styles.navTabTextInactive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
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
                    trackColor={{ false: "#27272a", true: "#0284c7" }}
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
                    trackColor={{ false: "#27272a", true: "#0284c7" }}
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
                <Button size="sm" variant="default" label="+ Invite" />
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
                <View style={{ flex: 1, paddingRight: 16 }}>
                  <Text style={styles.cardTitle}>Two-Factor Auth (2FA)</Text>
                  <Text style={styles.cardSubtitle}>Require TOTP code on every sign-in</Text>
                </View>
                <Switch
                  value={twoFactorEnabled}
                  onValueChange={setTwoFactorEnabled}
                  trackColor={{ false: "#27272a", true: "#10b981" }}
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
                      <TouchableOpacity style={styles.revokeBtn}>
                        <Text style={styles.revokeBtnText}>Revoke</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>

              <TouchableOpacity style={styles.signOutAllBtn}>
                <Text style={styles.signOutAllText}>Sign Out All Other Sessions</Text>
              </TouchableOpacity>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#09090b",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
  },
  avatar: {
    height: 56,
    width: 56,
    borderRadius: 16,
    backgroundColor: "#0284c7",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  headerTextCol: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "900",
    color: "#ffffff",
    marginRight: 8,
  },
  userEmail: {
    fontSize: 12,
    color: "#a1a1aa",
    marginTop: 2,
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#27272a",
    backgroundColor: "#18181b",
    padding: 4,
    marginBottom: 24,
  },
  navTab: {
    flex: 1,
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 8,
  },
  navTabActive: {
    backgroundColor: "#27272a",
  },
  navTabText: {
    fontSize: 12,
    fontWeight: "600",
  },
  navTabTextActive: {
    color: "#ffffff",
  },
  navTabTextInactive: {
    color: "#a1a1aa",
  },
  tabContent: {
    gap: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#27272a",
    backgroundColor: "#18181b",
    padding: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#a1a1aa",
    marginTop: 4,
  },
  separator: {
    marginVertical: 16,
    backgroundColor: "#27272a",
  },
  fieldGroup: {
    gap: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#a1a1aa",
    marginBottom: 4,
  },
  fieldInput: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272a",
    backgroundColor: "#09090b",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  fieldText: {
    fontSize: 14,
    color: "#d4d4d8",
  },
  fieldTextBold: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleTextCol: {
    flex: 1,
    paddingRight: 16,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
  },
  toggleSub: {
    fontSize: 12,
    color: "#a1a1aa",
  },
  progressBarBg: {
    height: 8,
    width: "100%",
    borderRadius: 9999,
    backgroundColor: "#27272a",
    overflow: "hidden",
    marginTop: 12,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 9999,
    backgroundColor: "#0284c7",
  },
  listCol: {
    gap: 12,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(39, 39, 42, 0.6)",
    backgroundColor: "rgba(9, 9, 11, 0.6)",
    padding: 12,
  },
  memberAvatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: "#27272a",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  memberAvatarText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },
  memberName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginRight: 8,
  },
  memberEmail: {
    fontSize: 12,
    color: "#a1a1aa",
  },
  revokeBtn: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(244, 63, 94, 0.3)",
    backgroundColor: "rgba(244, 63, 94, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  revokeBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fb7185",
  },
  signOutAllBtn: {
    marginTop: 16,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(244, 63, 94, 0.4)",
    backgroundColor: "rgba(244, 63, 94, 0.1)",
    paddingVertical: 12,
  },
  signOutAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fb7185",
  },
  planKicker: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#a1a1aa",
  },
  planTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#ffffff",
    marginTop: 4,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    marginTop: 8,
  },
  paymentBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272a",
    backgroundColor: "#09090b",
    padding: 12,
  },
  cardBrand: {
    height: 28,
    width: 40,
    borderRadius: 4,
    backgroundColor: "#27272a",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardBrandText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ffffff",
  },
  cardNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },
  cardExp: {
    fontSize: 10,
    color: "#a1a1aa",
  },
  invoiceId: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
  invoiceDate: {
    fontSize: 10,
    color: "#a1a1aa",
  },
  invoiceAmount: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
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

