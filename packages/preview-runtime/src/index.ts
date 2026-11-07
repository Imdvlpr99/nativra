/**
 * @nativra/preview-runtime — deterministic preview fixtures shared by Studio and
 * the native-preview app, so both render the same states.
 */
export type PreviewProps = Record<string, string | boolean | number>;

export interface PreviewFixture {
  name: string;
  props: PreviewProps;
}

export const PREVIEW_FIXTURES: Record<string, PreviewFixture[]> = {
  button: [
    { name: "Default", props: { children: "Button" } },
    { name: "Primary", props: { variant: "primary", children: "Primary" } },
    { name: "Destructive", props: { variant: "destructive", children: "Delete" } },
    { name: "Loading", props: { loading: true, children: "Saving" } },
    { name: "Disabled", props: { disabled: true, children: "Disabled" } },
  ],
  badge: [
    { name: "Default", props: { label: "New" } },
    { name: "Destructive", props: { variant: "destructive", label: "Error" } },
  ],
  input: [
    { name: "Basic", props: { label: "Email", placeholder: "you@example.com" } },
    { name: "Error", props: { label: "Email", error: true, errorMessage: "Invalid email" } },
    { name: "Disabled", props: { label: "Email", disabled: true } },
  ],
  card: [
    { name: "Flat", props: {} },
    { name: "Elevated", props: { elevated: true } },
  ],
  separator: [
    { name: "Horizontal", props: { orientation: "horizontal" } },
    { name: "Vertical", props: { orientation: "vertical" } },
  ],
  text: [
    { name: "Heading 1", props: { variant: "h1", children: "Heading 1" } },
    { name: "Heading 2", props: { variant: "h2", children: "Heading 2" } },
    { name: "Body", props: { variant: "p", children: "This is body copy for mobile apps." } },
    { name: "Muted", props: { variant: "muted", children: "Secondary helper text" } },
  ],
  label: [
    { name: "Standard", props: { children: "Email address" } },
    { name: "Required", props: { children: "Password", required: true } },
    { name: "Disabled", props: { children: "Disabled field", disabled: true } },
  ],
  checkbox: [
    { name: "Unchecked", props: { checked: false, label: "Accept terms" } },
    { name: "Checked", props: { checked: true, label: "Accept terms" } },
    { name: "Disabled", props: { checked: true, disabled: true, label: "Locked option" } },
  ],
  switch: [
    { name: "Off", props: { value: false } },
    { name: "On", props: { value: true } },
    { name: "Disabled", props: { value: true, disabled: true } },
  ],
  skeleton: [
    { name: "Text line", props: { width: 180, height: 16 } },
    { name: "Card skeleton", props: { width: 240, height: 80, radius: "md" } },
  ],
  spinner: [
    { name: "Small", props: { size: "sm" } },
    { name: "Medium", props: { size: "md" } },
    { name: "Large", props: { size: "lg" } },
  ],
  avatar: [
    { name: "Fallback initials", props: { fallback: "JD", size: "md" } },
    { name: "Small avatar", props: { fallback: "NV", size: "sm" } },
    { name: "Large avatar", props: { fallback: "AB", size: "lg" } },
  ],
  "empty-state": [
    { name: "Default", props: { title: "No Items Found", description: "Get started by creating your first item." } },
    { name: "No Action", props: { title: "Inbox Zero", description: "All caught up for today!", showAction: false } },
  ],
  "login-form": [
    { name: "Default", props: { title: "Welcome back", submitLabel: "Sign In" } },
    { name: "Loading", props: { title: "Signing In", loading: true } },
    { name: "Disabled", props: { title: "Account Suspended", disabled: true } },
  ],
  "user-profile": [
    { name: "Verified Pro", props: { name: "Sophia Martinez", handle: "@sophiam", verified: true, isFollowing: false } },
    { name: "Following", props: { name: "Alex Rivers", handle: "@arivers", verified: false, isFollowing: true } },
  ],
  "settings-list": [
    { name: "Standard", props: { title: "Preferences", notifications: true, darkMode: false, biometrics: true } },
    { name: "Dark Active", props: { title: "Preferences", notifications: true, darkMode: true, biometrics: true } },
  ],
  "pricing-card": [
    { name: "Popular", props: { planName: "Pro Mobile", price: "$19", popular: true } },
    { name: "Enterprise", props: { planName: "Enterprise Tier", price: "$99", popular: false, buttonText: "Contact Sales" } },
  ],
  "metric-card": [
    { name: "Positive Trend", props: { title: "Active Users", value: "48,290", change: "+24.8%", positive: true } },
    { name: "Negative Trend", props: { title: "Churn Rate", value: "1.42%", change: "-0.8%", positive: false } },
  ],
  "use-disclosure": [
    { name: "Closed", props: { defaultIsOpen: false, triggerLabel: "Open Bottom Sheet" } },
    { name: "Open", props: { defaultIsOpen: true, triggerLabel: "Sheet Active" } },
  ],
  alert: [
    { name: "Info Notice", props: { variant: "info", title: "Update Available", description: "A new version of Nativra is ready to install." } },
    { name: "Success Alert", props: { variant: "success", title: "Payment Processed", description: "Your subscription has been renewed." } },
    { name: "Destructive Alert", props: { variant: "destructive", title: "Session Expired", description: "Please sign in again to continue." } },
    { name: "Warning Notice", props: { variant: "warning", title: "Storage Warning", description: "You have used 85% of your quota." } },
  ],
  progress: [
    { name: "Initial 25%", props: { value: 25, variant: "primary", size: "md" } },
    { name: "Halfway 50%", props: { value: 50, variant: "primary", size: "md" } },
    { name: "Complete 100%", props: { value: 100, variant: "success", size: "lg" } },
    { name: "Warning 75%", props: { value: 75, variant: "destructive", size: "sm" } },
  ],
  slider: [
    { name: "Midpoint 50", props: { value: 50, min: 0, max: 100 } },
    { name: "High Value 85", props: { value: 85, min: 0, max: 100 } },
    { name: "Low Value 15", props: { value: 15, min: 0, max: 100 } },
    { name: "Disabled", props: { value: 40, disabled: true } },
  ],
  tabs: [
    { name: "Pill Style", props: { value: "overview", variant: "pill" } },
    { name: "Underline Style", props: { value: "activity", variant: "underline" } },
  ],
  "order-summary": [
    { name: "Standard Checkout", props: { orderNumber: "#NV-88219", subtotal: "$108.00", discount: "-$20.00", total: "$96.80" } },
    { name: "No Discount", props: { orderNumber: "#NV-99014", subtotal: "$149.00", discount: "", total: "$149.00" } },
  ],
  "notification-item": [
    { name: "Unread Alert", props: { senderName: "Marcus Vance", actionText: "requested feedback on", targetResource: "Design System Spec", unread: true, timeAgo: "12m ago" } },
    { name: "Read Notification", props: { senderName: "Sophia Martinez", actionText: "approved your pull request in", targetResource: "mobile-core", unread: false, timeAgo: "2h ago" } },
  ],
  "stat-progress-card": [
    { name: "High Progress 80%", props: { goalTitle: "Weekly Workout Goal", currentValue: "4", targetValue: "5 sessions", progressPercent: 80, streakDays: 14 } },
    { name: "Goal Completed 100%", props: { goalTitle: "Savings Target", currentValue: "$5,000", targetValue: "$5,000", progressPercent: 100, streakDays: 30 } },
  ],
};

export function getFixtures(id: string): PreviewFixture[] {
  return PREVIEW_FIXTURES[id] ?? [];
}
