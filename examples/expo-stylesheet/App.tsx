import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Avatar } from "./components/ui/Avatar";
import { Badge } from "./components/ui/Badge";
import { Button } from "./components/ui/Button";
import { Card } from "./components/ui/Card";
import { Checkbox } from "./components/ui/Checkbox";
import { Input } from "./components/ui/Input";
import { Separator } from "./components/ui/Separator";
import { Skeleton } from "./components/ui/Skeleton";
import { Spinner } from "./components/ui/Spinner";
import { Switch } from "./components/ui/Switch";
import { Text } from "./components/ui/Text";

type Tab = "form" | "buttons" | "feedback" | "typography";

export default function App() {
  const isDark = useColorScheme() === "dark";
  const [activeTab, setActiveTab] = useState<Tab>("form");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Submitted: ${email || "no email provided"}`);
    }, 1000);
  };

  return (
    <SafeAreaView
      style={[
        styles.root,
        { backgroundColor: isDark ? "#09090b" : "#f4f4f5" },
      ]}
    >
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Bar */}
        <View style={styles.header}>
          <View style={styles.headerBrand}>
            <Avatar fallback="NV" size="md" />
            <View>
              <Text variant="h3">Nativra</Text>
              <Text variant="muted">React Native & Expo UI</Text>
            </View>
          </View>
          <Badge label="StyleSheet" variant="primary" />
        </View>

        {/* Tab Pills */}
        <View
          style={[
            styles.tabBar,
            { backgroundColor: isDark ? "#18181b" : "#e4e4e7" },
          ]}
        >
          {(
            [
              { id: "form", label: "Form" },
              { id: "buttons", label: "Buttons" },
              { id: "feedback", label: "Feedback" },
              { id: "typography", label: "Type" },
            ] as const
          ).map((t) => (
            <TouchableOpacity
              key={t.id}
              onPress={() => setActiveTab(t.id)}
              style={[
                styles.tabItem,
                activeTab === t.id && [
                  styles.tabItemActive,
                  { backgroundColor: isDark ? "#27272a" : "#ffffff" },
                ],
              ]}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: activeTab === t.id ? "700" : "500",
                  color:
                    activeTab === t.id
                      ? isDark
                        ? "#fafafa"
                        : "#09090b"
                      : isDark
                      ? "#a1a1aa"
                      : "#71717a",
                }}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab 1: Form & Controls */}
        {activeTab === "form" && (
          <Card elevated padding="md" style={styles.card}>
            <View style={{ gap: 2 }}>
              <Text variant="h3">Interactive Controls</Text>
              <Text variant="muted">Native inputs, switches, and checkboxes</Text>
            </View>

            <Input
              label="Email Address"
              placeholder="developer@example.com"
              value={email}
              onChangeText={setEmail}
            />

            <View style={styles.row}>
              <View>
                <Text variant="p">Push Notifications</Text>
                <Text variant="muted">Receive alerts on your device</Text>
              </View>
              <Switch value={notifications} onValueChange={setNotifications} />
            </View>

            <Checkbox
              label="I accept terms and conditions"
              checked={agreed}
              onCheckedChange={setAgreed}
            />

            <Separator />

            <Button
              variant="default"
              size="lg"
              loading={isSubmitting}
              onPress={handleSubmit}
            >
              {isSubmitting ? "Submitting..." : "Submit Form"}
            </Button>
          </Card>
        )}

        {/* Tab 2: Buttons & Actions */}
        {activeTab === "buttons" && (
          <Card elevated padding="md" style={styles.card}>
            <Text variant="h3">Button Variants & Sizes</Text>
            <Text variant="muted">Configurable variants, sizes, and loading state</Text>

            <Button variant="default">Default Button</Button>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>

            <Separator />

            <Text variant="h4">Button Sizes</Text>
            <View style={styles.buttonSizesRow}>
              <Button size="sm" variant="primary">Small</Button>
              <Button size="md" variant="primary">Medium</Button>
              <Button size="lg" variant="primary">Large</Button>
            </View>
          </Card>
        )}

        {/* Tab 3: Feedback & Badges */}
        {activeTab === "feedback" && (
          <Card elevated padding="md" style={styles.card}>
            <Text variant="h3">Status, Badges & Loaders</Text>

            <Text variant="h4">Badges</Text>
            <View style={styles.badgeRow}>
              <Badge label="Default" variant="default" />
              <Badge label="Primary" variant="primary" />
              <Badge label="Secondary" variant="secondary" />
              <Badge label="Destructive" variant="destructive" />
              <Badge label="Outline" variant="outline" />
            </View>

            <Separator />

            <Text variant="h4">Loading Spinners</Text>
            <View style={styles.spinnerRow}>
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </View>

            <Separator />

            <Text variant="h4">Skeleton Placeholders</Text>
            <View style={{ gap: 8 }}>
              <Skeleton width={180} height={18} radius="sm" />
              <Skeleton width="100%" height={56} radius="md" />
            </View>

            <Separator />

            <Text variant="h4">Avatars</Text>
            <View style={styles.avatarRow}>
              <Avatar fallback="SM" size="sm" />
              <Avatar fallback="MD" size="md" />
              <Avatar fallback="LG" size="lg" />
            </View>
          </Card>
        )}

        {/* Tab 4: Typography Scale */}
        {activeTab === "typography" && (
          <Card elevated padding="md" style={styles.card}>
            <Text variant="h3">Typography Scale</Text>
            <Separator />
            <Text variant="h1">Heading 1</Text>
            <Text variant="h2">Heading 2</Text>
            <Text variant="h3">Heading 3</Text>
            <Text variant="h4">Heading 4</Text>
            <Text variant="lead">Lead paragraph copy for intro sections.</Text>
            <Text variant="p">Standard body text paragraph for mobile interfaces.</Text>
            <Text variant="muted">Muted secondary helper text.</Text>
            <Text variant="code">console.log(&quot;Nativra UI&quot;);</Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    padding: 20,
    gap: 20,
    paddingBottom: 48,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    paddingBottom: 16,
  },
  headerBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  tabBar: {
    flexDirection: "row",
    gap: 6,
    padding: 4,
    borderRadius: 12,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 6,
    alignItems: "center",
    borderRadius: 8,
  },
  tabItemActive: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  card: {
    gap: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  buttonSizesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  spinnerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
