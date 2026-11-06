/** Nativra — Card (NativeWind). Install: npx nativra add card */
import React from "react";
import { View, type ViewProps } from "react-native";

export interface CardProps extends ViewProps {
  elevated?: boolean;
  padding?: "sm" | "md" | "lg";
}

const PAD = { sm: "p-3", md: "p-4", lg: "p-6" } as const;

export function Card({ elevated = false, padding = "md", className, ...rest }: CardProps & { className?: string }) {
  return (
    <View
      className={`rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 ${PAD[padding]} ${
        elevated ? "shadow-md" : ""
      } ${className ?? ""}`}
      {...rest}
    />
  );
}

