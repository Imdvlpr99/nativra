/**
 * Embeddable single-item preview, loaded by the docs site in an iframe:
 *
 *   /preview/index.html?item=<id>&fixture=<n>&theme=<theme-id>&scheme=light|dark
 *
 * It renders the real StyleSheet source the CLI installs (synced into components/nativra),
 * themed by ?theme and ?scheme (see components/nativra/preview-env.ts), and reports its height
 * to the parent page so the iframe can fit the content. Templates render full-screen instead.
 */
import React, { useEffect } from "react";
import { Platform, ScrollView, StyleSheet, Text, View, type LayoutChangeEvent } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PREVIEW_FIXTURES } from "@nativra/preview-runtime";
import { ITEMS } from "./components/nativra/items";
import { useThemeColors } from "./components/nativra/use-theme-colors";
import { RENDERERS } from "./App";

const params = new URLSearchParams(Platform.OS === "web" ? window.location.search : "");
const itemId = params.get("item") ?? "";
const fixtureIndex = Number(params.get("fixture") ?? 0) || 0;

/** Tells the embedding page how tall the preview is (components and blocks only). */
function postHeight(height: number) {
  if (Platform.OS !== "web" || window.parent === window) return;
  // The docs site serves the preview from its own /preview path, so only that origin may listen.
  window.parent.postMessage({ type: "nativra-preview:height", item: itemId, height: Math.ceil(height) }, window.location.origin);
}

class Boundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  override state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  override render() {
    if (!this.state.error) return this.props.children;
    return <Text style={styles.message}>This preview failed to render: {this.state.error.message}</Text>;
  }
}

/**
 * `?item=` comes from the URL, so lookups go through Maps: a name like "toString" or
 * "constructor" can never reach an Object.prototype method.
 */
const FIXTURE_MAP = new Map(Object.entries(PREVIEW_FIXTURES));
const RENDERER_MAP = new Map(Object.entries(RENDERERS));
const ITEM_MAP = new Map(Object.entries(ITEMS));

function ItemDemo() {
  const fixtures = FIXTURE_MAP.get(itemId) ?? [{ name: "Default", props: {} }];
  const props = (fixtures[fixtureIndex] ?? fixtures[0])?.props ?? {};
  const renderer = RENDERER_MAP.get(itemId);
  if (typeof renderer === "function") return renderer(props);
  const entry = ITEM_MAP.get(itemId);
  if (!entry) return <Text style={styles.message}>No preview for “{itemId}”.</Text>;
  const { Component } = entry;
  return <Component {...props} />;
}

export default function Embed() {
  const c = useThemeColors();
  // Templates and overlays (sheets, dialogs) need a whole screen; the page asks with ?layout=screen.
  const isScreen = ITEMS[itemId]?.type === "template" || params.get("layout") === "screen";

  // Match the page behind the preview to the theme, so there's no white edge while loading.
  useEffect(() => {
    if (Platform.OS === "web") document.body.style.backgroundColor = c.background;
  }, [c.background]);

  if (isScreen) {
    return (
      <SafeAreaProvider>
        <View style={[styles.screen, { backgroundColor: c.background }]}>
          <Boundary>
            <ItemDemo />
          </Boundary>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ScrollView style={{ backgroundColor: c.background }} contentContainerStyle={styles.scroll}>
        <View
          style={styles.stage}
          onLayout={(e: LayoutChangeEvent) => postHeight(e.nativeEvent.layout.height)}
        >
          <Boundary>
            <ItemDemo />
          </Boundary>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flexGrow: 1 },
  stage: { width: "100%", alignItems: "center", justifyContent: "center", padding: 32, minHeight: 160 },
  message: { color: "#71717a", fontSize: 13, textAlign: "center" },
});
