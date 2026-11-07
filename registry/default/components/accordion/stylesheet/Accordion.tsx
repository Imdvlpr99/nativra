/** Nativra — Accordion (StyleSheet). Install: npx nativra add accordion */
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";

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
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const dark = useColorScheme() === "dark";
  const fg = dark ? "#fafafa" : "#18181b";
  const border = dark ? "#27272a" : "#e4e4e7";

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
          backgroundColor: dark ? "#18181b" : "#ffffff",
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
                <Text style={[styles.content, { color: dark ? "#a1a1aa" : "#71717a" }]}>
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

const styles = StyleSheet.create({
  container: { width: "100%", borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  itemWrap: { width: "100%" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 16 },
  title: { fontSize: 16, fontWeight: "600", flex: 1, paddingRight: 12 },
  arrow: { fontSize: 10, color: "#a1a1aa" },
  arrowOpen: { transform: [{ rotate: "180deg" }] },
  body: { paddingHorizontal: 20, paddingBottom: 16, paddingTop: 4 },
  content: { fontSize: 14, lineHeight: 20 },
});

