/** Nativra theme — Violet. Edit freely; you own this file. */
export const violet = {
  background: "#ffffff",
  foreground: "#2e1065",
  card: "#ffffff",
  "card-foreground": "#2e1065",
  popover: "#ffffff",
  "popover-foreground": "#2e1065",
  primary: "#7c3aed",
  "primary-foreground": "#ffffff",
  secondary: "#f5f3ff",
  "secondary-foreground": "#5b21b6",
  muted: "#f5f3ff",
  "muted-foreground": "#6d28d9",
  accent: "#ede9fe",
  "accent-foreground": "#5b21b6",
  destructive: "#ef4444",
  "destructive-foreground": "#ffffff",
  border: "#ddd6fe",
  input: "#ddd6fe",
  ring: "#7c3aed",
} as const;

export type VioletTheme = typeof violet;

