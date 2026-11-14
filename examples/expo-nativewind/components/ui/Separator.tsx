/** Nativra — Separator (NativeWind). Install: npx nativra-cli add separator */
import React from "react";
import { View, type ViewProps } from "react-native";

export interface SeparatorProps extends ViewProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Separator({ orientation = "horizontal", className = "", style, ...rest }: SeparatorProps) {
  return (
    <View
      accessibilityRole="none"
      style={style}
      className={`bg-zinc-200 dark:bg-zinc-800 ${
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px"
      } ${className}`}
      {...rest}
    />
  );
}

