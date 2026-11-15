/** Nativra — Card (NativeWind). Install: npx nativra-cli add card */
import React from "react";
import { View, type ViewProps } from "react-native";
import { elevation, themeStyle } from "@/hooks/use-theme-colors";

export interface CardProps extends ViewProps {
  /** Lift the card off the page: a solid card with the style's "raised" shadow */
  elevated?: boolean;
  padding?: "sm" | "md" | "lg";
}

const PAD = { sm: "sp-p-3", md: "sp-p-5", lg: "sp-p-6" } as const;

/** Tinted and grey surfaces read as flat; an elevated card is solid in every style. */
const FLAT_SURFACE = themeStyle.surface === "tonal" || themeStyle.surface === "fill";

export function Card({ elevated = false, padding = "md", className, style, ...rest }: CardProps & { className?: string }) {
  // `surface` comes from the installed style: bordered, ringed, tinted or grey.
  // A hairline keeps an elevated card's edge visible in dark mode, where shadows disappear.
  const look = elevated && FLAT_SURFACE ? "bg-card border border-border" : "surface";
  return (
    <View
      className={`rounded-card ${look} ${PAD[padding]} ${className ?? ""}`}
      style={[elevation(elevated ? "raised" : "card"), style]}
      {...rest}
    />
  );
}
