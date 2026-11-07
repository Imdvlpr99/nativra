/** Nativra — Accordion (NativeWind). Install: npx nativra add accordion */
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
    <View className="w-full divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <View key={item.id} className="w-full">
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
              onPress={() => toggle(item.id)}
              className="flex-row items-center justify-between px-5 py-4 active:bg-zinc-50 dark:active:bg-zinc-800/60"
            >
              <Text className="text-base font-semibold text-zinc-900 dark:text-zinc-50 flex-1 pr-3">
                {item.title}
              </Text>
              <Text className={`text-xs text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                ▼
              </Text>
            </Pressable>
            {isOpen ? (
              <View className="px-5 pb-4 pt-1">
                <Text className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
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

