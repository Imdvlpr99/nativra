/**
 * Nativra — Order Summary Block (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add order-summary
 */
import React from "react";
import { View } from "react-native";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { Text } from "./Text";
import { Separator } from "./Separator";

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: string;
}

export interface OrderSummaryProps {
  orderNumber?: string;
  items?: OrderItem[];
  subtotal?: string;
  discount?: string;
  voucherCode?: string;
  shipping?: string;
  tax?: string;
  total?: string;
  buttonLabel?: string;
  onCheckout?: () => void;
  className?: string;
}

export function OrderSummary({
  orderNumber = "#NV-88219",
  items = [
    { id: "1", name: "Nativra Pro Mobile Kit", qty: 1, price: "$79.00" },
    { id: "2", name: "Expo Template License", qty: 1, price: "$29.00" },
  ],
  subtotal = "$108.00",
  discount = "-$20.00",
  voucherCode = "LAUNCH50",
  shipping = "Free",
  tax = "$8.80",
  total = "$96.80",
  buttonLabel = "Proceed to Payment",
  onCheckout,
  className = "",
}: OrderSummaryProps) {
  return (
    <Card elevated padding="lg" className={`w-full max-w-sm rounded-card ${className}`.trim()}>
      <View className="flex-row items-center justify-between">
        <Text variant="h3">Order Summary</Text>
        <Badge variant="secondary" size="sm" label={orderNumber} />
      </View>

      {/* Item List */}
      <View className="mt-4 space-y-2.5">
        {items.map((it) => (
          <View key={it.id} className="flex-row items-center justify-between">
            <View className="flex-row items-center sp-gap-1.5 flex-1 sp-pr-2">
              <Text className="type-xs weight-title text-foreground">
                {it.qty}×
              </Text>
              <Text variant="muted" className="type-xs truncate">
                {it.name}
              </Text>
            </View>
            <Text className="type-xs weight-label text-foreground font-mono">
              {it.price}
            </Text>
          </View>
        ))}
      </View>

      <View className="my-4">
        <Separator />
      </View>

      {/* Pricing Breakdown */}
      <View className="space-y-2">
        <View className="flex-row justify-between items-center">
          <Text variant="muted" className="type-xs">Subtotal</Text>
          <Text className="type-xs font-medium text-foreground font-mono">{subtotal}</Text>
        </View>

        {discount && (
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center sp-gap-1.5">
              <Text variant="muted" className="type-xs">Discount</Text>
              <Badge variant="primary" size="sm" label={voucherCode} />
            </View>
            <Text className="type-xs weight-title text-success font-mono">{discount}</Text>
          </View>
        )}

        <View className="flex-row justify-between items-center">
          <Text variant="muted" className="type-xs">Shipping</Text>
          <Text className="type-xs font-medium text-foreground">{shipping}</Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text variant="muted" className="type-xs">Estimated Tax</Text>
          <Text className="type-xs font-medium text-foreground font-mono">{tax}</Text>
        </View>
      </View>

      <View className="my-4">
        <Separator />
      </View>

      {/* Total */}
      <View className="flex-row justify-between items-baseline mb-5">
        <Text variant="h3">Total Due</Text>
        <Text variant="h1" className="type-2xl weight-heading text-foreground font-mono">
          {total}
        </Text>
      </View>

      <Button variant="primary" size="lg" onPress={onCheckout}>
        {buttonLabel}
      </Button>
    </Card>
  );
}

