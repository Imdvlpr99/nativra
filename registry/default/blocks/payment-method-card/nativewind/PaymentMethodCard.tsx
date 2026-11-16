/**
 * Nativra — PaymentMethodCard (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add payment-method-card
 */
import React from "react";
import { View, Text, Pressable, type ViewProps } from "react-native";
import { CreditCard, CheckCircle2, Trash2 } from "lucide-react-native";
import { useThemeColors } from "@/hooks/use-theme-colors";

export interface PaymentMethodCardProps extends ViewProps {
  brand?: "visa" | "mastercard" | "amex" | "applepay";
  last4: string;
  expiry: string;
  cardholderName?: string;
  isDefault?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function PaymentMethodCard({
  brand = "visa",
  last4,
  expiry,
  cardholderName,
  isDefault = false,
  selected = false,
  onSelect,
  onDelete,
  className = "",
  style,
  ...props
}: PaymentMethodCardProps) {
  const palette = useThemeColors();
  const brandLabel =
    brand === "mastercard"
      ? "Mastercard"
      : brand === "amex"
      ? "Amex"
      : brand === "applepay"
      ? "Apple Pay"
      : "VISA";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${brandLabel} ending in ${last4}, expires ${expiry}`}
      onPress={onSelect}
      className={`rounded-card border sp-p-4.5 transition-all ${
        selected
          ? "border-primary bg-primary/5"
          : "surface"
      } ${className}`.trim()}
      style={style}
      {...props}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center sp-gap-3">
          <View className="min-h-control w-14 items-center justify-center rounded-control bg-primary sp-px-2 border border-border">
            <Text className="type-2xs weight-heading tracking-wider text-primary-foreground uppercase">
              {brandLabel}
            </Text>
          </View>
          <View>
            <View className="flex-row items-center sp-gap-2">
              <Text className="type-base weight-title text-foreground">
                •••• {last4}
              </Text>
              {isDefault && (
                <View className="rounded-full bg-muted sp-px-2 sp-py-0.5">
                  <Text className="type-2xs weight-label text-muted-foreground">
                    Default
                  </Text>
                </View>
              )}
            </View>
            <Text className="type-xs text-muted-foreground mt-0.5">
              Expires {expiry}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center sp-gap-2">
          {onDelete && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Delete card"
              onPress={(e) => {
                e.stopPropagation?.();
                onDelete();
              }}
              className="sp-p-2 rounded-control active:bg-muted"
            >
              <Trash2 size={16} color={palette["muted-foreground"]} />
            </Pressable>
          )}
          {selected && <CheckCircle2 size={20} color={palette.primary} />}
        </View>
      </View>

      {cardholderName && (
        <View className="mt-3 border-t border-border sp-pt-2.5">
          <Text className="type-xs font-medium text-muted-foreground">
            {cardholderName.toUpperCase()}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

