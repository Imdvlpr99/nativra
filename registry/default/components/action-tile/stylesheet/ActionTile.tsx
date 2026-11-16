/** Nativra — ActionTile (StyleSheet). Install: npx nativra-cli add action-tile */
import React from "react";
import { Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import { type ThemeColors, alpha, useThemeColors, themeStyle, ts, sp, pressedStyle } from "@/hooks/use-theme-colors";

export interface ActionTileProps extends Omit<PressableProps, "style"> {
  label: string;
  subtitle?: string;
  icon?: string;
  variant?: "default" | "primary" | "outline";
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ActionTile({
  label,
  subtitle,
  icon = "⚡",
  variant = "default",
  disabled = false,
  onPress,
  style,
  ...rest
}: ActionTileProps) {
  const c = useThemeColors();
  const styles = createStyles(c);
  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.base,
        variant === "outline" ? styles.outline : isPrimary ? styles.primary : styles.default,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      {...rest}
    >
      <View style={[styles.iconWrap, isPrimary && styles.iconWrapPrimary]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>
      <Text numberOfLines={1} style={[styles.label, isPrimary && styles.labelPrimary]}>
        {label}
      </Text>
      {subtitle ? (
        <Text numberOfLines={1} style={[styles.subtitle, isPrimary && styles.subtitlePrimary]}>
          {subtitle}
        </Text>
      ) : null}
    </Pressable>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  base: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: themeStyle.radius.card,
    borderWidth: themeStyle.borderWidth,
    padding: sp(14),
  },
  default: { backgroundColor: c.background, borderColor: c.border },
  primary: { backgroundColor: c.primary, borderColor: c.primary },
  outline: { backgroundColor: "transparent", borderColor: c.border },
  disabled: { opacity: 0.5 },
  pressed: { ...pressedStyle(true) },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: themeStyle.radius.control,
    backgroundColor: alpha(c.primary, 0.08),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  iconWrapPrimary: { backgroundColor: alpha(c["primary-foreground"], 0.2) },
  iconText: { fontSize: ts(16) },
  label: { fontSize: ts(12), fontWeight: themeStyle.fontWeight.title, color: c.foreground },
  labelPrimary: { color: c["primary-foreground"] },
  subtitle: { fontSize: ts(10), color: c["muted-foreground"], marginTop: 2 },
  subtitlePrimary: { color: alpha(c["primary-foreground"], 0.8) },
});

