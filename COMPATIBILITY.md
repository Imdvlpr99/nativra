# Nativra Compatibility Matrix

This document defines the verified platforms, SDKs, and tooling versions supported by Nativra MVP components and CLI.

## Mobile Runtimes

| Platform / Framework | Supported Versions | Verification Status | Notes |
| :--- | :--- | :--- | :--- |
| **Expo SDK** | `^51.0.0`, `^52.0.0` | Verified on iOS & Android | Standard Expo managed workflow and Expo Go |
| **React Native** | `0.74.x`, `0.75.x`, `0.76.x` | Verified | Supports New Architecture (Fabric / TurboModules) and legacy |
| **Android** | API 31+ (Android 12, 13, 14, 15) | Verified via Emulator & Device Hub | Tested with Material color schemes, dynamic fonts, touch feedback |
| **iOS** | iOS 16, 17, 18 | Verified via Simulator | Tested with Dynamic Island / Safe Area, Dark Mode, Dynamic Type |

## Styling Targets

| Styling Engine | Supported Versions | Notes |
| :--- | :--- | :--- |
| **NativeWind** | `^4.0.1` | Tailored utility classes with dark variant support |
| **React Native StyleSheet** | Pure React Native | Built with `StyleSheet.create` and `useColorScheme()`; zero external styling runtime |

## Development Tooling

| Tool | Supported Versions |
| :--- | :--- |
| **Node.js** | `>= 20.0.0` (LTS recommended) |
| **pnpm** | `>= 9.0.0` |
| **TypeScript** | `>= 5.0.0` |
| **Operating Systems** | Windows, macOS, Linux |

## Component & Block Platform Support

### Tier 1: Primitives (31 Items)

| Primitive Component | Android | iOS | Expo Go | Web (Approximate) | Touch Target |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `Button` | ✓ | ✓ | ✓ | ✓ | 44 × 44 pt min |
| `IconButton` | ✓ | ✓ | ✓ | ✓ | 44 × 44 pt min |
| `Fab` | ✓ | ✓ | ✓ | ✓ | 56 × 56 pt min |
| `Input` | ✓ | ✓ | ✓ | ✓ | 44 pt height |
| `Textarea` | ✓ | ✓ | ✓ | ✓ | 80 pt min height |
| `Checkbox` | ✓ | ✓ | ✓ | ✓ | 44 × 44 pt hitRect |
| `Switch` | ✓ | ✓ | ✓ | ✓ | 44 × 44 pt hitRect |
| `RadioGroup` | ✓ | ✓ | ✓ | ✓ | 44 × 44 pt hitRect |
| `Select` | ✓ | ✓ | ✓ | ✓ | 44 pt height |
| `Slider` | ✓ | ✓ | ✓ | ✓ | 44 pt height |
| `OtpInput` | ✓ | ✓ | ✓ | ✓ | 48 × 48 pt per pin |
| `Label` | ✓ | ✓ | ✓ | ✓ | Fluid |
| `Text` | ✓ | ✓ | ✓ | ✓ | Fluid |
| `Card` | ✓ | ✓ | ✓ | ✓ | Fluid |
| `Badge` | ✓ | ✓ | ✓ | ✓ | 24 pt min height |
| `Avatar` | ✓ | ✓ | ✓ | ✓ | 32 × 32 pt min |
| `Separator` | ✓ | ✓ | ✓ | ✓ | 1 pt stroke |
| `Skeleton` | ✓ | ✓ | ✓ | ✓ | Fluid |
| `Progress` | ✓ | ✓ | ✓ | ✓ | 8 pt bar |
| `Spinner` | ✓ | ✓ | ✓ | ✓ | 24 × 24 pt |
| `Alert` | ✓ | ✓ | ✓ | ✓ | Fluid |
| `Dialog` | ✓ | ✓ | ✓ | ✓ | Modal Standard |
| `Toast` | ✓ | ✓ | ✓ | ✓ | 48 pt height |
| `Tabs` | ✓ | ✓ | ✓ | ✓ | 44 pt height |
| `Accordion` | ✓ | ✓ | ✓ | ✓ | 44 pt header |
| `BottomSheet` | ✓ | ✓ | ✓ | ✓ | Full gesture drag |
| `Stack` | ✓ | ✓ | ✓ | ✓ | Flexbox container |
| `SafeArea` | ✓ | ✓ | ✓ | ✓ | Window insets |
| `SegmentedControl` | ✓ | ✓ | ✓ | ✓ | 40 pt height |
| `DataTable` | ✓ | ✓ | ✓ | ✓ | Fluid grid |
| `RatingStars` | ✓ | ✓ | ✓ | ✓ | 44 × 44 pt hitRect |

