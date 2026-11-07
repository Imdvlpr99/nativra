/**
 * Nativra — eCommerce Flow Template (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add ecommerce-flow
 */
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Text as RNText,
} from "react-native";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Text } from "./Text";

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
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Bar */}
        <View style={styles.header}>
          <View>
            <RNText style={styles.title}>Storefront</RNText>
            <RNText style={styles.subtitle}>Curated Tech Essentials</RNText>
          </View>
          <TouchableOpacity style={styles.cartBtn} activeOpacity={0.8}>
            <RNText style={styles.cartText}>Cart</RNText>
            <Badge size="sm" variant="primary" label={String(cartCount)} />
          </TouchableOpacity>
        </View>

        {/* Promo Hero Banner */}
        <Card elevated padding="lg" style={styles.heroCard}>
          <View style={styles.badgeWrap}>
            <Badge size="sm" variant="secondary" label="Limited Edition" />
          </View>
          <RNText style={styles.heroTitle}>Next-Gen Spatial Audio</RNText>
          <RNText style={styles.heroSub}>
            Immersive 360 sound with active adaptive noise cancellation.
          </RNText>
          <View style={styles.heroBtnWrap}>
            <Button variant="primary">Shop AeroSound</Button>
          </View>
        </Card>

        {/* Category Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {categories.map((c) => {
            const active = c.id === selectedCat;
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => setSelectedCat(c.id)}
                style={[styles.catPill, active ? styles.catPillActive : styles.catPillInactive]}
              >
                <RNText style={[styles.catText, active ? styles.catTextActive : styles.catTextInactive]}>
                  {c.name}
                </RNText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Product Grid */}
        <View style={styles.grid}>
          {filtered.map((item) => (
            <Card key={item.id} elevated padding="md" style={styles.productCard}>
              <View style={styles.productRow}>
                <View style={styles.productMeta}>
                  <View style={styles.brandRow}>
                    <RNText style={styles.brandText}>{item.brand}</RNText>
                    {item.tag && <Badge size="sm" variant="secondary" label={item.tag} />}
                  </View>
                  <RNText style={styles.productName}>{item.name}</RNText>
                  <RNText style={styles.ratingText}>★ {item.rating} Rating</RNText>
                </View>

                <View style={styles.actionCol}>
                  <RNText style={styles.priceText}>{item.price}</RNText>
                  <Button
                    variant="outline"
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#09090b" },
  scroll: { flex: 1 },
  container: { paddingHorizontal: 16, paddingVertical: 24 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: { fontSize: 24, fontWeight: "900", color: "#ffffff", letterSpacing: -0.5 },
  subtitle: { fontSize: 12, color: "#a1a1aa", marginTop: 4 },
  cartBtn: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#27272a",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cartText: { fontSize: 12, fontWeight: "600", color: "#e4e4e7" },
  heroCard: {
    borderRadius: 24,
    backgroundColor: "rgba(14, 165, 233, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.25)",
    marginBottom: 24,
    padding: 20,
  },
  badgeWrap: { marginBottom: 8, alignItems: "flex-start" },
  heroTitle: { fontSize: 20, fontWeight: "900", color: "#ffffff", lineHeight: 26 },
  heroSub: { fontSize: 12, color: "#cbd5e1", marginTop: 4, maxWidth: 260 },
  heroBtnWrap: { marginTop: 16, alignItems: "flex-start" },
  catScroll: { flexDirection: "row", gap: 8, marginBottom: 24 },
  catPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  catPillActive: { backgroundColor: "#0284c7", borderColor: "#38bdf8" },
  catPillInactive: { backgroundColor: "#18181b", borderColor: "#27272a" },
  catText: { fontSize: 12, fontWeight: "600" },
  catTextActive: { color: "#ffffff" },
  catTextInactive: { color: "#d4d4d8" },
  grid: { gap: 14, marginBottom: 32 },
  productCard: { borderRadius: 16, backgroundColor: "#18181b", borderWidth: 1, borderColor: "#27272a" },
  productRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  productMeta: { flex: 1, marginRight: 12 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandText: { fontSize: 12, color: "#a1a1aa", fontWeight: "500" },
  productName: { fontSize: 16, fontWeight: "700", color: "#ffffff", marginTop: 4 },
  ratingText: { fontSize: 12, color: "#fbbf24", fontWeight: "600", marginTop: 4 },
  actionCol: { alignItems: "flex-end", gap: 8 },
  priceText: { fontSize: 18, fontWeight: "900", color: "#ffffff" },
});

