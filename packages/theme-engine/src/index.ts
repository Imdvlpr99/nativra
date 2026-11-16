/**
 * @nativra/theme-engine
 *
 * Transforms semantic design tokens into NativeWind CSS variable definitions,
 * Tailwind configuration presets, and React Native StyleSheet-compatible plain objects.
 */

// ---------------------------------------------------------------------------
// Token definitions
// ---------------------------------------------------------------------------

/** A color token value — either a hex string or a CSS/RN color string */
export type ColorValue = string;

/** A spacing/sizing token value in dp (density-independent pixels) */
export type SpaceValue = number;

/** A border radius token value in dp */
export type RadiusValue = number;

/** A font size token value in sp (scale-independent pixels) */
export type FontSizeValue = number;

export interface ColorScale {
  "50": ColorValue;
  "100": ColorValue;
  "200": ColorValue;
  "300": ColorValue;
  "400": ColorValue;
  "500": ColorValue;
  "600": ColorValue;
  "700": ColorValue;
  "800": ColorValue;
  "900": ColorValue;
  "950": ColorValue;
}

export interface SemanticColors {
  background: ColorValue;
  foreground: ColorValue;
  card: ColorValue;
  "card-foreground": ColorValue;
  popover: ColorValue;
  "popover-foreground": ColorValue;
  primary: ColorValue;
  "primary-foreground": ColorValue;
  secondary: ColorValue;
  "secondary-foreground": ColorValue;
  muted: ColorValue;
  "muted-foreground": ColorValue;
  accent: ColorValue;
  "accent-foreground": ColorValue;
  destructive: ColorValue;
  "destructive-foreground": ColorValue;
  /** Positive states: completed, received, up-trends */
  success: ColorValue;
  "success-foreground": ColorValue;
  /** Caution states: pending, low balance, expiring */
  warning: ColorValue;
  "warning-foreground": ColorValue;
  /** Neutral information: tips, links to details */
  info: ColorValue;
  "info-foreground": ColorValue;
  border: ColorValue;
  input: ColorValue;
  ring: ColorValue;
}

export interface SpaceScale {
  "0": SpaceValue;
  "1": SpaceValue;
  "2": SpaceValue;
  "3": SpaceValue;
  "4": SpaceValue;
  "5": SpaceValue;
  "6": SpaceValue;
  "8": SpaceValue;
  "10": SpaceValue;
  "12": SpaceValue;
  "16": SpaceValue;
  "20": SpaceValue;
  "24": SpaceValue;
}

export interface RadiusScale {
  none: RadiusValue;
  sm: RadiusValue;
  md: RadiusValue;
  lg: RadiusValue;
  xl: RadiusValue;
  full: RadiusValue;
}

export interface FontSizeScale {
  xs: FontSizeValue;
  sm: FontSizeValue;
  base: FontSizeValue;
  lg: FontSizeValue;
  xl: FontSizeValue;
  "2xl": FontSizeValue;
  "3xl": FontSizeValue;
  "4xl": FontSizeValue;
}

/** One shadow level, applied as iOS shadow* props plus Android elevation. */
export interface ShadowToken {
  offsetY: number;
  /** Blur radius */
  radius: number;
  opacity: number;
  /** Android elevation */
  elevation: number;
}

/**
 * The theme's character beyond color: shape, depth, press feedback and heading type.
 * Components read radii by role (not by size), so one theme can make every button a pill
 * and another make it a crisp rectangle without touching component code.
 */
export interface ThemeStyle {
  radius: {
    /** Buttons and icon buttons */
    button: RadiusValue;
    /** Inputs, selects, segmented controls, small tiles */
    control: RadiusValue;
    /** Cards, list groups, stat tiles */
    card: RadiusValue;
    /** Dialogs, sheets, popovers, toasts */
    surface: RadiusValue;
    /** Badges, chips, tags */
    chip: RadiusValue;
    /** Checkboxes, tooltips, inline marks */
    small: RadiusValue;
  };
  borderWidth: number;
  shadow: {
    /** Resting cards */
    card: ShadowToken;
    /** Menus, toasts, floating buttons */
    raised: ShadowToken;
    /** Dialogs and sheets */
    overlay: ShadowToken;
  };
  /** Scale applied while a pressable is held (press: "scale") */
  pressedScale: number;
  /** Opacity of the black backdrop behind dialogs and sheets */
  scrimOpacity: number;
  fontWeight: {
    heading: "400" | "500" | "600" | "700" | "800";
    title: "500" | "600" | "700";
    label: "500" | "600";
  };
  /** Letter spacing for headings, in dp */
  headingLetterSpacing: number;
  /** Style preset id ("soft", "crisp", ...) */
  id: string;
  /** Display name */
  name: string;
  /** Multiplies every font size: 1 = the base design (body 16) */
  typeScale: number;
  /** Multiplies padding and gaps: < 1 compact, > 1 roomy */
  density: number;
  /**
   * How cards and grouped lists stand off the page:
   * - shadow: card color, border and a soft shadow
   * - ring:   card color, a faint ring instead of a border, and a soft shadow
   * - border: card color and a border, no shadow
   * - tonal:  a primary-tinted fill, no border or shadow
   * - fill:   a neutral grey fill, no border or shadow (grouped lists)
   */
  surface: "shadow" | "ring" | "border" | "tonal" | "fill";
  /** Text inputs: outlined on the page color, or filled with a neutral tint */
  field: "outline" | "filled";
  /** Press feedback: shrink slightly, or dim */
  press: "scale" | "opacity";
  /** Opacity while pressed (press: "opacity") */
  pressedOpacity: number;
  /** Buttons and inputs at their default size */
  control: {
    height: number;
    paddingX: number;
  };
}

