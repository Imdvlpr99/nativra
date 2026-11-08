import React, { useState, useRef, useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  useColorScheme,
  Image,
  Pressable,
  TextInput,
  Platform,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PREVIEW_FIXTURES, type PreviewProps, type PreviewFixture } from "@nativra/preview-runtime";
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

// ---------------------------------------------------------------------------
// Component Metadata & Categorization
// ---------------------------------------------------------------------------

type CategoryKey = "all" | "forms" | "feedback" | "navigation" | "overlays" | "layout";

interface ComponentMeta {
  id: string;
  title: string;
  category: CategoryKey;
  categoryLabel: string;
  description: string;
}

const COMPONENT_METADATA: Record<string, ComponentMeta> = {
  button: {
    id: "button",
    title: "Button",
    category: "forms",
    categoryLabel: "Forms & Inputs",
    description: "Versatile touch button with variants, sizes, loading spinners and icon slots.",
  },
  input: {
    id: "input",
    title: "Input",
    category: "forms",
    categoryLabel: "Forms & Inputs",
    description: "Text field with floating labels, error messages, and disabled states.",
  },
  textarea: {
    id: "textarea",
    title: "Textarea",
    category: "forms",
    categoryLabel: "Forms & Inputs",
    description: "Multi-line text input with configurable rows and character bounds.",
  },
  select: {
    id: "select",
    title: "Select",
    category: "forms",
    categoryLabel: "Forms & Inputs",
    description: "Native picker and selection dropdown with modal presentation.",
  },
  checkbox: {
    id: "checkbox",
    title: "Checkbox",
    category: "forms",
    categoryLabel: "Forms & Inputs",
    description: "Accessible toggle checkbox with customizable check mark and label.",
  },
  switch: {
    id: "switch",
    title: "Switch",
    category: "forms",
    categoryLabel: "Forms & Inputs",
    description: "Smooth sliding boolean toggle switch matching iOS and Material Design.",
  },
  "radio-group": {
    id: "radio-group",
    title: "Radio Group",
    category: "forms",
    categoryLabel: "Forms & Inputs",
    description: "Single-choice selection group with accessible keyboard and touch navigation.",
  },
  slider: {
    id: "slider",
    title: "Slider",
    category: "forms",
    categoryLabel: "Forms & Inputs",
    description: "Continuous value slider for selecting numbers within a range.",
  },
  "otp-input": {
    id: "otp-input",
    title: "OTP Input",
    category: "forms",
    categoryLabel: "Forms & Inputs",
    description: "PIN code and two-factor one-time-password input with focus transitions.",
  },
  "rating-stars": {
    id: "rating-stars",
    title: "Rating Stars",
    category: "forms",
    categoryLabel: "Forms & Inputs",
    description: "Interactive 5-star rating control with full touch and tap support.",
  },
  alert: {
    id: "alert",
    title: "Alert",
    category: "feedback",
    categoryLabel: "Feedback & Status",
    description: "Callout banner for system messages, warnings, and error alerts.",
  },
  toast: {
    id: "toast",
    title: "Toast",
    category: "feedback",
    categoryLabel: "Feedback & Status",
    description: "Ephemeral floating notification toast with automatic dismissal.",
  },
  progress: {
    id: "progress",
    title: "Progress",
    category: "feedback",
    categoryLabel: "Feedback & Status",
    description: "Linear progress track with percentage progress and indeterminate states.",
  },
  spinner: {
    id: "spinner",
    title: "Spinner",
    category: "feedback",
    categoryLabel: "Feedback & Status",
    description: "Rotating activity indicator with variable size and brand colors.",
  },
  skeleton: {
    id: "skeleton",
    title: "Skeleton",
    category: "feedback",
    categoryLabel: "Feedback & Status",
    description: "Shimmer placeholder skeleton for lazy-loaded layouts and images.",
  },
  badge: {
    id: "badge",
    title: "Badge",
    category: "feedback",
    categoryLabel: "Feedback & Status",
    description: "Compact pill tag for notification counts, status, and categories.",
  },
  tabs: {
    id: "tabs",
    title: "Tabs",
    category: "navigation",
    categoryLabel: "Navigation",
    description: "Tabbed navigation bar with underline or pill active indicators.",
  },
  "segmented-control": {
    id: "segmented-control",
    title: "Segmented Control",
    category: "navigation",
    categoryLabel: "Navigation",
    description: "iOS-style segmented button switch with sliding indicator.",
  },
  accordion: {
    id: "accordion",
    title: "Accordion",
    category: "navigation",
    categoryLabel: "Navigation",
    description: "Collapsible disclosure item with animated height reveal.",
  },
  dialog: {
    id: "dialog",
    title: "Dialog",
    category: "overlays",
    categoryLabel: "Overlays",
    description: "Modal dialog overlay for high-priority user confirmations and prompts.",
  },
  "bottom-sheet": {
    id: "bottom-sheet",
    title: "Bottom Sheet",
    category: "overlays",
    categoryLabel: "Overlays",
    description: "Draggable bottom sheet modal with snap points and backdrop scrim.",
  },
  card: {
    id: "card",
    title: "Card",
    category: "layout",
    categoryLabel: "Layout & Data",
    description: "Elevated container surface with rounded corners and subtle shadows.",
  },
  avatar: {
    id: "avatar",
    title: "Avatar",
    category: "layout",
    categoryLabel: "Layout & Data",
    description: "Circular user profile image with fallback initials badge.",
  },
  "data-table": {
    id: "data-table",
    title: "Data Table",
    category: "layout",
    categoryLabel: "Layout & Data",
    description: "Structured tabular data grid with columns, rows, and borders.",
  },
  stack: {
    id: "stack",
    title: "Stack",
    category: "layout",
    categoryLabel: "Layout & Data",
    description: "Flex layout container managing horizontal or vertical element gaps.",
  },
  separator: {
    id: "separator",
    title: "Separator",
    category: "layout",
    categoryLabel: "Layout & Data",
    description: "Divider rule for demarcating content sections horizontally or vertically.",
  },
  "safe-area": {
    id: "safe-area",
    title: "Safe Area",
    category: "layout",
    categoryLabel: "Layout & Data",
    description: "Screen boundary wrapper respecting notch, status bar, and home bar.",
  },
  "icon-button": {
    id: "icon-button",
    title: "Icon Button",
    category: "layout",
    categoryLabel: "Layout & Data",
    description: "Circular or square touch target housing an icon.",
  },
  fab: {
    id: "fab",
    title: "FAB",
    category: "layout",
    categoryLabel: "Layout & Data",
    description: "Floating action button with elevated shadow and prominent icon.",
  },
  text: {
    id: "text",
    title: "Text",
    category: "layout",
    categoryLabel: "Layout & Data",
    description: "Semantic typographic text styles (h1, h2, h3, p, muted, lead).",
  },
  label: {
    id: "label",
    title: "Label",
    category: "layout",
    categoryLabel: "Layout & Data",
    description: "Form input label with required asterisk and disabled state.",
  },
};

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "all", label: "All (31)" },
  { key: "forms", label: "Forms & Inputs (10)" },
  { key: "feedback", label: "Feedback (6)" },
  { key: "navigation", label: "Navigation (3)" },
  { key: "overlays", label: "Overlays (2)" },
  { key: "layout", label: "Layout & Data (10)" },
];

