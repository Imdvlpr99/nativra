/** Nativra — Dialog (StyleSheet). Install: npx nativra-cli add dialog */
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useThemeColors, themeStyle, elevation } from "@/hooks/use-theme-colors";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  destructive?: boolean;
  children?: React.ReactNode;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  destructive = false,
  children,
}: DialogProps) {
  const c = useThemeColors();

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.backdrop}>
        <Pressable style={styles.dismissOverlay} onPress={handleCancel} />
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }, elevation("overlay")]}>
          <Text style={[styles.title, { color: c.foreground }]}>{title}</Text>
          {description ? (
            <Text style={[styles.description, { color: c["muted-foreground"] }]}>
              {description}
            </Text>
          ) : null}

          {children ? <View style={styles.content}>{children}</View> : null}

          <View style={styles.actions}>
            <Pressable
              onPress={handleCancel}
              style={[styles.cancelBtn, { borderColor: c.input }]}
            >
              <Text style={[styles.cancelText, { color: c.foreground }]}>
                {cancelText}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              style={[
                styles.confirmBtn,
                { backgroundColor: destructive ? c.destructive : c.foreground },
              ]}
            >
              <Text
                style={[
                  styles.confirmText,
                  { color: destructive ? c["destructive-foreground"] : c.background },
                ]}
              >
                {confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center", padding: 24 },
  dismissOverlay: { ...StyleSheet.absoluteFillObject },
  card: { width: "100%", maxWidth: 360, borderRadius: themeStyle.radius.surface, borderWidth: themeStyle.borderWidth, padding: 24, zIndex: 10 },
  title: { fontSize: 18, fontWeight: "700" },
  description: { fontSize: 14, marginTop: 8, lineHeight: 20 },
  content: { marginTop: 16 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 12, marginTop: 24 },
  cancelBtn: { height: 40, paddingHorizontal: 16, borderRadius: themeStyle.radius.control, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  cancelText: { fontSize: 14, fontWeight: "600" },
  confirmBtn: { height: 40, paddingHorizontal: 16, borderRadius: themeStyle.radius.control, alignItems: "center", justifyContent: "center" },
  confirmText: { fontSize: 14, fontWeight: "600" },
});

