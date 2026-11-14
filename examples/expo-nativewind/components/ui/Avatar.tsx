/**
 * Nativra — Avatar (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add avatar
 */
import React, { useState } from "react";
import { View, Text, Image, type ViewProps } from "react-native";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

export interface AvatarProps extends ViewProps {
  src?: string;
  fallback: string;
  size?: AvatarSize;
  className?: string;
  accessibilityLabel?: string;
}

const SIZE_CONTAINER: Record<AvatarSize, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
  xl: "h-20 w-20",
};

const SIZE_TEXT: Record<AvatarSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-lg",
  xl: "text-2xl",
};

export function Avatar({
  src,
  fallback,
  size = "md",
  className = "",
  style,
  accessibilityLabel,
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel ?? fallback}
      className={`rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 items-center justify-center ${SIZE_CONTAINER[size]} ${className}`.trim()}
      style={style}
      {...props}
    >
      {src && !hasError ? (
        <Image
          source={{ uri: src }}
          onError={() => setHasError(true)}
          className="h-full w-full"
        />
      ) : (
        <Text
          className={`font-semibold text-zinc-700 dark:text-zinc-200 ${SIZE_TEXT[size]}`}
        >
          {fallback.slice(0, 2).toUpperCase()}
        </Text>
      )}
    </View>
  );
}

