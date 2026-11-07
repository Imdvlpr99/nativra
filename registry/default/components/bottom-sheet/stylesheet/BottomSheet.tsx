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
        <Pressable
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

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheet: {
    width: "100%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: "#E4E4E7",
    backgroundColor: "#FFFFFF",
    padding: 24,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  handleContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 9999,
    backgroundColor: "#D4D4D8",
  },
  titleText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#18181B",
    marginBottom: 16,
  },
});
