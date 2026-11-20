/**
 * Nativra — Search Results Row Block (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add search-results-row
 */
import React from "react";
import { Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { ArrowUpLeft } from "lucide-react-native";
import { ts, useThemeColors } from "@/hooks/use-theme-colors";

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
  className?: string;
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

function Highlighted({ text, query, className, matchClassName }: { text: string; query?: string; className: string; matchClassName: string }) {
  return (
    <Text className={className} numberOfLines={1}>
      {splitMatches(text, query).map((p, i) => (
        <Text key={i} className={p.match ? matchClassName : undefined}>
          {p.text}
        </Text>
      ))}
    </Text>
  );
}

/** One search result: highlighted title and subtitle, leading media, trailing meta. */
export function SearchResultsRow({ title, subtitle, query, leading, meta, onPress, onFill, style, className = "" }: SearchResultsRowProps) {
  const palette = useThemeColors();

  return (
    <View className={`flex-row items-center bg-background ${className}`} style={style}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole="button"
        accessibilityLabel={[title, subtitle, meta].filter(Boolean).join(", ")}
        className="flex-1 flex-row items-center sp-gap-3 px-4 py-2.5 min-h-control active:bg-muted"
      >
        {leading ? <View className="items-center justify-center">{leading}</View> : null}
        <View className="flex-1 sp-gap-0.5">
          {/* Matches stand out by weight and color; the rest of the text is softer. */}
          <Highlighted text={title} query={query} className="type-base text-muted-foreground" matchClassName="text-foreground weight-title" />
          {subtitle ? <Highlighted text={subtitle} query={query} className="type-sm text-muted-foreground" matchClassName="text-foreground weight-label" /> : null}
        </View>
        {meta ? <Text className="type-xs text-muted-foreground">{meta}</Text> : null}
      </Pressable>
      {onFill ? (
        <Pressable
          onPress={onFill}
          accessibilityRole="button"
          accessibilityLabel={`Search for ${title}`}
          hitSlop={8}
          className="p-3 mr-1 rounded-control active:bg-muted"
        >
          <ArrowUpLeft size={ts(18)} color={palette["muted-foreground"]} />
        </Pressable>
      ) : null}
    </View>
  );
}
