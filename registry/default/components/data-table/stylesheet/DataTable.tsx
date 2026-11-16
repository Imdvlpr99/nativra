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
import { type ThemeColors, alpha, useThemeColors, themeStyle, ts, sp, surface } from "@/hooks/use-theme-colors";

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
  const c = useThemeColors();
  const styles = createStyles(c);
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
                <Pressable accessibilityRole={onRowPress ? "button" : undefined}
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

const createStyles = (c: ThemeColors) => StyleSheet.create({
  container: {
    ...surface(c),
    borderRadius: themeStyle.radius.card,
    overflow: "hidden",
  },
  contentTable: {
    minWidth: "100%",
  },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: c.border,
    backgroundColor: c.muted,
    paddingVertical: sp(12),
    paddingHorizontal: sp(16),
  },
  headerTitle: {
    fontSize: ts(12),
    fontWeight: themeStyle.fontWeight.label,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: c["muted-foreground"],
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: c.border,
    paddingVertical: sp(14),
    paddingHorizontal: sp(16),
  },
  stripedRow: {
    backgroundColor: alpha(c.muted, 0.5),
  },
  cellText: {
    fontSize: ts(14),
    color: c.foreground,
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
    paddingVertical: sp(32),
    paddingHorizontal: sp(16),
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: ts(14),
    color: c["muted-foreground"],
  },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: c.border,
    backgroundColor: c.muted,
    paddingHorizontal: sp(16),
    paddingVertical: sp(10),
  },
  defaultFooter: {
    borderTopWidth: 1,
    borderTopColor: c.border,
    backgroundColor: c.muted,
    paddingHorizontal: sp(16),
    paddingVertical: sp(8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: ts(12),
    color: c["muted-foreground"],
  },
});

