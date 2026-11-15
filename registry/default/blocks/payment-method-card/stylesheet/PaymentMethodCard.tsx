/**
 * Nativra — PaymentMethodCard (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add payment-method-card
 */
import React from "react";
import { View, Text, Pressable, StyleSheet, type ViewProps } from "react-native";
import { CheckCircle2, Trash2 } from "lucide-react-native";
import { themeStyle, useThemeColors, alpha, type ThemeColors, ts, sp, surface } from "@/hooks/use-theme-colors";

export interface PaymentMethodCardProps extends ViewProps {
  brand?: "visa" | "mastercard" | "amex" | "applepay";
  last4: string;
  expiry: string;
  cardholderName?: string;
  isDefault?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
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
  style,
  ...props
}: PaymentMethodCardProps) {
  const palette = useThemeColors();
  const styles = React.useMemo(() => createStyles(palette), [palette]);
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
      style={[
        styles.card,
        selected ? styles.cardSelected : styles.cardUnselected,
        style,
      ]}
      {...props}
    >
      <View style={styles.topRow}>
        <View style={styles.leftCol}>
          <View style={styles.brandBox}>
            <Text style={styles.brandText}>{brandLabel}</Text>
          </View>
          <View>
            <View style={styles.panRow}>
              <Text style={styles.panText}>•••• {last4}</Text>
              {isDefault && (
                <View style={styles.defaultPill}>
                  <Text style={styles.defaultPillText}>Default</Text>
                </View>
              )}
            </View>
            <Text style={styles.expiryText}>Expires {expiry}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {onDelete && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Delete card"
              onPress={(e) => {
                e.stopPropagation?.();
                onDelete();
              }}
              style={styles.iconBtn}
            >
              <Trash2 size={16} color={palette["muted-foreground"]} />
            </Pressable>
          )}
          {selected && <CheckCircle2 size={20} color={palette.primary} />}
        </View>
      </View>

      {cardholderName && (
        <View style={styles.holderRow}>
          <Text style={styles.holderText}>{cardholderName.toUpperCase()}</Text>
        </View>
      )}
    </Pressable>
  );
}

const createStyles = (palette: ThemeColors) => StyleSheet.create({
  card: {
    borderRadius: themeStyle.radius.card,
    borderWidth: themeStyle.borderWidth,
    padding: sp(18),
  },
  cardUnselected: {
    ...surface(palette),
  },
  cardSelected: {
    borderColor: palette.primary,
    backgroundColor: alpha(palette.primary, 0.1),
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: sp(12),
  },
  brandBox: {
    height: 40,
    width: 56,
    borderRadius: themeStyle.radius.control,
    backgroundColor: palette.background,
    borderWidth: themeStyle.borderWidth,
    borderColor: palette.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: sp(6),
  },
  brandText: {
    fontSize: ts(11),
    fontWeight: themeStyle.fontWeight.heading,
    color: palette.foreground,
    letterSpacing: 0.5,
  },
  panRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: sp(8),
  },
  panText: {
    fontSize: ts(16),
    fontWeight: themeStyle.fontWeight.title,
    color: palette.foreground,
  },
  defaultPill: {
    borderRadius: 9999,
    backgroundColor: palette.muted,
    paddingHorizontal: sp(8),
    paddingVertical: sp(2),
  },
  defaultPillText: {
    fontSize: ts(10),
    fontWeight: themeStyle.fontWeight.label,
    color: palette["muted-foreground"],
  },
  expiryText: {
    fontSize: ts(12),
    color: palette["muted-foreground"],
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: sp(8),
  },
  iconBtn: {
    padding: sp(8),
  },
  holderRow: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: alpha(palette.border, 0.8),
    paddingTop: sp(8),
  },
  holderText: {
    fontSize: ts(11),
    fontWeight: themeStyle.fontWeight.label,
    color: palette["muted-foreground"],
    letterSpacing: 0.5,
  },
});

