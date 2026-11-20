/** Nativra — SectionList (NativeWind). Install: npx nativra-cli add section-list */
import React from "react";
import {
  SectionList as RNSectionList,
  Text,
  View,
  type SectionListData,
  type SectionListProps as RNSectionListProps,
  type SectionListRenderItem,
} from "react-native";
import { surface, themeStyle, useThemeColors } from "@/hooks/use-theme-colors";

export interface ListSection<ItemT> {
  title: string;
  /** Small print under the section, e.g. an explanation of the settings above it. */
  footer?: string;
  data: readonly ItemT[];
}

export interface SectionListProps<ItemT> extends Omit<RNSectionListProps<ItemT, ListSection<ItemT>>, "sections" | "renderItem"> {
  sections: readonly ListSection<ItemT>[];
  renderItem: SectionListRenderItem<ItemT, ListSection<ItemT>>;
  /** plain: full-width rows under sticky headers. inset: each section is a rounded card (settings screens). */
  variant?: "plain" | "inset";
}

/**
 * React Native's SectionList with themed sticky headers and section footers. `inset` groups each
 * section's rows into a card, the way settings screens do.
 */
export function SectionList<ItemT>({
  sections,
  renderItem,
  variant = "plain",
  renderSectionHeader,
  renderSectionFooter,
  stickySectionHeadersEnabled,
  contentContainerStyle,
  ...rest
}: SectionListProps<ItemT>) {
  const palette = useThemeColors();
  const inset = variant === "inset";
  // Rows are slices of one card: the style's background and border, without a shadow per slice.
  const card = surface(palette);
  const edge = card.borderWidth ?? 0;

  const renderRow: SectionListRenderItem<ItemT, ListSection<ItemT>> = (info) => {
    const row = renderItem(info);
    if (!inset) return row;
    const first = info.index === 0;
    const last = info.index === info.section.data.length - 1;
    const r = themeStyle.radius.card;
    return (
      <View
        className="overflow-hidden"
        style={{
          backgroundColor: card.backgroundColor,
          borderColor: card.borderColor,
          borderLeftWidth: edge,
          borderRightWidth: edge,
          ...(first ? { borderTopLeftRadius: r, borderTopRightRadius: r, borderTopWidth: edge } : {}),
          ...(last ? { borderBottomLeftRadius: r, borderBottomRightRadius: r, borderBottomWidth: edge } : {}),
        }}
      >
        {row}
      </View>
    );
  };

  return (
    <RNSectionList
      sections={sections as SectionListData<ItemT, ListSection<ItemT>>[]}
      renderItem={renderRow}
      // Inset cards scroll as a whole, like iOS settings; plain lists keep the header on top.
      stickySectionHeadersEnabled={stickySectionHeadersEnabled ?? !inset}
      renderSectionHeader={
        renderSectionHeader ??
        (({ section }) => (
          <Text
            accessibilityRole="header"
            className={`type-sm weight-label uppercase tracking-wide text-muted-foreground bg-background pt-4 pb-1.5 ${inset ? "px-3" : "px-4"}`}
          >
            {section.title}
          </Text>
        ))
      }
      renderSectionFooter={
        renderSectionFooter ??
        (({ section }) =>
          section.footer ? (
            <Text className={`type-sm text-muted-foreground pt-1.5 ${inset ? "px-3 pb-4" : "px-4 pb-2"}`}>{section.footer}</Text>
          ) : inset ? (
            <View className="h-4" />
          ) : null)
      }
      contentContainerStyle={[inset ? { paddingHorizontal: 16, paddingBottom: 24 } : null, contentContainerStyle]}
      {...rest}
    />
  );
}
