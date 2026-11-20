/** Nativra — PhoneInput (NativeWind). Install: npx nativra-cli add phone-input */
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { CountryPickerModal, type CountryPickerLabels } from "@/components/ui/CountryPicker";
import { COUNTRIES, countryByCode, type Country } from "@/components/ui/countries";
import { field, ts, useThemeColors } from "@/hooks/use-theme-colors";

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
  /** Text for another language; anything left out stays English. Also passed to the country list. */
  labels?: Partial<PhoneInputLabels>;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

export interface PhoneInputLabels extends Partial<CountryPickerLabels> {
  /** The country button, and the country list's title. */
  countryCode: string;
  countryCodeHint: string;
  /** Number field name read without a `label`. */
  phone: string;
}

const DEFAULT_LABELS: PhoneInputLabels = {
  countryCode: "Country code",
  countryCodeHint: "Opens the country list",
  phone: "Phone number",
};

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
  { label, value, onChangeText, country, onCountryChange, error = false, errorMessage, disabled = false, labels: labelOverrides, style, className = "", onFocus, onBlur, ...rest },
  ref
) {
  const palette = useThemeColors();
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
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
    <View className={`w-full sp-gap-1.5 ${className}`} style={style}>
      {label ? <Text className="type-sm weight-label text-foreground">{label}</Text> : null}
      {/* `field` (outlined or filled, from the style) is the resting look; focus is drawn in JS. */}
      <View
        className={`field flex-row items-center min-h-control rounded-control ${error ? "border-destructive" : ""} ${disabled ? "opacity-50" : ""}`}
        style={focused && !error ? field(palette, true) : undefined}
      >
        <Pressable
          onPress={() => setPicking(true)}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={`${labels.countryCode}, ${selected ? `${selected.name}, ${labels.plus ?? "plus"} ${selected.dial}` : (labels.none ?? "none")}`}
          accessibilityHint={labels.countryCodeHint}
          className="flex-row items-center sp-gap-1 pl-3 pr-2 self-stretch"
        >
          <Text className="type-lg">{selected?.flag ?? "🌐"}</Text>
          <Text className="type-base text-foreground" style={{ fontVariant: ["tabular-nums"] }}>
            +{selected?.dial ?? ""}
          </Text>
          <ChevronDown size={ts(16)} color={palette["muted-foreground"]} />
        </Pressable>
        <View className="self-stretch my-2.5 bg-border" style={{ width: StyleSheet.hairlineWidth }} />
        <TextInput
          ref={ref}
          value={value}
          onChangeText={change}
          editable={!disabled}
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
          placeholderTextColor={palette["muted-foreground"]}
          accessibilityLabel={rest.accessibilityLabel ?? label ?? labels.phone}
          accessibilityState={{ disabled }}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className="flex-1 type-base text-foreground sp-px-3 sp-py-2.5"
          {...rest}
        />
      </View>
      {error && errorMessage ? <Text className="type-xs text-destructive">{errorMessage}</Text> : null}
      <CountryPickerModal
        visible={picking}
        onClose={() => setPicking(false)}
        onSelect={onCountryChange}
        selected={selected?.code}
        title={labels.countryCode}
        labels={labels}
        showDialCode
      />
    </View>
  );
});
