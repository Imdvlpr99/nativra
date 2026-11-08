/** Nativra — Separator (NativeWind). Install: npx nativra-cli add separator */
import React from "react";
import { View } from "react-native";

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
}

export function Separator({ orientation = "horizontal" }: SeparatorProps) {
  return (
    <View
      accessibilityRole="none"
      className={`bg-zinc-200 dark:bg-zinc-800 ${orientation === "horizontal" ? "h-px w-full" : "h-full w-px"}`}
    />
  );
}

