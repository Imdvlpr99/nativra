/** Nativra — PhoneInput (StyleSheet). Install: npx nativra-cli add phone-input */
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { CountryPickerModal } from "@/components/ui/CountryPicker";
import { COUNTRIES, countryByCode, type Country } from "@/components/ui/countries";
import { type ThemeColors, field, sp, themeStyle, ts, useThemeColors } from "@/hooks/use-theme-colors";

export interface PhoneInputProps extends Omit<TextInputProps, "value" | "onChangeText" | "style"> {
  label?: string;
  /** National number, digits only (what the user typed, without the country code). */
  value: string;
  onChangeText: (national: string) => void;
  /** ISO code of the selected country, e.g. "ID". */
  country: string;
  onCountryChange: (country: Country) => void;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** "+6281234567890" from the country and the national number; a leading trunk 0 is dropped. */
export function toE164(countryCode: string, national: string): string {
  const country = countryByCode(countryCode);
  const digits = national.replace(/\D/g, "").replace(/^0+/, "");
  return country && digits ? `+${country.dial}${digits}` : "";
}

/** Where several countries share a dial code, the one an international number most likely means. */
const PRIMARY = new Set(["US", "GB", "RU", "IT", "RE"]);

/**
 * Longest dial code at the start of "+44 20..." wins, so "+1 684" is American Samoa, not the US.
 * A shared code keeps the current country (+1 while Canada is picked), else the primary one.
 */
function splitInternational(text: string, current: Country | undefined): { country: Country; national: string } | null {
  const digits = text.replace(/\D/g, "");
  let best: Country | undefined;
  for (const c of COUNTRIES) {
    if (!digits.startsWith(c.dial)) continue;
    if (!best || c.dial.length > best.dial.length) best = c;
    else if (c.dial === best.dial && (c.code === current?.code || (best.code !== current?.code && PRIMARY.has(c.code)))) best = c;
  }
  return best ? { country: best, national: digits.slice(best.dial.length) } : null;
}

/** A phone number field with a country-code picker. Autofilled "+62 ..." numbers pick their country. */
export const PhoneInput = React.forwardRef<React.ComponentRef<typeof TextInput>, PhoneInputProps>(function PhoneInput(
  { label, value, onChangeText, country, onCountryChange, error = false, errorMessage, disabled = false, style, onFocus, onBlur, ...rest },
  ref
) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const [focused, setFocused] = React.useState(false);
  const [picking, setPicking] = React.useState(false);
  const selected = countryByCode(country);

  const change = (text: string) => {
    if (text.trim().startsWith("+")) {
      const parsed = splitInternational(text, selected);
      if (parsed) {
        if (parsed.country.code !== selected?.code) onCountryChange(parsed.country);
        onChangeText(parsed.national);
        return;
      }
    }
    onChangeText(text.replace(/[^\d]/g, ""));
  };

  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, field(c, focused), error && styles.error, disabled && styles.disabled]}>
        <Pressable
          onPress={() => setPicking(true)}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={`Country code, ${selected ? `${selected.name}, plus ${selected.dial}` : "none"}`}
          accessibilityHint="Opens the country list"
          style={styles.country}
        >
          <Text style={styles.flag}>{selected?.flag ?? "🌐"}</Text>
          <Text style={styles.dial}>+{selected?.dial ?? ""}</Text>
          <ChevronDown size={ts(16)} color={c["muted-foreground"]} />
        </Pressable>
        <View style={styles.divider} />
        <TextInput
          ref={ref}
          value={value}
          onChangeText={change}
          editable={!disabled}
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
          placeholderTextColor={c["muted-foreground"]}
          accessibilityLabel={rest.accessibilityLabel ?? label ?? "Phone number"}
          accessibilityState={{ disabled }}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={styles.input}
          {...rest}
        />
      </View>
      {error && errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <CountryPickerModal
        visible={picking}
        onClose={() => setPicking(false)}
        onSelect={onCountryChange}
        selected={selected?.code}
        title="Country code"
        showDialCode
      />
    </View>
  );
});

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrap: { width: "100%", gap: sp(6) },
    label: { fontSize: ts(14), fontWeight: themeStyle.fontWeight.label, color: c.foreground },
    field: { flexDirection: "row", alignItems: "center", minHeight: themeStyle.control.height, borderRadius: themeStyle.radius.control },
    country: { flexDirection: "row", alignItems: "center", gap: sp(4), paddingLeft: sp(12), paddingRight: sp(8), alignSelf: "stretch" },
    flag: { fontSize: ts(20) },
    dial: { fontSize: ts(16), color: c.foreground, fontVariant: ["tabular-nums"] },
    divider: { width: StyleSheet.hairlineWidth, alignSelf: "stretch", marginVertical: sp(10), backgroundColor: c.border },
    input: { flex: 1, fontSize: ts(16), color: c.foreground, paddingHorizontal: sp(12), paddingVertical: sp(10) },
    error: { borderColor: c.destructive, borderWidth: Math.max(themeStyle.borderWidth, 1) },
    errorText: { fontSize: ts(12), color: c.destructive },
    disabled: { opacity: 0.5 },
  });
