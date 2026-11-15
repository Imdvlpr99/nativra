/**
 * Nativra theme — Midnight. Edit freely; you own this file.
 * Generated from @nativra/theme-engine by scripts/generate-themes.mjs — do not edit in the registry.
 */
export const midnight = {
  success: "#15803d",
  "success-foreground": "#ffffff",
  warning: "#b45309",
  "warning-foreground": "#ffffff",
  info: "#0369a1",
  "info-foreground": "#ffffff",
  background: "#f8fafc",
  foreground: "#0b0f19",
  card: "#ffffff",
  "card-foreground": "#0b0f19",
  popover: "#ffffff",
  "popover-foreground": "#0b0f19",
  primary: "#1d4ed8",
  "primary-foreground": "#ffffff",
  secondary: "#f1f5f9",
  "secondary-foreground": "#0f172a",
  muted: "#f1f5f9",
  "muted-foreground": "#64748b",
  accent: "#e2e8f0",
  "accent-foreground": "#0f172a",
  destructive: "#ef4444",
  "destructive-foreground": "#ffffff",
  border: "#cbd5e1",
  input: "#cbd5e1",
  ring: "#1d4ed8",
} as const;

export const midnightDark = {
  success: "#4ade80",
  "success-foreground": "#052e16",
  warning: "#fbbf24",
  "warning-foreground": "#451a03",
  info: "#38bdf8",
  "info-foreground": "#082f49",
  background: "#0b0f19",
  foreground: "#f8fafc",
  card: "#111827",
  "card-foreground": "#f8fafc",
  popover: "#111827",
  "popover-foreground": "#f8fafc",
  primary: "#3b82f6",
  "primary-foreground": "#ffffff",
  secondary: "#1e293b",
  "secondary-foreground": "#f8fafc",
  muted: "#1e293b",
  "muted-foreground": "#94a3b8",
  accent: "#1d4ed8",
  "accent-foreground": "#ffffff",
  destructive: "#f87171",
  "destructive-foreground": "#450a0a",
  border: "#1f2937",
  input: "#1f2937",
  ring: "#60a5fa",
} as const;

export type MidnightTheme = typeof midnight;

/**
 * The active palette pair. Components read this through the use-theme-colors hook, so
 * installing a different theme over this file restyles every component.
 */
export const themeColors = { light: midnight, dark: midnightDark } as const;

/**
 * Shape, depth and type character. Components read radii by role (button, control, card,
 * surface, chip, small), shadows by level and heading weights from here, in both styling targets.
 */
export const themeStyle = {
  radius: {
    button: 9999,
    control: 14,
    card: 20,
    surface: 28,
    chip: 9999,
    small: 8,
  },
  borderWidth: 1,
  shadow: {
    card: {
      offsetY: 4,
      radius: 16,
      opacity: 0.06,
      elevation: 2,
    },
    raised: {
      offsetY: 8,
      radius: 24,
      opacity: 0.1,
      elevation: 6,
    },
    overlay: {
      offsetY: 16,
      radius: 40,
      opacity: 0.18,
      elevation: 12,
    },
  },
  pressedScale: 0.97,
  fontWeight: {
    heading: "700",
    title: "600",
    label: "600",
  },
  headingLetterSpacing: -0.4,
} as const;
