import { useColorScheme, type ViewStyle } from "react-native";
import * as installedTheme from "@/lib/themes/theme";

const { themeColors } = installedTheme;

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

// ---------------------------------------------------------------------------
// Style tokens: shape, depth, press feedback and heading type
// ---------------------------------------------------------------------------

interface ShadowToken {
  readonly offsetY: number;
  readonly radius: number;
  readonly opacity: number;
  readonly elevation: number;
}

export interface ThemeStyle {
  readonly radius: {
    readonly button: number;
    readonly control: number;
    readonly card: number;
    readonly surface: number;
    readonly chip: number;
    readonly small: number;
  };
  readonly borderWidth: number;
  readonly shadow: { readonly card: ShadowToken; readonly raised: ShadowToken; readonly overlay: ShadowToken };
  readonly pressedScale: number;
  readonly fontWeight: { readonly heading: "500" | "600" | "700" | "800"; readonly title: "500" | "600" | "700"; readonly label: "500" | "600" };
  readonly headingLetterSpacing: number;
}

/** "Soft & friendly", used when the installed theme file predates style tokens. */
const FALLBACK_STYLE: ThemeStyle = {
  radius: { button: 9999, control: 14, card: 20, surface: 28, chip: 9999, small: 8 },
  borderWidth: 1,
  shadow: {
    card: { offsetY: 4, radius: 16, opacity: 0.06, elevation: 2 },
    raised: { offsetY: 8, radius: 24, opacity: 0.1, elevation: 6 },
    overlay: { offsetY: 16, radius: 40, opacity: 0.18, elevation: 12 },
  },
  pressedScale: 0.97,
  fontWeight: { heading: "700", title: "600", label: "600" },
  headingLetterSpacing: -0.4,
};

/**
 * The installed theme's style tokens. Every component reads radii, shadows and heading type
 * from here, so a theme controls the whole UI's character, not only its colors.
 */
export const themeStyle: ThemeStyle =
  (installedTheme as unknown as { themeStyle?: ThemeStyle }).themeStyle ?? FALLBACK_STYLE;

export type ShadowLevel = keyof ThemeStyle["shadow"];

/** A soft drop shadow for a surface: iOS shadow props plus Android elevation. */
export function elevation(level: ShadowLevel): ViewStyle {
  const s = themeStyle.shadow[level];
  return {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: s.offsetY },
    shadowOpacity: s.opacity,
    // The token is a CSS-style blur; React Native's shadowRadius is roughly half of that.
    shadowRadius: s.radius / 2,
    elevation: s.elevation,
  };
}

/** Press feedback for Pressable styles: `style={({ pressed }) => [base, pressedStyle(pressed)]}`. */
export function pressedStyle(pressed: boolean): ViewStyle | undefined {
  return pressed ? { transform: [{ scale: themeStyle.pressedScale }] } : undefined;
}