// ---------------------------------------------------------------------------
// Interactive Components with Live State
// ---------------------------------------------------------------------------

function InteractiveButton(p: PreviewProps) {
  const [clicks, setClicks] = useState(0);
  const baseLabel = String(p.children ?? "Button");
  return (
    <View style={{ alignItems: "center", gap: 8 }}>
      <Button
        variant={(p.variant as any) ?? "default"}
        size={(p.size as any) ?? "md"}
        disabled={Boolean(p.disabled)}
        loading={Boolean(p.loading)}
        onPress={() => setClicks((c) => c + 1)}
      >
        {clicks > 0 ? `${baseLabel} (${clicks})` : baseLabel}
      </Button>
      {clicks > 0 && (
        <Text style={{ fontSize: 11, color: "#10b981", fontWeight: "600" }}>
          ✓ Tapped {clicks} {clicks === 1 ? "time" : "times"}
        </Text>
      )}
    </View>
  );
}

function InteractiveSwitch(p: PreviewProps) {
  const [val, setVal] = useState(Boolean(p.value));
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <Switch
        value={val}
        disabled={Boolean(p.disabled)}
        onValueChange={setVal}
      />
      <Text style={{ fontSize: 13, fontWeight: "600", color: val ? "#10b981" : "#71717a" }}>
        {val ? "Active" : "Inactive"}
      </Text>
    </View>
  );
}

function InteractiveCheckbox(p: PreviewProps) {
  const [checked, setChecked] = useState(Boolean(p.checked));
  return (
    <Checkbox
      checked={checked}
      disabled={Boolean(p.disabled)}
      label={String(p.label ?? (checked ? "Option selected" : "Option unselected"))}
      onCheckedChange={setChecked}
    />
  );
}

function InteractiveRating(p: PreviewProps) {
  const [rating, setRating] = useState(Number(p.rating ?? 4));
  const max = Number(p.maxStars ?? 5);
  return (
    <View style={{ alignItems: "center", gap: 6 }}>
      <RatingStars
        rating={rating}
        maxStars={max}
        size={(p.size as any) ?? "md"}
        onRatingChange={setRating}
      />
      <Text style={{ fontSize: 12, color: "#f59e0b", fontWeight: "600" }}>
        {rating} of {max} Stars
      </Text>
    </View>
  );
}

function InteractiveSlider(p: PreviewProps) {
  const [val, setVal] = useState(Number(p.value ?? 50));
  return (
    <View style={{ width: "100%", gap: 8 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 12, color: "#71717a" }}>Current Value</Text>
        <Text style={{ fontSize: 13, fontWeight: "700", color: "#10b981" }}>{Math.round(val)}%</Text>
      </View>
      <Slider
        value={val}
        min={Number(p.min ?? 0)}
        max={Number(p.max ?? 100)}
        disabled={Boolean(p.disabled)}
        onValueChange={setVal}
        style={{ width: "100%" }}
      />
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 8 }}>
        <Pressable
          onPress={() => setVal((v) => Math.max(0, v - 10))}
          style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6, backgroundColor: "#27272a" }}
        >
          <Text style={{ color: "#ffffff", fontSize: 11, fontWeight: "600" }}>-10%</Text>
        </Pressable>
        <Pressable
          onPress={() => setVal((v) => Math.min(100, v + 10))}
          style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6, backgroundColor: "#27272a" }}
        >
          <Text style={{ color: "#ffffff", fontSize: 11, fontWeight: "600" }}>+10%</Text>
        </Pressable>
      </View>
    </View>
  );
}

