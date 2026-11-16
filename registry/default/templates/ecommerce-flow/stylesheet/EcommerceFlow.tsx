/**
 * Nativra — eCommerce Flow Template (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add ecommerce-flow
 */
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Text as RNText,
} from "react-native";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Text } from "./Text";
import { themeStyle, useThemeColors, alpha, type ThemeColors, ts, sp, surface } from "@/hooks/use-theme-colors";

export function EcommerceFlow() {
  const palette = useThemeColors();
  const styles = React.useMemo(() => createStyles(palette), [palette]);
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
          <Pressable accessibilityRole="button" style={({ pressed }) => [styles.cartBtn, pressed && { opacity: 0.8 }]}>
            <RNText style={styles.cartText}>Cart</RNText>
            <Badge size="sm" variant="primary" label={String(cartCount)} />
          </Pressable>
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
              <Pressable
                accessibilityRole="button"
                key={c.id}
                onPress={() => setSelectedCat(c.id)}
                style={({ pressed }) => [styles.catPill, active ? styles.catPillActive : styles.catPillInactive, pressed && { opacity: 0.2 }]}
              >
                <RNText style={[styles.catText, active ? styles.catTextActive : styles.catTextInactive]}>
                  {c.name}
                </RNText>
              </Pressable>
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

const createStyles = (palette: ThemeColors) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  scroll: { flex: 1 },
  container: { paddingHorizontal: sp(16), paddingVertical: sp(24) },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: { fontSize: ts(24), fontWeight: themeStyle.fontWeight.heading, color: palette.foreground, letterSpacing: -0.5 },
  subtitle: { fontSize: ts(12), color: palette["muted-foreground"], marginTop: 4 },
  cartBtn: {
    ...surface(palette),
    height: 40,
    paddingHorizontal: sp(14),
    borderRadius: themeStyle.radius.control,
    flexDirection: "row",
    alignItems: "center",
    gap: sp(8),
  },
  cartText: { fontSize: ts(12), fontWeight: themeStyle.fontWeight.label, color: palette.foreground },
  heroCard: {
    borderRadius: themeStyle.radius.card,
    backgroundColor: alpha(palette.primary, 0.12),
    borderWidth: themeStyle.borderWidth,
    borderColor: alpha(palette.primary, 0.25),
    marginBottom: 24,
    padding: sp(20),
  },
  badgeWrap: { marginBottom: 8, alignItems: "flex-start" },
  heroTitle: { fontSize: ts(20), fontWeight: themeStyle.fontWeight.heading, color: palette.foreground, lineHeight: ts(26) },
  heroSub: { fontSize: ts(12), color: palette["muted-foreground"], marginTop: 4, maxWidth: 260 },
  heroBtnWrap: { marginTop: 16, alignItems: "flex-start" },
  catScroll: { flexDirection: "row", gap: sp(8), marginBottom: 24 },
  catPill: { paddingHorizontal: sp(16), paddingVertical: sp(8), borderRadius: themeStyle.radius.control, borderWidth: themeStyle.borderWidth },
  catPillActive: { backgroundColor: palette.primary, borderColor: palette.primary },
  catPillInactive: { ...surface(palette) },
  catText: { fontSize: ts(12), fontWeight: themeStyle.fontWeight.label },
  catTextActive: { color: palette["primary-foreground"] },
  catTextInactive: { color: palette["muted-foreground"] },
  grid: { gap: sp(14), marginBottom: 32 },
  productCard: { ...surface(palette), borderRadius: themeStyle.radius.card },
  productRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  productMeta: { flex: 1, marginRight: 12 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: sp(8) },
  brandText: { fontSize: ts(12), color: palette["muted-foreground"], fontWeight: "500" },
  productName: { fontSize: ts(16), fontWeight: themeStyle.fontWeight.title, color: palette.foreground, marginTop: 4 },
  ratingText: { fontSize: ts(12), color: palette.warning, fontWeight: themeStyle.fontWeight.label, marginTop: 4 },
  actionCol: { alignItems: "flex-end", gap: sp(8) },
  priceText: { fontSize: ts(18), fontWeight: themeStyle.fontWeight.heading, color: palette.foreground },
});

