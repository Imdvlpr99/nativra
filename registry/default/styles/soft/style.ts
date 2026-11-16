/**
 * Nativra style — Soft. Edit freely; you own this file.
 * Generated from @nativra/theme-engine by scripts/generate-themes.mjs — do not edit in the registry.
 *
 * The UI's character, independent of its colors: radii by role, shadows, type scale, density,
 * surfaces, input fields and press feedback. Every component reads it through use-theme-colors,
 * so installing another style (npx nativra-cli style add <id>) restyles the whole app.
 */
export const themeStyle = {
  id: "soft",
  name: "Soft",
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
  typeScale: 1,
  density: 1,
  surface: "shadow",
  field: "outline",
  press: "scale",
  pressedOpacity: 0.7,
  control: {
    height: 46,
    paddingX: 20,
  },
} as const;
