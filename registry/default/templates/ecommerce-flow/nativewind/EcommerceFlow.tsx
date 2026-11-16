/**
 * Nativra — eCommerce Flow Template (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add ecommerce-flow
 */
import React, { useState } from "react";
import { Pressable, View, ScrollView, SafeAreaView, StatusBar } from "react-native";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Text } from "./Text";
import { Separator } from "./Separator";

export function EcommerceFlow() {
  const [selectedCat, setSelectedCat] = useState("all");
  const [cartCount, setCartCount] = useState(2);

  const categories = [
    { id: "all", name: "All" },
    { id: "audio", name: "Audio" },
    { id: "wearables", name: "Wearables" },
    { id: "accessories", name: "Accessories" },
  ];

  const products = [
    {
      id: "1",
      name: "Studio Pro Wireless ANC",
      brand: "AeroSound",
      price: "$299.00",
      rating: "4.9",
      tag: "Best Seller",
      cat: "audio",
    },
    {
      id: "2",
      name: "Ultra Pulse Smartwatch",
      brand: "Kronos",
      price: "$199.00",
      rating: "4.8",
      tag: "New",
      cat: "wearables",
    },
    {
      id: "3",
      name: "MagCharge 3-in-1 Dock",
      brand: "VoltGrid",
      price: "$79.00",
      rating: "4.7",
      cat: "accessories",
    },
    {
      id: "4",
      name: "Linear HiFi In-Ear Monitors",
      brand: "AeroSound",
      price: "$149.00",
      rating: "4.9",
      cat: "audio",
    },
  ];

  const filtered =
    selectedCat === "all"
      ? products
      : products.filter((p) => p.cat === selectedCat);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1 sp-px-4 sp-py-6" showsVerticalScrollIndicator={false}>
        {/* Top Bar */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="type-2xl weight-heading text-foreground">Storefront</Text>
            <Text className="type-xs text-muted-foreground mt-1">Curated Tech Essentials</Text>
          </View>
          <Pressable accessibilityRole="button" className="surface min-h-control sp-px-4 rounded-control flex-row items-center sp-gap-2 active:opacity-80 active:opacity-20">
            <Text className="type-xs weight-label text-foreground">Cart</Text>
            <Badge size="sm" variant="primary" label={String(cartCount)} />
          </Pressable>
        </View>

        {/* Promo Hero Banner */}
        <Card elevated padding="lg" className="rounded-card bg-primary/20 border border-primary/30 mb-6 sp-p-5">
          <Badge size="sm" variant="secondary" label="Limited Edition" className="self-start mb-2" />
          <Text className="type-xl weight-heading text-foreground leading-tight">
            Next-Gen Spatial Audio
          </Text>
          <Text className="type-xs text-muted-foreground mt-1 max-w-[260px]">
            Immersive 360 sound with active adaptive noise cancellation.
          </Text>
          <Button variant="primary" className="self-start mt-4 h-9 sp-px-4">
            Shop AeroSound
          </Button>
        </Card>

        {/* Category Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row sp-gap-2 mb-6">
          {categories.map((c) => {
            const active = c.id === selectedCat;
            return (
              <Pressable
                accessibilityRole="button"
                key={c.id}
                onPress={() => setSelectedCat(c.id)}
                className={`${`sp-px-4 sp-py-2 rounded-control border ${
                  active
                    ? "bg-primary border-primary"
                    : "bg-card border-border"
                }`} active:opacity-20`}
              >
                <Text
                  className={`type-xs weight-label ${
                    active ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  {c.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Product Grid */}
        <View className="sp-gap-3.5 mb-8">
          {filtered.map((item) => (
            <Card
              key={item.id}
              elevated
              padding="md"
              className="rounded-card bg-card/80 border border-border sp-p-4"
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center sp-gap-2">
                    <Text className="type-xs text-muted-foreground font-medium">{item.brand}</Text>
                    {item.tag && <Badge size="sm" variant="secondary" label={item.tag} />}
                  </View>
                  <Text className="type-base weight-title text-foreground mt-1 leading-snug">
                    {item.name}
                  </Text>
                  <Text className="type-xs text-warning weight-label mt-1">
                    ★ {item.rating} Rating
                  </Text>
                </View>

                <View className="items-end sp-gap-2">
                  <Text className="type-lg weight-heading text-foreground">{item.price}</Text>
                  <Button
                    variant="outline"
                    className="h-8 sp-px-3 type-xs"
                    onPress={() => setCartCount((c) => c + 1)}
                  >
                    + Add
                  </Button>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

