/**
 * Nativra theme — Amber. Edit freely; you own this file.
 * Generated from @nativra/theme-engine by scripts/generate-themes.mjs — do not edit in the registry.
 */
export const amber = {
  success: "#15803d",
  "success-foreground": "#ffffff",
  warning: "#b45309",
  "warning-foreground": "#ffffff",
  info: "#0369a1",
  "info-foreground": "#ffffff",
  background: "#ffffff",
  foreground: "#451a03",
  card: "#ffffff",
  "card-foreground": "#451a03",
  popover: "#ffffff",
  "popover-foreground": "#451a03",
  primary: "#d97706",
  "primary-foreground": "#ffffff",
  secondary: "#fffbeb",
  "secondary-foreground": "#92400e",
  muted: "#fffbeb",
  "muted-foreground": "#b45309",
  accent: "#fef3c7",
  "accent-foreground": "#92400e",
  destructive: "#ef4444",
  "destructive-foreground": "#ffffff",
  border: "#fde68a",
  input: "#fde68a",
  ring: "#d97706",
} as const;

export const amberDark = {
  success: "#4ade80",
  "success-foreground": "#052e16",
  warning: "#fbbf24",
  "warning-foreground": "#451a03",
  info: "#38bdf8",
  "info-foreground": "#082f49",
  background: "#1c0b02",
  foreground: "#fffbeb",
  card: "#451a03",
  "card-foreground": "#fffbeb",
  popover: "#451a03",
  "popover-foreground": "#fffbeb",
  primary: "#f59e0b",
  "primary-foreground": "#1c0b02",
  secondary: "#78350f",
  "secondary-foreground": "#fffbeb",
  muted: "#78350f",
  "muted-foreground": "#fcd34d",
  accent: "#92400e",
  "accent-foreground": "#fffbeb",
  destructive: "#f87171",
  "destructive-foreground": "#450a0a",
  border: "#92400e",
  input: "#92400e",
  ring: "#f59e0b",
} as const;

export type AmberTheme = typeof amber;

/**
 * The active palette pair. Components read this through the use-theme-colors hook, so
 * installing a different theme over this file restyles every component.
 */
export const themeColors = { light: amber, dark: amberDark } as const;

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
