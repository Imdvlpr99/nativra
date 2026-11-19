/**
 * @nativra/preview-runtime — deterministic preview fixtures shared by Docs and
 * the native-preview app, so both render the same states.
 */
export type PreviewProps = Record<string, unknown>;

export interface PreviewFixture {
  name: string;
  props: PreviewProps;
}

/** Stand-in for required callbacks in fixtures. */
const noop = () => {};

/**
 * Kept with its literal types (`satisfies`, not an annotation), so the preview app can check every
 * fixture's props against the real component's props at compile time.
 */
const FIXTURES = {
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
    { name: "Midpoint 50", props: { defaultValue: 50, min: 0, max: 100 } },
    { name: "High Value 85", props: { defaultValue: 85, min: 0, max: 100 } },
    { name: "Stepped by 10", props: { defaultValue: 30, min: 0, max: 100, step: 10 } },
    { name: "Disabled", props: { value: 40, disabled: true } },
  ],
  tabs: [
    { name: "Pill Style", props: { value: "overview", variant: "pill" } },
    { name: "Underline Style", props: { value: "activity", variant: "underline" } },
  ],
  accordion: [
    {
      name: "Default Accordion",
      props: {
        items: [
          { id: "1", title: "What is Nativra?", content: "A source-first UI platform for React Native & Expo." },
          { id: "2", title: "Is there runtime lock-in?", content: "No, you own 100% of the installed source code." },
        ],
      },
    },
  ],
  "bottom-sheet": [
    { name: "Open Sheet", props: { title: "Sheet Menu", isOpen: true } },
  ],
  "data-table": [
    {
      name: "Enterprise Grid",
      props: {
        columns: [
          { key: "id", title: "ID", width: 70 },
          { key: "name", title: "User" },
          { key: "status", title: "Status" },
        ],
        data: [
          { id: "#101", name: "Alex Mercer", status: "Active" },
          { id: "#102", name: "Sophia Vance", status: "Pending" },
        ],
      },
    },
  ],
  dialog: [
    { name: "Confirm Modal", props: { title: "Delete Record", description: "Are you sure you want to permanently delete this?", isOpen: true } },
  ],
  fab: [
    { name: "Primary Action", props: { label: "New Message", variant: "primary" } },
    { name: "Secondary Action", props: { label: "Add", variant: "secondary" } },
  ],
  "icon-button": [
    { name: "Primary Icon", props: { variant: "primary", size: "md" } },
    { name: "Outline Icon", props: { variant: "outline", size: "md" } },
  ],
  "otp-input": [
    { name: "4-Digit Pin", props: { length: 4, value: "4821" } },
  ],
  "radio-group": [
    {
      name: "Tier Selector",
      props: {
        options: [
          { label: "Personal Plan", value: "personal" },
          { label: "Team Plan", value: "team" },
        ],
        value: "personal",
      },
    },
  ],
  "rating-stars": [
    { name: "4 of 5 Stars", props: { rating: 4, maxStars: 5, size: "md" } },
    { name: "5 of 5 Stars", props: { rating: 5, maxStars: 5, size: "lg" } },
  ],
  "safe-area": [
    { name: "Standard Edges", props: { edges: ["top", "bottom"] } },
  ],
  "segmented-control": [
    {
      name: "Timeframe Selector",
      props: {
        options: [
          { label: "Day", value: "day" },
          { label: "Week", value: "week" },
          { label: "Month", value: "month" },
        ],
        value: "week",
      },
    },
  ],
  select: [
    {
      name: "Dropdown Picker",
      props: {
        placeholder: "Select country",
        options: ["United States", "Germany", "Japan", "Singapore"],
      },
    },
  ],
  stack: [
    { name: "Vertical Stack", props: { direction: "column", gap: "md" } },
    { name: "Horizontal Stack", props: { direction: "row", gap: "sm" } },
  ],
  textarea: [
    { name: "Standard Input", props: { label: "Bio / Notes", placeholder: "Enter description here..." } },
  ],
  toast: [
    { name: "Success Notification", props: { title: "Payment Processed", message: "Your card was charged successfully.", variant: "success" } },
  ],

  // Blocks
  "empty-state": [
    { name: "With Action", props: { title: "No Items Found", description: "Get started by creating your first item.", actionLabel: "Create item", onAction: noop } },
    { name: "No Action", props: { title: "Inbox Zero", description: "All caught up for today!" } },
  ],
  "login-form": [
    { name: "Default", props: { onSignIn: noop, onForgotPassword: noop, onSignUp: noop } },
    { name: "Loading", props: { onSignIn: noop, isLoading: true } },
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
  chip: [
    { name: "Default", props: { label: "Design" } },
    { name: "Selected", props: { label: "Design", selected: true, variant: "primary" } },
    { name: "Outline", props: { label: "Remote", variant: "outline" } },
  ],
  "stat-tile": [
    { name: "Up", props: { label: "Revenue", value: "$48,920", delta: "+12.4%", trend: "up", caption: "vs last month" } },
    { name: "Down", props: { label: "Churn", value: "2.1%", delta: "-0.4%", trend: "down", caption: "vs last month" } },
  ],
  "header-bar": [
    { name: "With back", props: { title: "Settings", subtitle: "Account and privacy", onBack: noop, rightLabel: "Done", onRightPress: noop } },
    { name: "Title only", props: { title: "Inbox", elevated: true } },
  ],
  "bottom-tab-bar": [
    {
      name: "Default",
      props: {
        tabs: [
          { id: "home", label: "Home", icon: "🏠" },
          { id: "search", label: "Search", icon: "🔍" },
          { id: "inbox", label: "Inbox", icon: "✉️", badge: 3 },
          { id: "profile", label: "Profile", icon: "👤" },
        ],
        activeTab: "home",
        onTabChange: noop,
      },
    },
  ],
  "app-header": [
    { name: "Dashboard", props: { title: "Dashboard", subtitle: "Welcome back, Alex", unreadNotificationsCount: 3, avatarFallback: "AK" } },
    { name: "With search", props: { title: "Projects", showBack: true, showSearch: true, searchPlaceholder: "Search projects" } },
  ],
  "mini-sparkline-card": [
    { name: "Positive", props: { title: "Active users", value: "12,480", change: "+8.2%", isPositive: true, data: [4, 6, 5, 8, 7, 10, 12] } },
    { name: "Negative", props: { title: "Bounce rate", value: "38%", change: "-3.1%", isPositive: false, data: [12, 10, 11, 8, 9, 7, 6] } },
  ],
  "filter-sheet": [{ name: "Open", props: { open: true, onOpenChange: noop } }],
  "pagination-dots": [
    { name: "Second of five", props: { total: 5, currentIndex: 1 } },
    { name: "Last", props: { total: 4, currentIndex: 3 } },
  ],
  "team-member-row": [
    { name: "Member", props: { name: "Alex Kim", email: "alex@acme.dev", role: "Admin" } },
    { name: "Current user", props: { name: "Sam Rivera", email: "sam@acme.dev", role: "Owner", isCurrentUser: true } },
  ],
  "search-bar": [
    { name: "Empty", props: { placeholder: "Search components" } },
    { name: "With text", props: { defaultValue: "button", onCancel: noop } },
    { name: "Loading", props: { defaultValue: "date picker", loading: true } },
  ],
  "form-field": [
    { name: "Default", props: { label: "Email me about updates", description: "At most one email a month" } },
    { name: "Error", props: { label: "Country", required: true, error: "Choose a country" } },
  ],
  "list-item": [
    { name: "Settings", props: { title: "Account", subtitle: "ana@example.com" } },
    { name: "Destructive", props: { title: "Sign out", destructive: true } },
  ],
  "swipeable-row": [{ name: "Inbox", props: {} }],
  "time-picker": [
    { name: "12-hour", props: { label: "Pickup time", defaultValue: "18:30", hourCycle: 12 } },
    { name: "24-hour, 15 min", props: { label: "Start", defaultValue: "07:45", hourCycle: 24, minuteStep: 15 } },
  ],
  "register-form": [
    { name: "Default", props: { onSubmit: noop, onSignIn: noop } },
    { name: "Loading", props: { onSubmit: noop, isLoading: true } },
  ],
} satisfies Record<string, PreviewFixture[]>;

/** The fixtures' exact types, for compile-time checks against component props. */
export type FixtureDefinitions = typeof FIXTURES;

export const PREVIEW_FIXTURES: Record<string, PreviewFixture[]> = FIXTURES;

export function getFixtures(id: string): PreviewFixture[] {
  return PREVIEW_FIXTURES[id] ?? [];
}
