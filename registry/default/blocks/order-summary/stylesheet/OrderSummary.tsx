/**
 * Nativra — Order Summary Block (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add order-summary --target stylesheet
 */
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { themeStyle, useThemeColors, alpha, type ThemeColors, elevation, ts, sp, surface } from "@/hooks/use-theme-colors";

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
}: OrderSummaryProps) {
  const palette = useThemeColors();
  const styles = React.useMemo(() => createStyles(palette), [palette]);
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Summary</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{orderNumber}</Text>
        </View>
      </View>

      {/* Item List */}
      <View style={styles.itemList}>
        {items.map((it) => (
          <View key={it.id} style={styles.row}>
            <Text style={styles.itemText}>
              <Text style={styles.qtyText}>{it.qty}× </Text>
              {it.name}
            </Text>
            <Text style={styles.itemPrice}>{it.price}</Text>
          </View>
        ))}
      </View>

      <View style={styles.separator} />

      {/* Cost Breakdown */}
      <View style={styles.breakdown}>
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>{subtotal}</Text>
        </View>

        {discount && (
          <View style={styles.row}>
            <View style={styles.voucherContainer}>
              <Text style={styles.label}>Discount</Text>
              <View style={styles.voucherBadge}>
                <Text style={styles.voucherText}>{voucherCode}</Text>
              </View>
            </View>
            <Text style={styles.discountText}>{discount}</Text>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.label}>Shipping</Text>
          <Text style={styles.value}>{shipping}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Estimated Tax</Text>
          <Text style={styles.value}>{tax}</Text>
        </View>
      </View>

      <View style={styles.separator} />

      {/* Total Due */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Due</Text>
        <Text style={styles.totalValue}>{total}</Text>
      </View>

      <Pressable accessibilityRole="button" style={styles.checkoutBtn} onPress={onCheckout}>
        <Text style={styles.btnText}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (palette: ThemeColors) => StyleSheet.create({
  card: {
    ...surface(palette),
    width: "100%",
    maxWidth: 360,
    borderRadius: themeStyle.radius.card,
    padding: sp(24),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: ts(18),
    fontWeight: themeStyle.fontWeight.title,
    color: palette.foreground,
  },
  badge: {
    paddingHorizontal: sp(8),
    paddingVertical: sp(3),
    borderRadius: 9999,
    backgroundColor: palette.muted,
  },
  badgeText: {
    fontSize: ts(11),
    fontWeight: themeStyle.fontWeight.label,
    color: palette["muted-foreground"],
  },
  itemList: {
    marginTop: 16,
    gap: sp(10),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: ts(12),
    color: palette["muted-foreground"],
    flex: 1,
    marginRight: 8,
  },
  qtyText: {
    fontWeight: themeStyle.fontWeight.title,
    color: palette.foreground,
  },
  itemPrice: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.label,
    color: palette.foreground,
  },
  separator: {
    height: 1,
    backgroundColor: palette.muted,
    marginVertical: 16,
  },
  breakdown: {
    gap: sp(8),
  },
  label: {
    fontSize: ts(12),
    color: palette["muted-foreground"],
  },
  value: {
    fontSize: ts(12),
    fontWeight: "500",
    color: palette.foreground,
  },
  voucherContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: sp(6),
  },
  voucherBadge: {
    paddingHorizontal: sp(6),
    paddingVertical: sp(1),
    borderRadius: themeStyle.radius.small,
    backgroundColor: alpha(palette.primary, 0.15),
  },
  voucherText: {
    fontSize: ts(10),
    fontWeight: themeStyle.fontWeight.title,
    color: palette.primary,
  },
  discountText: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.title,
    color: palette.success,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: ts(16),
    fontWeight: themeStyle.fontWeight.title,
    color: palette.foreground,
  },
  totalValue: {
    fontSize: ts(22),
    fontWeight: themeStyle.fontWeight.heading,
    color: palette.foreground,
  },
  checkoutBtn: {
    borderRadius: themeStyle.radius.button,
    backgroundColor: palette.primary,
    paddingVertical: sp(14),
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: palette["primary-foreground"],
    fontSize: ts(14),
    fontWeight: themeStyle.fontWeight.title,
  },
});

