/**
 * Nativra theme — Cyan. Edit freely; you own this file.
 * Generated from @nativra/theme-engine by scripts/generate-themes.mjs — do not edit in the registry.
 */
export const cyan = {
  success: "#15803d",
  "success-foreground": "#ffffff",
  warning: "#b45309",
  "warning-foreground": "#ffffff",
  info: "#0369a1",
  "info-foreground": "#ffffff",
  background: "#ffffff",
  foreground: "#083344",
  card: "#ffffff",
  "card-foreground": "#083344",
  popover: "#ffffff",
  "popover-foreground": "#083344",
  primary: "#0891b2",
  "primary-foreground": "#ffffff",
  secondary: "#ecfeff",
  "secondary-foreground": "#155e75",
  muted: "#ecfeff",
  "muted-foreground": "#0e7490",
  accent: "#cffafe",
  "accent-foreground": "#155e75",
  destructive: "#ef4444",
  "destructive-foreground": "#ffffff",
  border: "#a5f3fc",
  input: "#a5f3fc",
  ring: "#0891b2",
} as const;

export const cyanDark = {
  success: "#4ade80",
  "success-foreground": "#052e16",
  warning: "#fbbf24",
  "warning-foreground": "#451a03",
  info: "#38bdf8",
  "info-foreground": "#082f49",
  background: "#031d28",
  foreground: "#ecfeff",
  card: "#083344",
  "card-foreground": "#ecfeff",
  popover: "#083344",
  "popover-foreground": "#ecfeff",
  primary: "#06b6d4",
  "primary-foreground": "#031d28",
  secondary: "#155e75",
  "secondary-foreground": "#ecfeff",
  muted: "#155e75",
  "muted-foreground": "#67e8f9",
  accent: "#164e63",
  "accent-foreground": "#ecfeff",
  destructive: "#f87171",
  "destructive-foreground": "#450a0a",
  border: "#164e63",
  input: "#164e63",
  ring: "#06b6d4",
} as const;

export type CyanTheme = typeof cyan;

/**
 * The active palette pair. Components read this through the use-theme-colors hook, so
 * installing a different theme over this file restyles every component.
 */
export const themeColors = { light: cyan, dark: cyanDark } as const;

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
