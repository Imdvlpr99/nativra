/** Nativra — SectionList (StyleSheet). Install: npx nativra-cli add section-list */
import React from "react";
import {
  SectionList as RNSectionList,
  StyleSheet,
  Text,
  View,
  type SectionListData,
  type SectionListProps as RNSectionListProps,
  type SectionListRenderItem,
} from "react-native";
import { type ThemeColors, sp, surface, themeStyle, ts, useThemeColors } from "@/hooks/use-theme-colors";

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
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const inset = variant === "inset";

  const renderRow: SectionListRenderItem<ItemT, ListSection<ItemT>> = (info) => {
    const row = renderItem(info);
    if (!inset) return row;
    const first = info.index === 0;
    const last = info.index === info.section.data.length - 1;
    return <View style={[styles.insetRow, first && styles.insetFirst, last && styles.insetLast]}>{row}</View>;
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
          <Text accessibilityRole="header" style={[styles.header, inset && styles.headerInset]}>
            {section.title}
          </Text>
        ))
      }
      renderSectionFooter={
        renderSectionFooter ??
        (({ section }) => (section.footer ? <Text style={[styles.footer, inset && styles.footerInset]}>{section.footer}</Text> : inset ? <View style={styles.gap} /> : null))
      }
      contentContainerStyle={[inset && styles.insetContent, contentContainerStyle]}
      {...rest}
    />
  );
}

const createStyles = (c: ThemeColors) => {
  // Rows are slices of one card: the style's background and border, without a shadow per slice.
  const card = surface(c);
  const edge = card.borderWidth ?? 0;
  return StyleSheet.create({
    header: {
      fontSize: ts(13),
      fontWeight: themeStyle.fontWeight.label,
      color: c["muted-foreground"],
      textTransform: "uppercase",
      letterSpacing: 0.4,
      paddingHorizontal: sp(16),
      paddingTop: sp(16),
      paddingBottom: sp(6),
      backgroundColor: c.background,
    },
    headerInset: { paddingHorizontal: sp(12) },
    footer: { fontSize: ts(13), color: c["muted-foreground"], paddingHorizontal: sp(16), paddingTop: sp(6), paddingBottom: sp(8) },
    footerInset: { paddingHorizontal: sp(12), paddingBottom: sp(16) },
    gap: { height: sp(16) },
    insetContent: { paddingHorizontal: sp(16), paddingBottom: sp(24) },
    insetRow: {
      backgroundColor: card.backgroundColor,
      borderColor: card.borderColor,
      borderLeftWidth: edge,
      borderRightWidth: edge,
      overflow: "hidden",
    },
    insetFirst: { borderTopLeftRadius: themeStyle.radius.card, borderTopRightRadius: themeStyle.radius.card, borderTopWidth: edge },
    insetLast: { borderBottomLeftRadius: themeStyle.radius.card, borderBottomRightRadius: themeStyle.radius.card, borderBottomWidth: edge },
  });
};
