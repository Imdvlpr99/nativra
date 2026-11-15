/**
 * Nativra — Pricing Card Block (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add pricing-card
 */
import React from "react";
import { View } from "react-native";
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
  className?: string;
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
  className = "",
}: PricingCardProps) {
  return (
    <Card elevated padding="lg" className={`w-full max-w-sm rounded-card ${className}`.trim()}>
      <View className="flex-row items-center justify-between">
        <Text variant="h3">{planName}</Text>
        {popular && <Badge variant="primary" size="sm" label="Most Popular" />}
      </View>

      <Text variant="muted" className="mt-1 type-xs">{description}</Text>

      <View className="mt-5 flex-row items-baseline sp-gap-1">
        <Text variant="h1" className="type-3xl weight-heading">{price}</Text>
        <Text variant="muted" className="type-xs">{period}</Text>
      </View>

      <View className="my-5">
        <Separator />
      </View>

      <View className="sp-gap-3">
        {features.map((feature, idx) => (
          <View key={idx} className="flex-row items-center sp-gap-2.5">
            <Text className="type-xs weight-title text-success">✓</Text>
            <Text variant="p" className="type-xs text-foreground">{feature}</Text>
          </View>
        ))}
      </View>

      <Button
        variant="default"
        size="lg"
        className="mt-6 w-full"
        onPress={onSubscribe}
      >
        {buttonText}
      </Button>
    </Card>
  );
}
