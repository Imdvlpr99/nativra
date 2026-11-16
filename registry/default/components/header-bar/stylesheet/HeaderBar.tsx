/** Nativra — HeaderBar (StyleSheet). Install: npx nativra-cli add header-bar */
import React from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { type ThemeColors, alpha, useThemeColors, themeStyle, elevation, ts, sp } from "@/hooks/use-theme-colors";

export interface HeaderBarProps extends ViewProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightLabel?: string;
  onRightPress?: () => void;
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function HeaderBar({
  title,
  subtitle,
  onBack,
  rightLabel,
  onRightPress,
  elevated = false,
  style,
  ...rest
}: HeaderBarProps) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  return (
    <View
      accessibilityRole="header"
      style={[styles.container, elevated && styles.elevated, style]}
      {...rest}
    >
      <View style={styles.sideLeft}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backBtn}
          >
            <Text style={styles.backChevron}>‹</Text>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.center}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.sideRight}>
        {rightLabel ? (
          <Pressable
            onPress={onRightPress}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={rightLabel}
            style={styles.rightBtn}
          >
            <Text style={styles.rightText}>{rightLabel}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: c.border,
    backgroundColor: c.background,
    paddingHorizontal: sp(16),
    paddingVertical: sp(12),
  },
  elevated: {
    ...elevation("card"),
  },
  sideLeft: { width: 64, alignItems: "flex-start" },
  sideRight: { width: 64, alignItems: "flex-end" },
  backBtn: { flexDirection: "row", alignItems: "center", gap: sp(4), paddingVertical: sp(4) },
  backChevron: { fontSize: ts(16), fontWeight: themeStyle.fontWeight.title, color: c.primary },
  backText: { fontSize: ts(12), fontWeight: themeStyle.fontWeight.label, color: c.primary },
  center: { flex: 1, alignItems: "center", paddingHorizontal: sp(8) },
  title: { fontSize: ts(14), fontWeight: themeStyle.fontWeight.title, color: c.foreground },
  subtitle: { fontSize: ts(11), color: c["muted-foreground"], marginTop: 1 },
  rightBtn: {
    borderRadius: themeStyle.radius.button,
    backgroundColor: alpha(c.primary, 0.08),
    paddingHorizontal: sp(10),
    paddingVertical: sp(4),
  },
  rightText: { fontSize: ts(12), fontWeight: themeStyle.fontWeight.label, color: c.primary },
});

