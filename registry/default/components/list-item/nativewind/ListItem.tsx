/** Nativra — ListItem (NativeWind). Install: npx nativra-cli add list-item */
import React from "react";
import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { ts, useThemeColors } from "@/hooks/use-theme-colors";

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
  className?: string;
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
  className = "",
}: ListItemProps) {
  const palette = useThemeColors();
  const showChevron = chevron ?? Boolean(onPress);
  const rowClass = `flex-row items-center pl-4 min-h-control bg-background ${disabled ? "opacity-50" : ""} ${className}`;

  const content = (
    <>
      {leading ? <View className="mr-3">{leading}</View> : null}
      <View className={`flex-1 flex-row items-center self-stretch sp-gap-2 sp-py-3 pr-4 ${divider ? "border-b border-border" : ""}`}>
        <View className="flex-1 sp-gap-0.5">
          <Text numberOfLines={1} className={`type-base weight-label ${destructive ? "text-destructive" : "text-foreground"}`}>
            {title}
          </Text>
          {subtitle ? (
            <Text numberOfLines={2} className="type-sm text-muted-foreground">
              {subtitle}
            </Text>
          ) : null}
        </View>
        {trailing}
        {showChevron ? <ChevronRight size={ts(18)} color={palette["muted-foreground"]} /> : null}
      </View>
    </>
  );

  if (!onPress) {
    return (
      <View className={rowClass} style={style}>
        {content}
      </View>
    );
  }
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      className={`${rowClass} active:bg-muted`}
      style={style}
    >
      {content}
    </Pressable>
  );
}