### Tier 2: Business Blocks (18 Items)

| Business Block | Category | Android | iOS | Expo Go | Web (Approximate) |
| :--- | :--- | :---: | :---: | :---: | :---: |
| `AppHeader` | Controls & Navigation | ✓ | ✓ | ✓ | ✓ |
| `AppSidebar` | Controls & Navigation | ✓ | ✓ | ✓ | ✓ |
| `MetricCard` | Analytics & KPI | ✓ | ✓ | ✓ | ✓ |
| `StatProgressCard` | Analytics & KPI | ✓ | ✓ | ✓ | ✓ |
| `KpiComparisonCard` | Analytics & KPI | ✓ | ✓ | ✓ | ✓ |
| `MiniSparklineCard` | Analytics & KPI | ✓ | ✓ | ✓ | ✓ |
| `TransactionRow` | Finance & Commerce | ✓ | ✓ | ✓ | ✓ |
| `OrderSummary` | Finance & Commerce | ✓ | ✓ | ✓ | ✓ |
| `PricingCard` | Finance & Commerce | ✓ | ✓ | ✓ | ✓ |
| `PaymentMethodCard` | Finance & Commerce | ✓ | ✓ | ✓ | ✓ |
| `UserProfile` | Social & Team | ✓ | ✓ | ✓ | ✓ |
| `TeamMemberRow` | Social & Team | ✓ | ✓ | ✓ | ✓ |
| `NotificationItem` | Social & Team | ✓ | ✓ | ✓ | ✓ |
| `ActivityTimeline` | Social & Team | ✓ | ✓ | ✓ | ✓ |
| `SettingsList` | Controls & Filter | ✓ | ✓ | ✓ | ✓ |
| `FilterSheet` | Controls & Filter | ✓ | ✓ | ✓ | ✓ |
| `LoginForm` | Auth & Forms | ✓ | ✓ | ✓ | ✓ |
| `EmptyState` | Feedback & Status | ✓ | ✓ | ✓ | ✓ |

### Tier 3: Multi-Screen Application Templates (8 Flows)

| Template Flow | Flow Description | Android | iOS | Expo Go |
| :--- | :--- | :---: | :---: | :---: |
| `analytics-dashboard` | Executive KPIs, charts, segmented filters, and audit feed | ✓ | ✓ | ✓ |
| `ecommerce-flow` | Product catalog grid, details with variants, cart drawer, tracking | ✓ | ✓ | ✓ |
| `fintech-wallet` | Balance display, numeric keypad transfer, QR receive, transactions | ✓ | ✓ | ✓ |
| `account-settings-flow` | User overview, profile editing, 2FA security, team, billing | ✓ | ✓ | ✓ |
| `chat-flow` | Conversation list, chat thread, keyboard avoiding, participant drawer | ✓ | ✓ | ✓ |
| `auth-flow` | Login, sign up, password reset, and OTP verification flow | ✓ | ✓ | ✓ |
| `onboarding-flow` | Multi-step interactive walkthrough with progress dots | ✓ | ✓ | ✓ |
| `settings-flow` | App settings, notifications toggles, account management | ✓ | ✓ | ✓ |

### Hooks & Utilities (4 Hooks + cn Utility)

| Helper / Hook | Type | Android | iOS | Expo Go | Notes |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `useColorScheme` | Hook | ✓ | ✓ | ✓ | Seamless light/dark mode switching |
| `useDisclosure` | Hook | ✓ | ✓ | ✓ | Modal/sheet open/close toggle state |
| `useHaptics` | Hook | ✓ | ✓ | ✓ | Safe platform haptics wrapper |
| `useKeyboard` | Hook | ✓ | ✓ | ✓ | Keyboard elevation, height, and state |
| `cn` | Utility | ✓ | ✓ | ✓ | `clsx` + `tailwind-merge` class resolver |

