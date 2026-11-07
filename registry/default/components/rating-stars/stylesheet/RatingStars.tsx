/**
 * Nativra — RatingStars (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios, web
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add rating-stars
 */
import React from "react";
import { View, Text, Pressable, StyleSheet, type ViewProps } from "react-native";

export interface RatingStarsProps extends ViewProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function RatingStars({
  rating,
  maxStars = 5,
  size = "md",
  readOnly = false,
  onRatingChange,
  style,
  ...props
}: RatingStarsProps) {
  const fontSize = size === "sm" ? 18 : size === "lg" ? 30 : 22;

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={`Rating: ${rating} out of ${maxStars} stars`}
      style={[styles.container, style]}
      {...props}
    >
      {Array.from({ length: maxStars }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = rating >= starValue;

        const starElement = (
          <Text
            style={{
              fontSize,
              color: isFilled ? "#f59e0b" : "#71717a",
              lineHeight: fontSize + 2,
            }}
          >
            {isFilled ? "★" : "☆"}
          </Text>
        );

        if (readOnly) {
          return (
            <View key={starValue} accessibilityElementsHidden={true} importantForAccessibility="no">
              {starElement}
            </View>
          );
        }

        return (
          <Pressable
            key={starValue}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${starValue} of ${maxStars} stars`}
            accessibilityState={{ selected: isFilled }}
            onPress={() => onRatingChange?.(starValue)}
            style={styles.starButton}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            {starElement}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  starButton: {
    padding: 4,
  },
});
