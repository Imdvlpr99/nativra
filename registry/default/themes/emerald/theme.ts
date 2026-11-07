/** Nativra theme — Emerald. Edit freely; you own this file. */
export const emerald = {
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

export type EmeraldTheme = typeof emerald;

