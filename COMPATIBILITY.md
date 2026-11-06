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

## Component Platform Support

| Component | Android | iOS | Expo Go | Web (Approximate) |
| :--- | :---: | :---: | :---: | :---: |
| `Button` | ✓ | ✓ | ✓ | ✓ |
| `Badge` | ✓ | ✓ | ✓ | ✓ |
| `Card` | ✓ | ✓ | ✓ | ✓ |
| `Input` | ✓ | ✓ | ✓ | ✓ |
| `Separator` | ✓ | ✓ | ✓ | ✓ |
| `Text` | ✓ | ✓ | ✓ | ✓ |
| `Label` | ✓ | ✓ | ✓ | ✓ |
| `Checkbox` | ✓ | ✓ | ✓ | ✓ |
| `Switch` | ✓ | ✓ | ✓ | ✓ |
| `Skeleton` | ✓ | ✓ | ✓ | ✓ |
| `Spinner` | ✓ | ✓ | ✓ | ✓ |
| `Avatar` | ✓ | ✓ | ✓ | ✓ |
| `Login Form` (Block) | ✓ | ✓ | ✓ | ✓ |
| `Empty State` (Block) | ✓ | ✓ | ✓ | ✓ |
| `useDisclosure` (Hook) | ✓ | ✓ | ✓ | ✓ |

