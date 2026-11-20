/** Nativra — CountryPicker (StyleSheet). Install: npx nativra-cli add country-picker */
import React from "react";
import { FlatList, Modal, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { Check, ChevronDown, X } from "lucide-react-native";
import { SearchBar } from "@/components/ui/SearchBar";
import { COUNTRIES, countryByCode, searchCountries, type Country } from "@/components/ui/countries";
import { type ThemeColors, field, pressedStyle, sp, themeStyle, ts, useThemeColors } from "@/hooks/use-theme-colors";

export interface CountryPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (country: Country) => void;
  /** ISO code of the current choice, marked with a check. */
  selected?: string;
  title?: string;
  /** Show "+62" next to each name. */
  showDialCode?: boolean;
  /** Limit the list (e.g. the countries you ship to). Defaults to every country. */
  countries?: readonly Country[];
}

/** The searchable country list in a modal sheet, for custom triggers. */
export function CountryPickerModal({
  visible,
  onClose,
  onSelect,
  selected,
  title = "Select country",
  showDialCode = false,
  countries = COUNTRIES,
}: CountryPickerModalProps) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const [query, setQuery] = React.useState("");
  const results = React.useMemo(() => searchCountries(query, countries), [query, countries]);
  const close = () => {
    setQuery("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={close}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
          <Pressable onPress={close} accessibilityRole="button" accessibilityLabel="Close" hitSlop={8} style={({ pressed }) => pressedStyle(pressed)}>
            <X size={ts(22)} color={c.foreground} />
          </Pressable>
        </View>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search by name or code" style={styles.search} />
        <FlatList
          data={results}
          keyExtractor={(item) => item.code}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={20}
          ListEmptyComponent={<Text style={styles.empty}>No country matches “{query}”</Text>}
          renderItem={({ item }) => {
            const active = item.code === selected;
            return (
              <Pressable
                onPress={() => {
                  onSelect(item);
                  close();
                }}
                accessibilityRole="button"
                accessibilityLabel={showDialCode ? `${item.name}, plus ${item.dial}` : item.name}
                accessibilityState={{ selected: active }}
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              >
                <Text style={styles.flag}>{item.flag}</Text>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
                {showDialCode ? <Text style={styles.dial}>+{item.dial}</Text> : null}
                {active ? <Check size={ts(18)} color={c.primary} /> : null}
              </Pressable>
            );
          }}
        />
      </View>
    </Modal>
  );
}

export interface CountryPickerProps {
  label?: string;
  /** ISO code of the selected country, e.g. "ID" */
  value?: string;
  onChange?: (country: Country) => void;
  placeholder?: string;
  showDialCode?: boolean;
  countries?: readonly Country[];
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** A field that opens a searchable country list. */
export function CountryPicker({
  label,
  value,
  onChange,
  placeholder = "Select a country",
  showDialCode = false,
  countries,
  disabled = false,
  style,
}: CountryPickerProps) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const [open, setOpen] = React.useState(false);
  const selected = countryByCode(value);

  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable
        onPress={() => setOpen(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label ?? "Country"}
        accessibilityValue={{ text: selected?.name ?? "None selected" }}
        accessibilityState={{ disabled, expanded: open }}
        style={({ pressed }) => [styles.trigger, field(c, open), disabled && styles.disabled, pressed && styles.rowPressed]}
      >
        {selected ? <Text style={styles.flag}>{selected.flag}</Text> : null}
        <Text style={[styles.value, !selected && styles.placeholder]} numberOfLines={1}>
          {selected ? (showDialCode ? `${selected.name} (+${selected.dial})` : selected.name) : placeholder}
        </Text>
        <ChevronDown size={ts(18)} color={c["muted-foreground"]} />
      </Pressable>
      <CountryPickerModal
        visible={open}
        onClose={() => setOpen(false)}
        onSelect={(country) => onChange?.(country)}
        selected={selected?.code}
        showDialCode={showDialCode}
        {...(countries ? { countries } : {})}
      />
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrap: { width: "100%", gap: sp(6) },
    label: { fontSize: ts(14), fontWeight: themeStyle.fontWeight.label, color: c.foreground },
    trigger: {
      flexDirection: "row",
      alignItems: "center",
      gap: sp(10),
      minHeight: themeStyle.control.height,
      borderRadius: themeStyle.radius.control,
      paddingHorizontal: sp(14),
    },
    value: { flex: 1, fontSize: ts(16), color: c.foreground },
    placeholder: { color: c["muted-foreground"] },
    disabled: { opacity: 0.5 },
    sheet: { flex: 1, backgroundColor: c.background, paddingTop: sp(16) },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: sp(16), marginBottom: sp(12) },
    title: { fontSize: ts(18), fontWeight: themeStyle.fontWeight.title, color: c.foreground },
    search: { paddingHorizontal: sp(16), marginBottom: sp(8) },
    row: { flexDirection: "row", alignItems: "center", gap: sp(12), paddingHorizontal: sp(16), minHeight: themeStyle.control.height + 4 },
    rowPressed: { backgroundColor: c.muted },
    flag: { fontSize: ts(22) },
    name: { flex: 1, fontSize: ts(16), color: c.foreground },
    dial: { fontSize: ts(15), color: c["muted-foreground"], fontVariant: ["tabular-nums"] },
    empty: { padding: sp(24), textAlign: "center", color: c["muted-foreground"], fontSize: ts(15) },
  });
