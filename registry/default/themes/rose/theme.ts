/**
 * Nativra theme — Rose. Edit freely; you own this file.
 * Generated from @nativra/theme-engine by scripts/generate-themes.mjs — do not edit in the registry.
 */
export const rose = {
  success: "#15803d",
  "success-foreground": "#ffffff",
  warning: "#b45309",
  "warning-foreground": "#ffffff",
  info: "#0369a1",
  "info-foreground": "#ffffff",
  background: "#ffffff",
  foreground: "#4c0519",
  card: "#ffffff",
  "card-foreground": "#4c0519",
  popover: "#ffffff",
  "popover-foreground": "#4c0519",
  primary: "#e11d48",
  "primary-foreground": "#ffffff",
  secondary: "#fff1f2",
  "secondary-foreground": "#9f1239",
  muted: "#fff1f2",
  "muted-foreground": "#be123c",
  accent: "#ffe4e6",
  "accent-foreground": "#9f1239",
  destructive: "#ef4444",
  "destructive-foreground": "#ffffff",
  border: "#fecdd3",
  input: "#fecdd3",
  ring: "#e11d48",
} as const;

export const roseDark = {
  success: "#4ade80",
  "success-foreground": "#052e16",
  warning: "#fbbf24",
  "warning-foreground": "#451a03",
  info: "#38bdf8",
  "info-foreground": "#082f49",
  background: "#2a040e",
  foreground: "#fff1f2",
  card: "#4c0519",
  "card-foreground": "#fff1f2",
  popover: "#4c0519",
  "popover-foreground": "#fff1f2",
  primary: "#f43f5e",
  "primary-foreground": "#2a040e",
  secondary: "#881337",
  "secondary-foreground": "#fff1f2",
  muted: "#881337",
  "muted-foreground": "#fda4af",
  accent: "#9f1239",
  "accent-foreground": "#fff1f2",
  destructive: "#f87171",
  "destructive-foreground": "#450a0a",
  border: "#9f1239",
  input: "#9f1239",
  ring: "#f43f5e",
} as const;

export type RoseTheme = typeof rose;

/**
 * The active palette pair. Components read this through the use-theme-colors hook, so
 * installing a different theme over this file restyles every component.
 */
export const themeColors = { light: rose, dark: roseDark } as const;

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
