/**
 * Nativra — DataTable (NativeWind)
 * @version 0.1.0
 * @target nativewind
 * @platforms android, ios
 *
 * Copy this file into your project. You own this code.
 * Install: npx nativra-cli add data-table
 */
import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  type ViewProps,
} from "react-native";

export interface ColumnDef<T> {
  key: keyof T | string;
  title: string;
  width?: number;
  align?: "left" | "center" | "right";
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> extends ViewProps {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor?: (item: T, index: number) => string;
  onRowPress?: (item: T, index: number) => void;
  striped?: boolean;
  emptyMessage?: string;
  footer?: React.ReactNode;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor = (_, index) => String(index),
  onRowPress,
  striped = false,
  emptyMessage = "No records found.",
  footer,
  className = "",
  style,
  ...props
}: DataTableProps<T>) {
  const getAlignClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "items-center text-center";
      case "right":
        return "items-end text-right";
      default:
        return "items-start text-left";
    }
  };

  return (
    <View
      className={`rounded-2xl border border-zinc-200 bg-white overflow-hidden dark:border-zinc-800 dark:bg-zinc-950 ${className}`.trim()}
      style={style}
      {...props}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="min-w-full">
          {/* Header */}
          <View className="flex-row border-b border-zinc-200 bg-zinc-50 py-3 px-4 dark:border-zinc-800 dark:bg-zinc-900/60">
            {columns.map((col, idx) => (
              <View
                key={String(col.key || idx)}
                style={{ width: col.width || 120 }}
                className={`justify-center ${getAlignClass(col.align)}`}
              >
                <Text className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {col.title}
                </Text>
              </View>
            ))}
          </View>

          {/* Rows */}
          {data.length === 0 ? (
            <View className="py-8 px-4 items-center justify-center">
              <Text className="text-sm text-zinc-500 dark:text-zinc-400">
                {emptyMessage}
              </Text>
            </View>
          ) : (
            data.map((item, rowIndex) => {
              const isStriped = striped && rowIndex % 2 === 1;
              const rowKey = keyExtractor(item, rowIndex);

              return (
                <Pressable
                  key={rowKey}
                  disabled={!onRowPress}
                  onPress={() => onRowPress?.(item, rowIndex)}
                  className={`flex-row border-b border-zinc-100 py-3.5 px-4 dark:border-zinc-800/60 active:opacity-70 ${
                    isStriped ? "bg-zinc-50/70 dark:bg-zinc-900/30" : "bg-transparent"
                  }`}
                >
                  {columns.map((col, colIdx) => {
                    const rawVal = item[col.key as string];
                    return (
                      <View
                        key={String(col.key || colIdx)}
                        style={{ width: col.width || 120 }}
                        className={`justify-center ${getAlignClass(col.align)}`}
                      >
                        {col.render ? (
                          col.render(rawVal, item, rowIndex)
                        ) : (
                          <Text
                            className="text-sm text-zinc-800 dark:text-zinc-200"
                            numberOfLines={1}
                          >
                            {rawVal !== undefined && rawVal !== null ? String(rawVal) : "-"}
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </Pressable>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      {footer ? (
        <View className="border-t border-zinc-200 bg-zinc-50 px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-900/40">
          {footer}
        </View>
      ) : (
        <View className="flex-row items-center justify-between border-t border-zinc-200 bg-zinc-50/50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900/30">
          <Text className="text-xs text-zinc-500 dark:text-zinc-400">
            Total {data.length} records
          </Text>
        </View>
      )}
    </View>
  );
}