export interface NativraThemeTokens {
  /** Theme identifier */
  id: string;
  /** Display name */
  name: string;
  /** Semantic colors for light mode */
  light: SemanticColors;
  /** Semantic colors for dark mode */
  dark: SemanticColors;
  space: SpaceScale;
  radius: RadiusScale;
  fontSize: FontSizeScale;
  /** Shape, depth and type character */
  style: ThemeStyle;
}

// ---------------------------------------------------------------------------
// Standard Layout Scales
// ---------------------------------------------------------------------------

export const defaultSpace: SpaceScale = {
  "0": 0,
  "1": 4,
  "2": 8,
  "3": 12,
  "4": 16,
  "5": 20,
  "6": 24,
  "8": 32,
  "10": 40,
  "12": 48,
  "16": 64,
  "20": 80,
  "24": 96,
};

export const defaultRadius: RadiusScale = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

/**
 * "Soft & friendly": pill buttons, generous rounding, soft layered shadows, confident headings.
 * The default character for every preset.
 */
export const softStyle: ThemeStyle = {
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

/** "Crisp" (shadcn/ui): small radii, hairline borders instead of shadows, compact and neutral. */
export const crispStyle: ThemeStyle = {
  id: "crisp",
  name: "Crisp",
  radius: { button: 8, control: 8, card: 12, surface: 14, chip: 6, small: 4 },
  borderWidth: 1,
  shadow: {
    card: { offsetY: 1, radius: 2, opacity: 0.05, elevation: 1 },
    raised: { offsetY: 4, radius: 12, opacity: 0.08, elevation: 4 },
    overlay: { offsetY: 10, radius: 30, opacity: 0.16, elevation: 10 },
  },
  pressedScale: 1,
  scrimOpacity: 0.6,
  fontWeight: { heading: "600", title: "600", label: "500" },
  headingLetterSpacing: -0.5,
  typeScale: 0.94,
  density: 0.9,
  surface: "border",
  field: "outline",
  press: "opacity",
  pressedOpacity: 0.8,
  control: { height: 40, paddingX: 16 },
};

/** "Tailwind" (Tailwind UI): medium radii, faint rings with layered shadows, roomy spacing. */
export const tailwindStyle: ThemeStyle = {
  id: "tailwind",
  name: "Tailwind",
  radius: { button: 10, control: 10, card: 16, surface: 20, chip: 9999, small: 6 },
  borderWidth: 1,
  shadow: {
    card: { offsetY: 2, radius: 8, opacity: 0.08, elevation: 2 },
    raised: { offsetY: 10, radius: 24, opacity: 0.12, elevation: 8 },
    overlay: { offsetY: 20, radius: 50, opacity: 0.22, elevation: 16 },
  },
  pressedScale: 0.98,
  scrimOpacity: 0.55,
  fontWeight: { heading: "700", title: "600", label: "600" },
  headingLetterSpacing: -0.6,
  typeScale: 1,
  density: 1.1,
  surface: "ring",
  field: "outline",
  press: "opacity",
  pressedOpacity: 0.85,
  control: { height: 44, paddingX: 18 },
};

/** "Material" (Material 3): large radii, tonal surfaces instead of borders, filled fields. */
export const materialStyle: ThemeStyle = {
  id: "material",
  name: "Material",
  radius: { button: 9999, control: 12, card: 16, surface: 28, chip: 8, small: 4 },
  borderWidth: 1,
  shadow: {
    card: { offsetY: 1, radius: 3, opacity: 0.12, elevation: 1 },
    raised: { offsetY: 2, radius: 6, opacity: 0.15, elevation: 3 },
    overlay: { offsetY: 4, radius: 12, opacity: 0.18, elevation: 6 },
  },
  pressedScale: 1,
  scrimOpacity: 0.32,
  fontWeight: { heading: "400", title: "500", label: "500" },
  headingLetterSpacing: 0,
  typeScale: 1,
  density: 1,
  surface: "tonal",
  field: "filled",
  press: "opacity",
  pressedOpacity: 0.88,
  control: { height: 48, paddingX: 24 },
};

/** "iOS" (Apple): grey grouped surfaces, hairlines, large bold titles, dimming press feedback. */
export const iosStyle: ThemeStyle = {
  id: "ios",
  name: "iOS",
  radius: { button: 12, control: 10, card: 12, surface: 14, chip: 9999, small: 6 },
  borderWidth: 0.5,
  shadow: {
    card: { offsetY: 1, radius: 2, opacity: 0.04, elevation: 1 },
    raised: { offsetY: 6, radius: 20, opacity: 0.12, elevation: 6 },
    overlay: { offsetY: 12, radius: 36, opacity: 0.2, elevation: 12 },
  },
  pressedScale: 1,
  scrimOpacity: 0.4,
  fontWeight: { heading: "700", title: "600", label: "600" },
  headingLetterSpacing: 0.35,
  typeScale: 1.06,
  density: 1,
  surface: "fill",
  field: "filled",
  press: "opacity",
  pressedOpacity: 0.55,
  control: { height: 50, paddingX: 20 },
};

/** Every style preset by id. A style is independent of the color theme. */
/**
 * Lookup tables keyed by ids that come from nativra.json, lockfiles and registries, so they have no
 * prototype: an id such as "constructor" must find nothing rather than an Object.prototype member.
 */
function presetTable<T>(entries: Record<string, T>): Record<string, T> {
  return Object.assign(Object.create(null) as Record<string, T>, entries);
}

export const STYLE_PRESETS: Record<string, ThemeStyle> = presetTable({
  soft: softStyle,
  crisp: crispStyle,
  tailwind: tailwindStyle,
  material: materialStyle,
  ios: iosStyle,
});

/** Style preset by id, falling back to "soft". */
export function getStylePreset(id: string | undefined): ThemeStyle {
  return (id && STYLE_PRESETS[id]) || softStyle;
}

/** Status colors shared by every preset (light). Each is >= 4.5:1 against its foreground. */
export const STATUS_LIGHT = {
  success: "#15803d",
  "success-foreground": "#ffffff",
  warning: "#b45309",
  "warning-foreground": "#ffffff",
  info: "#0369a1",
  "info-foreground": "#ffffff",
} as const;

/** Status colors shared by every preset (dark). */
export const STATUS_DARK = {
  success: "#4ade80",
  "success-foreground": "#052e16",
  warning: "#fbbf24",
  "warning-foreground": "#451a03",
  info: "#38bdf8",
  "info-foreground": "#082f49",
} as const;

export const defaultFontSize: FontSizeScale = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
};

