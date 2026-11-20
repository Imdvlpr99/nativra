/** Nativra — CountryPicker (NativeWind). Install: npx nativra-cli add country-picker */
import React from "react";
import { FlatList, Modal, Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { Check, ChevronDown, X } from "lucide-react-native";
import { SearchBar } from "@/components/ui/SearchBar";
import { COUNTRIES, countryByCode, searchCountries, type Country } from "@/components/ui/countries";
import { field, ts, useThemeColors } from "@/hooks/use-theme-colors";

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
  /** Text for another language; anything left out stays English. */
  labels?: Partial<CountryPickerLabels>;
}

export interface CountryPickerLabels {
  /** Modal title (the `title` prop wins when set). */
  title: string;
  search: string;
  /** `{query}` is filled in. */
  empty: string;
  close: string;
  /** Read before a dial code: "Indonesia, plus 62". */
  plus: string;
  /** Field placeholder (the `placeholder` prop wins when set). */
  placeholder: string;
  /** Field name read without a `label`. */
  field: string;
  none: string;
}

export const DEFAULT_COUNTRY_PICKER_LABELS: CountryPickerLabels = {
  title: "Select country",
  search: "Search by name or code",
  empty: "No country matches “{query}”",
  close: "Close",
  plus: "plus",
  placeholder: "Select a country",
  field: "Country",
  none: "None selected",
};

/** The searchable country list in a modal sheet, for custom triggers. */
export function CountryPickerModal({
  visible,
  onClose,
  onSelect,
  selected,
  title,
  showDialCode = false,
  countries = COUNTRIES,
  labels: labelOverrides,
}: CountryPickerModalProps) {
  const labels = { ...DEFAULT_COUNTRY_PICKER_LABELS, ...labelOverrides };
  const palette = useThemeColors();
  const [query, setQuery] = React.useState("");
  const results = React.useMemo(() => searchCountries(query, countries), [query, countries]);
  const close = () => {
    setQuery("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={close}>
      <View className="flex-1 bg-background pt-4">
        <View className="flex-row items-center justify-between px-4 mb-3">
          <Text accessibilityRole="header" className="type-lg weight-title text-foreground">
            {title ?? labels.title}
          </Text>
          <Pressable onPress={close} accessibilityRole="button" accessibilityLabel={labels.close} hitSlop={8} className="active:opacity-70">
            <X size={ts(22)} color={palette.foreground} />
          </Pressable>
        </View>
        <SearchBar value={query} onChangeText={setQuery} placeholder={labels.search} className="px-4 mb-2" />
        <FlatList
          data={results}
          keyExtractor={(item) => item.code}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={20}
          ListEmptyComponent={<Text className="p-6 text-center type-base text-muted-foreground">{labels.empty.replace("{query}", query)}</Text>}
          renderItem={({ item }) => {
            const active = item.code === selected;
            return (
              <Pressable
                onPress={() => {
                  onSelect(item);
                  close();
                }}
                accessibilityRole="button"
                accessibilityLabel={showDialCode ? `${item.name}, ${labels.plus} ${item.dial}` : item.name}
                accessibilityState={{ selected: active }} aria-selected={active}
                className="flex-row items-center sp-gap-3 px-4 min-h-control active:bg-muted"
              >
                <Text className="type-xl">{item.flag}</Text>
                <Text numberOfLines={1} className="flex-1 type-base text-foreground">
                  {item.name}
                </Text>
                {showDialCode ? (
                  <Text className="type-sm text-muted-foreground" style={{ fontVariant: ["tabular-nums"] }}>
                    +{item.dial}
                  </Text>
                ) : null}
                {active ? <Check size={ts(18)} color={palette.primary} /> : null}
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
  /** Text for another language; anything left out stays English. */
  labels?: Partial<CountryPickerLabels>;
  style?: StyleProp<ViewStyle>;
  className?: string;
}

/** A field that opens a searchable country list. */
export function CountryPicker({
  label,
  value,
  onChange,
  placeholder,
  showDialCode = false,
  countries,
  disabled = false,
  labels: labelOverrides,
  style,
  className = "",
}: CountryPickerProps) {
  const palette = useThemeColors();
  const labels = { ...DEFAULT_COUNTRY_PICKER_LABELS, ...labelOverrides };
  const [open, setOpen] = React.useState(false);
  const selected = countryByCode(value);

  return (
    <View className={`w-full sp-gap-1.5 ${className}`} style={style}>
      {label ? <Text className="type-sm weight-label text-foreground">{label}</Text> : null}
      <Pressable
        onPress={() => setOpen(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={label ?? labels.field}
        accessibilityValue={{ text: selected?.name ?? labels.none }}
        accessibilityState={{ disabled, expanded: open }}
        className={`field flex-row items-center sp-gap-2.5 min-h-control rounded-control sp-px-3.5 active:bg-muted ${disabled ? "opacity-50" : ""}`}
        style={open ? field(palette, true) : undefined}
      >
        {selected ? <Text className="type-xl">{selected.flag}</Text> : null}
        <Text numberOfLines={1} className={`flex-1 type-base ${selected ? "text-foreground" : "text-muted-foreground"}`}>
          {selected ? (showDialCode ? `${selected.name} (+${selected.dial})` : selected.name) : (placeholder ?? labels.placeholder)}
        </Text>
        <ChevronDown size={ts(18)} color={palette["muted-foreground"]} />
      </Pressable>
      <CountryPickerModal
        visible={open}
        onClose={() => setOpen(false)}
        onSelect={(country) => onChange?.(country)}
        selected={selected?.code}
        showDialCode={showDialCode}
        labels={labels}
        {...(countries ? { countries } : {})}
      />
    </View>
  );
}
