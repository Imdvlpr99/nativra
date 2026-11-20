/** Nativra — SearchBar (StyleSheet). Install: npx nativra-cli add search-bar */
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from "react-native";
import { Search, X } from "lucide-react-native";
import { type ThemeColors, field, pressedStyle, sp, themeStyle, ts, useThemeColors } from "@/hooks/use-theme-colors";

export interface SearchBarProps extends Omit<TextInputProps, "value" | "defaultValue" | "onChangeText" | "style"> {
  /** Controlled text. Leave out (with defaultValue) to let the bar keep its own. */
  value?: string;
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  /** Called with the text when the keyboard's search key is pressed. */
  onSearch?: (text: string) => void;
  /** Called after the clear button empties the field. */
  onClear?: () => void;
  /** Shows a "Cancel" button next to the field while it is focused or has text. */
  onCancel?: () => void;
  cancelLabel?: string;
  /** Replaces the clear button with a spinner (results are loading). */
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Forwards its ref to the TextInput, so a screen can focus the bar on open. */
export const SearchBar = React.forwardRef<React.ComponentRef<typeof TextInput>, SearchBarProps>(function SearchBar(
  {
    value,
    defaultValue = "",
    onChangeText,
    onSearch,
    onClear,
    onCancel,
    cancelLabel = "Cancel",
    loading = false,
    placeholder = "Search",
    style,
    onFocus,
    onBlur,
    ...rest
  },
  ref
) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const [internal, setInternal] = React.useState(defaultValue);
  const [focused, setFocused] = React.useState(false);
  const text = value ?? internal;
  const inputRef = React.useRef<React.ComponentRef<typeof TextInput>>(null);
  React.useImperativeHandle(ref, () => inputRef.current as React.ComponentRef<typeof TextInput>);

  const change = (next: string) => {
    if (value === undefined) setInternal(next);
    onChangeText?.(next);
  };
  const clear = () => {
    change("");
    onClear?.();
    inputRef.current?.focus();
  };
  const cancel = () => {
    change("");
    inputRef.current?.blur();
    onCancel?.();
  };

  return (
    <View style={[styles.row, style]}>
      <View style={[styles.field, field(c, focused)]}>
        <Search size={ts(18)} color={c["muted-foreground"]} />
        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={change}
          placeholder={placeholder}
          placeholderTextColor={c["muted-foreground"]}
          accessibilityRole="search"
          accessibilityLabel={rest.accessibilityLabel ?? placeholder}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="never"
          onSubmitEditing={() => onSearch?.(text)}
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
        {loading ? (
          <ActivityIndicator size="small" color={c["muted-foreground"]} />
        ) : text.length > 0 ? (
          <Pressable
            onPress={clear}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={8}
            style={({ pressed }) => [styles.clear, pressedStyle(pressed)]}
          >
            <X size={ts(14)} color={c.background} strokeWidth={3} />
          </Pressable>
        ) : null}
      </View>
      {onCancel && (focused || text.length > 0) ? (
        <Pressable onPress={cancel} accessibilityRole="button" hitSlop={8} style={({ pressed }) => pressedStyle(pressed)}>
          <Text style={styles.cancel}>{cancelLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
});

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: { width: "100%", flexDirection: "row", alignItems: "center", gap: sp(12) },
    field: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: sp(8),
      minHeight: themeStyle.control.height,
      borderRadius: themeStyle.radius.control,
      paddingHorizontal: sp(12),
    },
    // No vertical padding: the row centers the text, and Android adds its own.
    input: { flex: 1, fontSize: ts(16), color: c.foreground, paddingVertical: 0 },
    clear: {
      width: ts(20),
      height: ts(20),
      borderRadius: ts(10),
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c["muted-foreground"],
    },
    cancel: { fontSize: ts(16), color: c.primary, fontWeight: themeStyle.fontWeight.label },
  });
