/** Nativra — Card (StyleSheet). Install: npx nativra-cli add card */
import React from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import { elevation, sp, surface, themeStyle, useThemeColors } from "@/hooks/use-theme-colors";

export interface CardProps extends ViewProps {
  /** Lift the card off the page: a solid card with the style's "raised" shadow */
  elevated?: boolean;
  padding?: "sm" | "md" | "lg";
}

const PAD = { sm: sp(12), md: sp(20), lg: sp(24) } as const;

/** Tinted and grey surfaces read as flat; an elevated card is solid in every style. */
const FLAT_SURFACE = themeStyle.surface === "tonal" || themeStyle.surface === "fill";

export function Card({ elevated = false, padding = "md", style, ...rest }: CardProps) {
  const c = useThemeColors();
  return (
    <View
      style={[
        styles.base,
        // A hairline keeps the card's edge visible in dark mode, where shadows disappear.
        elevated && FLAT_SURFACE ? { backgroundColor: c.card, borderWidth: themeStyle.borderWidth, borderColor: c.border } : surface(c),
        { padding: PAD[padding] },
        elevated && elevation("raised"),
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: themeStyle.radius.card },
});
