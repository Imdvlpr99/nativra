import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, View, StyleSheet, useColorScheme, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { PREVIEW_FIXTURES, type PreviewProps } from "@nativra/preview-runtime";
import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  BottomSheet,
  Button,
  Card,
  Checkbox,
  DataTable,
  Dialog,
  Fab,
  IconButton,
  Input,
  Label,
  OtpInput,
  Progress,
  RadioGroup,
  RatingStars,
  SafeArea,
  SegmentedControl,
  Select,
  Separator,
  Skeleton,
  Slider,
  Spinner,
  Stack,
  Switch,
  Tabs,
  Text as NText,
  Textarea,
  Toast,
} from "./components/nativra";

function BottomSheetPreview(p: PreviewProps) {
  const [open, setOpen] = useState(false);
  const title = String(p.title ?? "Bottom Sheet");
  return (
    <View style={{ gap: 8 }}>
      <Button variant="outline" onPress={() => setOpen(true)}>
        {`Open ${title}`}
      </Button>
      <BottomSheet
        isOpen={open}
        onClose={() => setOpen(false)}
        title={title}
      >
        <View style={{ padding: 16 }}>
          <Text>Bottom Sheet interactive modal content</Text>
        </View>
      </BottomSheet>
    </View>
  );
}

function DialogPreview(p: PreviewProps) {
  const [open, setOpen] = useState(false);
  const title = String(p.title ?? "Dialog");
  return (
    <View style={{ gap: 8 }}>
      <Button variant="outline" onPress={() => setOpen(true)}>
        {`Open ${title}`}
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={String(p.title ?? "Confirm Action")}
        description={String(p.description ?? "")}
        onConfirm={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </View>
  );
}

// Every fixture is rendered with the exact registry source (synced via `pnpm sync`).
const RENDERERS: Record<string, (p: PreviewProps) => React.ReactElement> = {
  accordion: (p) => (
    <Accordion
      items={(p.items as any) ?? [
        { id: "1", title: "Accordion 1", content: "Details 1" },
        { id: "2", title: "Accordion 2", content: "Details 2" },
      ]}
      allowMultiple={Boolean(p.allowMultiple)}
    />
  ),
  alert: (p) => (
    <Alert
      variant={(p.variant as any) ?? "default"}
      title={String(p.title ?? "")}
      description={String(p.description ?? "")}
    />
  ),
  avatar: ({ fallback, ...p }) => <Avatar fallback={String(fallback ?? "NV")} {...(p as object)} />,
  badge: ({ label, ...p }) => <Badge label={String(label ?? "Badge")} {...(p as object)} />,
  "bottom-sheet": (p) => <BottomSheetPreview {...p} />,
  button: ({ children, ...p }) => <Button {...(p as object)}>{String(children ?? "Button")}</Button>,
  card: (p) => (
    <Card {...(p as object)}>
      <Text>Card content</Text>
    </Card>
  ),
  checkbox: ({ label, checked, ...p }) => (
    <Checkbox checked={Boolean(checked)} label={String(label ?? "")} onCheckedChange={() => {}} {...(p as object)} />
  ),
  "data-table": (p) => (
    <DataTable
      columns={(p.columns as any) ?? [{ key: "name", title: "Name" }]}
      data={(p.data as any) ?? [{ name: "Demo" }]}
    />
  ),
  dialog: (p) => <DialogPreview {...p} />,
  fab: (p) => (
    <View style={{ height: 60, width: "100%", position: "relative" }}>
      <Fab
        accessibilityLabel={String(p.label ?? "Action")}
        label={p.label ? String(p.label) : undefined}
        variant={(p.variant as any) ?? "primary"}
        style={{ position: "relative", bottom: "auto", right: "auto" }}
      />
    </View>
  ),
  "icon-button": (p) => (
    <IconButton
      accessibilityLabel="Icon Action"
      variant={(p.variant as any) ?? "default"}
      size={(p.size as any) ?? "md"}
    >
      <Text>★</Text>
    </IconButton>
  ),
  input: (p) => <Input {...(p as object)} />,
  label: ({ children, ...p }) => <Label {...(p as object)}>{String(children ?? "Label")}</Label>,
  "otp-input": (p) => (
    <OtpInput
      length={Number(p.length ?? 4)}
      value={String(p.value ?? "4821")}
      onChangeText={() => {}}
    />
  ),
  progress: (p) => (
    <Progress
      value={Number(p.value ?? 50)}
      variant={(p.variant as any) ?? "primary"}
      size={(p.size as any) ?? "md"}
      style={{ width: "100%" }}
    />
  ),
  "radio-group": (p) => (
    <RadioGroup
      options={(p.options as any) ?? [{ label: "Default Option", value: "default" }]}
      value={String(p.value ?? "default")}
      onValueChange={() => {}}
    />
  ),
  "rating-stars": (p) => (
    <RatingStars
      rating={Number(p.rating ?? 4)}
      maxStars={Number(p.maxStars ?? 5)}
      size={(p.size as any) ?? "md"}
    />
  ),
  "safe-area": (p) => (
    <SafeArea edges={(p.edges as any) ?? ["top", "bottom"]} style={{ padding: 12, backgroundColor: "#f4f4f5", borderRadius: 8 }}>
      <Text style={{ fontSize: 12, color: "#52525b" }}>SafeArea Protected Content</Text>
    </SafeArea>
  ),
  "segmented-control": (p) => (
    <SegmentedControl
      options={p.options as any}
      values={p.values as any}
      value={String(p.value ?? "day")}
      onValueChange={() => {}}
    />
  ),
  select: (p) => (
    <Select
      placeholder={String(p.placeholder ?? "Select option...")}
      options={(Array.isArray(p.options) ? p.options : []).map((o: any) => (typeof o === "string" ? { label: o, value: o } : o))}
      value={p.value ? String(p.value) : undefined}
      onValueChange={() => {}}
    />
  ),
  separator: (p) => (
    <View style={{ height: 40, width: "100%", alignItems: "center", justifyContent: "center" }}>
      <Separator {...(p as object)} />
    </View>
  ),
  skeleton: (p) => <Skeleton {...(p as object)} />,
  slider: (p) => (
    <Slider
      value={Number(p.value ?? 50)}
      min={Number(p.min ?? 0)}
      max={Number(p.max ?? 100)}
      disabled={Boolean(p.disabled)}
      style={{ width: "100%" }}
    />
  ),
  spinner: (p) => <Spinner {...(p as object)} />,
  stack: (p) => (
    <Stack direction={(p.direction as any) ?? "row"} gap={(p.gap as any) ?? "md"}>
      <Badge label="Stack Item 1" />
      <Badge label="Stack Item 2" variant="outline" />
    </Stack>
  ),
  switch: ({ value, ...p }) => <Switch value={Boolean(value)} onValueChange={() => {}} {...(p as object)} />,
  tabs: (p) => (
    <Tabs
      value={String(p.value ?? "overview")}
      onValueChange={() => {}}
      variant={(p.variant as any) ?? "pill"}
      items={(p.items as any) ?? [
        { value: "overview", label: "Overview" },
        { value: "activity", label: "Activity" },
      ]}
    />
  ),
  text: ({ children, ...p }) => <NText {...(p as object)}>{String(children ?? "")}</NText>,
  textarea: (p) => (
    <Textarea
      label={p.label ? String(p.label) : undefined}
      placeholder={p.placeholder ? String(p.placeholder) : undefined}
      rows={Number(p.rows ?? 3)}
      style={{ width: "100%" }}
    />
  ),
  toast: (p) => (
    <Toast
      title={String(p.title ?? "Notification")}
      description={String(p.description ?? p.message ?? "")}
      variant={(p.variant as any) ?? "default"}
    />
  ),
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallbackTitle?: string },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallbackTitle?: string }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Preview render error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ padding: 10, backgroundColor: "#fef2f2", borderColor: "#fecaca", borderWidth: 1, borderRadius: 8 }}>
          <Text style={{ fontSize: 12, color: "#991b1b", fontWeight: "600" }}>
            Failed to render {this.props.fallbackTitle ?? "fixture"}
          </Text>
          <Text style={{ fontSize: 11, color: "#b91c1c", marginTop: 2 }}>
            {this.state.error?.message}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const DEFAULT_WEB_INSETS = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export default function App() {
  const dark = useColorScheme() === "dark";
  const fg = dark ? "#fafafa" : "#0a0a0a";

  return (
    <SafeAreaProvider initialMetrics={DEFAULT_WEB_INSETS}>
      <SafeAreaView style={[styles.root, { backgroundColor: dark ? "#0a0a0a" : "#ffffff" }]}>
        <StatusBar style="auto" />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <Image source={require("./assets/icon.png")} style={styles.appLogo} resizeMode="contain" />
            <View>
              <Text style={[styles.h1, { color: fg }]}>Nativra Preview</Text>
              <Text style={[styles.caption, { color: dark ? "#a1a1aa" : "#71717a" }]}>Native Component Harness</Text>
            </View>
          </View>
          {Object.entries(PREVIEW_FIXTURES).map(([id, fixtures]) => (
            <View key={id} style={styles.section}>
              <Text style={[styles.h2, { color: fg }]}>{id}</Text>
              {fixtures.map((f) => (
                <View key={f.name} style={styles.fixture}>
                  <Text style={[styles.caption, { color: dark ? "#a1a1aa" : "#71717a" }]}>{f.name}</Text>
                  <ErrorBoundary fallbackTitle={`${id} (${f.name})`}>
                    {RENDERERS[id]?.(f.props)}
                  </ErrorBoundary>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, minHeight: "100%" as any },
  content: { padding: 20, gap: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 },
  appLogo: { width: 44, height: 44, borderRadius: 10 },
  h1: { fontSize: 28, fontWeight: "700" },
  h2: { fontSize: 18, fontWeight: "600", textTransform: "capitalize" },
  section: { gap: 10 },
  fixture: { gap: 4, alignItems: "flex-start", width: "100%" },
  caption: { fontSize: 11 },
});
