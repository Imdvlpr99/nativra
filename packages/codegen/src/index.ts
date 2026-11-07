import {
  ScreenDocumentSchema,
  type ScreenDocument,
  type ScreenBlockNode,
  NavigationDocumentSchema,
  type NavigationDocument,
} from "@nativra/studio-schema";

export type PropValues = Record<string, string | boolean | number>;

/** Convert "use-disclosure" / "button" to a JSX component name. */
export function componentName(name: string): string {
  return name.replace(/(^|[-_ ])(\w)/g, (_, __, c: string) => c.toUpperCase());
}

/**
 * Generate a JSX usage snippet. `children` becomes element content; `false`/empty
 * props are omitted; `true` props use shorthand.
 */
export function generateUsage(name: string, props: PropValues): string {
  const tag = componentName(name);
  const attrs = Object.entries(props)
    .filter(([k, v]) => k !== "children" && v !== "" && v !== false)
    .map(([k, v]) => (v === true ? k : typeof v === "number" ? `${k}={${v}}` : `${k}="${v}"`));
  const open = [tag, ...attrs].join(" ");
  const children = props["children"];
  return children !== undefined && children !== ""
    ? `<${open}>${children}</${tag}>`
    : `<${open} />`;
}

export function generateInstallCommand(ids: string | string[], registry?: string): string {
  const list = Array.isArray(ids) ? ids.join(" ") : ids;
  return `npx nativra add ${list}${registry ? ` --registry ${registry}` : ""}`;
}

// ---------------------------------------------------------------------------
// V3 Generator Contracts (Section 2.6 & Section 5)
// ---------------------------------------------------------------------------

export interface GeneratorFileResult {
  path: string;
  content: string;
}

export interface GeneratorResult {
  files: GeneratorFileResult[];
  dependencies: string[];
  devDependencies?: string[];
  instructions?: string[];
}

export interface Generator<TInput, TOutput = GeneratorResult> {
  validate(input: TInput): Promise<void>;
  generate(input: TInput): Promise<TOutput>;
}

export class ScreenGenerator implements Generator<ScreenDocument, GeneratorResult> {
  async validate(input: ScreenDocument): Promise<void> {
    await ScreenDocumentSchema.parseAsync(input);
  }

  async generate(input: ScreenDocument): Promise<GeneratorResult> {
    await this.validate(input);
    const target = input.canvas.target ?? "nativewind";
    const screenName = componentName(input.name.replace(/Screen$/, "")) + "Screen";
    const isNW = target === "nativewind";

    const content = isNW
      ? this.generateNativeWind(screenName, input.nodes)
      : this.generateStyleSheet(screenName, input.nodes);

    return {
      files: [
        {
          path: `screens/${screenName}.tsx`,
          content,
        },
      ],
      dependencies: ["react", "react-native", "lucide-react-native", isNW ? "nativewind" : ""].filter(Boolean),
    };
  }

  private generateNativeWind(name: string, nodes: ScreenBlockNode[]): string {
    const lines = [
      `import React from "react";`,
      `import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";`,
      `import { Sparkles, ArrowRight, Search } from "lucide-react-native";`,
      ``,
      `export default function ${name}() {`,
      `  return (`,
      `    <SafeAreaView className="flex-1 bg-zinc-950">`,
      `      <StatusBar barStyle="light-content" />`,
      `      <ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ gap: 16 }}>`,
    ];

    for (const node of nodes) {
      lines.push(this.renderNodeNW(node));
    }

    lines.push(
      `      </ScrollView>`,
      `    </SafeAreaView>`,
      `  );`,
      `}`
    );

    return lines.join("\n");
  }

  private renderNodeNW(node: ScreenBlockNode): string {
    switch (node.type) {
      case "header":
        return `        <View className="mb-2">\n          <Text className="text-2xl font-bold text-white">${node.title ?? "Title"}</Text>\n          <Text className="text-sm text-zinc-400 mt-1">${node.subtitle ?? "Subtitle"}</Text>\n        </View>`;
      case "search":
        return `        <View className="flex-row items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800">\n          <Search size={16} color="#71717a" />\n          <Text className="text-sm text-zinc-500">${node.title ?? "Search..."}</Text>\n        </View>`;
      case "metric-card":
        return `        <View className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex-row items-center justify-between">\n          <View>\n            <Text className="text-xs text-zinc-400 font-medium">${node.title ?? "Metric"}</Text>\n            <Text className="text-2xl font-bold text-white mt-1">${node.subtitle ?? "$0.00"}</Text>\n          </View>\n          <View className="p-2.5 rounded-xl bg-emerald-500/10">\n            <Sparkles size={20} color="#10b981" />\n          </View>\n        </View>`;
      case "button-action":
        return `        <TouchableOpacity className="h-12 rounded-xl bg-sky-500 items-center justify-center flex-row gap-2 active:opacity-90">\n          <Text className="font-semibold text-white text-base">${node.title ?? "Continue"}</Text>\n          <ArrowRight size={18} color="#ffffff" />\n        </TouchableOpacity>`;
      case "divider":
        return `        <View className="h-px bg-zinc-800 my-1" />`;
      default:
        return `        <View className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">\n          <Text className="text-base font-semibold text-white">${node.title ?? node.type}</Text>\n        </View>`;
    }
  }

