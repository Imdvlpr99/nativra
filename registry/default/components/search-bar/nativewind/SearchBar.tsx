/** Nativra — SearchBar (NativeWind). Install: npx nativra-cli add search-bar */
import React from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from "react-native";
import { Search, X } from "lucide-react-native";
import { field, ts, useThemeColors } from "@/hooks/use-theme-colors";

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
  className?: string;
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
    className = "",
    onFocus,
    onBlur,
    ...rest
  },
  ref
) {
  const palette = useThemeColors();
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
    <View className={`w-full flex-row items-center sp-gap-3 ${className}`} style={style}>
      {/* `field` (outlined or filled, from the style) is the resting look; focus is drawn in JS. */}
      <View
        className="field flex-1 flex-row items-center sp-gap-2 min-h-control rounded-control sp-px-3"
        style={focused ? field(palette, true) : undefined}
      >
        <Search size={ts(18)} color={palette["muted-foreground"]} />
        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={change}
          placeholder={placeholder}
          placeholderTextColor={palette["muted-foreground"]}
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
          // No vertical padding: the row centers the text, and Android adds its own.
          className="flex-1 type-base text-foreground py-0"
          {...rest}
        />
        {loading ? (
          <ActivityIndicator size="small" color={palette["muted-foreground"]} />
        ) : text.length > 0 ? (
          <Pressable
            onPress={clear}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            hitSlop={8}
            className="h-5 w-5 rounded-full items-center justify-center bg-muted-foreground active:opacity-70"
          >
            <X size={ts(14)} color={palette.background} strokeWidth={3} />
          </Pressable>
        ) : null}
      </View>
      {onCancel && (focused || text.length > 0) ? (
        <Pressable onPress={cancel} accessibilityRole="button" hitSlop={8} className="active:opacity-70">
          <Text className="type-base weight-label text-primary">{cancelLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
});
