/** Nativra — Card (StyleSheet). Install: npx nativra-cli add card */
import React from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import { useThemeColors } from "@/hooks/use-theme-colors";

export interface CardProps extends ViewProps {
  elevated?: boolean;
  padding?: "sm" | "md" | "lg";
}

const PAD = { sm: 12, md: 16, lg: 24 } as const;

export function Card({ elevated = false, padding = "md", style, ...rest }: CardProps) {
  const c = useThemeColors();
  return (
    <View
      style={[
        styles.base,
        { backgroundColor: c.background, borderColor: c.border, padding: PAD[padding] },
        elevated && styles.elevated,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: { borderWidth: 1, borderRadius: 12 },
  elevated: { elevation: 4, shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
});

