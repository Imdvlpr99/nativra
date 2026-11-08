/**
 * Nativra — DataTable (StyleSheet)
 * @version 0.1.0
 * @target stylesheet
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
  StyleSheet,
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
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor = (_, index) => String(index),
  onRowPress,
  striped = false,
  emptyMessage = "No records found.",
  footer,
  style,
  ...props
}: DataTableProps<T>) {
  const getAlignStyle = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return styles.alignCenter;
      case "right":
        return styles.alignRight;
      default:
        return styles.alignLeft;
    }
  };

  const getTextAlignStyle = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return styles.textAlignCenter;
      case "right":
        return styles.textAlignRight;
      default:
        return styles.textAlignLeft;
    }
  };

  return (
    <View style={[styles.container, style]} {...props}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.contentTable}>
          {/* Header */}
          <View style={styles.headerRow}>
            {columns.map((col, idx) => (
              <View
                key={String(col.key || idx)}
                style={[{ width: col.width || 120 }, getAlignStyle(col.align)]}
              >
                <Text style={[styles.headerTitle, getTextAlignStyle(col.align)]}>
                  {col.title}
                </Text>
              </View>
            ))}
          </View>

          {/* Rows */}
          {data.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{emptyMessage}</Text>
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
                  style={[styles.row, isStriped && styles.stripedRow]}
                >
                  {columns.map((col, colIdx) => {
                    const rawVal = item[col.key as string];
                    return (
                      <View
                        key={String(col.key || colIdx)}
                        style={[{ width: col.width || 120 }, getAlignStyle(col.align)]}
                      >
                        {col.render ? (
                          col.render(rawVal, item, rowIndex)
                        ) : (
                          <Text
                            style={[styles.cellText, getTextAlignStyle(col.align)]}
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
        <View style={styles.footerContainer}>{footer}</View>
      ) : (
        <View style={styles.defaultFooter}>
          <Text style={styles.footerText}>Total {data.length} records</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#27272a",
    backgroundColor: "#18181b",
    overflow: "hidden",
  },
  contentTable: {
    minWidth: "100%",
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
    backgroundColor: "#202024",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#a1a1aa",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  stripedRow: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  cellText: {
    fontSize: 14,
    color: "#f4f4f5",
  },
  alignLeft: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  alignCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  alignRight: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  textAlignLeft: {
    textAlign: "left",
  },
  textAlignCenter: {
    textAlign: "center",
  },
  textAlignRight: {
    textAlign: "right",
  },
  emptyContainer: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#71717a",
  },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: "#27272a",
    backgroundColor: "#202024",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  defaultFooter: {
    borderTopWidth: 1,
    borderTopColor: "#27272a",
    backgroundColor: "#202024",
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#a1a1aa",
  },
});

