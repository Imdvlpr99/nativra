import "./global.css";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
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
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
      <StatusBar style="auto" />
      <ScrollView contentContainerClassName="p-6 gap-6">
        <View className="flex-row items-center justify-between">
          <Text variant="h1">Nativra</Text>
          <Badge label="NativeWind v4" variant="primary" />
        </View>

        <Text variant="lead">
          Verified source-owned React Native components running with NativeWind styling.
        </Text>

        <Card elevated padding="md" className="gap-4">
          <Text variant="h3">Interactive Controls</Text>
          
          <Input
            label="Email Address"
            placeholder="developer@example.com"
            value={email}
            onChangeText={setEmail}
          />

          <View className="flex-row items-center justify-between py-2">
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

