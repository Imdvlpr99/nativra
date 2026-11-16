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
      className={`rounded-card border border-border bg-background overflow-hidden ${className}`.trim()}
      style={style}
      {...props}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="min-w-full">
          {/* Header */}
          <View className="flex-row border-b border-border bg-muted sp-py-3 sp-px-4">
            {columns.map((col, idx) => (
              <View
                key={String(col.key || idx)}
                style={{ width: col.width || 120 }}
                className={`justify-center ${getAlignClass(col.align)}`}
              >
                <Text className="type-xs weight-label uppercase tracking-wider text-muted-foreground">
                  {col.title}
                </Text>
              </View>
            ))}
          </View>

          {/* Rows */}
          {data.length === 0 ? (
            <View className="sp-py-8 sp-px-4 items-center justify-center">
              <Text className="type-sm text-muted-foreground">
                {emptyMessage}
              </Text>
            </View>
          ) : (
            data.map((item, rowIndex) => {
              const isStriped = striped && rowIndex % 2 === 1;
              const rowKey = keyExtractor(item, rowIndex);

              return (
                <Pressable accessibilityRole={onRowPress ? "button" : undefined}
                  key={rowKey}
                  disabled={!onRowPress}
                  onPress={() => onRowPress?.(item, rowIndex)}
                  className={`flex-row border-b border-border sp-py-3.5 sp-px-4 active:opacity-70 ${
                    isStriped ? "bg-muted/50" : "bg-transparent"
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
                            className="type-sm text-foreground"
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
        <View className="border-t border-border bg-muted sp-px-4 sp-py-2.5">
          {footer}
        </View>
      ) : (
        <View className="flex-row items-center justify-between border-t border-border bg-muted sp-px-4 sp-py-2">
          <Text className="type-xs text-muted-foreground">
            Total {data.length} records
          </Text>
        </View>
      )}
    </View>
  );
}

