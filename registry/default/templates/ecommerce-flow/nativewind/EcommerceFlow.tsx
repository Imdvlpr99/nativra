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
import { View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
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
    <SafeAreaView className="flex-1 bg-zinc-950">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        {/* Top Bar */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-black text-white">Storefront</Text>
            <Text className="text-xs text-zinc-400 mt-1">Curated Tech Essentials</Text>
          </View>
          <TouchableOpacity className="h-10 px-4 rounded-xl bg-zinc-900 border border-zinc-800 flex-row items-center gap-2 active:opacity-80">
            <Text className="text-xs font-semibold text-zinc-200">Cart</Text>
            <Badge size="sm" variant="primary" label={String(cartCount)} />
          </TouchableOpacity>
        </View>

        {/* Promo Hero Banner */}
        <Card elevated padding="lg" className="rounded-3xl bg-sky-600/20 border border-sky-500/30 mb-6 p-5">
          <Badge size="sm" variant="secondary" label="Limited Edition" className="self-start mb-2" />
          <Text className="text-xl font-black text-white leading-tight">
            Next-Gen Spatial Audio
          </Text>
          <Text className="text-xs text-zinc-300 mt-1 max-w-[260px]">
            Immersive 360 sound with active adaptive noise cancellation.
          </Text>
          <Button variant="primary" className="self-start mt-4 h-9 px-4">
            Shop AeroSound
          </Button>
        </Card>

        {/* Category Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 mb-6">
          {categories.map((c) => {
            const active = c.id === selectedCat;
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => setSelectedCat(c.id)}
                className={`px-4 py-2 rounded-xl border ${
                  active
                    ? "bg-sky-500 border-sky-400"
                    : "bg-zinc-900 border-zinc-800"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    active ? "text-white" : "text-zinc-300"
                  }`}
                >
                  {c.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Product Grid */}
        <View className="gap-3.5 mb-8">
          {filtered.map((item) => (
            <Card
              key={item.id}
              elevated
              padding="md"
              className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-4"
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-3">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-xs text-zinc-400 font-medium">{item.brand}</Text>
                    {item.tag && <Badge size="sm" variant="secondary" label={item.tag} />}
                  </View>
                  <Text className="text-base font-bold text-white mt-1 leading-snug">
                    {item.name}
                  </Text>
                  <Text className="text-xs text-amber-400 font-semibold mt-1">
                    ★ {item.rating} Rating
                  </Text>
                </View>

                <View className="items-end gap-2">
                  <Text className="text-lg font-black text-white">{item.price}</Text>
                  <Button
                    variant="outline"
                    className="h-8 px-3 text-xs"
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