// ---------------------------------------------------------------------------
// 8 Official Mobile Palettes (Section 5.2)
// ---------------------------------------------------------------------------

export const zincTheme: NativraThemeTokens = {
  id: "zinc",
  name: "Zinc (Default)",
  light: {
    ...STATUS_LIGHT,
    background: "#ffffff",
    foreground: "#09090b",
    card: "#ffffff",
    "card-foreground": "#09090b",
    popover: "#ffffff",
    "popover-foreground": "#09090b",
    primary: "#18181b",
    "primary-foreground": "#fafafa",
    secondary: "#f4f4f5",
    "secondary-foreground": "#18181b",
    muted: "#f4f4f5",
    "muted-foreground": "#71717a",
    accent: "#f4f4f5",
    "accent-foreground": "#18181b",
    destructive: "#ef4444",
    "destructive-foreground": "#fafafa",
    border: "#e4e4e7",
    input: "#e4e4e7",
    ring: "#18181b",
  },
  dark: {
    ...STATUS_DARK,
    background: "#09090b",
    foreground: "#fafafa",
    card: "#09090b",
    "card-foreground": "#fafafa",
    popover: "#09090b",
    "popover-foreground": "#fafafa",
    primary: "#fafafa",
    "primary-foreground": "#18181b",
    secondary: "#27272a",
    "secondary-foreground": "#fafafa",
    muted: "#27272a",
    "muted-foreground": "#a1a1aa",
    accent: "#27272a",
    "accent-foreground": "#fafafa",
    destructive: "#f87171",
    "destructive-foreground": "#450a0a",
    border: "#27272a",
    input: "#27272a",
    ring: "#d4d4d8",
  },
  space: defaultSpace,
  radius: defaultRadius,
  fontSize: defaultFontSize,
  style: softStyle,
};

export const slateTheme: NativraThemeTokens = {
  id: "slate",
  name: "Slate",
  light: {
    ...STATUS_LIGHT,
    background: "#ffffff",
    foreground: "#0f172a",
    card: "#ffffff",
    "card-foreground": "#0f172a",
    popover: "#ffffff",
    "popover-foreground": "#0f172a",
    primary: "#0f172a",
    "primary-foreground": "#f8fafc",
    secondary: "#f1f5f9",
    "secondary-foreground": "#0f172a",
    muted: "#f1f5f9",
    "muted-foreground": "#64748b",
    accent: "#f1f5f9",
    "accent-foreground": "#0f172a",
    destructive: "#ef4444",
    "destructive-foreground": "#f8fafc",
    border: "#e2e8f0",
    input: "#e2e8f0",
    ring: "#0f172a",
  },
  dark: {
    ...STATUS_DARK,
    background: "#020617",
    foreground: "#f8fafc",
    card: "#020617",
    "card-foreground": "#f8fafc",
    popover: "#020617",
    "popover-foreground": "#f8fafc",
    primary: "#f8fafc",
    "primary-foreground": "#0f172a",
    secondary: "#1e293b",
    "secondary-foreground": "#f8fafc",
    muted: "#1e293b",
    "muted-foreground": "#94a3b8",
    accent: "#1e293b",
    "accent-foreground": "#f8fafc",
    destructive: "#f87171",
    "destructive-foreground": "#450a0a",
    border: "#1e293b",
    input: "#1e293b",
    ring: "#cbd5e1",
  },
  space: defaultSpace,
  radius: defaultRadius,
  fontSize: defaultFontSize,
  style: softStyle,
};

