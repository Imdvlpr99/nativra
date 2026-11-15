/** Nativra — Card (NativeWind). Install: npx nativra-cli add card */
import React from "react";
import { View, type ViewProps } from "react-native";
import { elevation } from "@/hooks/use-theme-colors";

export interface CardProps extends ViewProps {
  /** Lift the card higher off the page (the theme's "raised" shadow instead of "card") */
  elevated?: boolean;
  padding?: "sm" | "md" | "lg";
}

const PAD = { sm: "p-3", md: "p-5", lg: "p-6" } as const;

export function Card({ elevated = false, padding = "md", className, style, ...rest }: CardProps & { className?: string }) {
  return (
    <View
      className={`rounded-card border border-border bg-card ${PAD[padding]} ${className ?? ""}`}
      style={[elevation(elevated ? "raised" : "card"), style]}
      {...rest}
    />
  );
}
