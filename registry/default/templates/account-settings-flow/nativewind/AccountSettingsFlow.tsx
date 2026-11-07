/**
 * Nativra — Account Settings Flow Template (NativeWind)
 * @version 0.1.0
 * @target nativewind
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
} from "react-native";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Text } from "./Text";
import { Separator } from "./Separator";

export function AccountSettingsFlow() {
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
    <SafeAreaView className="flex-1 bg-zinc-950">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        {/* Header Profile Summary */}
        <View className="mb-6 flex-row items-center gap-4">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-md">
            <Text className="text-lg font-bold text-white">JD</Text>
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-xl font-black text-white">Jane Doe</Text>
              <Badge variant="outline" label="Enterprise" />
            </View>
            <Text className="text-xs text-zinc-400 mt-0.5">jane.doe@enterprise.corp</Text>
          </View>
        </View>

        {/* Section Navigation Pills */}
        <View className="mb-6 flex-row items-center rounded-2xl border border-zinc-800 bg-zinc-900 p-1">
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
                className={`flex-1 items-center rounded-xl py-2 ${
                  active ? "bg-zinc-800 shadow" : ""
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    active ? "text-white" : "text-zinc-400"
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
            <Card className="border-zinc-800 bg-zinc-900/90 p-5">
              <Text className="text-base font-bold text-white">Organization Details</Text>
              <Text className="text-xs text-zinc-400 mt-1">Manage corporate entity and timezone</Text>
              <Separator className="my-4 bg-zinc-800" />

              <View className="gap-3">
                <View>
                  <Text className="text-xs font-medium text-zinc-400 mb-1">Company Name</Text>
                  <View className="rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5">
                    <Text className="text-sm font-semibold text-white">Acme Global Technologies Ltd.</Text>
                  </View>
                </View>

                <View>
                  <Text className="text-xs font-medium text-zinc-400 mb-1">Billing Contact Email</Text>
                  <View className="rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5">
                    <Text className="text-sm text-zinc-300">finance@acme.corp</Text>
                  </View>
                </View>

                <View>
                  <Text className="text-xs font-medium text-zinc-400 mb-1">Timezone</Text>
                  <View className="rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5">
                    <Text className="text-sm text-zinc-300">UTC-05:00 (Eastern Time)</Text>
                  </View>
                </View>
              </View>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/90 p-5">
              <Text className="text-base font-bold text-white">Email Notifications</Text>
              <Separator className="my-4 bg-zinc-800" />

              <View className="gap-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1 pr-4">
                    <Text className="text-sm font-medium text-white">Product Releases</Text>
                    <Text className="text-xs text-zinc-400">Weekly digest of features</Text>
                  </View>
                  <Switch
                    value={emailAlerts}
                    onValueChange={setEmailAlerts}
                    trackColor={{ false: "#27272a", true: "#0284c7" }}
                  />
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-1 pr-4">
                    <Text className="text-sm font-medium text-white">Security Alerts</Text>
                    <Text className="text-xs text-zinc-400">Immediate notice on login attempts</Text>
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
          <View className="gap-4">
            {/* Seat Utilization Bar */}
            <Card className="border-zinc-800 bg-zinc-900/90 p-5">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-bold text-white">Team Seats</Text>
                <Badge variant="outline" label="8 / 10 Active" />
              </View>
              <View className="mt-3 h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                <View className="h-full w-4/5 rounded-full bg-sky-500" />
              </View>
              <Text className="text-xs text-zinc-400 mt-2">
                You have 2 seats remaining on your Enterprise plan.
              </Text>
            </Card>

            {/* Member List */}
            <Card className="border-zinc-800 bg-zinc-900/90 p-5">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-base font-bold text-white">Assigned Members</Text>
                <Button size="sm" variant="default" label="+ Invite" />
              </View>

              <View className="gap-3">
                {teamMembers.map((member) => (
                  <View
                    key={member.id}
                    className="flex-row items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-950/60 p-3"
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="h-9 w-9 items-center justify-center rounded-full bg-zinc-800">
                        <Text className="text-xs font-bold text-white">{member.initials}</Text>
                      </View>
                      <View>
                        <Text className="text-sm font-semibold text-white">{member.name}</Text>
                        <Text className="text-xs text-zinc-400">{member.email}</Text>
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
            <Card className="border-zinc-800 bg-zinc-900/90 p-5">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-4">
                  <Text className="text-base font-bold text-white">Two-Factor Auth (2FA)</Text>
                  <Text className="text-xs text-zinc-400 mt-1">
                    Require TOTP code on every sign-in
                  </Text>
                </View>
                <Switch
                  value={twoFactorEnabled}
                  onValueChange={setTwoFactorEnabled}
                  trackColor={{ false: "#27272a", true: "#10b981" }}
                />
              </View>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/90 p-5">
              <Text className="text-base font-bold text-white">Active Device Sessions</Text>
              <Text className="text-xs text-zinc-400 mt-1">
                Devices authorized with persistent tokens
              </Text>
              <Separator className="my-4 bg-zinc-800" />

              <View className="gap-3">
                {sessions.map((sess) => (
                  <View
                    key={sess.id}
                    className="flex-row items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-950/60 p-3"
                  >
                    <View>
                      <View className="flex-row items-center gap-2">
                        <Text className="text-sm font-semibold text-white">{sess.device}</Text>
                        {sess.isCurrent && (
                          <Badge variant="outline" label="This Device" />
                        )}
                      </View>
                      <Text className="text-xs text-zinc-400 mt-0.5">{sess.location} • {sess.active}</Text>
                    </View>
                    {!sess.isCurrent && (
                      <TouchableOpacity className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1">
                        <Text className="text-xs font-semibold text-rose-400">Revoke</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>

              <TouchableOpacity className="mt-4 items-center rounded-xl border border-rose-500/40 bg-rose-500/10 py-3">
                <Text className="text-xs font-bold text-rose-400">Sign Out All Other Sessions</Text>
              </TouchableOpacity>
            </Card>
          </View>
        )}

        {/* TAB 4: BILLING */}
        {activeTab === "billing" && (
          <View className="gap-4">
            <Card className="border-zinc-800 bg-zinc-900/90 p-5">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-xs font-medium uppercase tracking-wider text-zinc-400">Current Plan</Text>
                  <Text className="text-2xl font-black text-white mt-1">Enterprise Tier</Text>
                </View>
                <Badge variant="default" label="Active" />
              </View>
              <Text className="text-base font-bold text-white mt-2">$499.00 / month</Text>
              <Text className="text-xs text-zinc-400 mt-1">Next invoice scheduled for Dec 1, 2026</Text>
              <Separator className="my-4 bg-zinc-800" />

              <Text className="text-xs font-medium text-zinc-400 mb-2">Payment Method</Text>
              <View className="flex-row items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                <View className="flex-row items-center gap-3">
                  <View className="h-7 w-10 items-center justify-center rounded bg-zinc-800">
                    <Text className="text-[10px] font-bold text-white">VISA</Text>
                  </View>
                  <View>
                    <Text className="text-xs font-bold text-white">•••• 4242</Text>
                    <Text className="text-[10px] text-zinc-400">Expires 09/28</Text>
                  </View>
                </View>
                <Badge variant="outline" label="Default" />
              </View>
            </Card>

            <Card className="border-zinc-800 bg-zinc-900/90 p-5">
              <Text className="text-base font-bold text-white mb-3">Invoice History</Text>
              <View className="gap-2.5">
                {invoices.map((inv) => (
                  <View
                    key={inv.id}
                    className="flex-row items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-950/60 p-3"
                  >
                    <View>
                      <Text className="text-xs font-semibold text-white">{inv.id}</Text>
                      <Text className="text-[10px] text-zinc-400">{inv.date}</Text>
                    </View>
                    <View className="flex-row items-center gap-3">
                      <Text className="text-xs font-bold text-white">{inv.amount}</Text>
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