export const emeraldTheme: NativraThemeTokens = {
  id: "emerald",
  name: "Emerald",
  light: {
    ...STATUS_LIGHT,
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
  },
  dark: {
    ...STATUS_DARK,
    background: "#022c22",
    foreground: "#ecfdf5",
    card: "#064e3b",
    "card-foreground": "#ecfdf5",
    popover: "#064e3b",
    "popover-foreground": "#ecfdf5",
    primary: "#10b981",
    "primary-foreground": "#022c22",
    secondary: "#065f46",
    "secondary-foreground": "#ecfdf5",
    muted: "#065f46",
    "muted-foreground": "#6ee7b7",
    accent: "#047857",
    "accent-foreground": "#ecfdf5",
    destructive: "#f87171",
    "destructive-foreground": "#450a0a",
    border: "#047857",
    input: "#047857",
    ring: "#10b981",
  },
  space: defaultSpace,
  radius: defaultRadius,
  fontSize: defaultFontSize,
  style: softStyle,
};

export const violetTheme: NativraThemeTokens = {
  id: "violet",
  name: "Violet",
  light: {
    ...STATUS_LIGHT,
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
  },
  dark: {
    ...STATUS_DARK,
    background: "#0f0728",
    foreground: "#f5f3ff",
    card: "#1e103a",
    "card-foreground": "#f5f3ff",
    popover: "#1e103a",
    "popover-foreground": "#f5f3ff",
    primary: "#8b5cf6",
    "primary-foreground": "#0f0728",
    secondary: "#2e1065",
    "secondary-foreground": "#f5f3ff",
    muted: "#2e1065",
    "muted-foreground": "#c4b5fd",
    accent: "#3b0764",
    "accent-foreground": "#f5f3ff",
    destructive: "#f87171",
    "destructive-foreground": "#450a0a",
    border: "#3b0764",
    input: "#3b0764",
    ring: "#8b5cf6",
  },
  space: defaultSpace,
  radius: defaultRadius,
  fontSize: defaultFontSize,
  style: softStyle,
};

export const roseTheme: NativraThemeTokens = {
  id: "rose",
  name: "Rose",
  light: {
    ...STATUS_LIGHT,
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
  },
  dark: {
    ...STATUS_DARK,
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
  },
  space: defaultSpace,
  radius: defaultRadius,
  fontSize: defaultFontSize,
  style: softStyle,
};

export const amberTheme: NativraThemeTokens = {
  id: "amber",
  name: "Amber",
  light: {
    ...STATUS_LIGHT,
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
  },
  dark: {
    ...STATUS_DARK,
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
  },
  space: defaultSpace,
  radius: defaultRadius,
  fontSize: defaultFontSize,
  style: softStyle,
};

export const orangeTheme: NativraThemeTokens = {
  id: "orange",
  name: "Orange",
  light: {
    ...STATUS_LIGHT,
    background: "#ffffff",
    foreground: "#431407",
    card: "#ffffff",
    "card-foreground": "#431407",
    popover: "#ffffff",
    "popover-foreground": "#431407",
    primary: "#ea580c",
    "primary-foreground": "#ffffff",
    secondary: "#fff7ed",
    "secondary-foreground": "#9a3412",
    muted: "#fff7ed",
    "muted-foreground": "#c2410c",
    accent: "#ffedd5",
    "accent-foreground": "#9a3412",
    destructive: "#ef4444",
    "destructive-foreground": "#ffffff",
    border: "#fed7aa",
    input: "#fed7aa",
    ring: "#ea580c",
  },
  dark: {
    ...STATUS_DARK,
    background: "#1e0903",
    foreground: "#fff7ed",
    card: "#431407",
    "card-foreground": "#fff7ed",
    popover: "#431407",
    "popover-foreground": "#fff7ed",
    primary: "#f97316",
    "primary-foreground": "#1e0903",
    secondary: "#7c2d12",
    "secondary-foreground": "#fff7ed",
    muted: "#7c2d12",
    "muted-foreground": "#fdba74",
    accent: "#9a3412",
    "accent-foreground": "#fff7ed",
    destructive: "#f87171",
    "destructive-foreground": "#450a0a",
    border: "#9a3412",
    input: "#9a3412",
    ring: "#f97316",
  },
  space: defaultSpace,
  radius: defaultRadius,
  fontSize: defaultFontSize,
  style: softStyle,
};

