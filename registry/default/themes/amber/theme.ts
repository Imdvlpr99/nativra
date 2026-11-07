/** Nativra theme — Amber. Edit freely; you own this file. */
export const amber = {
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

export type AmberTheme = typeof amber;

