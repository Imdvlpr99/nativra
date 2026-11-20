/** Nativra — ImageWithFallback (NativeWind). Install: npx nativra-cli add image-with-fallback */
import React from "react";
import { Image, StyleSheet, View, type DimensionValue, type ImageProps, type ImageSourcePropType, type StyleProp, type ViewStyle } from "react-native";
import { ImageOff } from "lucide-react-native";
import { Skeleton } from "@/components/ui/Skeleton";
import { useThemeColors } from "@/hooks/use-theme-colors";

type Radius = "none" | "sm" | "md" | "lg" | "full";

export interface ImageWithFallbackProps extends Omit<ImageProps, "source" | "style" | "onLoad" | "onError" | "width" | "height"> {
  /** A URL string, `{ uri }`, or a `require()`d asset. Empty or missing shows the fallback. */
  source: ImageSourcePropType | string | null | undefined;
  width?: DimensionValue;
  height?: DimensionValue;
  /** Width / height, e.g. 16 / 9. Used when only one dimension is set. */
  aspectRatio?: number;
  /** sm, md and lg follow the style's radii; full is a circle. */
  radius?: Radius;
  /** Shown when the image fails or there is no source. Defaults to an icon on a muted surface. */
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

const RADIUS_CLASS: Record<Radius, string> = {
  none: "rounded-none",
  sm: "rounded-small",
  md: "rounded-control",
  lg: "rounded-card",
  full: "rounded-full",
};

/** An image with a skeleton while it loads and a fallback when it can't. */
export function ImageWithFallback({
  source,
  width = "100%",
  height,
  aspectRatio,
  radius = "md",
  fallback,
  onLoad,
  onError,
  style,
  className = "",
  accessibilityLabel,
  ...rest
}: ImageWithFallbackProps) {
  const palette = useThemeColors();
  const resolved: ImageSourcePropType | null = typeof source === "string" ? (source ? { uri: source } : null) : (source ?? null);
  const key = typeof source === "string" ? source : JSON.stringify(source ?? null);
  const [state, setState] = React.useState<"loading" | "loaded" | "failed">(resolved ? "loading" : "failed");
  // A new source starts over (set during render, so the old image's state never shows for it).
  const [shownKey, setShownKey] = React.useState(key);
  if (shownKey !== key) {
    setShownKey(key);
    setState(resolved ? "loading" : "failed");
  }

  return (
    <View
      className={`overflow-hidden bg-muted ${RADIUS_CLASS[radius]} ${className}`}
      style={[{ width, ...(height !== undefined ? { height } : {}), ...(aspectRatio ? { aspectRatio } : {}) }, style]}
      accessible={state === "failed"}
      accessibilityRole={state === "failed" ? "image" : undefined}
      accessibilityLabel={state === "failed" ? accessibilityLabel : undefined}
    >
      {resolved && state !== "failed" ? (
        <Image
          source={resolved}
          style={StyleSheet.absoluteFill}
          accessibilityLabel={accessibilityLabel}
          accessibilityIgnoresInvertColors
          onLoad={() => {
            setState("loaded");
            onLoad?.();
          }}
          onError={() => {
            setState("failed");
            onError?.();
          }}
          {...rest}
        />
      ) : null}
      {state === "loading" ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Skeleton width="100%" height="100%" radius={radius} />
        </View>
      ) : null}
      {state === "failed"
        ? (fallback ?? (
            <View className="absolute inset-0 items-center justify-center bg-muted">
              <ImageOff size={24} color={palette["muted-foreground"]} />
            </View>
          ))
        : null}
    </View>
  );
}
