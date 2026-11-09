/** Nativra — ActionTile (StyleSheet). Install: npx nativra-cli add action-tile */
import React from "react";
import { Pressable, StyleSheet, Text, View, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

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

const styles = StyleSheet.create({
  base: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  default: { backgroundColor: "#ffffff", borderColor: "#e4e4e7" },
  primary: { backgroundColor: "#0284c7", borderColor: "#0284c7" },
  outline: { backgroundColor: "transparent", borderColor: "#e4e4e7" },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.8 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f0f9ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  iconWrapPrimary: { backgroundColor: "rgba(255,255,255,0.2)" },
  iconText: { fontSize: 16 },
  label: { fontSize: 12, fontWeight: "700", color: "#18181b" },
  labelPrimary: { color: "#ffffff" },
  subtitle: { fontSize: 10, color: "#71717a", marginTop: 2 },
  subtitlePrimary: { color: "#e0f2fe" },
});

