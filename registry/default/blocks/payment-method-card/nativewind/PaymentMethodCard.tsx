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
      className={`rounded-2xl border p-4.5 transition-all ${
        selected
          ? "border-sky-500 bg-sky-500/5 dark:bg-sky-500/10"
          : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
      } ${className}`.trim()}
      style={style}
      {...props}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="h-10 w-14 items-center justify-center rounded-xl bg-zinc-950 px-2 dark:bg-zinc-800 border border-zinc-800">
            <Text className="text-[11px] font-black tracking-wider text-white uppercase">
              {brandLabel}
            </Text>
          </View>
          <View>
            <View className="flex-row items-center gap-2">
              <Text className="text-base font-bold text-zinc-950 dark:text-white">
                •••• {last4}
              </Text>
              {isDefault && (
                <View className="rounded-full bg-zinc-100 px-2 py-0.5 dark:bg-zinc-800">
                  <Text className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-300">
                    Default
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Expires {expiry}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          {onDelete && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Delete card"
              onPress={(e) => {
                e.stopPropagation?.();
                onDelete();
              }}
              className="p-2 rounded-lg active:bg-zinc-100 dark:active:bg-zinc-800"
            >
              <Trash2 size={16} color="#71717a" />
            </Pressable>
          )}
          {selected && <CheckCircle2 size={20} color="#0284c7" />}
        </View>
      </View>

      {cardholderName && (
        <View className="mt-3 border-t border-zinc-100 pt-2.5 dark:border-zinc-800/80">
          <Text className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {cardholderName.toUpperCase()}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

