/**
 * Nativra — Filter Sheet Block (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add filter-sheet
 */
import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { BottomSheet } from "./BottomSheet";
import { Button } from "./Button";
import { Badge } from "./Badge";
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
    <BottomSheet isOpen={open} onClose={() => onOpenChange(false)}>
      <View className="sp-px-5 sp-pb-8 sp-pt-3 sp-gap-5">
        {/* Header */}
        <View className="flex-row items-center justify-between sp-pb-3 border-b border-border">
          <Text className="type-lg weight-title text-foreground">Filter Results</Text>
          <TouchableOpacity
            onPress={() => {
              setCurrentCategory("all");
              setCurrentPrice(maxPrice / 2);
              onReset?.();
            }}
          >
            <Text className="type-xs weight-label text-primary">Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Chips */}
        <View className="sp-gap-2.5">
          <Text className="type-xs weight-label uppercase tracking-wider text-muted-foreground">
            Category
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row sp-gap-2">
            {categories.map((c) => {
              const active = c.id === currentCategory;
              return (
                <TouchableOpacity
                  key={c.id}
                  activeOpacity={0.7}
                  onPress={() => handleCategoryPress(c.id)}
                  className={`sp-px-3.5 sp-py-1.5 rounded-full border ${
                    active
                      ? "bg-primary border-primary"
                      : "bg-muted/80 border-border"
                  }`}
                >
                  <Text
                    className={`type-xs weight-label ${
                      active ? "text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {c.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Price Range */}
        <View className="sp-gap-2.5">
          <View className="flex-row items-center justify-between">
            <Text className="type-xs weight-label uppercase tracking-wider text-muted-foreground">
              Max Budget
            </Text>
            <Text className="type-sm weight-title text-foreground">
              ${Math.round(currentPrice)}
            </Text>
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
        <View className="flex-row sp-gap-3 mt-2">
          <Button
            variant="outline"
            className="flex-1"
            onPress={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onPress={() => {
              onApply?.();
              onOpenChange(false);
            }}
          >
            Apply Filters
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}

