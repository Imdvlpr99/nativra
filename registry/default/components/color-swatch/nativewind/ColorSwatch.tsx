/** Nativra — ColorSwatch (NativeWind). Install: npx nativra-cli add color-swatch */
import React from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { Check } from "lucide-react-native";
import { type ThemeColors, alpha, useThemeColors } from "@/hooks/use-theme-colors";

export interface SwatchOption {
  /** Any React Native color: "#1e3a8a", "rgb(…)", or a theme token you resolved. */
  color: string;
  /** What a screen reader says, e.g. "Navy". Required: a color alone means nothing to it. */
  label: string;
  disabled?: boolean;
}

export interface ColorSwatchProps {
  options: readonly SwatchOption[];
  /** The selected option's color. */
  value?: string;
  onChange?: (color: string) => void;
  size?: "sm" | "md" | "lg";
  /** Group label for screen readers, e.g. "Color". */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

const SIZE = { sm: 24, md: 32, lg: 40 } as const;

/** "#fff", "#ffffff" or "#ffffffaa" -> relative luminance, or null for other color formats. */
function luminance(color: string): number | null {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})([0-9a-f]{2})?$/i.exec(color.trim());
  if (!m?.[1]) return null;
  const hex = m[1].length === 3 ? m[1].replace(/./g, (ch) => ch + ch) : m[1];
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** The check mark's color: whichever of the theme's foreground and background stands out more on the swatch. */
function contrastingToken(swatch: string, c: ThemeColors): string {
  const s = luminance(swatch);
  const fg = luminance(c.foreground);
  const bg = luminance(c.background);
  if (s === null || fg === null || bg === null) return c.foreground;
  return Math.abs(fg - s) >= Math.abs(bg - s) ? c.foreground : c.background;
}

/** A row of color choices, e.g. product variants. Works as a radio group for screen readers. */
export function ColorSwatch({ options, value, onChange, size = "md", accessibilityLabel = "Color", style, className = "" }: ColorSwatchProps) {
  const palette = useThemeColors();
  const d = SIZE[size];

  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={accessibilityLabel} className={`flex-row flex-wrap sp-gap-2 ${className}`} style={style}>
      {options.map((o) => {
        const selected = o.color === value;
        return (
          <Pressable
            key={`${o.color}-${o.label}`}
            onPress={() => onChange?.(o.color)}
            disabled={o.disabled}
            accessibilityRole="radio"
            accessibilityLabel={o.label}
            accessibilityState={{ checked: selected, disabled: Boolean(o.disabled) }} aria-checked={selected}
            hitSlop={Math.max(0, (44 - d - 8) / 2)}
            className={`items-center justify-center rounded-full border-2 ${selected ? "border-foreground" : "border-transparent"}`}
            style={{ width: d + 8, height: d + 8 }}
          >
            <View
              className={`items-center justify-center rounded-full ${o.disabled ? "opacity-35" : ""}`}
              // A hairline keeps white swatches visible on a white background.
              style={{
                width: d,
                height: d,
                backgroundColor: o.color,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: alpha(palette.foreground, 0.15),
              }}
            >
              {selected ? <Check size={d * 0.5} color={contrastingToken(o.color, palette)} strokeWidth={3} /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
