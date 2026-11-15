/**
 * Nativra theme — Emerald. Edit freely; you own this file.
 * Generated from @nativra/theme-engine by scripts/generate-themes.mjs — do not edit in the registry.
 */
export const emerald = {
  success: "#15803d",
  "success-foreground": "#ffffff",
  warning: "#b45309",
  "warning-foreground": "#ffffff",
  info: "#0369a1",
  "info-foreground": "#ffffff",
  background: "#ffffff",
  foreground: "#064e3b",
  card: "#ffffff",
  "card-foreground": "#064e3b",
  popover: "#ffffff",
  "popover-foreground": "#064e3b",
  primary: "#059669",
  "primary-foreground": "#ffffff",
  secondary: "#ecfdf5",
  "secondary-foreground": "#065f46",
  muted: "#f0fdf4",
  "muted-foreground": "#047857",
  accent: "#d1fae5",
  "accent-foreground": "#065f46",
  destructive: "#ef4444",
  "destructive-foreground": "#ffffff",
  border: "#a7f3d0",
  input: "#a7f3d0",
  ring: "#059669",
} as const;

export const emeraldDark = {
  success: "#4ade80",
  "success-foreground": "#052e16",
  warning: "#fbbf24",
  "warning-foreground": "#451a03",
  info: "#38bdf8",
  "info-foreground": "#082f49",
  background: "#022c22",
  foreground: "#ecfdf5",
  card: "#064e3b",
  "card-foreground": "#ecfdf5",
  popover: "#064e3b",
  "popover-foreground": "#ecfdf5",
  primary: "#10b981",
  "primary-foreground": "#022c22",
  secondary: "#065f46",
  "secondary-foreground": "#ecfdf5",
  muted: "#065f46",
  "muted-foreground": "#6ee7b7",
  accent: "#047857",
  "accent-foreground": "#ecfdf5",
  destructive: "#f87171",
  "destructive-foreground": "#450a0a",
  border: "#047857",
  input: "#047857",
  ring: "#10b981",
} as const;

export type EmeraldTheme = typeof emerald;

/**
 * The active palette pair. Components read this through the use-theme-colors hook, so
 * installing a different theme over this file restyles every component.
 */
export const themeColors = { light: emerald, dark: emeraldDark } as const;

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
  scrimOpacity: 0.5,
  fontWeight: {
    heading: "700",
    title: "600",
    label: "600",
  },
  headingLetterSpacing: -0.4,
} as const;
