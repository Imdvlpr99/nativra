/**
 * Nativra — Product Card Block (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add product-card
 */
import React from "react";
import { Pressable, Text, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from "react-native";
import { Heart } from "lucide-react-native";
import { ImageWithFallback } from "./ImageWithFallback";
import { RatingStars } from "./RatingStars";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { elevation, ts, useThemeColors } from "@/hooks/use-theme-colors";

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
  /** @deprecated Use `labels.addToCart`. */
  addLabel?: string;
  /** Text for another language; anything left out stays English. `{name}`, `{price}` and `{rating}` are filled in. */
  labels?: Partial<ProductCardLabels>;
  /** Shows the heart; `wishlisted` fills it. */
  onToggleWishlist?: () => void;
  wishlisted?: boolean;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

/** A product tile for grids and carousels: image, badge, wishlist, name, rating, price and add-to-cart. */
export interface ProductCardLabels {
  addToCart: string;
  soldOut: string;
  /** Read before the compare-at price. */
  was: string;
  rating: string;
  addToWishlist: string;
  removeFromWishlist: string;
}

const DEFAULT_LABELS: ProductCardLabels = {
  addToCart: "Add to cart",
  soldOut: "Sold out",
  was: "was {price}",
  rating: "rated {rating} of 5",
  addToWishlist: "Add {name} to wishlist",
  removeFromWishlist: "Remove {name} from wishlist",
};

/** "Add {name}" + { name: "Tote" } -> "Add Tote". */
const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (m, k: string) => (k in values ? String(values[k]) : m));

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
  addLabel,
  labels: labelOverrides,
  onToggleWishlist,
  wishlisted = false,
  style,
  className = "",
}: ProductCardProps) {
  const palette = useThemeColors();
  const labels = { ...DEFAULT_LABELS, ...(addLabel ? { addToCart: addLabel } : {}), ...labelOverrides };
  const summary = [
    name,
    price,
    compareAtPrice ? fill(labels.was, { price: compareAtPrice }) : null,
    rating !== undefined ? fill(labels.rating, { rating }) : null,
    soldOut ? labels.soldOut : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <View className={`surface rounded-card overflow-hidden ${className}`} style={style}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole="button"
        accessibilityLabel={summary}
        className={onPress ? "active:opacity-80" : ""}
      >
        <View>
          <ImageWithFallback source={image} aspectRatio={1} radius="none" accessibilityLabel={name} />
          {badge ? <Badge label={badge} variant="primary" size="sm" className="absolute top-2 left-2" /> : null}
          {soldOut ? (
            <View className="absolute left-0 right-0 bottom-0 py-1.5 items-center bg-foreground">
              <Text className="type-xs weight-label text-background">{labels.soldOut}</Text>
            </View>
          ) : null}
        </View>
        <View className="p-3 sp-gap-1.5">
          <Text numberOfLines={2} className="type-base weight-label text-foreground">
            {name}
          </Text>
          {rating !== undefined ? (
            <View className="flex-row items-center sp-gap-1">
              <RatingStars rating={rating} size="sm" readOnly />
              {reviewCount !== undefined ? <Text className="type-xs text-muted-foreground">({reviewCount})</Text> : null}
            </View>
          ) : null}
          <View className="flex-row items-baseline sp-gap-1.5">
            <Text className="type-base weight-title text-foreground">{price}</Text>
            {compareAtPrice ? <Text className="type-sm text-muted-foreground line-through">{compareAtPrice}</Text> : null}
          </View>
        </View>
      </Pressable>
      {onToggleWishlist ? (
        <Pressable
          onPress={onToggleWishlist}
          accessibilityRole="button"
          accessibilityLabel={fill(wishlisted ? labels.removeFromWishlist : labels.addToWishlist, { name })}
          accessibilityState={{ selected: wishlisted }} aria-selected={wishlisted}
          hitSlop={8}
          className="absolute top-2 right-2 h-9 w-9 rounded-full items-center justify-center bg-background active:opacity-70"
          style={elevation("card")}
        >
          <Heart size={ts(18)} color={wishlisted ? palette.destructive : palette.foreground} fill={wishlisted ? palette.destructive : "transparent"} />
        </Pressable>
      ) : null}
      {onAddToCart ? (
        <View className="px-3 pb-3">
          <Button size="sm" variant="primary" onPress={onAddToCart} disabled={soldOut} accessibilityLabel={`${labels.addToCart}, ${name}`}>
            {soldOut ? labels.soldOut : labels.addToCart}
          </Button>
        </View>
      ) : null}
    </View>
  );
}
