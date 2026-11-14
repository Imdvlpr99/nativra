/** Nativra — Accordion (NativeWind). Install: npx nativra-cli add accordion */
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

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
    <View className="w-full divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <View key={item.id} className="w-full">
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
              onPress={() => toggle(item.id)}
              className="flex-row items-center justify-between px-5 py-4 active:bg-accent"
            >
              <Text className="text-base font-semibold text-foreground flex-1 pr-3">
                {item.title}
              </Text>
              <Text className={`text-xs text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}>
                ▼
              </Text>
            </Pressable>
            {isOpen ? (
              <View className="px-5 pb-4 pt-1">
                <Text className="text-sm text-muted-foreground leading-relaxed">
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

