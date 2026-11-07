/**
 * Nativra — Order Summary Block (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra add order-summary --target stylesheet
 */
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

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

      <Pressable style={styles.checkoutBtn} onPress={onCheckout}>
        <Text style={styles.btnText}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e4e4e7",
    backgroundColor: "#ffffff",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "between",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#09090b",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    backgroundColor: "#f4f4f5",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#71717a",
  },
  itemList: {
    marginTop: 16,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 12,
    color: "#71717a",
    flex: 1,
    marginRight: 8,
  },
  qtyText: {
    fontWeight: "700",
    color: "#09090b",
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: "600",
    color: "#09090b",
  },
  separator: {
    height: 1,
    backgroundColor: "#f4f4f5",
    marginVertical: 16,
  },
  breakdown: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: "#71717a",
  },
  value: {
    fontSize: 12,
    fontWeight: "500",
    color: "#18181b",
  },
  voucherContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  voucherBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
    backgroundColor: "#e0f2fe",
  },
  voucherText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0284c7",
  },
  discountText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#16a34a",
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#09090b",
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#09090b",
  },
  checkoutBtn: {
    borderRadius: 14,
    backgroundColor: "#0ea5e9",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});

