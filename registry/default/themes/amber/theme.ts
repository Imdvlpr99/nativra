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
 * installing a different theme over this file restyles every component. Shape, type and
 * density live separately in style.ts (npx nativra-cli style add <id>).
 */
export const themeColors = { light: amber, dark: amberDark } as const;
