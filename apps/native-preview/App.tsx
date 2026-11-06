import React from "react";
import { SafeAreaView, ScrollView, Text, View, StyleSheet, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { PREVIEW_FIXTURES, type PreviewProps } from "@nativra/preview-runtime";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Label,
  Separator,
  Skeleton,
  Spinner,
  Switch,
  Text as NText,
} from "./components/nativra";

// Every fixture is rendered with the exact registry source (synced via `pnpm sync`).
const RENDERERS: Record<string, (p: PreviewProps) => React.ReactElement> = {
  button: ({ children, ...p }) => <Button {...(p as object)}>{String(children ?? "Button")}</Button>,
  badge: ({ label, ...p }) => <Badge label={String(label ?? "Badge")} {...(p as object)} />,
  input: (p) => <Input {...(p as object)} />,
  card: (p) => (
    <Card {...(p as object)}>
      <Text>Card content</Text>
    </Card>
  ),
  separator: (p) => (
    <View style={{ height: 40, width: "100%", alignItems: "center", justifyContent: "center" }}>
      <Separator {...(p as object)} />
    </View>
  ),
  text: ({ children, ...p }) => <NText {...(p as object)}>{String(children ?? "")}</NText>,
  label: ({ children, ...p }) => <Label {...(p as object)}>{String(children ?? "Label")}</Label>,
  checkbox: ({ label, checked, ...p }) => (
    <Checkbox checked={Boolean(checked)} label={String(label ?? "")} onCheckedChange={() => {}} {...(p as object)} />
  ),
  switch: ({ value, ...p }) => <Switch value={Boolean(value)} onValueChange={() => {}} {...(p as object)} />,
  skeleton: (p) => <Skeleton {...(p as object)} />,
  spinner: (p) => <Spinner {...(p as object)} />,
  avatar: ({ fallback, ...p }) => <Avatar fallback={String(fallback ?? "NV")} {...(p as object)} />,
};

export default function App() {
  const dark = useColorScheme() === "dark";
  const fg = dark ? "#fafafa" : "#0a0a0a";

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: dark ? "#0a0a0a" : "#ffffff" }]}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.h1, { color: fg }]}>Nativra Preview</Text>
        {Object.entries(PREVIEW_FIXTURES).map(([id, fixtures]) => (
          <View key={id} style={styles.section}>
            <Text style={[styles.h2, { color: fg }]}>{id}</Text>
            {fixtures.map((f) => (
              <View key={f.name} style={styles.fixture}>
                <Text style={[styles.caption, { color: dark ? "#a1a1aa" : "#71717a" }]}>{f.name}</Text>
                {RENDERERS[id]?.(f.props)}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 20, gap: 16 },
  h1: { fontSize: 28, fontWeight: "700" },
  h2: { fontSize: 18, fontWeight: "600", textTransform: "capitalize" },
  section: { gap: 10 },
  fixture: { gap: 4, alignItems: "flex-start" },
  caption: { fontSize: 11 },
});
