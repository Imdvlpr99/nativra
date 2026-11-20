/** Nativra — CodeScanner (NativeWind). Install: npx nativra-cli add code-scanner */
import React from "react";
import { Linking, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { CameraView, useCameraPermissions, type BarcodeScanningResult, type BarcodeType } from "expo-camera";
import { Camera, Flashlight, FlashlightOff } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { type ThemeColors, alpha, scrim, themeStyle, ts, useThemeColors } from "@/hooks/use-theme-colors";

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
  className?: string;
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
const EDGE = 3;
const LEN = 28;

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
export function CodeScanner({
  onScan,
  barcodeTypes = ["qr"],
  paused = false,
  hint = "Point the camera at a code",
  cooldownMs = 2000,
  labels: labelOverrides,
  style,
  className = "",
}: CodeScannerProps) {
  const palette = useThemeColors();
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = React.useState(false);
  const last = React.useRef<{ data: string; at: number } | null>(null);
  const box = `w-full rounded-card overflow-hidden bg-muted ${className}`;
  const ratio = { aspectRatio: 3 / 4 };

  const handle = (result: BarcodeScanningResult) => {
    if (paused) return;
    const now = Date.now();
    if (last.current && last.current.data === result.data && now - last.current.at < cooldownMs) return;
    last.current = { data: result.data, at: now };
    onScan({ type: result.type, data: result.data });
  };

  if (!permission) {
    // Permission status is still loading.
    return <View className={box} style={[ratio, style]} />;
  }

  if (!permission.granted) {
    return (
      <View className={`${box} items-center justify-center sp-gap-2.5 p-6`} style={[ratio, style]}>
        <Camera size={ts(32)} color={palette["muted-foreground"]} />
        <Text className="type-lg weight-title text-foreground">{labels.permissionTitle}</Text>
        <Text className="type-sm text-muted-foreground text-center mb-2">
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

  const corner = (pos: ViewStyle) => <View style={[{ position: "absolute", width: LEN, height: LEN, borderColor: palette.primary }, pos]} />;
  const r = themeStyle.radius.small;

  return (
    <View className={box} style={[ratio, style]}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torch}
        barcodeScannerSettings={{ barcodeTypes }}
        onBarcodeScanned={paused ? undefined : handle}
        accessibilityLabel={labels.viewfinder}
      />
      {/* Dims everything but the frame, so the target is obvious. */}
      <View className="absolute inset-0" pointerEvents="none">
        <View className="flex-1" style={{ backgroundColor: scrim() }} />
        <View className="flex-row" style={{ height: FRAME }}>
          <View className="flex-1" style={{ backgroundColor: scrim() }} />
          <View style={{ width: FRAME, height: FRAME }}>
            {corner({ top: 0, left: 0, borderTopWidth: EDGE, borderLeftWidth: EDGE, borderTopLeftRadius: r })}
            {corner({ top: 0, right: 0, borderTopWidth: EDGE, borderRightWidth: EDGE, borderTopRightRadius: r })}
            {corner({ bottom: 0, left: 0, borderBottomWidth: EDGE, borderLeftWidth: EDGE, borderBottomLeftRadius: r })}
            {corner({ bottom: 0, right: 0, borderBottomWidth: EDGE, borderRightWidth: EDGE, borderBottomRightRadius: r })}
          </View>
          <View className="flex-1" style={{ backgroundColor: scrim() }} />
        </View>
        <View className="flex-1 items-center pt-4" style={{ backgroundColor: scrim() }}>
          <Text className="type-sm weight-label" style={{ color: onScrim(palette) }} accessibilityLiveRegion="polite">
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
        className={`absolute top-3 right-3 h-10 w-10 rounded-full items-center justify-center active:opacity-70 ${torch ? "bg-primary" : ""}`}
        style={torch ? undefined : { backgroundColor: alpha(palette.background, 0.85) }}
      >
        {torch ? <Flashlight size={ts(20)} color={palette["primary-foreground"]} /> : <FlashlightOff size={ts(20)} color={palette.foreground} />}
      </Pressable>
    </View>
  );
}