function InteractiveInput(p: PreviewProps) {
  const [text, setText] = useState(String(p.value ?? ""));
  return (
    <View style={{ width: "100%", gap: 6 }}>
      <Input
        label={p.label ? String(p.label) : undefined}
        placeholder={p.placeholder ? String(p.placeholder) : "Type text..."}
        error={Boolean(p.error)}
        errorMessage={p.errorMessage ? String(p.errorMessage) : undefined}
        disabled={Boolean(p.disabled)}
        value={text}
        onChangeText={setText}
      />
      {text.length > 0 && (
        <Text style={{ fontSize: 11, color: "#71717a", textAlign: "right" }}>
          {text.length} characters
        </Text>
      )}
    </View>
  );
}

function InteractiveTextarea(p: PreviewProps) {
  const [text, setText] = useState(String(p.value ?? ""));
  return (
    <View style={{ width: "100%", gap: 6 }}>
      <Textarea
        label={p.label ? String(p.label) : undefined}
        placeholder={p.placeholder ? String(p.placeholder) : "Enter multiline note..."}
        rows={Number(p.rows ?? 3)}
        value={text}
        onChangeText={setText}
        style={{ width: "100%" }}
      />
    </View>
  );
}

function InteractiveTabs(p: PreviewProps) {
  const items = (p.items as any) ?? [
    { value: "overview", label: "Overview" },
    { value: "activity", label: "Activity" },
    { value: "settings", label: "Settings" },
  ];
  const [active, setActive] = useState(String(p.value ?? items[0]?.value ?? "overview"));
  return (
    <View style={{ width: "100%", gap: 12 }}>
      <Tabs
        value={active}
        onValueChange={setActive}
        variant={(p.variant as any) ?? "pill"}
        items={items}
      />
      <View style={{ padding: 10, borderRadius: 8, backgroundColor: "rgba(120, 120, 128, 0.08)", alignItems: "center" }}>
        <Text style={{ fontSize: 12, color: "#71717a" }}>
          Active Tab: <Text style={{ fontWeight: "700", color: "#10b981" }}>{active.toUpperCase()}</Text>
        </Text>
      </View>
    </View>
  );
}

function InteractiveSegmentedControl(p: PreviewProps) {
  const options = (p.options as any) ?? ["Day", "Week", "Month", "Year"];
  const values = (p.values as any) ?? ["day", "week", "month", "year"];
  const [val, setVal] = useState(String(p.value ?? values[0]));
  return (
    <View style={{ width: "100%", gap: 10 }}>
      <SegmentedControl
        options={options}
        values={values}
        value={val}
        onValueChange={setVal}
      />
      <Text style={{ fontSize: 11, textAlign: "center", color: "#71717a" }}>
        Selected timeframe: <Text style={{ fontWeight: "700", color: "#10b981" }}>{val.toUpperCase()}</Text>
      </Text>
    </View>
  );
}

function InteractiveSelect(p: PreviewProps) {
  const rawOpts = Array.isArray(p.options) ? p.options : ["React Native", "Expo SDK 52", "TypeScript", "Tailwind CSS"];
  const options = rawOpts.map((o: any) => (typeof o === "string" ? { label: o, value: o } : o));
  const [val, setVal] = useState(p.value ? String(p.value) : undefined);
  return (
    <View style={{ width: "100%", gap: 8 }}>
      <Select
        placeholder={String(p.placeholder ?? "Choose framework option...")}
        options={options}
        value={val}
        onValueChange={setVal}
      />
      {val && (
        <Text style={{ fontSize: 11, color: "#10b981", textAlign: "right", fontWeight: "600" }}>
          ✓ Selected: {val}
        </Text>
      )}
    </View>
  );
}

function InteractiveRadioGroup(p: PreviewProps) {
  const options = (p.options as any) ?? [
    { label: "Community Free", value: "free" },
    { label: "Pro Cloud ($19/mo)", value: "pro" },
    { label: "Enterprise Custom", value: "enterprise" },
  ];
  const [val, setVal] = useState(String(p.value ?? options[0].value));
  return (
    <RadioGroup
      options={options}
      value={val}
      onValueChange={setVal}
    />
  );
}

function InteractiveOtpInput(p: PreviewProps) {
  const [code, setCode] = useState(String(p.value ?? "4821"));
  return (
    <View style={{ alignItems: "center", gap: 10, width: "100%" }}>
      <OtpInput
        length={Number(p.length ?? 4)}
        value={code}
        onChangeText={setCode}
      />
      <Text style={{ fontSize: 11, color: "#71717a" }}>
        Entered Code: <Text style={{ fontWeight: "700", color: "#10b981" }}>{code || "----"}</Text>
      </Text>
    </View>
  );
}

