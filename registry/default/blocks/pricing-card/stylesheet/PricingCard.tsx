/**
 * Nativra — Pricing Card Block (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add pricing-card
 */
import React from "react";
import { View, StyleSheet } from "react-native";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Text } from "./Text";
import { Separator } from "./Separator";

export interface PricingCardProps {
  planName?: string;
  price?: string;
  period?: string;
  description?: string;
  popular?: boolean;
  features?: string[];
  buttonText?: string;
  onSubscribe?: () => void;
}

export function PricingCard({
  planName = "Pro Mobile",
  price = "$19",
  period = "/ month, billed yearly",
  description = "Complete mobile UI infrastructure for production Expo & React Native apps.",
  popular = true,
  features = [
    "12 foundation mobile components",
    "Dual NativeWind v4 & StyleSheet",
    "Source-first ownership, 0 runtime bloat",
    "Interactive component canvas previews",
  ],
  buttonText = "Start 14-Day Free Trial",
  onSubscribe,
}: PricingCardProps) {
  return (
    <Card elevated padding="lg" style={styles.card}>
      <View style={styles.header}>
        <Text variant="h3">{planName}</Text>
        {popular && <Badge variant="primary" size="sm" label="Most Popular" />}
      </View>

      <Text variant="muted" style={styles.description}>{description}</Text>

      <View style={styles.priceRow}>
        <Text variant="h1" style={styles.price}>{price}</Text>
        <Text variant="muted" style={styles.period}>{period}</Text>
      </View>

      <View style={styles.separatorContainer}>
        <Separator />
      </View>

      <View style={styles.featuresList}>
        {features.map((feature, idx) => (
          <View key={idx} style={styles.featureItem}>
            <Text style={styles.checkIcon}>✓</Text>
            <Text variant="p" style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <Button
        variant="default"
        size="lg"
        style={styles.submitBtn}
        onPress={onSubscribe}
      >
        {buttonText}
      </Button>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  description: {
    fontSize: 12,
    marginTop: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    marginTop: 20,
  },
  price: {
    fontSize: 28,
    fontWeight: "800",
  },
  period: {
    fontSize: 12,
  },
  separatorContainer: {
    marginVertical: 20,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkIcon: {
    fontSize: 12,
    fontWeight: "700",
    color: "#059669",
  },
  featureText: {
    fontSize: 12,
  },
  submitBtn: {
    marginTop: 24,
    width: "100%",
  },
});