export const cyanTheme: NativraThemeTokens = {
  id: "cyan",
  name: "Cyan",
  light: {
    ...STATUS_LIGHT,
    background: "#ffffff",
    foreground: "#083344",
    card: "#ffffff",
    "card-foreground": "#083344",
    popover: "#ffffff",
    "popover-foreground": "#083344",
    primary: "#0891b2",
    "primary-foreground": "#ffffff",
    secondary: "#ecfeff",
    "secondary-foreground": "#155e75",
    muted: "#ecfeff",
    "muted-foreground": "#0e7490",
    accent: "#cffafe",
    "accent-foreground": "#155e75",
    destructive: "#ef4444",
    "destructive-foreground": "#ffffff",
    border: "#a5f3fc",
    input: "#a5f3fc",
    ring: "#0891b2",
  },
  dark: {
    ...STATUS_DARK,
    background: "#031d28",
    foreground: "#ecfeff",
    card: "#083344",
    "card-foreground": "#ecfeff",
    popover: "#083344",
    "popover-foreground": "#ecfeff",
    primary: "#06b6d4",
    "primary-foreground": "#031d28",
    secondary: "#155e75",
    "secondary-foreground": "#ecfeff",
    muted: "#155e75",
    "muted-foreground": "#67e8f9",
    accent: "#164e63",
    "accent-foreground": "#ecfeff",
    destructive: "#f87171",
    "destructive-foreground": "#450a0a",
    border: "#164e63",
    input: "#164e63",
    ring: "#06b6d4",
  },
  space: defaultSpace,
  radius: defaultRadius,
  fontSize: defaultFontSize,
  style: softStyle,
};

export const midnightTheme: NativraThemeTokens = {
  id: "midnight",
  name: "Midnight",
  light: {
    ...STATUS_LIGHT,
    background: "#f8fafc",
    foreground: "#0b0f19",
    card: "#ffffff",
    "card-foreground": "#0b0f19",
    popover: "#ffffff",
    "popover-foreground": "#0b0f19",
    primary: "#1d4ed8",
    "primary-foreground": "#ffffff",
    secondary: "#f1f5f9",
    "secondary-foreground": "#0f172a",
    muted: "#f1f5f9",
    "muted-foreground": "#64748b",
    accent: "#e2e8f0",
    "accent-foreground": "#0f172a",
    destructive: "#ef4444",
    "destructive-foreground": "#ffffff",
    border: "#cbd5e1",
    input: "#cbd5e1",
    ring: "#1d4ed8",
  },
  dark: {
    ...STATUS_DARK,
    background: "#0b0f19",
    foreground: "#f8fafc",
    card: "#111827",
    "card-foreground": "#f8fafc",
    popover: "#111827",
    "popover-foreground": "#f8fafc",
    primary: "#3b82f6",
    "primary-foreground": "#ffffff",
    secondary: "#1e293b",
    "secondary-foreground": "#f8fafc",
    muted: "#1e293b",
    "muted-foreground": "#94a3b8",
    accent: "#1d4ed8",
    "accent-foreground": "#ffffff",
    destructive: "#f87171",
    "destructive-foreground": "#450a0a",
    border: "#1f2937",
    input: "#1f2937",
    ring: "#60a5fa",
  },
  space: defaultSpace,
  radius: defaultRadius,
  fontSize: defaultFontSize,
  style: softStyle,
};

export const darkSlateTheme: NativraThemeTokens = {
  id: "dark-slate",
  name: "Dark Slate",
  light: {
    ...STATUS_LIGHT,
    background: "#f8fafc",
    foreground: "#0f172a",
    card: "#ffffff",
    "card-foreground": "#0f172a",
    popover: "#ffffff",
    "popover-foreground": "#0f172a",
    primary: "#0284c7",
    "primary-foreground": "#ffffff",
    secondary: "#f1f5f9",
    "secondary-foreground": "#0f172a",
    muted: "#f1f5f9",
    "muted-foreground": "#64748b",
    accent: "#e2e8f0",
    "accent-foreground": "#0f172a",
    destructive: "#ef4444",
    "destructive-foreground": "#ffffff",
    border: "#cbd5e1",
    input: "#cbd5e1",
    ring: "#0284c7",
  },
  dark: {
    ...STATUS_DARK,
    background: "#0f172a",
    foreground: "#f8fafc",
    card: "#1e293b",
    "card-foreground": "#f8fafc",
    popover: "#1e293b",
    "popover-foreground": "#f8fafc",
    primary: "#38bdf8",
    "primary-foreground": "#0f172a",
    secondary: "#334155",
    "secondary-foreground": "#f8fafc",
    muted: "#334155",
    "muted-foreground": "#94a3b8",
    accent: "#0369a1",
    "accent-foreground": "#ffffff",
    destructive: "#f87171",
    "destructive-foreground": "#450a0a",
    border: "#334155",
    input: "#334155",
    ring: "#38bdf8",
  },
  space: defaultSpace,
  radius: defaultRadius,
  fontSize: defaultFontSize,
  style: softStyle,
};

export const THEME_PRESETS: Record<string, NativraThemeTokens> = presetTable({
  zinc: zincTheme,
  slate: slateTheme,
  "dark-slate": darkSlateTheme,
  emerald: emeraldTheme,
  midnight: midnightTheme,
  violet: violetTheme,
  rose: roseTheme,
  amber: amberTheme,
  orange: orangeTheme,
  cyan: cyanTheme,
});