function InteractiveBottomSheet(p: PreviewProps) {
  const [open, setOpen] = useState(false);
  const title = String(p.title ?? "Bottom Sheet Details");
  return (
    <View style={{ gap: 8, alignItems: "center", width: "100%" }}>
      <Button variant="outline" onPress={() => setOpen(true)}>
        {`Open ${title}`}
      </Button>
      <BottomSheet
        isOpen={open}
        onClose={() => setOpen(false)}
        title={title}
      >
        <View style={{ padding: 20, gap: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: "700" }}>Native Bottom Sheet Modal</Text>
          <Text style={{ fontSize: 13, color: "#71717a" }}>
            This modal supports gestures, backdrop dismissal, and smooth spring transitions.
          </Text>
          <Button variant="primary" onPress={() => setOpen(false)}>
            Close Sheet
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
}

function InteractiveDialog(p: PreviewProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const title = String(p.title ?? "Confirm Action");
  return (
    <View style={{ gap: 8, alignItems: "center", width: "100%" }}>
      <Button variant="outline" onPress={() => setOpen(true)}>
        {`Open ${title}`}
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={String(p.description ?? "Are you sure you want to proceed with this operation?")}
        onConfirm={() => {
          setOpen(false);
          setStatus("Confirmed");
        }}
        onCancel={() => {
          setOpen(false);
          setStatus("Cancelled");
        }}
      />
      {status && (
        <Text style={{ fontSize: 11, color: status === "Confirmed" ? "#10b981" : "#ef4444" }}>
          Last action: {status}
        </Text>
      )}
    </View>
  );
}

function InteractiveToast(p: PreviewProps) {
  const [visible, setVisible] = useState(true);
  return (
    <View style={{ width: "100%", gap: 8 }}>
      {visible ? (
        <Toast
          title={String(p.title ?? "Update Successful")}
          description={String(p.description ?? p.message ?? "All component changes were applied cleanly.")}
          variant={(p.variant as any) ?? "default"}
          onDismiss={() => setVisible(false)}
        />
      ) : (
        <Button variant="outline" size="sm" onPress={() => setVisible(true)}>
          Show Toast
        </Button>
      )}
    </View>
  );
}

function InteractiveProgress(p: PreviewProps) {
  const [val, setVal] = useState(Number(p.value ?? 60));
  return (
    <View style={{ width: "100%", gap: 8 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 12, color: "#71717a" }}>Task Completion</Text>
        <Text style={{ fontSize: 12, fontWeight: "700", color: "#10b981" }}>{val}%</Text>
      </View>
      <Progress
        value={val}
        variant={(p.variant as any) ?? "primary"}
        size={(p.size as any) ?? "md"}
        style={{ width: "100%" }}
      />
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 8 }}>
        <Pressable
          onPress={() => setVal((v) => Math.max(0, v - 15))}
          style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: "#27272a" }}
        >
          <Text style={{ color: "#ffffff", fontSize: 11, fontWeight: "600" }}>-15%</Text>
        </Pressable>
        <Pressable
          onPress={() => setVal((v) => Math.min(100, v + 15))}
          style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: "#27272a" }}
        >
          <Text style={{ color: "#ffffff", fontSize: 11, fontWeight: "600" }}>+15%</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Renderers Registry
// ---------------------------------------------------------------------------