  private generateStyleSheet(name: string, nodes: ScreenBlockNode[]): string {
    const lines = [
      `import React from "react";`,
      `import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";`,
      `import { Sparkles, ArrowRight, Search } from "lucide-react-native";`,
      ``,
      `export default function ${name}() {`,
      `  return (`,
      `    <SafeAreaView style={styles.container}>`,
      `      <StatusBar barStyle="light-content" />`,
      `      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>`,
    ];

    for (const node of nodes) {
      lines.push(this.renderNodeSS(node));
    }

    lines.push(
      `      </ScrollView>`,
      `    </SafeAreaView>`,
      `  );`,
      `}`,
      ``,
      `const styles = StyleSheet.create({`,
      `  container: { flex: 1, backgroundColor: "#09090b" },`,
      `  scroll: { flex: 1 },`,
      `  content: { padding: 16, gap: 16 },`,
      `  header: { marginBottom: 8 },`,
      `  title: { fontSize: 24, fontWeight: "700", color: "#ffffff" },`,
      `  subtitle: { fontSize: 14, color: "#a1a1aa", marginTop: 4 },`,
      `  searchBar: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, backgroundColor: "#18181b", borderWidth: 1, borderColor: "#27272a" },`,
      `  searchText: { fontSize: 14, color: "#71717a" },`,
      `  card: { padding: 16, borderRadius: 16, backgroundColor: "#18181b", borderWidth: 1, borderColor: "#27272a", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },`,
      `  metricLabel: { fontSize: 12, color: "#a1a1aa", fontWeight: "500" },`,
      `  metricValue: { fontSize: 24, fontWeight: "700", color: "#ffffff", marginTop: 4 },`,
      `  button: { height: 48, borderRadius: 12, backgroundColor: "#0284c7", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },`,
      `  buttonText: { fontSize: 16, fontWeight: "600", color: "#ffffff" },`,
      `  divider: { height: 1, backgroundColor: "#27272a", marginVertical: 4 },`,
      `});`
    );

    return lines.join("\n");
  }

  private renderNodeSS(node: ScreenBlockNode): string {
    switch (node.type) {
      case "header":
        return `        <View style={styles.header}>\n          <Text style={styles.title}>${node.title ?? "Title"}</Text>\n          <Text style={styles.subtitle}>${node.subtitle ?? "Subtitle"}</Text>\n        </View>`;
      case "search":
        return `        <View style={styles.searchBar}>\n          <Search size={16} color="#71717a" />\n          <Text style={styles.searchText}>${node.title ?? "Search..."}</Text>\n        </View>`;
      case "metric-card":
        return `        <View style={styles.card}>\n          <View>\n            <Text style={styles.metricLabel}>${node.title ?? "Metric"}</Text>\n            <Text style={styles.metricValue}>${node.subtitle ?? "$0.00"}</Text>\n          </View>\n          <Sparkles size={20} color="#10b981" />\n        </View>`;
      case "button-action":
        return `        <TouchableOpacity style={styles.button} activeOpacity={0.85}>\n          <Text style={styles.buttonText}>${node.title ?? "Continue"}</Text>\n          <ArrowRight size={18} color="#ffffff" />\n        </TouchableOpacity>`;
      case "divider":
        return `        <View style={styles.divider} />`;
      default:
        return `        <View style={styles.card}>\n          <Text style={styles.title}>${node.title ?? node.type}</Text>\n        </View>`;
    }
  }
}

export class NavigationGenerator implements Generator<NavigationDocument, GeneratorResult> {
  async validate(input: NavigationDocument): Promise<void> {
    await NavigationDocumentSchema.parseAsync(input);
  }

