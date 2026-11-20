/**
 * Nativra — Search Results Row Block (React Native StyleSheet)
 * @version 0.1.0
 * @target stylesheet
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add search-results-row
 */
import React from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { ArrowUpLeft } from "lucide-react-native";
import { type ThemeColors, sp, themeStyle, ts, useThemeColors } from "@/hooks/use-theme-colors";

export interface SearchResultsRowProps {
  title: string;
  subtitle?: string;
  /** The search text: its matches in the title and subtitle are highlighted. */
  query?: string;
  /** Icon, thumbnail or avatar. */
  leading?: React.ReactNode;
  /** Short trailing text, e.g. a category or "Recent". */
  meta?: string;
  onPress?: () => void;
  /** Shows a button that puts the title into the search field (like a browser's suggestion arrow). */
  onFill?: () => void;
  style?: StyleProp<ViewStyle>;
}

/** Splits text into [plain, match, plain, match, ...] pieces, case-insensitively. */
export function splitMatches(text: string, query: string | undefined): Array<{ text: string; match: boolean }> {
  const q = query?.trim();
  if (!q) return [{ text, match: false }];
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text
    .split(new RegExp(`(${escaped})`, "gi"))
    .filter((part) => part !== "")
    .map((part) => ({ text: part, match: part.toLowerCase() === q.toLowerCase() }));
}

function Highlighted({ text, query, style, matchStyle }: { text: string; query?: string; style: StyleProp<TextStyle>; matchStyle: StyleProp<TextStyle> }) {
  return (
    <Text style={style} numberOfLines={1}>
      {splitMatches(text, query).map((p, i) => (
        <Text key={i} style={p.match ? matchStyle : undefined}>
          {p.text}
        </Text>
      ))}
    </Text>
  );
}

/** One search result: highlighted title and subtitle, leading media, trailing meta. */
export function SearchResultsRow({ title, subtitle, query, leading, meta, onPress, onFill, style }: SearchResultsRowProps) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);

  return (
    <View style={[styles.row, style]}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole="button"
        accessibilityLabel={[title, subtitle, meta].filter(Boolean).join(", ")}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}
      >
        {leading ? <View style={styles.leading}>{leading}</View> : null}
        <View style={styles.text}>
          <Highlighted text={title} query={query} style={styles.title} matchStyle={styles.titleMatch} />
          {subtitle ? <Highlighted text={subtitle} query={query} style={styles.subtitle} matchStyle={styles.subtitleMatch} /> : null}
        </View>
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}
      </Pressable>
      {onFill ? (
        <Pressable
          onPress={onFill}
          accessibilityRole="button"
          accessibilityLabel={`Search for ${title}`}
          hitSlop={8}
          style={({ pressed }) => [styles.fill, pressed && styles.pressed]}
        >
          <ArrowUpLeft size={ts(18)} color={c["muted-foreground"]} />
        </Pressable>
      ) : null}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: { flexDirection: "row", alignItems: "center", backgroundColor: c.background },
    main: { flex: 1, flexDirection: "row", alignItems: "center", gap: sp(12), paddingHorizontal: sp(16), paddingVertical: sp(10), minHeight: themeStyle.control.height + 8 },
    pressed: { backgroundColor: c.muted },
    leading: { alignItems: "center", justifyContent: "center" },
    text: { flex: 1, gap: sp(2) },
    // Matches stand out by weight and color; the rest of the text is softer.
    title: { fontSize: ts(15), color: c["muted-foreground"] },
    titleMatch: { color: c.foreground, fontWeight: themeStyle.fontWeight.title },
    subtitle: { fontSize: ts(13), color: c["muted-foreground"] },
    subtitleMatch: { color: c.foreground, fontWeight: themeStyle.fontWeight.label },
    meta: { fontSize: ts(12), color: c["muted-foreground"] },
    fill: { padding: sp(12), marginRight: sp(4), borderRadius: themeStyle.radius.control },
  });
