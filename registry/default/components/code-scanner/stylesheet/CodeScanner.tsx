/** Nativra — CodeScanner (StyleSheet). Install: npx nativra-cli add code-scanner */
import React from "react";
import { Linking, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { CameraView, useCameraPermissions, type BarcodeScanningResult, type BarcodeType } from "expo-camera";
import { Camera, Flashlight, FlashlightOff } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { type ThemeColors, alpha, pressedStyle, scrim, sp, themeStyle, ts, useThemeColors } from "@/hooks/use-theme-colors";

export interface ScanResult {
  /** "qr", "ean13", "code128", … */
  type: string;
  data: string;
}

export interface CodeScannerProps {
  /** Called once per code: the same code isn't reported again for `cooldownMs`. */
  onScan: (result: ScanResult) => void;
  /** Formats to look for (default: QR only, which is fastest). */
  barcodeTypes?: BarcodeType[];
  /** Stops reporting codes (e.g. while you handle one). The camera stays on. */
  paused?: boolean;
  /** Text under the frame. */
  hint?: string;
  /** Milliseconds before the same code counts again (default 2000). */
  cooldownMs?: number;
  /** Text for another language; anything left out stays English. */
  labels?: Partial<CodeScannerLabels>;
  style?: StyleProp<ViewStyle>;
}

export interface CodeScannerLabels {
  permissionTitle: string;
  permissionAsk: string;
  permissionBlocked: string;
  allow: string;
  openSettings: string;
  paused: string;
  viewfinder: string;
  flashlight: string;
}

const DEFAULT_LABELS: CodeScannerLabels = {
  permissionTitle: "Camera access needed",
  permissionAsk: "Allow the camera to scan codes.",
  permissionBlocked: "Camera access is off. Turn it on in Settings to scan codes.",
  allow: "Allow camera",
  openSettings: "Open Settings",
  paused: "Paused",
  viewfinder: "Camera viewfinder",
  flashlight: "Flashlight",
};

const FRAME = 240;

/** "#rrggbb" -> 0–255 brightness, or -1 for other formats. */
function brightness(color: string): number {
  const m = /^#([0-9a-f]{6})/i.exec(color);
  if (!m?.[1]) return -1;
  const n = parseInt(m[1], 16);
  return 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
}

/** Text over the black scrim: the lighter of the theme's foreground and background. */
const onScrim = (c: ThemeColors) => (brightness(c.foreground) > brightness(c.background) ? c.foreground : c.background);

/**
 * A camera view that reads QR codes and barcodes, with a framing guide, a torch toggle and the
 * camera-permission states handled. Uses expo-camera's built-in scanner.
 */
export function CodeScanner({ onScan, barcodeTypes = ["qr"], paused = false, hint = "Point the camera at a code", cooldownMs = 2000, labels: labelOverrides, style }: CodeScannerProps) {
  const c = useThemeColors();
  const styles = React.useMemo(() => createStyles(c), [c]);
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = React.useState(false);
  const last = React.useRef<{ data: string; at: number } | null>(null);

  const handle = (result: BarcodeScanningResult) => {
    if (paused) return;
    const now = Date.now();
    if (last.current && last.current.data === result.data && now - last.current.at < cooldownMs) return;
    last.current = { data: result.data, at: now };
    onScan({ type: result.type, data: result.data });
  };

  if (!permission) {
    // Permission status is still loading.
    return <View style={[styles.box, style]} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.box, styles.permission, style]}>
        <Camera size={ts(32)} color={c["muted-foreground"]} />
        <Text style={styles.permissionTitle}>{labels.permissionTitle}</Text>
        <Text style={styles.permissionText}>
          {permission.canAskAgain ? labels.permissionAsk : labels.permissionBlocked}
        </Text>
        {/* Once the system won't ask again, only the Settings app can turn the camera back on. */}
        {permission.canAskAgain ? (
          <Button variant="primary" onPress={() => void requestPermission()}>
            {labels.allow}
          </Button>
        ) : (
          <Button variant="primary" onPress={() => void Linking.openSettings()}>
            {labels.openSettings}
          </Button>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.box, style]}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torch}
        barcodeScannerSettings={{ barcodeTypes }}
        onBarcodeScanned={paused ? undefined : handle}
        accessibilityLabel={labels.viewfinder}
      />
      {/* Dims everything but the frame, so the target is obvious. */}
      <View style={styles.overlay} pointerEvents="none">
        <View style={styles.shade} />
        <View style={styles.middle}>
          <View style={styles.shade} />
          <View style={styles.frame}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
          </View>
          <View style={styles.shade} />
        </View>
        <View style={[styles.shade, styles.bottom]}>
          <Text style={styles.hint} accessibilityLiveRegion="polite">
            {paused ? labels.paused : hint}
          </Text>
        </View>
      </View>
      <Pressable
        onPress={() => setTorch((t) => !t)}
        accessibilityRole="switch"
        accessibilityLabel={labels.flashlight}
        accessibilityState={{ checked: torch }} aria-checked={torch}
        hitSlop={8}
        style={({ pressed }) => [styles.torch, torch && styles.torchOn, pressedStyle(pressed)]}
      >
        {torch ? <Flashlight size={ts(20)} color={c["primary-foreground"]} /> : <FlashlightOff size={ts(20)} color={c.foreground} />}
      </Pressable>
    </View>
  );
}

const createStyles = (c: ThemeColors) => {
  const edge = 3;
  const len = 28;
  return StyleSheet.create({
    box: { width: "100%", aspectRatio: 3 / 4, borderRadius: themeStyle.radius.card, overflow: "hidden", backgroundColor: c.muted },
    permission: { alignItems: "center", justifyContent: "center", gap: sp(10), padding: sp(24) },
    permissionTitle: { fontSize: ts(17), fontWeight: themeStyle.fontWeight.title, color: c.foreground },
    permissionText: { fontSize: ts(14), color: c["muted-foreground"], textAlign: "center", marginBottom: sp(8) },
    overlay: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 },
    shade: { flex: 1, backgroundColor: scrim() },
    middle: { flexDirection: "row", height: FRAME },
    frame: { width: FRAME, height: FRAME },
    bottom: { alignItems: "center", paddingTop: sp(16) },
    hint: { fontSize: ts(14), color: onScrim(c), fontWeight: themeStyle.fontWeight.label },
    corner: { position: "absolute", width: len, height: len, borderColor: c.primary },
    tl: { top: 0, left: 0, borderTopWidth: edge, borderLeftWidth: edge, borderTopLeftRadius: themeStyle.radius.small },
    tr: { top: 0, right: 0, borderTopWidth: edge, borderRightWidth: edge, borderTopRightRadius: themeStyle.radius.small },
    bl: { bottom: 0, left: 0, borderBottomWidth: edge, borderLeftWidth: edge, borderBottomLeftRadius: themeStyle.radius.small },
    br: { bottom: 0, right: 0, borderBottomWidth: edge, borderRightWidth: edge, borderBottomRightRadius: themeStyle.radius.small },
    torch: {
      position: "absolute",
      top: sp(12),
      right: sp(12),
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: alpha(c.background, 0.85),
    },
    torchOn: { backgroundColor: c.primary },
  });
};
