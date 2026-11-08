import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { RegistryItemSchema, RegistryManifestSchema } from "@nativra/registry-schema";
import type { RegistryItem, RegistryManifest } from "@nativra/registry-schema";
import {
  DISABLED_CONTROL,
  LOADING_CONTROL,
  SIZE_CONTROL,
  VARIANT_CONTROL,
  type Control,
  type SelectControl,
} from "@nativra/studio-schema";

const BUILT_REGISTRY = resolve(process.cwd(), "../../dist/registry");

export async function getManifest(): Promise<RegistryManifest> {
  const raw = await readFile(join(BUILT_REGISTRY, "registry.json"), "utf8");
  return RegistryManifestSchema.parse(JSON.parse(raw));
}

export async function getItem(id: string): Promise<RegistryItem> {
  const raw = await readFile(join(BUILT_REGISTRY, "items", `${id}.json`), "utf8");
  return RegistryItemSchema.parse(JSON.parse(raw));
}

const BADGE_VARIANT: SelectControl = {
  ...VARIANT_CONTROL,
  options: VARIANT_CONTROL.options.filter((o) => ["default", "primary", "secondary", "destructive", "outline"].includes(o.value)),
};

/** Editable controls are explicit per item — Studio never infers props from TSX. */
export const STUDIO_CONTROLS: Record<string, Control[]> = {
  button: [VARIANT_CONTROL, SIZE_CONTROL, DISABLED_CONTROL, LOADING_CONTROL, { type: "text", label: "Label", propKey: "children", defaultValue: "Button" }],
  badge: [
    BADGE_VARIANT,
    { ...SIZE_CONTROL, options: SIZE_CONTROL.options.filter((o) => ["sm", "md", "lg"].includes(o.value)) },
    { type: "text", label: "Label", propKey: "label", defaultValue: "Badge" },
  ],
  input: [
    { type: "text", label: "Label", propKey: "label", defaultValue: "Email" },
    { type: "text", label: "Placeholder", propKey: "placeholder", defaultValue: "you@example.com" },
    { type: "boolean", label: "Error", propKey: "error", defaultValue: false },
    { type: "text", label: "Error message", propKey: "errorMessage", defaultValue: "Invalid email" },
    DISABLED_CONTROL,
  ],
  card: [
    { type: "boolean", label: "Elevated", propKey: "elevated", defaultValue: false },
    {
      type: "select", label: "Padding", propKey: "padding", defaultValue: "md",
      options: [{ label: "SM", value: "sm" }, { label: "MD", value: "md" }, { label: "LG", value: "lg" }],
    },
  ],
  separator: [
    {
      type: "select", label: "Orientation", propKey: "orientation", defaultValue: "horizontal",
      options: [{ label: "Horizontal", value: "horizontal" }, { label: "Vertical", value: "vertical" }],
    },
  ],
  text: [
    {
      type: "select", label: "Variant", propKey: "variant", defaultValue: "p",
      options: [
        { label: "H1", value: "h1" },
        { label: "H2", value: "h2" },
        { label: "H3", value: "h3" },
        { label: "Paragraph", value: "p" },
        { label: "Lead", value: "lead" },
        { label: "Muted", value: "muted" },
        { label: "Code", value: "code" },
      ],
    },
    { type: "text", label: "Text", propKey: "children", defaultValue: "The quick brown fox jumps over the lazy dog." },
  ],
  label: [
    { type: "text", label: "Label", propKey: "children", defaultValue: "Email address" },
    { type: "boolean", label: "Required", propKey: "required", defaultValue: true },
    DISABLED_CONTROL,
  ],
  checkbox: [
    { type: "boolean", label: "Checked", propKey: "checked", defaultValue: true },
    { type: "text", label: "Label", propKey: "label", defaultValue: "I agree to the Terms of Service" },
    DISABLED_CONTROL,
  ],
  switch: [
    { type: "boolean", label: "Value", propKey: "value", defaultValue: true },
    DISABLED_CONTROL,
  ],
  skeleton: [
    {
      type: "select", label: "Radius", propKey: "radius", defaultValue: "md",
      options: [
        { label: "None", value: "none" },
        { label: "SM", value: "sm" },
        { label: "MD", value: "md" },
        { label: "LG", value: "lg" },
        { label: "Full", value: "full" },
      ],
    },
    { type: "text", label: "Width", propKey: "width", defaultValue: "180" },
    { type: "text", label: "Height", propKey: "height", defaultValue: "24" },
  ],
  spinner: [
    {
      type: "select", label: "Size", propKey: "size", defaultValue: "md",
      options: [
        { label: "SM", value: "sm" },
        { label: "MD", value: "md" },
        { label: "LG", value: "lg" },
      ],
    },
  ],
  avatar: [
    { type: "text", label: "Fallback", propKey: "fallback", defaultValue: "NV" },
    {
      type: "select", label: "Size", propKey: "size", defaultValue: "md",
      options: [
        { label: "SM", value: "sm" },
        { label: "MD", value: "md" },
        { label: "LG", value: "lg" },
        { label: "XL", value: "xl" },
      ],
    },
  ],
  "empty-state": [
    { type: "text", label: "Title", propKey: "title", defaultValue: "No Projects Found" },
    { type: "text", label: "Description", propKey: "description", defaultValue: "You have not created any mobile projects yet. Tap below to begin." },
    { type: "text", label: "Action Label", propKey: "actionLabel", defaultValue: "Create Project" },
    { type: "boolean", label: "Show Action", propKey: "showAction", defaultValue: true },
  ],
  "login-form": [
    { type: "text", label: "Title", propKey: "title", defaultValue: "Welcome back" },
    { type: "text", label: "Subtitle", propKey: "subtitle", defaultValue: "Enter your credentials to access your account" },
    { type: "text", label: "Button Label", propKey: "submitLabel", defaultValue: "Sign In" },
    LOADING_CONTROL,
    DISABLED_CONTROL,
  ],
  "user-profile": [
    { type: "text", label: "Name", propKey: "name", defaultValue: "Sophia Martinez" },
    { type: "text", label: "Handle", propKey: "handle", defaultValue: "@sophiam" },
    { type: "text", label: "Bio", propKey: "bio", defaultValue: "Senior Mobile Engineer building design systems & fluid React Native mobile apps." },
    { type: "boolean", label: "Verified", propKey: "verified", defaultValue: true },
    { type: "boolean", label: "Following", propKey: "isFollowing", defaultValue: false },
  ],
  "settings-list": [
    { type: "text", label: "Group Title", propKey: "title", defaultValue: "Preferences" },
    { type: "boolean", label: "Notifications", propKey: "notifications", defaultValue: true },
    { type: "boolean", label: "Dark Theme", propKey: "darkMode", defaultValue: false },
    { type: "boolean", label: "Biometrics", propKey: "biometrics", defaultValue: true },
  ],
  "pricing-card": [
    { type: "text", label: "Plan Name", propKey: "planName", defaultValue: "Pro Mobile" },
    { type: "text", label: "Price", propKey: "price", defaultValue: "$19" },
    { type: "text", label: "Period", propKey: "period", defaultValue: "/ month, billed yearly" },
    { type: "boolean", label: "Popular Badge", propKey: "popular", defaultValue: true },
    { type: "text", label: "Button Text", propKey: "buttonText", defaultValue: "Start 14-Day Free Trial" },
  ],
  "metric-card": [
    { type: "text", label: "Metric Title", propKey: "title", defaultValue: "Monthly Active Users" },
    { type: "text", label: "Value", propKey: "value", defaultValue: "48,290" },
    { type: "text", label: "Change", propKey: "change", defaultValue: "+24.8%" },
    { type: "boolean", label: "Positive", propKey: "positive", defaultValue: true },
    { type: "text", label: "Timeframe", propKey: "timeframe", defaultValue: "vs last month" },
  ],
  "use-disclosure": [
    { type: "boolean", label: "Open by Default", propKey: "defaultIsOpen", defaultValue: false },
    { type: "text", label: "Trigger Text", propKey: "triggerLabel", defaultValue: "Open Sheet" },
    { type: "text", label: "Sheet Title", propKey: "sheetTitle", defaultValue: "Interactive Sheet" },
  ],
  alert: [
    {
      type: "select",
      label: "Variant",
      propKey: "variant",
      defaultValue: "info",
      options: [
        { label: "Default", value: "default" },
        { label: "Info", value: "info" },
        { label: "Success", value: "success" },
        { label: "Warning", value: "warning" },
        { label: "Destructive", value: "destructive" },
      ],
    },
    { type: "text", label: "Title", propKey: "title", defaultValue: "Update Available" },
    { type: "text", label: "Description", propKey: "description", defaultValue: "A new version of Nativra mobile UI is ready to install." },
    { type: "boolean", label: "Dismissible", propKey: "dismissible", defaultValue: true },
  ],
  progress: [
    { type: "text", label: "Value (0-100)", propKey: "value", defaultValue: "65" },
    {
      type: "select",
      label: "Size",
      propKey: "size",
      defaultValue: "md",
      options: [
        { label: "SM", value: "sm" },
        { label: "MD", value: "md" },
        { label: "LG", value: "lg" },
      ],
    },
    {
      type: "select",
      label: "Variant",
      propKey: "variant",
      defaultValue: "primary",
      options: [
        { label: "Default", value: "default" },
        { label: "Primary", value: "primary" },
        { label: "Success", value: "success" },
        { label: "Destructive", value: "destructive" },
      ],
    },
  ],
  slider: [
    { type: "text", label: "Value", propKey: "value", defaultValue: "50" },
    { type: "text", label: "Min", propKey: "min", defaultValue: "0" },
    { type: "text", label: "Max", propKey: "max", defaultValue: "100" },
    DISABLED_CONTROL,
  ],
  tabs: [
    {
      type: "select",
      label: "Variant",
      propKey: "variant",
      defaultValue: "pill",
      options: [
        { label: "Pill", value: "pill" },
        { label: "Underline", value: "underline" },
      ],
    },
    {
      type: "select",
      label: "Active Tab",
      propKey: "value",
      defaultValue: "overview",
      options: [
        { label: "Overview", value: "overview" },
        { label: "Activity", value: "activity" },
        { label: "Settings", value: "settings" },
      ],
    },
  ],
  "order-summary": [
    { type: "text", label: "Order Number", propKey: "orderNumber", defaultValue: "#NV-88219" },
    { type: "text", label: "Subtotal", propKey: "subtotal", defaultValue: "$108.00" },
    { type: "text", label: "Discount", propKey: "discount", defaultValue: "-$20.00" },
    { type: "text", label: "Voucher Code", propKey: "voucherCode", defaultValue: "LAUNCH50" },
    { type: "text", label: "Total Due", propKey: "total", defaultValue: "$96.80" },
    { type: "text", label: "Button Label", propKey: "buttonLabel", defaultValue: "Proceed to Payment" },
  ],
  "notification-item": [
    { type: "text", label: "Sender Name", propKey: "senderName", defaultValue: "Marcus Vance" },
    { type: "text", label: "Action Text", propKey: "actionText", defaultValue: "requested feedback on" },
    { type: "text", label: "Target Resource", propKey: "targetResource", defaultValue: "Design System Spec" },
    { type: "text", label: "Time Ago", propKey: "timeAgo", defaultValue: "12m ago" },
    { type: "boolean", label: "Unread", propKey: "unread", defaultValue: true },
    { type: "text", label: "Category", propKey: "category", defaultValue: "Workspace" },
  ],
  "stat-progress-card": [
    { type: "text", label: "Goal Title", propKey: "goalTitle", defaultValue: "Weekly Workout Goal" },
    { type: "text", label: "Current Value", propKey: "currentValue", defaultValue: "4" },
    { type: "text", label: "Target Value", propKey: "targetValue", defaultValue: "5 sessions" },
    { type: "text", label: "Progress %", propKey: "progressPercent", defaultValue: "80" },
    { type: "text", label: "Streak Days", propKey: "streakDays", defaultValue: "14" },
  ],
  "icon-button": [
    VARIANT_CONTROL,
    SIZE_CONTROL,
    DISABLED_CONTROL,
    LOADING_CONTROL,
  ],
  fab: [
    {
      type: "select",
      label: "Variant",
      propKey: "variant",
      defaultValue: "primary",
      options: [
        { label: "Primary", value: "primary" },
        { label: "Secondary", value: "secondary" },
        { label: "Accent", value: "accent" },
      ],
    },
    {
      type: "select",
      label: "Size",
      propKey: "size",
      defaultValue: "md",
      options: [
        { label: "SM", value: "sm" },
        { label: "MD", value: "md" },
        { label: "LG", value: "lg" },
      ],
    },
    {
      type: "select",
      label: "Position",
      propKey: "position",
      defaultValue: "bottom-right",
      options: [
        { label: "Bottom Right", value: "bottom-right" },
        { label: "Bottom Left", value: "bottom-left" },
        { label: "Bottom Center", value: "bottom-center" },
      ],
    },
    { type: "text", label: "Optional Label", propKey: "label", defaultValue: "" },
    DISABLED_CONTROL,
  ],
  "otp-input": [
    { type: "text", label: "Digits Length", propKey: "length", defaultValue: "6" },
    { type: "boolean", label: "Error State", propKey: "error", defaultValue: false },
    { type: "boolean", label: "Masked (Pin)", propKey: "secureTextEntry", defaultValue: false },
    DISABLED_CONTROL,
  ],
  "bottom-sheet": [
    { type: "text", label: "Sheet Title", propKey: "title", defaultValue: "Quick Sheet Actions" },
  ],
  stack: [
    {
      type: "select",
      label: "Direction",
      propKey: "direction",
      defaultValue: "column",
      options: [
        { label: "Column (VStack)", value: "column" },
        { label: "Row (HStack)", value: "row" },
      ],
    },
    {
      type: "select",
      label: "Align",
      propKey: "align",
      defaultValue: "stretch",
      options: [
        { label: "Start", value: "start" },
        { label: "Center", value: "center" },
        { label: "End", value: "end" },
        { label: "Stretch", value: "stretch" },
      ],
    },
    {
      type: "select",
      label: "Gap",
      propKey: "gap",
      defaultValue: "md",
      options: [
        { label: "None", value: "none" },
        { label: "SM", value: "sm" },
        { label: "MD", value: "md" },
        { label: "LG", value: "lg" },
        { label: "XL", value: "xl" },
      ],
    },
  ],
  "safe-area": [
    { type: "text", label: "Background", propKey: "backgroundColor", defaultValue: "#ffffff" },
  ],
  "auth-flow": [
    { type: "text", label: "App Name", propKey: "appName", defaultValue: "Nativra App" },
    {
      type: "select",
      label: "Initial Step",
      propKey: "initialStep",
      defaultValue: "login",
      options: [
        { label: "Login", value: "login" },
        { label: "Sign Up", value: "signup" },
        { label: "Forgot Password", value: "forgot" },
        { label: "Verify OTP", value: "otp" },
      ],
    },
  ],
  "onboarding-flow": [],
  "settings-flow": [
    { type: "text", label: "User Name", propKey: "userName", defaultValue: "Sophia Martinez" },
    { type: "text", label: "User Email", propKey: "userEmail", defaultValue: "sophia@nativra.dev" },
  ],
  accordion: [
    { type: "boolean", label: "Allow Multiple", propKey: "allowMultiple", defaultValue: false },
  ],
  "data-table": [
    { type: "boolean", label: "Striped Rows", propKey: "striped", defaultValue: false },
  ],
  dialog: [
    { type: "text", label: "Title", propKey: "title", defaultValue: "Delete Item" },
    { type: "text", label: "Description", propKey: "description", defaultValue: "Are you sure you want to delete this record?" },
    { type: "boolean", label: "Destructive", propKey: "destructive", defaultValue: false },
  ],
  "radio-group": [
    {
      type: "select",
      label: "Selected Option",
      propKey: "value",
      defaultValue: "personal",
      options: [
        { label: "Personal Plan", value: "personal" },
        { label: "Team Plan", value: "team" },
        { label: "Enterprise Plan", value: "enterprise" },
      ],
    },
    DISABLED_CONTROL,
  ],
  "rating-stars": [
    { type: "slider", label: "Rating", propKey: "rating", defaultValue: 4, min: 1, max: 5, step: 1 },
    {
      type: "select",
      label: "Size",
      propKey: "size",
      defaultValue: "md",
      options: [
        { label: "SM", value: "sm" },
        { label: "MD", value: "md" },
        { label: "LG", value: "lg" },
      ],
    },
    { type: "boolean", label: "Read Only", propKey: "readOnly", defaultValue: false },
  ],
  "segmented-control": [
    {
      type: "select",
      label: "Timeframe",
      propKey: "value",
      defaultValue: "week",
      options: [
        { label: "Day", value: "day" },
        { label: "Week", value: "week" },
        { label: "Month", value: "month" },
      ],
    },
    DISABLED_CONTROL,
  ],
  select: [
    { type: "text", label: "Label", propKey: "label", defaultValue: "Country" },
    { type: "text", label: "Placeholder", propKey: "placeholder", defaultValue: "Select an option..." },
    DISABLED_CONTROL,
  ],
  textarea: [
    { type: "text", label: "Label", propKey: "label", defaultValue: "Bio / Feedback" },
    { type: "text", label: "Placeholder", propKey: "placeholder", defaultValue: "Write your message here..." },
    { type: "boolean", label: "Error State", propKey: "error", defaultValue: false },
    DISABLED_CONTROL,
  ],
  toast: [
    { type: "text", label: "Title", propKey: "title", defaultValue: "Payment Processed" },
    { type: "text", label: "Description", propKey: "description", defaultValue: "Your receipt has been sent to your email." },
    {
      type: "select",
      label: "Variant",
      propKey: "variant",
      defaultValue: "default",
      options: [
        { label: "Default", value: "default" },
        { label: "Success", value: "success" },
        { label: "Warning", value: "warning" },
        { label: "Error", value: "error" },
      ],
    },
  ],
  "app-header": [
    { type: "text", label: "Header Title", propKey: "title", defaultValue: "Dashboard" },
    { type: "boolean", label: "Show Back", propKey: "showBack", defaultValue: true },
  ],
  "app-sidebar": [
    { type: "text", label: "Workspace Name", propKey: "workspace", defaultValue: "Nativra Team" },
  ],
  "transaction-row": [
    { type: "text", label: "Title", propKey: "title", defaultValue: "Stripe Payout" },
    { type: "text", label: "Amount", propKey: "amount", defaultValue: "+$1,250.00" },
    { type: "boolean", label: "Positive", propKey: "positive", defaultValue: true },
  ],
  "payment-method-card": [
    { type: "text", label: "Card Brand", propKey: "brand", defaultValue: "Visa" },
    { type: "text", label: "Last 4 Digits", propKey: "last4", defaultValue: "4242" },
    { type: "boolean", label: "Default Method", propKey: "isDefault", defaultValue: true },
  ],
  cn: [
    { type: "text", label: "Description", propKey: "description", defaultValue: "Conditional class / style merger" },
  ],
  "activity-timeline": [
    { type: "text", label: "Timeline Title", propKey: "title", defaultValue: "System Audit Trail" },
    { type: "boolean", label: "Show Filter", propKey: "showFilter", defaultValue: true },
  ],
  "filter-sheet": [
    { type: "text", label: "Sheet Title", propKey: "title", defaultValue: "Filter Products" },
    { type: "boolean", label: "Show Badges", propKey: "showBadges", defaultValue: true },
  ],
  "kpi-comparison-card": [
    { type: "text", label: "Metric Title", propKey: "metricTitle", defaultValue: "Monthly Recurring Revenue" },
    { type: "text", label: "Current Value", propKey: "currentValue", defaultValue: "$48,250" },
    { type: "text", label: "Previous Value", propKey: "previousValue", defaultValue: "$41,100" },
    { type: "text", label: "Growth Delta", propKey: "deltaPercentage", defaultValue: "+17.4%" },
    { type: "boolean", label: "Positive Growth", propKey: "positive", defaultValue: true },
  ],
  "mini-sparkline-card": [
    { type: "text", label: "Label", propKey: "label", defaultValue: "Active Daily Users" },
    { type: "text", label: "Current Value", propKey: "value", defaultValue: "14,820" },
    { type: "text", label: "Trend", propKey: "trend", defaultValue: "+8.2%" },
  ],
  "team-member-row": [
    { type: "text", label: "Member Name", propKey: "name", defaultValue: "Sophia Martinez" },
    { type: "text", label: "Role", propKey: "role", defaultValue: "Lead Mobile Architect" },
    { type: "text", label: "Email", propKey: "email", defaultValue: "sophia@nativra.dev" },
  ],
  "account-settings-flow": [
    { type: "text", label: "User Name", propKey: "userName", defaultValue: "Sophia Martinez" },
    { type: "text", label: "Workspace", propKey: "workspaceName", defaultValue: "Acme Mobile Corp" },
  ],
  "analytics-dashboard": [
    { type: "text", label: "Revenue Total", propKey: "totalRevenue", defaultValue: "$124,500" },
    {
      type: "select",
      label: "Timeframe",
      propKey: "timeframe",
      defaultValue: "7d",
      options: [
        { label: "24h", value: "24h" },
        { label: "7d", value: "7d" },
        { label: "30d", value: "30d" },
        { label: "YTD", value: "ytd" },
      ],
    },
  ],
  "chat-flow": [
    { type: "text", label: "Chat Partner", propKey: "chatWith", defaultValue: "Engineering Support" },
    { type: "text", label: "Status", propKey: "status", defaultValue: "Online" },
  ],
  "ecommerce-flow": [
    { type: "text", label: "Store Name", propKey: "storeName", defaultValue: "Nativra Storefront" },
    { type: "text", label: "Cart Count", propKey: "cartItemsCount", defaultValue: "3" },
  ],
  "fintech-wallet": [
    { type: "text", label: "Total Balance", propKey: "totalBalance", defaultValue: "$24,850.40" },
    { type: "text", label: "Account Tag", propKey: "accountTag", defaultValue: "Multi-Chain Vault" },
  ],
};