const RENDERERS: Record<string, (p: PreviewProps) => React.ReactElement> = {
  accordion: (p) => (
    <Accordion
      items={(p.items as any) ?? [
        { id: "1", title: "What is Nativra?", content: "Nativra is a clean copy-paste React Native component registry." },
        { id: "2", title: "Does it support Expo?", content: "Yes! Full Expo SDK 52 and React Native CLI compatibility." },
      ]}
      allowMultiple={Boolean(p.allowMultiple)}
    />
  ),
  alert: (p) => (
    <Alert
      variant={(p.variant as any) ?? "default"}
      title={String(p.title ?? "System Alert")}
      description={String(p.description ?? "Please review your configuration settings.")}
    />
  ),
  avatar: ({ fallback, ...p }) => (
    <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
      <Avatar fallback={String(fallback ?? "NV")} size={(p.size as any) ?? "md"} {...(p as object)} />
      <Avatar fallback="JD" size="sm" />
      <Avatar fallback="AG" size="lg" />
    </View>
  ),
  badge: ({ label, ...p }) => (
    <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
      <Badge label={String(label ?? "New")} variant={(p.variant as any) ?? "default"} />
      <Badge label="Primary" variant="primary" />
      <Badge label="Secondary" variant="secondary" />
      <Badge label="Error" variant="destructive" />
      <Badge label="Outline" variant="outline" />
    </View>
  ),
  "bottom-sheet": (p) => <InteractiveBottomSheet {...p} />,
  button: (p) => <InteractiveButton {...p} />,
  card: (p) => (
    <Card elevated={Boolean(p.elevated !== false)} style={{ width: "100%", padding: 16 }}>
      <Text style={{ fontSize: 15, fontWeight: "700", marginBottom: 4 }}>Native Card Container</Text>
      <Text style={{ fontSize: 13, color: "#71717a", marginBottom: 12 }}>
        Modular surface container with responsive corner radius and depth styling.
      </Text>
      <Button variant="primary" size="sm">Explore Card</Button>
    </Card>
  ),
  checkbox: (p) => <InteractiveCheckbox {...p} />,
  "data-table": (p) => (
    <DataTable
      columns={(p.columns as any) ?? [
        { key: "name", title: "Component" },
        { key: "category", title: "Type" },
        { key: "status", title: "Status" },
      ]}
      data={(p.data as any) ?? [
        { name: "Button", category: "Form", status: "Stable" },
        { name: "Dialog", category: "Overlay", status: "Stable" },
        { name: "Tabs", category: "Navigation", status: "Verified" },
      ]}
    />
  ),
  dialog: (p) => <InteractiveDialog {...p} />,
  fab: (p) => (
    <View style={{ height: 60, width: "100%", position: "relative", justifyContent: "center", alignItems: "center" }}>
      <Fab
        accessibilityLabel={String(p.label ?? "Action")}
        label={p.label ? String(p.label) : "Create"}
        variant={(p.variant as any) ?? "primary"}
        style={{ position: "relative", bottom: "auto", right: "auto" }}
      />
    </View>
  ),
  "icon-button": (p) => (
    <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
      <IconButton accessibilityLabel="Star action" variant="default" size="md">
        <Text style={{ fontSize: 16, color: "#ffffff" }}>★</Text>
      </IconButton>
      <IconButton accessibilityLabel="Heart action" variant="primary" size="md">
        <Text style={{ fontSize: 16, color: "#ffffff" }}>♥</Text>
      </IconButton>
      <IconButton accessibilityLabel="Outline action" variant="outline" size="md">
        <Text style={{ fontSize: 16 }}>✦</Text>
      </IconButton>
    </View>
  ),
  input: (p) => <InteractiveInput {...p} />,
  label: ({ children, ...p }) => (
    <View style={{ gap: 6, width: "100%" }}>
      <Label {...(p as object)}>{String(children ?? "Required Field")}</Label>
      <Text style={{ fontSize: 12, color: "#71717a" }}>Subordinate helper annotation below label</Text>
    </View>
  ),
  "otp-input": (p) => <InteractiveOtpInput {...p} />,
  progress: (p) => <InteractiveProgress {...p} />,
  "radio-group": (p) => <InteractiveRadioGroup {...p} />,
  "rating-stars": (p) => <InteractiveRating {...p} />,
  "safe-area": (p) => (
    <SafeArea edges={(p.edges as any) ?? ["top", "bottom"]} style={{ padding: 14, backgroundColor: "rgba(16, 185, 129, 0.08)", borderColor: "#10b981", borderWidth: 1, borderRadius: 8, width: "100%" }}>
      <Text style={{ fontSize: 12, color: "#10b981", fontWeight: "600" }}>✓ SafeArea Inset Protected Content</Text>
      <Text style={{ fontSize: 11, color: "#71717a", marginTop: 2 }}>Adapts dynamically to device status bar, notch and home pill.</Text>
    </SafeArea>
  ),
  "segmented-control": (p) => <InteractiveSegmentedControl {...p} />,
  select: (p) => <InteractiveSelect {...p} />,
  separator: (p) => (
    <View style={{ height: 36, width: "100%", justifyContent: "center" }}>
      <Separator {...(p as object)} />
    </View>
  ),
  skeleton: (p) => (
    <View style={{ gap: 8, width: "100%" }}>
      <Skeleton width="100%" height={18} />
      <Skeleton width="75%" height={14} />
      <Skeleton width="50%" height={14} />
    </View>
  ),
  slider: (p) => <InteractiveSlider {...p} />,
  spinner: (p) => (
    <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </View>
  ),
  stack: (p) => (
    <Stack direction={(p.direction as any) ?? "row"} gap={(p.gap as any) ?? "md"}>
      <Badge label="Item Alpha" />
      <Badge label="Item Beta" variant="primary" />
      <Badge label="Item Gamma" variant="outline" />
    </Stack>
  ),
  switch: (p) => <InteractiveSwitch {...p} />,
  tabs: (p) => <InteractiveTabs {...p} />,
  text: ({ children, ...p }) => <NText {...(p as object)}>{String(children ?? "Typography Preview Sample")}</NText>,
  textarea: (p) => <InteractiveTextarea {...p} />,
  toast: (p) => <InteractiveToast {...p} />,
};

// ---------------------------------------------------------------------------
// Error Boundary
// ---------------------------------------------------------------------------

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
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Failed to render {this.props.fallbackTitle ?? "fixture"}</Text>
          <Text style={styles.errorMessage}>{this.state.error?.message}</Text>
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

// ---------------------------------------------------------------------------
// Main Application
// ---------------------------------------------------------------------------

