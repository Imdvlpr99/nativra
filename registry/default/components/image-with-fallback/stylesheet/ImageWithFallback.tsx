/** Nativra — ImageWithFallback (StyleSheet). Install: npx nativra-cli add image-with-fallback */
import React from "react";
import { Image, StyleSheet, View, type DimensionValue, type ImageProps, type ImageSourcePropType, type StyleProp, type ViewStyle } from "react-native";
import { ImageOff } from "lucide-react-native";
import { Skeleton } from "@/components/ui/Skeleton";
import { type ThemeColors, themeStyle, useThemeColors } from "@/hooks/use-theme-colors";

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
}

const RADIUS: Record<Radius, number> = {
  none: 0,
  sm: themeStyle.radius.small,
  md: themeStyle.radius.control,
  lg: themeStyle.radius.card,
  full: 9999,
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
  accessibilityLabel,
  ...rest
}: ImageWithFallbackProps) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const resolved: ImageSourcePropType | null = typeof source === "string" ? (source ? { uri: source } : null) : (source ?? null);
  const key = typeof source === "string" ? source : JSON.stringify(source ?? null);
  const [state, setState] = React.useState<"loading" | "loaded" | "failed">(resolved ? "loading" : "failed");
  // A new source starts over (set during render, so the old image's state never shows for it).
  const [shownKey, setShownKey] = React.useState(key);
  if (shownKey !== key) {
    setShownKey(key);
    setState(resolved ? "loading" : "failed");
  }

  const box: ViewStyle = { width, borderRadius: RADIUS[radius], ...(height !== undefined ? { height } : {}), ...(aspectRatio ? { aspectRatio } : {}) };

  return (
    <View
      style={[styles.box, box, style]}
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
      {state === "failed" ? (fallback ?? <View style={styles.fallback}><ImageOff size={24} color={c["muted-foreground"]} /></View>) : null}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    box: { overflow: "hidden", backgroundColor: c.muted },
    fallback: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, alignItems: "center", justifyContent: "center", backgroundColor: c.muted },
  });
