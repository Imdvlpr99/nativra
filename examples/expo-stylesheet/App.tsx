import React, { useState } from "react";
import { SafeAreaView, ScrollView, View, StyleSheet, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Button } from "./components/ui/Button";
import { Card } from "./components/ui/Card";
import { Input } from "./components/ui/Input";
import { Badge } from "./components/ui/Badge";
import { Separator } from "./components/ui/Separator";
import { Text } from "./components/ui/Text";
import { Switch } from "./components/ui/Switch";
import { Checkbox } from "./components/ui/Checkbox";

export default function App() {
  const isDark = useColorScheme() === "dark";
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: isDark ? "#09090b" : "#ffffff" }]}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text variant="h1">Nativra</Text>
          <Badge label="StyleSheet" variant="primary" />
        </View>

        <Text variant="lead">
          Verified source-owned React Native components running with native StyleSheet styling.
        </Text>

        <Card elevated padding="md" style={styles.card}>
          <Text variant="h3">Interactive Controls</Text>

          <Input
            label="Email Address"
            placeholder="developer@example.com"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.row}>
            <Text variant="p">Enable push notifications</Text>
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
            onPress={() => alert(`Submitted: ${email}`)}
          >
            Submit Form
          </Button>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    padding: 24,
    gap: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  card: {
    gap: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
});

