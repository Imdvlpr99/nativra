/** Nativra theme — Rose. Edit freely; you own this file. */
export const rose = {
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

export type RoseTheme = typeof rose;