export function getThemePreset(id: string): NativraThemeTokens {
  return THEME_PRESETS[id.toLowerCase()] ?? zincTheme;
}

export const defaultTheme: NativraThemeTokens = zincTheme;

// ---------------------------------------------------------------------------
// StyleSheet adapter
// ---------------------------------------------------------------------------

/**
 * Converts theme tokens into a React Native StyleSheet-compatible flat object.
 */
export function toStyleSheetTokens(theme: NativraThemeTokens, colorScheme: "light" | "dark" = "light") {
  const colors = theme[colorScheme];
  return {
    colors,
    space: theme.space,
    radius: theme.radius,
    fontSize: theme.fontSize,
    style: theme.style,
  };
}

// ---------------------------------------------------------------------------
// Density Presets, Font Scale Tiers, Typography Scale & High-Contrast Mode
// ---------------------------------------------------------------------------

export type DensityPreset = "compact" | "regular" | "comfortable";
export type FontScaleTier = "sm" | "md" | "lg" | "xl";

export interface TypographyVariantSpec {
  fontSize: number;
  lineHeight: number;
  fontWeight: "400" | "500" | "600" | "700" | "800";
  letterSpacing: number;
  tabularNums?: boolean;
}

export type TypographyVariantName =
  | "displayLarge"
  | "displayMedium"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "bodyLarge"
  | "body"
  | "bodySmall"
  | "label"
  | "caption"
  | "overline";

export type TypographyScale = Record<TypographyVariantName, TypographyVariantSpec>;

const DENSITY_MULTIPLIERS: Record<DensityPreset, number> = {
  compact: 0.85,
  regular: 1.0,
  comfortable: 1.15,
};

const FONT_SCALE_MULTIPLIERS: Record<FontScaleTier, number> = {
  sm: 0.9,
  md: 1.0,
  lg: 1.125,
  xl: 1.25,
};

export const BASE_TYPOGRAPHY_SCALE: TypographyScale = {
  displayLarge: { fontSize: 34, lineHeight: 41, fontWeight: "700", letterSpacing: -0.6, tabularNums: true },
  displayMedium: { fontSize: 28, lineHeight: 34, fontWeight: "700", letterSpacing: -0.4, tabularNums: true },
  h1: { fontSize: 28, lineHeight: 34, fontWeight: "600", letterSpacing: -0.4 },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: "600", letterSpacing: -0.3 },
  h3: { fontSize: 18, lineHeight: 24, fontWeight: "600", letterSpacing: -0.2 },
  h4: { fontSize: 16, lineHeight: 22, fontWeight: "600", letterSpacing: -0.1 },
  bodyLarge: { fontSize: 17, lineHeight: 24, fontWeight: "500", letterSpacing: 0 },
  body: { fontSize: 15, lineHeight: 22, fontWeight: "400", letterSpacing: 0 },
  bodySmall: { fontSize: 13, lineHeight: 18, fontWeight: "400", letterSpacing: 0 },
  label: { fontSize: 14, lineHeight: 20, fontWeight: "600", letterSpacing: 0.1 },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "500", letterSpacing: 0.2, tabularNums: true },
  overline: { fontSize: 11, lineHeight: 14, fontWeight: "700", letterSpacing: 0.8 },
};

/**
 * Computes a density- and font-scale-adjusted typography scale.
 */
export function getTypographyScale(
  density: DensityPreset = "regular",
  fontScale: FontScaleTier = "md"
): TypographyScale {
  const densityFactor = density === "compact" ? 0.94 : density === "comfortable" ? 1.06 : 1.0;
  const fontFactor = FONT_SCALE_MULTIPLIERS[fontScale] ?? 1.0;
  const multiplier = densityFactor * fontFactor;

  const result = {} as TypographyScale;
  for (const [key, spec] of Object.entries(BASE_TYPOGRAPHY_SCALE) as Array<[TypographyVariantName, TypographyVariantSpec]>) {
    result[key] = {
      ...spec,
      fontSize: Math.round(spec.fontSize * multiplier),
      lineHeight: Math.round(spec.lineHeight * multiplier),
    };
  }
  return result;
}

/**
 * Applies WCAG AAA high-contrast adjustments to a semantic color set.
 */
export function applyHighContrast(
  colors: SemanticColors,
  colorScheme: "light" | "dark" = "light"
): SemanticColors {
  if (colorScheme === "dark") {
    return {
      ...colors,
      background: "#000000",
      foreground: "#ffffff",
      card: "#09090b",
      "card-foreground": "#ffffff",
      "muted-foreground": "#e4e4e7",
      border: "#71717a",
      input: "#71717a",
    };
  }
  return {
    ...colors,
    background: "#ffffff",
    foreground: "#000000",
    card: "#ffffff",
    "card-foreground": "#000000",
    "muted-foreground": "#27272a",
    border: "#52525b",
    input: "#52525b",
  };
}

export interface ResolveThemeOptions {
  colorScheme?: "light" | "dark";
  density?: DensityPreset;
  fontScale?: FontScaleTier;
  highContrast?: boolean;
}

/**
 * Resolves a complete Nativra theme configuration with density-scaled spacing,
 * dynamic font-scale typography, and optional high-contrast accessibility tokens.
 */
