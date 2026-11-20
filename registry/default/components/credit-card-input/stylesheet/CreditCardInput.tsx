/** Nativra — CreditCardInput (StyleSheet). Install: npx nativra-cli add credit-card-input */
import React from "react";
import { StyleSheet, Text, View, type StyleProp, type TextInput, type ViewStyle } from "react-native";
import { Input } from "@/components/ui/Input";
import { BRAND_LABEL, cardStatus, formatCardNumber, formatExpiry, maxLength, ruleFor, type CardStatus, type CardValue } from "@/components/ui/card-utils";
import { type ThemeColors, sp, themeStyle, ts, useThemeColors } from "@/hooks/use-theme-colors";

export type { CardStatus, CardValue } from "@/components/ui/card-utils";

export interface CreditCardInputProps {
  value: CardValue;
  /** Called on every change with the new value and its validation status. */
  onChange: (value: CardValue, status: CardStatus) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Card number, expiry and CVC with formatting, brand detection, checksum validation and focus
 * moving on as each field fills. Use it with your payment provider's tokenization; never store
 * raw card numbers on your own servers.
 */
export function CreditCardInput({ value, onChange, disabled = false, style }: CreditCardInputProps) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const expiryRef = React.useRef<React.ComponentRef<typeof TextInput>>(null);
  const cvcRef = React.useRef<React.ComponentRef<typeof TextInput>>(null);
  const [left, setLeft] = React.useState({ number: false, expiry: false, cvc: false });
  const status = cardStatus(value);
  const rule = ruleFor(value.number);

  const emit = (next: CardValue) => onChange(next, cardStatus(next));
  const leave = (key: keyof typeof left) => setLeft((l) => ({ ...l, [key]: true }));

  return (
    <View style={[styles.wrap, style]}>
      <View>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Card number</Text>
          {status.brand !== "unknown" ? <Text style={styles.brand}>{BRAND_LABEL[status.brand]}</Text> : null}
        </View>
        <Input
          value={value.number}
          onChangeText={(text) => {
            const number = formatCardNumber(text);
            emit({ ...value, number });
            const digits = number.replace(/\D/g, "").length;
            if (digits === maxLength(number) && cardStatus({ ...value, number }).numberValid) expiryRef.current?.focus();
          }}
          onBlur={() => leave("number")}
          placeholder="1234 5678 9012 3456"
          keyboardType="number-pad"
          autoComplete="cc-number"
          textContentType="creditCardNumber"
          accessibilityLabel={status.brand !== "unknown" ? `Card number, ${BRAND_LABEL[status.brand]}` : "Card number"}
          error={left.number && value.number.length > 0 && !status.numberValid}
          errorMessage="Check the card number"
          disabled={disabled}
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => expiryRef.current?.focus()}
        />
      </View>
      <View style={styles.row}>
        <View style={styles.half}>
          <Input
            ref={expiryRef}
            label="Expiry"
            value={value.expiry}
            onChangeText={(text) => {
              const expiry = formatExpiry(text, value.expiry);
              emit({ ...value, expiry });
              if (expiry.length === 5) cvcRef.current?.focus();
            }}
            onBlur={() => leave("expiry")}
            placeholder="MM/YY"
            keyboardType="number-pad"
            autoComplete="cc-exp"
            accessibilityLabel="Expiry date, month and year"
            error={left.expiry && value.expiry.length > 0 && !status.expiryValid}
            errorMessage="Check the date"
            disabled={disabled}
            maxLength={5}
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => cvcRef.current?.focus()}
          />
        </View>
        <View style={styles.half}>
          <Input
            ref={cvcRef}
            label={rule.cvc === 4 ? "CID" : "CVC"}
            value={value.cvc}
            onChangeText={(text) => emit({ ...value, cvc: text.replace(/\D/g, "").slice(0, rule.cvc) })}
            onBlur={() => leave("cvc")}
            placeholder={rule.cvc === 4 ? "1234" : "123"}
            keyboardType="number-pad"
            autoComplete="cc-csc"
            secureTextEntry
            accessibilityLabel={`Security code, ${rule.cvc} digits`}
            error={left.cvc && value.cvc.length > 0 && !status.cvcValid}
            errorMessage={`${rule.cvc} digits`}
            disabled={disabled}
            maxLength={rule.cvc}
          />
        </View>
      </View>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrap: { width: "100%", gap: sp(16) },
    labelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: sp(6) },
    label: { fontSize: ts(14), fontWeight: themeStyle.fontWeight.label, color: c.foreground },
    brand: { fontSize: ts(13), color: c["muted-foreground"] },
    row: { flexDirection: "row", gap: sp(12) },
    half: { flex: 1 },
  });
