import * as React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { type ThemeColors, useThemeColors, elevation, scrim, themeStyle } from "@/hooks/use-theme-colors";

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  style,
}: BottomSheetProps) {
  const c = useThemeColors();
  const styles = createStyles(c);
  if (!isOpen) return null;

  return (
    <Modal
      transparent
      visible={isOpen}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        {/* Backdrop Dismiss */}
        <Pressable accessibilityRole="button"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityLabel="Dismiss bottom sheet"
        />

        {/* Sheet Content Panel */}
        <View style={[styles.sheet, style]}>
          {/* Grab Handle */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {title && <Text style={styles.titleText}>{title}</Text>}

          {children}
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (c: ThemeColors) => StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: scrim(),
  },
  sheet: {
    width: "100%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: c.border,
    backgroundColor: c.background,
    padding: 24,
    paddingBottom: 40,
    ...elevation("overlay"),
    shadowOffset: { width: 0, height: -themeStyle.shadow.overlay.offsetY },
  },
  handleContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 9999,
    backgroundColor: c.input,
  },
  titleText: {
    fontSize: 17,
    fontWeight: "700",
    color: c.foreground,
    marginBottom: 16,
  },
});

