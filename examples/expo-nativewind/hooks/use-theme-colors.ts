import { useColorScheme, type ViewStyle } from "react-native";
import * as installedTheme from "@/lib/themes/theme";
import * as installedStyle from "@/lib/themes/style";

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
// Style tokens: the UI's character (lib/themes/style.ts), independent of its colors
// ---------------------------------------------------------------------------

interface ShadowToken {
  readonly offsetY: number;
  readonly radius: number;
  readonly opacity: number;
  readonly elevation: number;
}

export interface ThemeStyle {
  readonly id: string;
  readonly name: string;
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
  readonly scrimOpacity: number;
  readonly fontWeight: {
    readonly heading: "400" | "500" | "600" | "700" | "800";
    readonly title: "500" | "600" | "700";
    readonly label: "500" | "600";
  };
  readonly headingLetterSpacing: number;
  /** Multiplies every font size (1 = body 16) */
  readonly typeScale: number;
  /** Multiplies padding and gaps */
  readonly density: number;
  /** How cards stand off the page: shadow, ring, border, tonal (tinted) or fill (grey) */
  readonly surface: "shadow" | "ring" | "border" | "tonal" | "fill";
  /** Text inputs: outlined or filled */
  readonly field: "outline" | "filled";
  /** Press feedback: shrink or dim */
  readonly press: "scale" | "opacity";
  readonly pressedOpacity: number;
  /** Buttons and inputs at their default size */
  readonly control: { readonly height: number; readonly paddingX: number };
}

/** "Soft", used for any token a style file (or a pre-0.3 theme file) doesn't define. */
const FALLBACK_STYLE: ThemeStyle = {
  id: "soft",
  name: "Soft",
  radius: { button: 9999, control: 14, card: 20, surface: 28, chip: 9999, small: 8 },
  borderWidth: 1,
  shadow: {
    card: { offsetY: 4, radius: 16, opacity: 0.06, elevation: 2 },
    raised: { offsetY: 8, radius: 24, opacity: 0.1, elevation: 6 },
    overlay: { offsetY: 16, radius: 40, opacity: 0.18, elevation: 12 },
  },
  pressedScale: 0.97,
  scrimOpacity: 0.5,
  fontWeight: { heading: "700", title: "600", label: "600" },
  headingLetterSpacing: -0.4,
  typeScale: 1,
  density: 1,
  surface: "shadow",
  field: "outline",
  press: "scale",
  pressedOpacity: 0.7,
  control: { height: 46, paddingX: 20 },
};

/**
 * The installed style. Every component reads radii, shadows, type, density, surfaces and press
 * feedback from here, so `npx nativra-cli style add <id>` changes the whole UI's character.
 */
export const themeStyle: ThemeStyle = {
  ...FALLBACK_STYLE,
  // Theme files from before styles were separate carried the style tokens themselves.
  ...(installedTheme as unknown as { themeStyle?: Partial<ThemeStyle> }).themeStyle,
  ...(installedStyle as unknown as { themeStyle?: Partial<ThemeStyle> }).themeStyle,
};

/** A font size from the base design (body 16) in the installed style's type scale. */
export function ts(px: number): number {
  return Math.round(px * themeStyle.typeScale);
}

/** A padding or gap from the base design at the installed style's density. */
export function sp(px: number): number {
  return Math.round(px * themeStyle.density);
}

export type ShadowLevel = keyof ThemeStyle["shadow"];

/**
 * A drop shadow: iOS shadow props plus Android elevation. Resting cards ("card") only get one
 * in styles whose surfaces are shadowed; menus ("raised") and dialogs ("overlay") always do.
 */
export function elevation(level: ShadowLevel): ViewStyle {
  if (level === "card" && themeStyle.surface !== "shadow" && themeStyle.surface !== "ring") return {};
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

/**
 * A card or grouped-list background in the installed style: bordered card, ringed card, tinted
 * (tonal) or grey (fill). Includes the resting shadow where the style has one.
 */
export function surface(c: ThemeColors): ViewStyle {
  switch (themeStyle.surface) {
    case "ring":
      return { backgroundColor: c.card, borderWidth: themeStyle.borderWidth, borderColor: alpha(c.foreground, 0.08), ...elevation("card") };
    case "border":
      return { backgroundColor: c.card, borderWidth: themeStyle.borderWidth, borderColor: c.border };
    case "tonal":
      return { backgroundColor: alpha(c.primary, 0.07), borderWidth: 0 };
    case "fill":
      return { backgroundColor: alpha(c.foreground, 0.05), borderWidth: 0 };
    default:
      return { backgroundColor: c.card, borderWidth: themeStyle.borderWidth, borderColor: c.border, ...elevation("card") };
  }
}

/** A text input's container in the installed style: outlined, or filled with a neutral tint. */
export function field(c: ThemeColors, focused = false): ViewStyle {
  if (themeStyle.field === "filled") {
    return {
      backgroundColor: alpha(c.foreground, focused ? 0.09 : 0.06),
      borderWidth: 0,
      // Material's filled fields mark focus with an underline-weight edge.
      ...(focused ? { borderBottomWidth: 2, borderBottomColor: c.primary } : null),
    };
  }
  return {
    backgroundColor: c.background,
    borderWidth: focused ? Math.max(themeStyle.borderWidth, 1.5) : themeStyle.borderWidth,
    borderColor: focused ? c.ring : c.input,
  };
}

/** The backdrop behind dialogs and sheets: black in both schemes, at the style's opacity. */
export function scrim(): string {
  return `rgba(0, 0, 0, ${themeStyle.scrimOpacity})`;
}

/** Press feedback for Pressable styles: `style={({ pressed }) => [base, pressedStyle(pressed)]}`. */
export function pressedStyle(pressed: boolean): ViewStyle | undefined {
  if (!pressed) return undefined;
  return themeStyle.press === "opacity"
    ? { opacity: themeStyle.pressedOpacity }
    : { transform: [{ scale: themeStyle.pressedScale }] };
}
