import { useColorScheme } from "react-native";
import { themeColors } from "@/lib/themes/theme";

/** Semantic color tokens of the installed theme (background, primary, muted, border, …). */
export type ThemeColors = { readonly [K in keyof typeof themeColors.light]: string };

/**
 * The installed theme's colors for the current color scheme.
 *
 * Nativra's StyleSheet components read every color through this hook, so replacing
 * lib/themes/theme.ts (npx nativra-cli theme add <id> --overwrite) restyles all of them.
 */
export function useThemeColors(): ThemeColors {
  return useColorScheme() === "dark" ? themeColors.dark : themeColors.light;
}

/** A theme color at reduced opacity, for tints: alpha(c.primary, 0.12) -> "rgba(…, 0.12)". */
export function alpha(hex: string, opacity: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1]!, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${opacity})`;
}
