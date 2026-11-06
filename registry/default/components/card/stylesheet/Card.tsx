/** Nativra — Card (StyleSheet). Install: npx nativra add card */
import React from "react";
import { StyleSheet, View, useColorScheme, type ViewProps } from "react-native";

export interface CardProps extends ViewProps {
  elevated?: boolean;
  padding?: "sm" | "md" | "lg";
}

const PAD = { sm: 12, md: 16, lg: 24 } as const;

export function Card({ elevated = false, padding = "md", style, ...rest }: CardProps) {
  const dark = useColorScheme() === "dark";
  return (
    <View
      style={[
        styles.base,
        { backgroundColor: dark ? "#18181b" : "#ffffff", borderColor: dark ? "#27272a" : "#e4e4e7", padding: PAD[padding] },
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

