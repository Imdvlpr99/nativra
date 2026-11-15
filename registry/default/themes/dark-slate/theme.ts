/**
 * Nativra theme — Dark Slate. Edit freely; you own this file.
 * Generated from @nativra/theme-engine by scripts/generate-themes.mjs — do not edit in the registry.
 */
export const darkSlate = {
  success: "#15803d",
  "success-foreground": "#ffffff",
  warning: "#b45309",
  "warning-foreground": "#ffffff",
  info: "#0369a1",
  "info-foreground": "#ffffff",
  background: "#f8fafc",
  foreground: "#0f172a",
  card: "#ffffff",
  "card-foreground": "#0f172a",
  popover: "#ffffff",
  "popover-foreground": "#0f172a",
  primary: "#0284c7",
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
  ring: "#0284c7",
} as const;

export const darkSlateDark = {
  success: "#4ade80",
  "success-foreground": "#052e16",
  warning: "#fbbf24",
  "warning-foreground": "#451a03",
  info: "#38bdf8",
  "info-foreground": "#082f49",
  background: "#0f172a",
  foreground: "#f8fafc",
  card: "#1e293b",
  "card-foreground": "#f8fafc",
  popover: "#1e293b",
  "popover-foreground": "#f8fafc",
  primary: "#38bdf8",
  "primary-foreground": "#0f172a",
  secondary: "#334155",
  "secondary-foreground": "#f8fafc",
  muted: "#334155",
  "muted-foreground": "#94a3b8",
  accent: "#0369a1",
  "accent-foreground": "#ffffff",
  destructive: "#f87171",
  "destructive-foreground": "#450a0a",
  border: "#334155",
  input: "#334155",
  ring: "#38bdf8",
} as const;

export type DarkSlateTheme = typeof darkSlate;

/**
 * The active palette pair. Components read this through the use-theme-colors hook, so
 * installing a different theme over this file restyles every component.
 */
export const themeColors = { light: darkSlate, dark: darkSlateDark } as const;

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