export function resolveThemeTokens(
  theme: NativraThemeTokens,
  options: ResolveThemeOptions = {}
) {
  const {
    colorScheme = "light",
    density = "regular",
    fontScale = "md",
    highContrast = false,
  } = options;

  const baseColors = theme[colorScheme];
  const colors = highContrast ? applyHighContrast(baseColors, colorScheme) : baseColors;
  const spaceMultiplier = DENSITY_MULTIPLIERS[density] ?? 1.0;

  const space = Object.fromEntries(
    Object.entries(theme.space).map(([k, v]) => [k, Math.round(v * spaceMultiplier)])
  ) as unknown as SpaceScale;

  const typography = getTypographyScale(density, fontScale);

  return {
    id: theme.id,
    name: theme.name,
    colorScheme,
    density,
    fontScale,
    highContrast,
    colors,
    space,
    radius: theme.radius,
    fontSize: theme.fontSize,
    typography,
  };
}

// ---------------------------------------------------------------------------
// NativeWind / CSS variable adapter
// ---------------------------------------------------------------------------

/**
 * Converts theme tokens into a CSS custom property block suitable for
 * embedding in a global CSS file (used by NativeWind / web target).
 */
/** "#18181b" -> "24 24 27". Accepts 3- or 6-digit hex; anything else is returned unchanged. */
export function hexToRgbChannels(hex: string): string {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const full = m[1]!.length === 3 ? m[1]!.split("").map((c) => c + c).join("") : m[1]!;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

export function toCssVariables(theme: NativraThemeTokens): string {
  const lines: string[] = [];

  // Space-separated RGB channels, so Tailwind opacity modifiers work:
  // rgb(var(--color-primary) / <alpha-value>) -> bg-primary/10
  const colorVars = (colors: SemanticColors, indent: string) =>
    Object.entries(colors).map(([key, value]) => `${indent}--color-${key}: ${hexToRgbChannels(String(value))};`);

  lines.push(":root {", ...colorVars(theme.light, "  "), "}");
  // A media query needs its own block around the rule; "@media (...) :root {" is invalid CSS.
  lines.push("@media (prefers-color-scheme: dark) {", "  :root {", ...colorVars(theme.dark, "    "), "  }", "}");

  lines.push(`:root {`);
  for (const [key, value] of Object.entries(theme.space)) {
    lines.push(`  --space-${key}: ${value}px;`);
  }
  for (const [key, value] of Object.entries(theme.radius)) {
    lines.push(`  --radius-${key}: ${value}px;`);
  }
  for (const [key, value] of Object.entries(theme.fontSize)) {
    lines.push(`  --font-size-${key}: ${value}px;`);
  }
  lines.push(`}`);

  return lines.join("\n");
}

/**
 * Converts theme tokens into a Tailwind CSS theme.extend configuration object.
 */
/**
 * Semantic shape classes for NativeWind components (`rounded-button`, `rounded-card`,
 * `rounded-t-surface`, ...), generated from the theme's style tokens. The CLI writes them into
 * global.css next to the color variables, so installing a theme changes the UI's shape too.
 */
export function toStyleCss(theme: NativraThemeTokens, style: ThemeStyle = theme.style): string {
  const sides: Record<string, string[]> = {
    "": ["border-radius"],
    t: ["border-top-left-radius", "border-top-right-radius"],
    b: ["border-bottom-left-radius", "border-bottom-right-radius"],
  };
  const rules: string[] = [`/* style: ${style.id} */`];
  for (const [role, value] of Object.entries(style.radius)) {
    for (const [side, props] of Object.entries(sides)) {
      const name = side ? `rounded-${side}-${role}` : `rounded-${role}`;
      rules.push(`.${name} { ${props.map((p) => `${p}: ${value}px;`).join(" ")} }`);
    }
  }
  // The backdrop behind dialogs and sheets stays dark in both color schemes.
  rules.push(`.bg-scrim { background-color: rgba(0, 0, 0, ${style.scrimOpacity}); }`);

  // Type scale: type-* replaces Tailwind's text-* sizes so the style can resize all text.
  for (const [step, [size, lineHeight]] of Object.entries(TYPE_STEPS)) {
    rules.push(`.type-${step} { font-size: ${typeSize(style, size)}px; line-height: ${typeSize(style, lineHeight)}px; }`);
  }
  rules.push(
    `.weight-heading { font-weight: ${style.fontWeight.heading}; letter-spacing: ${style.headingLetterSpacing}px; }`,
    `.weight-title { font-weight: ${style.fontWeight.title}; }`,
    `.weight-label { font-weight: ${style.fontWeight.label}; }`
  );

  // Density: sp-<utility>-<step> mirrors Tailwind's spacing (step × 0.25rem) scaled by the
  // style's density, so components can follow it without changing Tailwind's own p-4 for the app.
  for (const [utility, props] of Object.entries(SPACING_UTILITIES)) {
    for (const step of SPACING_STEPS) {
      const value = `${+(step * 0.25 * style.density).toFixed(4)}rem`;
      const name = `sp-${utility}-${String(step).replace(".", "\\.")}`;
      rules.push(`.${name} { ${props.map((p) => `${p}: ${value};`).join(" ")} }`);
    }
  }

  // Controls and surfaces.
  rules.push(
    `.h-control { height: ${style.control.height}px; }`,
    `.min-h-control { min-height: ${style.control.height}px; }`,
    `.px-control { padding-left: ${style.control.paddingX}px; padding-right: ${style.control.paddingX}px; }`,
    `.surface { ${surfaceCss(style)} }`,
    `.field { ${
      style.field === "filled"
        ? "background-color: rgb(var(--color-foreground) / 0.06); border-width: 0px;"
        : `background-color: rgb(var(--color-background)); border-width: ${style.borderWidth}px; border-color: rgb(var(--color-input));`
    } }`
  );
  return rules.join("\n");
}

/** Spacing utilities that get a density-aware sp-* twin, and the CSS properties they set. */
export const SPACING_UTILITIES: Record<string, string[]> = {
  p: ["padding"],
  px: ["padding-left", "padding-right"],
  py: ["padding-top", "padding-bottom"],
  pt: ["padding-top"],
  pb: ["padding-bottom"],
  pl: ["padding-left"],
  pr: ["padding-right"],
  gap: ["gap"],
  "gap-x": ["column-gap"],
  "gap-y": ["row-gap"],
};

/** Tailwind spacing steps with a density-aware twin. */
export const SPACING_STEPS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 10, 12];

