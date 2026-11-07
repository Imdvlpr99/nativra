/**
 * Nativra — Filter Sheet Block (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add filter-sheet
 */
import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, ScrollView, Text as RNText } from "react-native";
import { BottomSheet } from "./BottomSheet";
import { Button } from "./Button";
import { Slider } from "./Slider";
import { Text } from "./Text";

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
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filter Results</Text>
          <TouchableOpacity
            onPress={() => {
              setCurrentCategory("all");
              setCurrentPrice(maxPrice / 2);
              onReset?.();
            }}
          >
            <RNText style={styles.resetBtn}>Reset</RNText>
          </TouchableOpacity>
        </View>

        {/* Categories Chips */}
        <View style={styles.section}>
          <RNText style={styles.sectionLabel}>Category</RNText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            {categories.map((c) => {
              const active = c.id === currentCategory;
              return (
                <TouchableOpacity
                  key={c.id}
                  activeOpacity={0.7}
                  onPress={() => handleCategoryPress(c.id)}
                  style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
                >
                  <RNText style={[styles.chipText, active ? styles.chipTextActive : styles.chipTextInactive]}>
                    {c.label}
                  </RNText>
                </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
    gap: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f4f4f5",
  },
  resetBtn: {
    fontSize: 12,
    fontWeight: "600",
    color: "#38bdf8",
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#a1a1aa",
  },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: "#0284c7",
    borderColor: "#38bdf8",
  },
  chipInactive: {
    backgroundColor: "rgba(39, 39, 42, 0.8)",
    borderColor: "#3f3f46",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#ffffff",
  },
  chipTextInactive: {
    color: "#d4d4d8",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceVal: {
    fontSize: 14,
    fontWeight: "700",
    color: "#f4f4f5",
  },
  btnRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  flexOne: {
    flex: 1,
  },
});

