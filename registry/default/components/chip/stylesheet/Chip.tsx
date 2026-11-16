/** Nativra — Chip (StyleSheet). Install: npx nativra-cli add chip */
import React from "react";
import { Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import { type ThemeColors, alpha, useThemeColors, themeStyle, ts, sp, pressedStyle } from "@/hooks/use-theme-colors";

export interface ChipProps extends Omit<PressableProps, "style"> {
  label: string;
  selected?: boolean;
  variant?: "default" | "primary" | "outline";
  size?: "sm" | "md";
  disabled?: boolean;
  onPress?: () => void;
  onRemove?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function Chip({
  label,
  selected = false,
  variant = "default",
  size = "md",
  disabled = false,
  onPress,
  onRemove,
  style,
  ...rest
}: ChipProps) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.base,
        size === "sm" ? styles.sizeSm : styles.sizeMd,
        variant === "outline" ? styles.outline : variant === "primary" ? styles.primary : styles.default,
        selected && styles.selected,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      {...rest}
    >
      <Text
        style={[
          size === "sm" ? styles.textSm : styles.textMd,
          variant === "primary" ? styles.textPrimary : styles.textDefault,
          selected && styles.textSelected,
        ]}
      >
        {label}
      </Text>
      {onRemove ? (
        <Pressable
          onPress={disabled ? undefined : onRemove}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
          style={styles.removeBtn}
        >
          <View style={styles.removeInner}>
            <Text style={[styles.removeIcon, selected && styles.textSelected]}>✕</Text>
          </View>
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: themeStyle.radius.chip,
    borderWidth: themeStyle.borderWidth,
  },
  sizeSm: { height: 28, paddingHorizontal: sp(10) },
  sizeMd: { height: 32, paddingHorizontal: sp(14) },
  default: { backgroundColor: c.muted, borderColor: c.border },
  primary: { backgroundColor: alpha(c.primary, 0.08), borderColor: c.primary },
  outline: { backgroundColor: "transparent", borderColor: c.input },
  selected: { backgroundColor: c.primary, borderColor: c.primary },
  disabled: { opacity: 0.5 },
  pressed: { ...pressedStyle(true) },
  textSm: { fontSize: ts(12), fontWeight: "500" },
  textMd: { fontSize: ts(14), fontWeight: "500" },
  textDefault: { color: c.foreground },
  textPrimary: { color: c.primary },
  textSelected: { color: c["primary-foreground"], fontWeight: themeStyle.fontWeight.label },
  removeBtn: {
    marginLeft: 6,
    width: 16,
    height: 16,
    borderRadius: themeStyle.radius.chip,
    backgroundColor: alpha(c.foreground, 0.1),
    alignItems: "center",
    justifyContent: "center",
  },
  removeInner: { alignItems: "center", justifyContent: "center" },
  removeIcon: { fontSize: ts(10), color: c["muted-foreground"] },
});