/** Tailwind's text-* steps in the base design: [font size, line height] in px. */
export const TYPE_STEPS: Record<string, [number, number]> = {
  "2xs": [11, 14],
  xs: [12, 16],
  sm: [14, 20],
  base: [16, 24],
  lg: [18, 28],
  xl: [20, 28],
  "2xl": [24, 32],
  "3xl": [30, 36],
  "4xl": [36, 40],
};

/** A base-design font size in this style. */
export function typeSize(style: ThemeStyle, px: number): number {
  return Math.round(px * style.typeScale);
}

function surfaceCss(style: ThemeStyle): string {
  const width = `${style.borderWidth}px`;
  switch (style.surface) {
    case "ring":
      return `background-color: rgb(var(--color-card)); border-width: ${width}; border-color: rgb(var(--color-foreground) / 0.08);`;
    case "tonal":
      return "background-color: rgb(var(--color-primary) / 0.07); border-width: 0px;";
    case "fill":
      return "background-color: rgb(var(--color-foreground) / 0.05); border-width: 0px;";
    default:
      return `background-color: rgb(var(--color-card)); border-width: ${width}; border-color: rgb(var(--color-border));`;
  }
}

export function toTailwindPreset(theme: NativraThemeTokens): Record<string, unknown> {
  return {
    theme: {
      extend: {
        colors: {
          background: "rgb(var(--color-background) / <alpha-value>)",
          foreground: "rgb(var(--color-foreground) / <alpha-value>)",
          card: {
            DEFAULT: "rgb(var(--color-card) / <alpha-value>)",
            foreground: "rgb(var(--color-card-foreground) / <alpha-value>)",
          },
          popover: {
            DEFAULT: "rgb(var(--color-popover) / <alpha-value>)",
            foreground: "rgb(var(--color-popover-foreground) / <alpha-value>)",
          },
          primary: {
            DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
            foreground: "rgb(var(--color-primary-foreground) / <alpha-value>)",
          },
          secondary: {
            DEFAULT: "rgb(var(--color-secondary) / <alpha-value>)",
            foreground: "rgb(var(--color-secondary-foreground) / <alpha-value>)",
          },
          muted: {
            DEFAULT: "rgb(var(--color-muted) / <alpha-value>)",
            foreground: "rgb(var(--color-muted-foreground) / <alpha-value>)",
          },
          accent: {
            DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
            foreground: "rgb(var(--color-accent-foreground) / <alpha-value>)",
          },
          destructive: {
            DEFAULT: "rgb(var(--color-destructive) / <alpha-value>)",
            foreground: "rgb(var(--color-destructive-foreground) / <alpha-value>)",
          },
          success: {
            DEFAULT: "rgb(var(--color-success) / <alpha-value>)",
            foreground: "rgb(var(--color-success-foreground) / <alpha-value>)",
          },
          warning: {
            DEFAULT: "rgb(var(--color-warning) / <alpha-value>)",
            foreground: "rgb(var(--color-warning-foreground) / <alpha-value>)",
          },
          info: {
            DEFAULT: "rgb(var(--color-info) / <alpha-value>)",
            foreground: "rgb(var(--color-info-foreground) / <alpha-value>)",
          },
          border: "rgb(var(--color-border) / <alpha-value>)",
          input: "rgb(var(--color-input) / <alpha-value>)",
          ring: "rgb(var(--color-ring) / <alpha-value>)",
        },
        borderRadius: {
          sm: `${theme.radius.sm}px`,
          md: `${theme.radius.md}px`,
          lg: `${theme.radius.lg}px`,
          xl: `${theme.radius.xl}px`,
        },
      },
    },
  };
}

export { defaultTheme as default };
