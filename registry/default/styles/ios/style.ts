/**
 * Nativra style — iOS. Edit freely; you own this file.
 * Generated from @nativra/theme-engine by scripts/generate-themes.mjs — do not edit in the registry.
 *
 * The UI's character, independent of its colors: radii by role, shadows, type scale, density,
 * surfaces, input fields and press feedback. Every component reads it through use-theme-colors,
 * so installing another style (npx nativra-cli style add <id>) restyles the whole app.
 */
export const themeStyle = {
  id: "ios",
  name: "iOS",
  radius: {
    button: 12,
    control: 10,
    card: 12,
    surface: 14,
    chip: 9999,
    small: 6,
  },
  borderWidth: 0.5,
  shadow: {
    card: {
      offsetY: 1,
      radius: 2,
      opacity: 0.04,
      elevation: 1,
    },
    raised: {
      offsetY: 6,
      radius: 20,
      opacity: 0.12,
      elevation: 6,
    },
    overlay: {
      offsetY: 12,
      radius: 36,
      opacity: 0.2,
      elevation: 12,
    },
  },
  pressedScale: 1,
  scrimOpacity: 0.4,
  fontWeight: {
    heading: "700",
    title: "600",
    label: "600",
  },
  headingLetterSpacing: 0.35,
  typeScale: 1.06,
  density: 1,
  surface: "fill",
  field: "filled",
  press: "opacity",
  pressedOpacity: 0.55,
  control: {
    height: 50,
    paddingX: 20,
  },
} as const;
