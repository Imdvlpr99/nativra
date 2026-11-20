/**
 * Nativra — Product Card Block (React Native StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add product-card
 */
import React from "react";
import { Pressable, StyleSheet, Text, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from "react-native";
import { Heart } from "lucide-react-native";
import { ImageWithFallback } from "./ImageWithFallback";
import { RatingStars } from "./RatingStars";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { type ThemeColors, elevation, pressedStyle, sp, surface, themeStyle, ts, useThemeColors } from "@/hooks/use-theme-colors";

export interface ProductCardProps {
  name: string;
  /** Formatted price, e.g. "$129" or "Rp 1.250.000". */
  price: string;
  /** The old price, shown struck through. */
  compareAtPrice?: string;
  image?: ImageSourcePropType | string | null;
  /** 0-5 */
  rating?: number;
  reviewCount?: number;
  /** A short tag over the image: "New", "-20%". */
  badge?: string;
  soldOut?: boolean;
  /** Opens the product. */
  onPress?: () => void;
  /** Shows the add button. */
  onAddToCart?: () => void;
  addLabel?: string;
  /** Shows the heart; `wishlisted` fills it. */
  onToggleWishlist?: () => void;
  wishlisted?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** A product tile for grids and carousels: image, badge, wishlist, name, rating, price and add-to-cart. */
export function ProductCard({
  name,
  price,
  compareAtPrice,
  image,
  rating,
  reviewCount,
  badge,
  soldOut = false,
  onPress,
  onAddToCart,
  addLabel = "Add to cart",
  onToggleWishlist,
  wishlisted = false,
  style,
}: ProductCardProps) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const summary = [name, price, compareAtPrice ? `was ${compareAtPrice}` : null, rating !== undefined ? `rated ${rating} of 5` : null, soldOut ? "sold out" : null]
    .filter(Boolean)
    .join(", ");

  return (
    <View style={[styles.card, style]}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole="button"
        accessibilityLabel={summary}
        style={({ pressed }) => pressedStyle(pressed && Boolean(onPress))}
      >
        <View>
          <ImageWithFallback source={image} aspectRatio={1} radius="none" accessibilityLabel={name} />
          {badge ? <Badge label={badge} variant="primary" size="sm" style={styles.badge} /> : null}
          {soldOut ? (
            <View style={styles.soldOut}>
              <Text style={styles.soldOutText}>Sold out</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={2}>
            {name}
          </Text>
          {rating !== undefined ? (
            <View style={styles.ratingRow}>
              <RatingStars rating={rating} size="sm" readOnly />
              {reviewCount !== undefined ? <Text style={styles.muted}>({reviewCount})</Text> : null}
            </View>
          ) : null}
          <View style={styles.priceRow}>
            <Text style={styles.price}>{price}</Text>
            {compareAtPrice ? <Text style={styles.compare}>{compareAtPrice}</Text> : null}
          </View>
        </View>
      </Pressable>
      {onToggleWishlist ? (
        <Pressable
          onPress={onToggleWishlist}
          accessibilityRole="button"
          accessibilityLabel={wishlisted ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          accessibilityState={{ selected: wishlisted }}
          hitSlop={8}
          style={({ pressed }) => [styles.heart, pressedStyle(pressed)]}
        >
          <Heart size={ts(18)} color={wishlisted ? c.destructive : c.foreground} fill={wishlisted ? c.destructive : "transparent"} />
        </Pressable>
      ) : null}
      {onAddToCart ? (
        <View style={styles.footer}>
          <Button size="sm" variant="primary" onPress={onAddToCart} disabled={soldOut} accessibilityLabel={`${addLabel}, ${name}`}>
            {soldOut ? "Sold out" : addLabel}
          </Button>
        </View>
      ) : null}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: { ...surface(c), borderRadius: themeStyle.radius.card, overflow: "hidden" },
    badge: { position: "absolute", top: sp(8), left: sp(8) },
    heart: {
      position: "absolute",
      top: sp(8),
      right: sp(8),
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.background,
      ...elevation("card"),
    },
    soldOut: { position: "absolute", left: 0, right: 0, bottom: 0, paddingVertical: sp(6), alignItems: "center", backgroundColor: c.foreground },
    soldOutText: { fontSize: ts(12), fontWeight: themeStyle.fontWeight.label, color: c.background },
    body: { padding: sp(12), gap: sp(6) },
    name: { fontSize: ts(15), fontWeight: themeStyle.fontWeight.label, color: c.foreground },
    ratingRow: { flexDirection: "row", alignItems: "center", gap: sp(4) },
    muted: { fontSize: ts(12), color: c["muted-foreground"] },
    priceRow: { flexDirection: "row", alignItems: "baseline", gap: sp(6) },
    price: { fontSize: ts(16), fontWeight: themeStyle.fontWeight.title, color: c.foreground },
    compare: { fontSize: ts(13), color: c["muted-foreground"], textDecorationLine: "line-through" },
    footer: { paddingHorizontal: sp(12), paddingBottom: sp(12) },
  });
