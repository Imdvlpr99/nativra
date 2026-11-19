/** Nativra — ListItem (StyleSheet). Install: npx nativra-cli add list-item */
import React from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { type ThemeColors, sp, themeStyle, ts, useThemeColors } from "@/hooks/use-theme-colors";

export interface ListItemProps {
  title: string;
  subtitle?: string;
  /** Icon or avatar before the text. */
  leading?: React.ReactNode;
  /** Value, badge or control after the text (a Switch, a count). */
  trailing?: React.ReactNode;
  /** Shows a chevron after `trailing`; defaults to true when the row is pressable. */
  chevron?: boolean;
  /** Makes the whole row a button. */
  onPress?: () => void;
  /** Draws a hairline under the row, aligned with the text. */
  divider?: boolean;
  /** Title in the destructive color (Sign out, Delete account). */
  destructive?: boolean;
  disabled?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

export function ListItem({
  title,
  subtitle,
  leading,
  trailing,
  chevron,
  onPress,
  divider = false,
  destructive = false,
  disabled = false,
  accessibilityHint,
  style,
}: ListItemProps) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const showChevron = chevron ?? Boolean(onPress);

  const content = (
    <>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={[styles.body, divider && styles.divider]}>
        <View style={styles.text}>
          <Text numberOfLines={1} style={[styles.title, destructive && { color: c.destructive }]}>
            {title}
          </Text>
          {subtitle ? (
            <Text numberOfLines={2} style={styles.subtitle}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {trailing}
        {showChevron ? <ChevronRight size={ts(18)} color={c["muted-foreground"]} /> : null}
      </View>
    </>
  );

  if (!onPress) {
    return <View style={[styles.row, disabled && styles.disabled, style]}>{content}</View>;
  }
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      // A full-width row highlights instead of fading or scaling (pressedStyle).
      style={({ pressed }) => [styles.row, pressed && styles.pressed, disabled && styles.disabled, style]}
    >
      {content}
    </Pressable>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: sp(16),
      minHeight: themeStyle.control.height + 8,
      backgroundColor: c.background,
    },
    pressed: { backgroundColor: c.muted },
    leading: { marginRight: sp(12) },
    body: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: sp(8),
      paddingVertical: sp(12),
      paddingRight: sp(16),
      alignSelf: "stretch",
    },
    divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border },
    text: { flex: 1, gap: sp(2) },
    title: { fontSize: ts(16), color: c.foreground, fontWeight: themeStyle.fontWeight.label },
    subtitle: { fontSize: ts(13), color: c["muted-foreground"] },
    disabled: { opacity: 0.5 },
  });
