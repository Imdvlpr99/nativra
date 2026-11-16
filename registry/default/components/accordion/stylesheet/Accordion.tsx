/** Nativra — Accordion (StyleSheet). Install: npx nativra-cli add accordion */
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { type ThemeColors, useThemeColors, themeStyle, ts, sp } from "@/hooks/use-theme-colors";

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export function Accordion({ items, allowMultiple = false }: AccordionProps) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const fg = c.foreground;
  const border = c.border;

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: c.background,
          borderColor: border,
        },
      ]}
    >
      {items.map((item, index) => {
        const isOpen = openIds.has(item.id);
        const isNotLast = index < items.length - 1;

        return (
          <View key={item.id} style={[styles.itemWrap, isNotLast && { borderBottomWidth: 1, borderBottomColor: border }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
              onPress={() => toggle(item.id)}
              style={styles.header}
            >
              <Text style={[styles.title, { color: fg }]}>{item.title}</Text>
              <Text style={[styles.arrow, isOpen && styles.arrowOpen]}>▼</Text>
            </Pressable>
            {isOpen ? (
              <View style={styles.body}>
                <Text style={[styles.content, { color: c["muted-foreground"] }]}>
                  {item.content}
                </Text>
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: { width: "100%", borderRadius: themeStyle.radius.card, borderWidth: themeStyle.borderWidth, overflow: "hidden" },
  itemWrap: { width: "100%" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: sp(20), paddingVertical: sp(16) },
  title: { fontSize: ts(16), fontWeight: themeStyle.fontWeight.label, flex: 1, paddingRight: sp(12) },
  arrow: { fontSize: ts(10), color: c["muted-foreground"] },
  arrowOpen: { transform: [{ rotate: "180deg" }] },
  body: { paddingHorizontal: sp(20), paddingBottom: sp(16), paddingTop: sp(4) },
  content: { fontSize: ts(14), lineHeight: ts(20) },
});

