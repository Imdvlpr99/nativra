/**
 * Nativra — Account Settings Flow Template (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add account-settings-flow
 */
import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
} from "react-native";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Text } from "./Text";
import { Separator } from "./Separator";
import { useThemeColors } from "@/hooks/use-theme-colors";

export function AccountSettingsFlow() {
  const palette = useThemeColors();
  const [activeTab, setActiveTab] = useState<"profile" | "team" | "security" | "billing">("profile");

  // State toggles
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
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        {/* Header Profile Summary */}
        <View className="mb-6 flex-row items-center gap-4">
          <View className="h-14 w-14 items-center justify-center rounded-card bg-gradient-to-tr from-primary to-primary shadow-md">
            <Text className="text-lg font-bold text-foreground">JD</Text>
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-xl font-black text-foreground">Jane Doe</Text>
              <Badge variant="outline" label="Enterprise" />
            </View>
            <Text className="text-xs text-muted-foreground mt-0.5">jane.doe@enterprise.corp</Text>
          </View>
        </View>

        {/* Section Navigation Pills */}
        <View className="mb-6 flex-row items-center rounded-card border border-border bg-card p-1">
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
                className={`flex-1 items-center rounded-control py-2 ${
                  active ? "bg-muted shadow" : ""
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* TAB 1: PROFILE */}
        {activeTab === "profile" && (
          <View className="gap-4">
            <Card className="border-border bg-card/90 p-5">
              <Text className="text-base font-bold text-foreground">Organization Details</Text>
              <Text className="text-xs text-muted-foreground mt-1">Manage corporate entity and timezone</Text>
              <Separator className="my-4 bg-muted" />

              <View className="gap-3">
                <View>
                  <Text className="text-xs font-medium text-muted-foreground mb-1">Company Name</Text>
                  <View className="rounded-control border border-border bg-background px-3.5 py-2.5">
                    <Text className="text-sm font-semibold text-foreground">Acme Global Technologies Ltd.</Text>
                  </View>
                </View>

                <View>
                  <Text className="text-xs font-medium text-muted-foreground mb-1">Billing Contact Email</Text>
                  <View className="rounded-control border border-border bg-background px-3.5 py-2.5">
                    <Text className="text-sm text-muted-foreground">finance@acme.corp</Text>
                  </View>
                </View>

                <View>
                  <Text className="text-xs font-medium text-muted-foreground mb-1">Timezone</Text>
                  <View className="rounded-control border border-border bg-background px-3.5 py-2.5">
                    <Text className="text-sm text-muted-foreground">UTC-05:00 (Eastern Time)</Text>
                  </View>
                </View>
              </View>
            </Card>

            <Card className="border-border bg-card/90 p-5">
              <Text className="text-base font-bold text-foreground">Email Notifications</Text>
              <Separator className="my-4 bg-muted" />

              <View className="gap-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 pr-4">
                    <Text className="text-sm font-medium text-foreground">Product Releases</Text>
                    <Text className="text-xs text-muted-foreground">Weekly digest of features</Text>
                  </View>
                  <Switch
                    value={emailAlerts}
                    onValueChange={setEmailAlerts}
                    trackColor={{ false: palette.muted, true: palette.primary }}
                  />
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-1 pr-4">
                    <Text className="text-sm font-medium text-foreground">Security Alerts</Text>
                    <Text className="text-xs text-muted-foreground">Immediate notice on login attempts</Text>
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
          <View className="gap-4">
            {/* Seat Utilization Bar */}
            <Card className="border-border bg-card/90 p-5">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-bold text-foreground">Team Seats</Text>
                <Badge variant="outline" label="8 / 10 Active" />
              </View>
              <View className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
                <View className="h-full w-4/5 rounded-full bg-primary" />
              </View>
              <Text className="text-xs text-muted-foreground mt-2">
                You have 2 seats remaining on your Enterprise plan.
              </Text>
            </Card>

            {/* Member List */}
            <Card className="border-border bg-card/90 p-5">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-base font-bold text-foreground">Assigned Members</Text>
                <Button size="sm" variant="default">+ Invite</Button>
              </View>

              <View className="gap-3">
                {teamMembers.map((member) => (
                  <View
                    key={member.id}
                    className="flex-row items-center justify-between rounded-control border border-border/60 bg-background/60 p-3"
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="h-9 w-9 items-center justify-center rounded-full bg-muted">
                        <Text className="text-xs font-bold text-foreground">{member.initials}</Text>
                      </View>
                      <View>
                        <Text className="text-sm font-semibold text-foreground">{member.name}</Text>
                        <Text className="text-xs text-muted-foreground">{member.email}</Text>
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
          <View className="gap-4">
            <Card className="border-border bg-card/90 p-5">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-4">
                  <Text className="text-base font-bold text-foreground">Two-Factor Auth (2FA)</Text>
                  <Text className="text-xs text-muted-foreground mt-1">
                    Require TOTP code on every sign-in
                  </Text>
                </View>
                <Switch
                  value={twoFactorEnabled}
                  onValueChange={setTwoFactorEnabled}
                  trackColor={{ false: palette.muted, true: palette.success }}
                />
              </View>
            </Card>

            <Card className="border-border bg-card/90 p-5">
              <Text className="text-base font-bold text-foreground">Active Device Sessions</Text>
              <Text className="text-xs text-muted-foreground mt-1">
                Devices authorized with persistent tokens
              </Text>
              <Separator className="my-4 bg-muted" />

              <View className="gap-3">
                {sessions.map((sess) => (
                  <View
                    key={sess.id}
                    className="flex-row items-center justify-between rounded-control border border-border/60 bg-background/60 p-3"
                  >
                    <View>
                      <View className="flex-row items-center gap-2">
                        <Text className="text-sm font-semibold text-foreground">{sess.device}</Text>
                        {sess.isCurrent && (
                          <Badge variant="outline" label="This Device" />
                        )}
                      </View>
                      <Text className="text-xs text-muted-foreground mt-0.5">{sess.location} • {sess.active}</Text>
                    </View>
                    {!sess.isCurrent && (
                      <TouchableOpacity className="rounded-control border border-destructive/30 bg-destructive/10 px-2.5 py-1">
                        <Text className="text-xs font-semibold text-destructive">Revoke</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>

              <TouchableOpacity className="mt-4 items-center rounded-control border border-destructive/40 bg-destructive/10 py-3">
                <Text className="text-xs font-bold text-destructive">Sign Out All Other Sessions</Text>
              </TouchableOpacity>
            </Card>
          </View>
        )}

        {/* TAB 4: BILLING */}
        {activeTab === "billing" && (
          <View className="gap-4">
            <Card className="border-border bg-card/90 p-5">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Current Plan</Text>
                  <Text className="text-2xl font-black text-foreground mt-1">Enterprise Tier</Text>
                </View>
                <Badge variant="default" label="Active" />
              </View>
              <Text className="text-base font-bold text-foreground mt-2">$499.00 / month</Text>
              <Text className="text-xs text-muted-foreground mt-1">Next invoice scheduled for Dec 1, 2026</Text>
              <Separator className="my-4 bg-muted" />

              <Text className="text-xs font-medium text-muted-foreground mb-2">Payment Method</Text>
              <View className="flex-row items-center justify-between rounded-control border border-border bg-background p-3">
                <View className="flex-row items-center gap-3">
                  <View className="h-7 w-10 items-center justify-center rounded-small bg-muted">
                    <Text className="text-[10px] font-bold text-foreground">VISA</Text>
                  </View>
                  <View>
                    <Text className="text-xs font-bold text-foreground">•••• 4242</Text>
                    <Text className="text-[10px] text-muted-foreground">Expires 09/28</Text>
                  </View>
                </View>
                <Badge variant="outline" label="Default" />
              </View>
            </Card>

            <Card className="border-border bg-card/90 p-5">
              <Text className="text-base font-bold text-foreground mb-3">Invoice History</Text>
              <View className="gap-2.5">
                {invoices.map((inv) => (
                  <View
                    key={inv.id}
                    className="flex-row items-center justify-between rounded-control border border-border/60 bg-background/60 p-3"
                  >
                    <View>
                      <Text className="text-xs font-semibold text-foreground">{inv.id}</Text>
                      <Text className="text-[10px] text-muted-foreground">{inv.date}</Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                      <Text className="text-xs font-bold text-foreground">{inv.amount}</Text>
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

