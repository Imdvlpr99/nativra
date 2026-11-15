/** Nativra — Card (StyleSheet). Install: npx nativra-cli add card */
import React from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import { elevation, useThemeColors, themeStyle } from "@/hooks/use-theme-colors";

export interface CardProps extends ViewProps {
  /** Lift the card higher off the page (the theme's "raised" shadow instead of "card") */
  elevated?: boolean;
  padding?: "sm" | "md" | "lg";
}

const PAD = { sm: 12, md: 20, lg: 24 } as const;

export function Card({ elevated = false, padding = "md", style, ...rest }: CardProps) {
  const c = useThemeColors();
  return (
    <View
      style={[
        styles.base,
        { backgroundColor: c.card, borderColor: c.border, padding: PAD[padding] },
        elevation(elevated ? "raised" : "card"),
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: { borderWidth: themeStyle.borderWidth, borderRadius: themeStyle.radius.card },
});