export default function App() {
  const systemDark = useColorScheme() === "dark";
  const [themePreference, setThemePreference] = useState<"system" | "dark" | "light">("system");
  const isDark = themePreference === "system" ? systemDark : themePreference === "dark";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryKey>("all");
  const [activeFixtures, setActiveFixtures] = useState<Record<string, number>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"phone" | "grid">(Platform.OS === "web" ? "phone" : "phone");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  // Theme Palette Tokens
  const theme = useMemo(() => {
    if (isDark) {
      return {
        bg: "#09090b",
        topBarBg: "#0f0f13",
        topBarBorder: "#27272a",
        cardBg: "#121215",
        cardBorder: "#27272a",
        stageBg: "#18181b",
        stageBorder: "#2e2e34",
        textPrimary: "#fafafa",
        textSecondary: "#a1a1aa",
        textMuted: "#71717a",
        accent: "#10b981",
        accentSubtle: "rgba(16, 185, 129, 0.15)",
        pillBg: "#1c1c22",
        pillActiveBg: "#10b981",
        pillActiveText: "#ffffff",
        shellBorder: "#27272a",
      };
    }
    return {
      bg: "#f8fafc",
      topBarBg: "#ffffff",
      topBarBorder: "#e2e8f0",
      cardBg: "#ffffff",
      cardBorder: "#e2e8f0",
      stageBg: "#f8fafc",
      stageBorder: "#e2e8f0",
      textPrimary: "#0f172a",
      textSecondary: "#475569",
      textMuted: "#94a3b8",
      accent: "#059669",
      accentSubtle: "rgba(5, 150, 105, 0.12)",
      pillBg: "#e2e8f0",
      pillActiveBg: "#0f172a",
      pillActiveText: "#ffffff",
      shellBorder: "#cbd5e1",
    };
  }, [isDark]);

  // Copy CLI command helper
  const handleCopy = (id: string) => {
    const cmd = `npx nativra-cli add ${id}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(cmd);
    }
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2200);
  };

  // Filter components list
  const filteredComponents = useMemo(() => {
    const list = Object.keys(RENDERERS);
    return list.filter((id) => {
      const meta = COMPONENT_METADATA[id] ?? {
        id,
        title: id,
        category: "layout" as CategoryKey,
        categoryLabel: "Other",
        description: "",
      };

      // Category filter
      if (category !== "all" && meta.category !== category) {
        return false;
      }

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          meta.id.toLowerCase().includes(q) ||
          meta.title.toLowerCase().includes(q) ||
          meta.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, category]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    setShowScrollTop(y > 350);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const renderContent = () => (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={[
        styles.scrollContent,
        viewMode === "grid" && styles.gridScrollContent,
      ]}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
    >
      {/* Mobile Inline Header (visible inside phone screen or native mobile app) */}
      <View style={styles.heroSection}>
        <View style={styles.brandRow}>
          <Image
            source={require("./assets/icon.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>Nativra</Text>
              <View style={[styles.badgePill, { backgroundColor: theme.accentSubtle }]}>
                <View style={[styles.statusDot, { backgroundColor: theme.accent }]} />
                <Text style={[styles.badgeText, { color: theme.accent }]}>Native Runtime</Text>
              </View>
            </View>
            <Text style={[styles.brandSubtitle, { color: theme.textSecondary }]}>
              Copy-paste React Native components for Expo & RN CLI
            </Text>
          </View>
        </View>

        {/* Search Input Bar */}
        <View style={[styles.searchContainer, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
          <Text style={{ fontSize: 15, marginRight: 8 }}>🔍</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search 31 native components..."
            placeholderTextColor={theme.textMuted}
            style={[styles.searchInput, { color: theme.textPrimary }]}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")} style={styles.clearSearchBtn}>
              <Text style={{ fontSize: 12, color: theme.textMuted }}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const active = category === cat.key;
            return (
              <Pressable
                key={cat.key}
                onPress={() => setCategory(cat.key)}
                style={[
                  styles.categoryPill,
                  { backgroundColor: active ? theme.pillActiveBg : theme.pillBg },
                ]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    { color: active ? theme.pillActiveText : theme.textSecondary },
                  ]}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Result Counter */}
        <View style={styles.counterRow}>
          <Text style={[styles.counterText, { color: theme.textMuted }]}>
            Showing <Text style={{ color: theme.textPrimary, fontWeight: "700" }}>{filteredComponents.length}</Text> of{" "}
            {Object.keys(RENDERERS).length} components
          </Text>
        </View>
      </View>

      {/* Components Gallery */}
      <View style={[styles.cardsContainer, viewMode === "grid" && styles.gridCardsContainer]}>
        {filteredComponents.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>🔍</Text>
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>No components found</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
              No component matches your search query "{search}". Try searching for button, input, or card.
            </Text>
            <Pressable
              onPress={() => {
                setSearch("");
                setCategory("all");
              }}
              style={[styles.resetBtn, { backgroundColor: theme.accent }]}
            >
              <Text style={{ color: "#ffffff", fontWeight: "600", fontSize: 13 }}>Reset Filters</Text>
            </Pressable>
          </View>
        ) : (
          filteredComponents.map((id) => {
            const meta = COMPONENT_METADATA[id] ?? {
              id,
              title: id.replace(/-/g, " "),
              category: "layout" as CategoryKey,
              categoryLabel: "Component",
              description: "Interactive React Native component",
            };
            const fixtures: PreviewFixture[] = PREVIEW_FIXTURES[id] ?? [{ name: "Default", props: {} }];
            const activeIndex = activeFixtures[id] ?? 0;
            const currentFixture = fixtures[activeIndex] ?? fixtures[0];
            const isCopied = copiedId === id;

            return (
              <View
                key={id}
                style={[
                  styles.componentCard,
                  { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
                  viewMode === "grid" && styles.gridCardItem,
                ]}
              >
                {/* Card Header */}
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>{meta.title}</Text>
                      <View style={[styles.tagPill, { backgroundColor: theme.pillBg }]}>
                        <Text style={[styles.tagText, { color: theme.textSecondary }]}>
                          {meta.categoryLabel}
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.cardDescription, { color: theme.textMuted }]}>
                      {meta.description}
                    </Text>
                  </View>

                  {/* Copy CLI Button */}
                  <Pressable
                    onPress={() => handleCopy(id)}
                    style={[
                      styles.copyBtn,
                      {
                        backgroundColor: isCopied ? theme.accentSubtle : theme.pillBg,
                        borderColor: isCopied ? theme.accent : theme.cardBorder,
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 12 }}>{isCopied ? "✓" : "📋"}</Text>
                    <Text
                      style={[
                        styles.copyBtnText,
                        { color: isCopied ? theme.accent : theme.textSecondary },
                      ]}
                    >
                      {isCopied ? "Copied!" : `add ${id}`}
                    </Text>
                  </Pressable>
                </View>

                {/* Fixture Selector Pills */}
                {fixtures.length > 1 && (
                  <View style={styles.fixtureTabsWrap}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={styles.fixtureTabsRow}>
                        {fixtures.map((f, idx) => {
                          const isSelected = activeIndex === idx;
                          return (
                            <Pressable
                              key={f.name}
                              onPress={() =>
                                setActiveFixtures((prev) => ({
                                  ...prev,
                                  [id]: idx,
                                }))
                              }
                              style={[
                                styles.fixturePill,
                                {
                                  backgroundColor: isSelected ? theme.pillActiveBg : "transparent",
                                  borderColor: isSelected ? theme.pillActiveBg : theme.cardBorder,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.fixturePillText,
                                  { color: isSelected ? theme.pillActiveText : theme.textMuted },
                                ]}
                              >
                                {f.name}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </ScrollView>
                  </View>
                )}

                {/* Interactive Stage */}
                <View
                  style={[
                    styles.previewStage,
                    { backgroundColor: theme.stageBg, borderColor: theme.stageBorder },
                  ]}
                >
                  <ErrorBoundary fallbackTitle={`${meta.title} (${currentFixture.name})`}>
                    {RENDERERS[id]?.(currentFixture.props)}
                  </ErrorBoundary>
                </View>

                {/* Card Footer Caption */}
                <View style={styles.cardFooter}>
                  <Text style={[styles.footerText, { color: theme.textMuted }]}>
                    Fixture: <Text style={{ color: theme.textSecondary, fontWeight: "600" }}>{currentFixture.name}</Text>
                  </Text>
                  <Text style={[styles.footerCli, { color: theme.textMuted }]}>
                    npx nativra-cli add {id}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Footer Info */}
      <View style={styles.appFooter}>
        <Text style={[styles.footerBrand, { color: theme.textSecondary }]}>
          Nativra — Open Source React Native Component Registry
        </Text>
        <Text style={[styles.footerSub, { color: theme.textMuted }]}>
          Run on iOS, Android, and Web • Built with React Native & Expo SDK 52
        </Text>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaProvider initialMetrics={DEFAULT_WEB_INSETS}>
      <SafeAreaView style={[styles.root, { backgroundColor: theme.bg }]}>
        <StatusBar style={isDark ? "light" : "dark"} />

        {/* Web Top Navigation Toolbar */}
        {Platform.OS === "web" && (
          <View style={[styles.webTopBar, { backgroundColor: theme.topBarBg, borderColor: theme.topBarBorder }]}>
            <View style={styles.webTopBarInner}>
              <View style={styles.webTopLeft}>
                <Image source={require("./assets/icon.png")} style={{ width: 30, height: 30, borderRadius: 8 }} resizeMode="contain" />
                <Text style={[styles.webTopTitle, { color: theme.textPrimary }]}>Nativra Preview</Text>
                <View style={[styles.badgePill, { backgroundColor: theme.accentSubtle }]}>
                  <View style={[styles.statusDot, { backgroundColor: theme.accent }]} />
                  <Text style={[styles.badgeText, { color: theme.accent }]}>Expo 52</Text>
                </View>
              </View>

              <View style={styles.webTopRight}>
                {/* Viewport Switcher */}
                <View style={styles.segmentedRow}>
                  <Pressable
                    onPress={() => setViewMode("phone")}
                    style={[
                      styles.segmentItem,
                      viewMode === "phone" && [styles.segmentActive, { backgroundColor: theme.pillActiveBg }],
                    ]}
                  >
                    <Text style={[styles.segmentText, { color: viewMode === "phone" ? theme.pillActiveText : theme.textSecondary }]}>
                      📱 Phone Frame
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setViewMode("grid")}
                    style={[
                      styles.segmentItem,
                      viewMode === "grid" && [styles.segmentActive, { backgroundColor: theme.pillActiveBg }],
                    ]}
                  >
                    <Text style={[styles.segmentText, { color: viewMode === "grid" ? theme.pillActiveText : theme.textSecondary }]}>
                      💻 Wide View
                    </Text>
                  </Pressable>
                </View>

                {/* Theme Switcher */}
                <View style={styles.segmentedRow}>
                  <Pressable
                    onPress={() => setThemePreference("dark")}
                    style={[
                      styles.segmentItem,
                      themePreference === "dark" && [styles.segmentActive, { backgroundColor: theme.pillActiveBg }],
                    ]}
                  >
                    <Text style={[styles.segmentText, { color: themePreference === "dark" ? theme.pillActiveText : theme.textSecondary }]}>
                      🌙 Dark
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setThemePreference("light")}
                    style={[
                      styles.segmentItem,
                      themePreference === "light" && [styles.segmentActive, { backgroundColor: theme.pillActiveBg }],
                    ]}
                  >
                    <Text style={[styles.segmentText, { color: themePreference === "light" ? theme.pillActiveText : theme.textSecondary }]}>
                      ☀️ Light
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setThemePreference("system")}
                    style={[
                      styles.segmentItem,
                      themePreference === "system" && [styles.segmentActive, { backgroundColor: theme.pillActiveBg }],
                    ]}
                  >
                    <Text style={[styles.segmentText, { color: themePreference === "system" ? theme.pillActiveText : theme.textSecondary }]}>
                      ⚙ Auto
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Content Shell */}
        {Platform.OS === "web" && viewMode === "phone" ? (
          <View style={styles.webContainer}>
            <View style={[styles.phoneShell, { borderColor: theme.shellBorder, backgroundColor: theme.bg }]}>
              {/* iPhone Dynamic Island & Status Bar */}
              <View style={styles.phoneHeaderBar}>
                <Text style={[styles.phoneClockText, { color: theme.textPrimary }]}>9:41</Text>
                <View style={styles.dynamicIsland}>
                  <View style={styles.cameraLens} />
                </View>
                <View style={styles.phoneStatusIcons}>
                  <Text style={[styles.phoneIconText, { color: theme.textPrimary }]}>5G</Text>
                  <View style={[styles.batteryPill, { borderColor: theme.textPrimary }]}>
                    <View style={[styles.batteryFill, { backgroundColor: theme.textPrimary }]} />
                  </View>
                </View>
              </View>

              {/* Inner Mobile Screen */}
              <View style={styles.phoneScreen}>{renderContent()}</View>

              {/* Bottom Home Indicator */}
              <View style={styles.homeIndicatorWrap}>
                <View style={[styles.homeIndicator, { backgroundColor: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)" }]} />
              </View>
            </View>
          </View>
        ) : (
          /* Wide View or Native Mobile App */
          <View style={{ flex: 1 }}>{renderContent()}</View>
        )}

        {/* Floating Copied Toast Pill */}
        {copiedId && (
          <View style={[styles.floatingToast, { backgroundColor: "#10b981" }]}>
            <Text style={styles.floatingToastText}>✓ Copied to clipboard: npx nativra-cli add {copiedId}</Text>
          </View>
        )}

        {/* Floating Scroll-to-Top Button */}
        {showScrollTop && (
          <Pressable
            onPress={scrollToTop}
            style={[styles.floatingScrollTop, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}
          >
            <Text style={{ fontSize: 16, color: theme.textPrimary }}>↑</Text>
          </Pressable>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ---------------------------------------------------------------------------
// Stylesheet
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
    minHeight: "100%" as any,
  },
  webTopBar: {
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 100,
  },
  webTopBarInner: {
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  webTopLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  webTopTitle: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  webTopRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  webContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  phoneShell: {
    width: "100%",
    maxWidth: 412,
    height: "88vh" as any,
    maxHeight: 880,
    borderRadius: 48,
    borderWidth: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.35,
    shadowRadius: 36,
    elevation: 24,
    flexDirection: "column",
  },
  phoneHeaderBar: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 10,
  },
  phoneClockText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  dynamicIsland: {
    width: 108,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraLens: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#1e1e24",
    alignSelf: "flex-end",
    marginRight: 12,
  },
  phoneStatusIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  phoneIconText: {
    fontSize: 11,
    fontWeight: "700",
  },
  batteryPill: {
    width: 20,
    height: 10,
    borderWidth: 1,
    borderRadius: 3,
    padding: 1,
  },
  batteryFill: {
    width: "75%",
    height: "100%",
    borderRadius: 1.5,
  },
  phoneScreen: {
    flex: 1,
    overflow: "hidden",
  },
  homeIndicatorWrap: {
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: 100,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 60,
  },
  gridScrollContent: {
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  heroSection: {
    gap: 14,
    marginBottom: 18,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  logoImage: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  badgePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  brandSubtitle: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  segmentedRow: {
    flexDirection: "row",
    backgroundColor: "rgba(120, 120, 128, 0.12)",
    borderRadius: 10,
    padding: 2,
    gap: 2,
  },
  segmentItem: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  segmentActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  segmentText: {
    fontSize: 11,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    height: "100%",
  },
  clearSearchBtn: {
    padding: 6,
  },
  categoryScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 100,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  counterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  counterText: {
    fontSize: 12,
  },
  cardsContainer: {
    gap: 16,
  },
  gridCardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  componentCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  gridCardItem: {
    width: "48.8%",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "600",
  },
  cardDescription: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  copyBtnText: {
    fontSize: 11,
    fontWeight: "600",
  },
  fixtureTabsWrap: {
    marginTop: -4,
  },
  fixtureTabsRow: {
    flexDirection: "row",
    gap: 6,
  },
  fixturePill: {
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  fixturePillText: {
    fontSize: 11,
    fontWeight: "600",
  },
  previewStage: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(120, 120, 128, 0.15)",
    paddingTop: 10,
  },
  footerText: {
    fontSize: 11,
  },
  footerCli: {
    fontSize: 10,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center" as any,
    gap: 8,
    width: "100%",
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: "center",
    maxWidth: 320,
    lineHeight: 18,
  },
  resetBtn: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  appFooter: {
    alignItems: "center",
    gap: 4,
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(120, 120, 128, 0.15)",
  },
  footerBrand: {
    fontSize: 12,
    fontWeight: "600",
  },
  footerSub: {
    fontSize: 11,
  },
  errorBox: {
    padding: 12,
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    borderWidth: 1,
    borderRadius: 8,
    width: "100%",
  },
  errorTitle: {
    fontSize: 12,
    color: "#991b1b",
    fontWeight: "700",
  },
  errorMessage: {
    fontSize: 11,
    color: "#b91c1c",
    marginTop: 3,
  },
  floatingToast: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 999,
  },
  floatingToastText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  floatingScrollTop: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 998,
  },
});
