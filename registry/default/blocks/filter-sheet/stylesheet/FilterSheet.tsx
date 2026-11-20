/**
 * Nativra — Filter Sheet Block (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add filter-sheet
 */
import React, { useState } from "react";
import { Pressable, StyleSheet, View, ScrollView, Text as RNText } from "react-native";
import { BottomSheet } from "./BottomSheet";
import { Button } from "./Button";
import { Slider } from "./Slider";
import { Text } from "./Text";
import { useThemeColors, alpha, type ThemeColors, ts, sp, themeStyle, pressedStyle } from "@/hooks/use-theme-colors";

export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories?: FilterOption[];
  selectedCategory?: string;
  onSelectCategory?: (id: string) => void;
  maxPrice?: number;
  price?: number;
  onPriceChange?: (price: number) => void;
  onApply?: () => void;
  onReset?: () => void;
  style?: object;
}

export function FilterSheet({
  open,
  onOpenChange,
  categories = [
    { id: "all", label: "All Items" },
    { id: "saas", label: "SaaS & Cloud" },
    { id: "hardware", label: "Hardware" },
    { id: "services", label: "Consulting" },
    { id: "licensing", label: "Enterprise" },
  ],
  selectedCategory = "all",
  onSelectCategory,
  maxPrice = 1000,
  price = 500,
  onPriceChange,
  onApply,
  onReset,
}: FilterSheetProps) {
  const palette = useThemeColors();
  const styles = React.useMemo(() => createStyles(palette), [palette]);
  const [currentCategory, setCurrentCategory] = useState(selectedCategory);
  const [currentPrice, setCurrentPrice] = useState(price);

  const handleCategoryPress = (id: string) => {
    setCurrentCategory(id);
    onSelectCategory?.(id);
  };

  const handlePriceChange = (val: number) => {
    setCurrentPrice(val);
    onPriceChange?.(val);
  };

  return (
    <BottomSheet isOpen={open} onClose={() => onOpenChange(false)}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filter Results</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setCurrentCategory("all");
              setCurrentPrice(maxPrice / 2);
              onReset?.();
            }}
            style={({ pressed }) => pressedStyle(pressed)}
          >
            <RNText style={styles.resetBtn}>Reset</RNText>
          </Pressable>
        </View>

        {/* Categories Chips */}
        <View style={styles.section}>
          <RNText style={styles.sectionLabel}>Category</RNText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            {categories.map((c) => {
              const active = c.id === currentCategory;
              return (
                <Pressable
                  accessibilityRole="button"
                  key={c.id}
                  onPress={() => handleCategoryPress(c.id)}
                  style={({ pressed }) => [styles.chip, active ? styles.chipActive : styles.chipInactive, pressedStyle(pressed)]}
                >
                  <RNText style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
                    {c.label}
                  </RNText>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Price Range */}
        <View style={styles.section}>
          <View style={styles.priceRow}>
            <RNText style={styles.sectionLabel}>Max Budget</RNText>
            <RNText style={styles.priceVal}>${Math.round(currentPrice)}</RNText>
          </View>
          <Slider
            min={0}
            max={maxPrice}
            step={10}
            value={currentPrice}
            onValueChange={handlePriceChange}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.btnRow}>
          <View style={styles.flexOne}>
            <Button
              variant="outline"
              onPress={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </View>
          <View style={styles.flexOne}>
            <Button
              variant="primary"
              onPress={() => {
                onApply?.();
                onOpenChange(false);
              }}
            >
              Apply Filters
            </Button>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}

const createStyles = (palette: ThemeColors) => StyleSheet.create({
  container: {
    paddingHorizontal: sp(20),
    paddingBottom: sp(32),
    paddingTop: sp(12),
    gap: sp(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: sp(12),
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  headerTitle: {
    fontSize: ts(18),
    fontWeight: themeStyle.fontWeight.title,
    color: palette.foreground,
  },
  resetBtn: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.label,
    color: palette.primary,
  },
  section: {
    gap: sp(10),
  },
  sectionLabel: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.label,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: palette["muted-foreground"],
  },
  chipsRow: {
    flexDirection: "row",
    gap: sp(8),
  },
  chip: {
    paddingHorizontal: sp(14),
    paddingVertical: sp(6),
    borderRadius: 9999,
    borderWidth: themeStyle.borderWidth,
  },
  chipActive: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  chipInactive: {
    backgroundColor: alpha(palette.muted, 0.8),
    borderColor: palette.border,
  },
  chipText: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.label,
  },
  chipTextActive: {
    color: palette["primary-foreground"],
  },
  chipTextInactive: {
    color: palette["muted-foreground"],
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceVal: {
    fontSize: ts(14),
    fontWeight: themeStyle.fontWeight.title,
    color: palette.foreground,
  },
  btnRow: {
    flexDirection: "row",
    gap: sp(12),
    marginTop: 8,
  },
  flexOne: {
    flex: 1,
  },
});