  async generate(input: NavigationDocument): Promise<GeneratorResult> {
    await this.validate(input);

    const navCode = [
      `import React from "react";`,
      `import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";`,
      `import { createNativeStackNavigator } from "@react-navigation/native-stack";`,
      `import { createDrawerNavigator } from "@react-navigation/drawer";`,
      `import { NavigationContainer } from "@react-navigation/native";`,
      `import { Home, Compass, User, Bell, Settings } from "lucide-react-native";`,
      `import type { RootNavParamList } from "./types";`,
      ``,
    ];

    if (input.type === "tabs") {
      navCode.push(
        `const Tab = createBottomTabNavigator<RootNavParamList>();`,
        ``,
        `export function RootNavigator() {`,
        `  return (`,
        `    <NavigationContainer>`,
        `      <Tab.Navigator`,
        `        initialRouteName="${input.initialRouteName}"`,
        `        screenOptions={{`,
        `          headerStyle: { backgroundColor: "${input.backgroundColor}" },`,
        `          headerTintColor: "#ffffff",`,
        `          tabBarStyle: { backgroundColor: "${input.backgroundColor}", borderTopColor: "#27272a" },`,
        `          tabBarActiveTintColor: "${input.activeTintColor}",`,
        `          tabBarInactiveTintColor: "${input.inactiveTintColor}",`,
        `        }}`,
        `      >`,
      );
      for (const route of input.routes) {
        navCode.push(
          `        <Tab.Screen`,
          `          name="${route.name}"`,
          `          component={${route.component}}`,
          `          options={{`,
          `            title: "${route.title}",`,
          `            headerShown: ${route.headerShown},`,
          `            tabBarIcon: ({ color, size }) => <${route.icon} color={color} size={size} />,`,
          `          }}`,
          `        />`
        );
      }
      navCode.push(`      </Tab.Navigator>`, `    </NavigationContainer>`, `  );`, `}`);
    } else if (input.type === "stack") {
      navCode.push(
        `const Stack = createNativeStackNavigator<RootNavParamList>();`,
        ``,
        `export function RootNavigator() {`,
        `  return (`,
        `    <NavigationContainer>`,
        `      <Stack.Navigator`,
        `        initialRouteName="${input.initialRouteName}"`,
        `        screenOptions={{`,
        `          headerStyle: { backgroundColor: "${input.backgroundColor}" },`,
        `          headerTintColor: "#ffffff",`,
        `        }}`,
        `      >`,
      );
      for (const route of input.routes) {
        navCode.push(
          `        <Stack.Screen`,
          `          name="${route.name}"`,
          `          component={${route.component}}`,
          `          options={{ title: "${route.title}", headerShown: ${route.headerShown} }}`,
          `        />`
        );
      }
      navCode.push(`      </Stack.Navigator>`, `    </NavigationContainer>`, `  );`, `}`);
    } else {
      navCode.push(
        `const Drawer = createDrawerNavigator<RootNavParamList>();`,
        ``,
        `export function RootNavigator() {`,
        `  return (`,
        `    <NavigationContainer>`,
        `      <Drawer.Navigator`,
        `        initialRouteName="${input.initialRouteName}"`,
        `        screenOptions={{`,
        `          headerStyle: { backgroundColor: "${input.backgroundColor}" },`,
        `          headerTintColor: "#ffffff",`,
        `          drawerStyle: { backgroundColor: "${input.backgroundColor}" },`,
        `          drawerActiveTintColor: "${input.activeTintColor}",`,
        `          drawerInactiveTintColor: "${input.inactiveTintColor}",`,
        `        }}`,
        `      >`,
      );
      for (const route of input.routes) {
        navCode.push(
          `        <Drawer.Screen`,
          `          name="${route.name}"`,
          `          component={${route.component}}`,
          `          options={{ title: "${route.title}", headerShown: ${route.headerShown} }}`,
          `        />`
        );
      }
      navCode.push(`      </Drawer.Navigator>`, `    </NavigationContainer>`, `  );`, `}`);
    }

    const typesCode = [
      `/** Strictly typed React Navigation parameters */`,
      `export type RootNavParamList = {`,
      ...input.routes.map((r: { name: string }) => `  ${r.name}: undefined;`),
      `};`,
    ].join("\n");

    const packageMap: Record<string, string> = {
      tabs: "@react-navigation/bottom-tabs",
      stack: "@react-navigation/native-stack",
      drawer: "@react-navigation/drawer",
    };

    return {
      files: [
        { path: "navigation/root-navigator.tsx", content: navCode.join("\n") },
        { path: "navigation/types.ts", content: typesCode },
      ],
      dependencies: [
        "@react-navigation/native",
        packageMap[input.type] ?? "@react-navigation/bottom-tabs",
        "react-native-screens",
        "react-native-safe-area-context",
        "lucide-react-native",
      ],
    };
  }
}

// ---------------------------------------------------------------------------
// V3 AI Context Exporter (Section 7.4)
// ---------------------------------------------------------------------------

export interface AIContextParams {
  framework?: string;
  stylingSystem?: "nativewind" | "stylesheet";
  installedComponents?: string[];
  screenDocument?: ScreenDocument;
  navigationDocument?: NavigationDocument;
  themeTokens?: Record<string, unknown>;
}

export function exportAIContext(params: AIContextParams): string {
  const payload = {
    platform: "nativra-v3",
    framework: params.framework ?? "expo-sdk-52",
    styling: params.stylingSystem ?? "nativewind",
    sourceFirst: true,
    installedComponents: params.installedComponents ?? ["button", "input", "badge", "card"],
    theme: params.themeTokens ?? { preset: "zinc", primary: "#3b82f6", background: "#09090b" },
    screen: params.screenDocument ?? null,
    navigation: params.navigationDocument ?? null,
    rules: [
      "Use React Native components only; avoid DOM elements (div, span)",
      "Strictly preserve TypeScript types without 'any'",
      "Support both NativeWind className and StyleSheet patterns",
      "Do not create runtime dependencies on Nativra packages",
    ],
  };

  return JSON.stringify(payload, null, 2);
}
