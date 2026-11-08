import { StyleSheet, type ViewStyle, type TextStyle, type ImageStyle } from "react-native";

type StyleProp = ViewStyle | TextStyle | ImageStyle | null | undefined | false;

/**
 * Flattens and merges React Native style objects or arrays safely.
 */
export function cn(...styles: StyleProp[]): Record<string, unknown> {
  const flattened = StyleSheet.flatten(styles.filter(Boolean));
  return (flattened ?? {}) as Record<string, unknown>;
}

