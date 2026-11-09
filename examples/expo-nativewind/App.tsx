import "./global.css";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, View, TouchableOpacity } from "react-native";
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
    <SafeAreaView className="flex-1 bg-zinc-50 dark:bg-zinc-950">
      <StatusBar style="auto" />
      <ScrollView contentContainerClassName="p-5 gap-5 pb-12">
        {/* Header Bar */}
        <View className="flex-row items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <View className="flex-row items-center gap-3">
            <Avatar fallback="NV" size="md" />
            <View>
              <Text variant="h3">Nativra</Text>
              <Text variant="muted">React Native & Expo UI</Text>
            </View>
          </View>
          <Badge label="NativeWind v4" variant="primary" />
        </View>

        {/* Tab Pills */}
        <View className="flex-row gap-1.5 p-1 bg-zinc-200/60 dark:bg-zinc-900 rounded-xl">
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
              className={`flex-1 py-1.5 items-center rounded-lg ${
                activeTab === t.id
                  ? "bg-white dark:bg-zinc-800 shadow-xs"
                  : "bg-transparent"
              }`}
            >
              <Text
                className={`text-xs ${
                  activeTab === t.id
                    ? "font-bold text-zinc-900 dark:text-zinc-50"
                    : "font-medium text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab 1: Form & Controls */}
        {activeTab === "form" && (
          <Card elevated padding="md" className="gap-4">
            <View>
              <Text variant="h3">Interactive Controls</Text>
              <Text variant="muted">Native inputs, switches, and checkboxes</Text>
            </View>

            <Input
              label="Email Address"
              placeholder="developer@example.com"
              value={email}
              onChangeText={setEmail}
            />

            <View className="flex-row items-center justify-between py-2 border-y border-zinc-100 dark:border-zinc-800">
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
          <Card elevated padding="md" className="gap-3">
            <Text variant="h3">Button Variants & Sizes</Text>
            <Text variant="muted">Configurable variants, sizes, and loading state</Text>

            <Button variant="default">Default Button</Button>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>

            <Separator className="my-2" />

            <Text variant="h4">Button Sizes</Text>
            <View className="flex-row items-center gap-2">
              <Button size="sm" variant="primary">Small</Button>
              <Button size="md" variant="primary">Medium</Button>
              <Button size="lg" variant="primary">Large</Button>
            </View>
          </Card>
        )}

        {/* Tab 3: Feedback & Badges */}
        {activeTab === "feedback" && (
          <Card elevated padding="md" className="gap-4">
            <Text variant="h3">Status, Badges & Loaders</Text>

            <Text variant="h4">Badges</Text>
            <View className="flex-row flex-wrap gap-2">
              <Badge label="Default" variant="default" />
              <Badge label="Primary" variant="primary" />
              <Badge label="Secondary" variant="secondary" />
              <Badge label="Destructive" variant="destructive" />
              <Badge label="Outline" variant="outline" />
            </View>

            <Separator />

            <Text variant="h4">Loading Spinners</Text>
            <View className="flex-row items-center gap-4">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </View>

            <Separator />

            <Text variant="h4">Skeleton Placeholders</Text>
            <View className="gap-2">
              <Skeleton width={180} height={18} radius="sm" />
              <Skeleton width="100%" height={56} radius="md" />
            </View>

            <Separator />

            <Text variant="h4">Avatars</Text>
            <View className="flex-row items-center gap-3">
              <Avatar fallback="SM" size="sm" />
              <Avatar fallback="MD" size="md" />
              <Avatar fallback="LG" size="lg" />
            </View>
          </Card>
        )}

        {/* Tab 4: Typography Scale */}
        {activeTab === "typography" && (
          <Card elevated padding="md" className="gap-3">
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
