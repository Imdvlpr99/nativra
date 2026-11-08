/**
 * Nativra — Pricing Card Block (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add pricing-card
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
    <Card elevated padding="lg" className={`w-full max-w-sm rounded-3xl ${className}`.trim()}>
      <View className="flex-row items-center justify-between">
        <Text variant="h3">{planName}</Text>
        {popular && <Badge variant="primary" size="sm" label="Most Popular" />}
      </View>

      <Text variant="muted" className="mt-1 text-xs">{description}</Text>

      <View className="mt-5 flex-row items-baseline gap-1">
        <Text variant="h1" className="text-3xl font-extrabold">{price}</Text>
        <Text variant="muted" className="text-xs">{period}</Text>
      </View>

      <View className="my-5">
        <Separator />
      </View>

      <View className="gap-3">
        {features.map((feature, idx) => (
          <View key={idx} className="flex-row items-center gap-2.5">
            <Text className="text-xs font-bold text-emerald-600 dark:text-emerald-400">✓</Text>
            <Text variant="p" className="text-xs text-zinc-700 dark:text-zinc-300">{feature}</Text>
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
