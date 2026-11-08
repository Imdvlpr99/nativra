import ts from "typescript";
import {
  ScreenDocumentSchema,
  type ScreenDocument,
  type ScreenBlockNode,
  NavigationDocumentSchema,
  type NavigationDocument,
  ScreenIRDocumentSchema,
  type ScreenIRDocument,
  type ScreenIRNode,
} from "@nativra/studio-schema";

export type PropValues = Record<string, string | boolean | number>;

/** Validate whether a string is a valid JavaScript/TypeScript identifier. */
export function isValidIdentifier(id: string): boolean {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(id);
}

/** Assert that an identifier is valid, throwing a descriptive error if not. */
export function assertValidIdentifier(id: string, context = "identifier"): void {
  if (!isValidIdentifier(id)) {
    throw new Error(`Invalid ${context}: "${id}". Must match /^[a-zA-Z_$][a-zA-Z0-9_$]*$/`);
  }
}

/**
 * Escapes text intended for JSX children.
 * If text contains JSX delimiters (<, >, {, }) or newlines, it wraps it in an expression {"..."}.
 */
export function escapeJsxText(text: string): string {
  if (typeof text !== "string") return String(text);
  if (/[<>{}\n\r]/.test(text)) {
    return `{${JSON.stringify(text)}}`;
  }
  return text;
}

/**
 * Escapes an attribute value for JSX.
 * If the value contains double quotes, newlines, or backslashes, wraps it in expression {"..."}.
 */
export function escapeJsxAttr(attrValue: string): string {
  if (typeof attrValue !== "string") return String(attrValue);
  if (/["\n\r\\]/.test(attrValue)) {
    return `{${JSON.stringify(attrValue)}}`;
  }
  return `"${attrValue}"`;
}

/**
 * Validates TSX / TS source code using TypeScript's compiler parser diagnostics.
 */
export function validateTSX(content: string, fileName = "generated.tsx"): { valid: boolean; errors: string[] } {
  const isTsx = fileName.endsWith(".tsx");
  const sf = ts.createSourceFile(
    fileName,
    content,
    ts.ScriptTarget.Latest,
    true,
    isTsx ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  );
  const parseDiagnostics = (sf as unknown as { parseDiagnostics?: ts.Diagnostic[] }).parseDiagnostics || [];
  if (parseDiagnostics.length === 0) {
    return { valid: true, errors: [] };
  }
  const errors = parseDiagnostics.map((d) => {
    const msg = typeof d.messageText === "string" ? d.messageText : d.messageText.messageText;
    const start = d.start ?? 0;
    const pos = sf.getLineAndCharacterOfPosition(start);
    return `Line ${pos.line + 1}, Col ${pos.character + 1}: ${msg}`;
  });
  return { valid: false, errors };
}

/**
 * Asserts that generated TypeScript / TSX code parses cleanly.
 */
export function assertValidTSX(content: string, fileName = "generated.tsx"): void {
  const res = validateTSX(content, fileName);
  if (!res.valid) {
    throw new Error(`Failed to generate valid TSX for "${fileName}":\n${res.errors.join("\n")}`);
  }
}

/** Convert "use-disclosure" / "button" to a safe PascalCase JSX component name. */
export function componentName(name: string): string {
  const sanitized = name
    .trim()
    .replace(/(^|[-_ ])+(\w)/g, (_, __, c: string) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, "");
  if (/^[0-9]/.test(sanitized)) {
    return "_" + sanitized;
  }
  return sanitized || "Component";
}

/**
 * Generate a JSX usage snippet. `children` becomes element content; `false`/empty
 * props are omitted; `true` props use shorthand.
 */
export function generateUsage(name: string, props: PropValues): string {
  const tag = componentName(name);
  assertValidIdentifier(tag, "component tag");

  const attrs = Object.entries(props)
    .filter(([k, v]) => k !== "children" && v !== "" && v !== false)
    .map(([k, v]) => {
      assertValidIdentifier(k, "prop key");
      if (v === true) return k;
      if (typeof v === "number" || typeof v === "boolean") return `${k}={${v}}`;
      return `${k}=${escapeJsxAttr(String(v))}`;
    });

  const open = [tag, ...attrs].join(" ");
  const children = props["children"];
  const childrenStr =
    children !== undefined && children !== ""
      ? typeof children === "string"
        ? escapeJsxText(children)
        : String(children)
      : "";

  return childrenStr !== "" ? `<${open}>${childrenStr}</${tag}>` : `<${open} />`;
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
    assertValidIdentifier(screenName, "screen component name");

    const isNW = target === "nativewind";

    const content = isNW
      ? this.generateNativeWind(screenName, input.nodes)
      : this.generateStyleSheet(screenName, input.nodes);

    const filePath = `screens/${screenName}.tsx`;
    assertValidTSX(content, filePath);

    return {
      files: [
        {
          path: filePath,
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
    const title = escapeJsxText(node.title ?? "Title");
    const subtitle = escapeJsxText(node.subtitle ?? "Subtitle");

    switch (node.type) {
      case "header":
        return `        <View className="mb-2">\n          <Text className="text-2xl font-bold text-white">${title}</Text>\n          <Text className="text-sm text-zinc-400 mt-1">${subtitle}</Text>\n        </View>`;
      case "search":
        return `        <View className="flex-row items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800">\n          <Search size={16} color="#71717a" />\n          <Text className="text-sm text-zinc-500">${title}</Text>\n        </View>`;
      case "metric-card":
        return `        <View className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex-row items-center justify-between">\n          <View>\n            <Text className="text-xs text-zinc-400 font-medium">${title}</Text>\n            <Text className="text-2xl font-bold text-white mt-1">${subtitle}</Text>\n          </View>\n          <View className="p-2.5 rounded-xl bg-emerald-500/10">\n            <Sparkles size={20} color="#10b981" />\n          </View>\n        </View>`;
      case "button-action":
        return `        <TouchableOpacity className="h-12 rounded-xl bg-sky-500 items-center justify-center flex-row gap-2 active:opacity-90">\n          <Text className="font-semibold text-white text-base">${title}</Text>\n          <ArrowRight size={18} color="#ffffff" />\n        </TouchableOpacity>`;
      case "divider":
        return `        <View className="h-px bg-zinc-800 my-1" />`;
      default:
        return `        <View className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">\n          <Text className="text-base font-semibold text-white">${title}</Text>\n        </View>`;
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
    const title = escapeJsxText(node.title ?? "Title");
    const subtitle = escapeJsxText(node.subtitle ?? "Subtitle");

    switch (node.type) {
      case "header":
        return `        <View style={styles.header}>\n          <Text style={styles.title}>${title}</Text>\n          <Text style={styles.subtitle}>${subtitle}</Text>\n        </View>`;
      case "search":
        return `        <View style={styles.searchBar}>\n          <Search size={16} color="#71717a" />\n          <Text style={styles.searchText}>${title}</Text>\n        </View>`;
      case "metric-card":
        return `        <View style={styles.card}>\n          <View>\n            <Text style={styles.metricLabel}>${title}</Text>\n            <Text style={styles.metricValue}>${subtitle}</Text>\n          </View>\n          <Sparkles size={20} color="#10b981" />\n        </View>`;
      case "button-action":
        return `        <TouchableOpacity style={styles.button} activeOpacity={0.85}>\n          <Text style={styles.buttonText}>${title}</Text>\n          <ArrowRight size={18} color="#ffffff" />\n        </TouchableOpacity>`;
      case "divider":
        return `        <View style={styles.divider} />`;
      default:
        return `        <View style={styles.card}>\n          <Text style={styles.title}>${title}</Text>\n        </View>`;
    }
  }
}

// ---------------------------------------------------------------------------
// V4 Screen IR Deterministic Generator (Master Blueprint §8.2 & §9)
// ---------------------------------------------------------------------------

function renderIRNodeNativeWind(node: ScreenIRNode, indent = 8): string {
  const sp = " ".repeat(indent);
  const layoutClasses: string[] = [];
  if (node.layout) {
    if (node.layout.flexDirection === "row") layoutClasses.push("flex-row");
    if (node.layout.flexDirection === "column") layoutClasses.push("flex-col");
    if (node.layout.alignItems === "center") layoutClasses.push("items-center");
    if (node.layout.alignItems === "flex-start") layoutClasses.push("items-start");
    if (node.layout.alignItems === "flex-end") layoutClasses.push("items-end");
    if (node.layout.justifyContent === "center") layoutClasses.push("justify-center");
    if (node.layout.justifyContent === "space-between") layoutClasses.push("justify-between");
    if (node.layout.gap) layoutClasses.push(`gap-${Math.round(node.layout.gap / 4)}`);
  }

  const cls = layoutClasses.length > 0 ? ` className="${layoutClasses.join(" ")}"` : "";

  if (node.name === "VStack" || node.name === "HStack" || node.name === "Box") {
    const defaultCls = node.name === "HStack" ? ' className="flex-row items-center gap-3"' : ' className="flex-col gap-4"';
    const finalCls = cls || defaultCls;
    if (!node.children || node.children.length === 0) {
      return `${sp}<View${finalCls} />`;
    }
    const childrenStr = node.children.map((c) => renderIRNodeNativeWind(c, indent + 2)).join("\n");
    return `${sp}<View${finalCls}>\n${childrenStr}\n${sp}</View>`;
  }

  const props = node.props ?? {};

  if (node.name === "Spacer") {
    return `${sp}<View className="flex-1" />`;
  }

  if (node.name === "Text") {
    const raw = String(props["children"] ?? props["text"] ?? "Text");
    const textContent = escapeJsxText(raw);
    return `${sp}<Text className="text-base text-zinc-100">${textContent}</Text>`;
  }

  if (node.name === "Button") {
    const raw = String(props["children"] ?? props["label"] ?? "Button");
    const label = escapeJsxText(raw);
    return `${sp}<TouchableOpacity className="h-11 px-5 rounded-xl bg-sky-500 items-center justify-center active:opacity-90">\n${sp}  <Text className="font-semibold text-white">${label}</Text>\n${sp}</TouchableOpacity>`;
  }

  if (node.name === "Card") {
    if (!node.children || node.children.length === 0) {
      return `${sp}<View className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800" />`;
    }
    const childrenStr = node.children.map((c) => renderIRNodeNativeWind(c, indent + 2)).join("\n");
    return `${sp}<View className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">\n${childrenStr}\n${sp}</View>`;
  }

  // Fallback generic component
  const safeName = escapeJsxText(node.name);
  return `${sp}<View className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">\n${sp}  <Text className="text-zinc-300 font-medium">${safeName}</Text>\n${sp}</View>`;
}

function renderIRNodeStyleSheet(node: ScreenIRNode, indent = 8, styleNames: Set<string>): string {
  const sp = " ".repeat(indent);
  const rawKey = node.name.toLowerCase().replace(/[^a-zA-Z0-9_$]/g, "") + "Style";
  const styleKey = isValidIdentifier(rawKey) ? rawKey : "boxStyle";
  styleNames.add(styleKey);

  if (node.name === "VStack" || node.name === "HStack" || node.name === "Box") {
    if (!node.children || node.children.length === 0) {
      return `${sp}<View style={styles.${styleKey}} />`;
    }
    const childrenStr = node.children.map((c) => renderIRNodeStyleSheet(c, indent + 2, styleNames)).join("\n");
    return `${sp}<View style={styles.${styleKey}}>\n${childrenStr}\n${sp}</View>`;
  }

  const props = node.props ?? {};

  if (node.name === "Spacer") {
    return `${sp}<View style={styles.spacer} />`;
  }

  if (node.name === "Text") {
    const raw = String(props["children"] ?? props["text"] ?? "Text");
    const textContent = escapeJsxText(raw);
    return `${sp}<Text style={styles.text}>${textContent}</Text>`;
  }

  if (node.name === "Button") {
    const raw = String(props["children"] ?? props["label"] ?? "Button");
    const label = escapeJsxText(raw);
    return `${sp}<TouchableOpacity style={styles.button} activeOpacity={0.85}>\n${sp}  <Text style={styles.buttonText}>${label}</Text>\n${sp}</TouchableOpacity>`;
  }

  if (node.name === "Card") {
    if (!node.children || node.children.length === 0) {
      return `${sp}<View style={styles.card} />`;
    }
    const childrenStr = node.children.map((c) => renderIRNodeStyleSheet(c, indent + 2, styleNames)).join("\n");
    return `${sp}<View style={styles.card}>\n${childrenStr}\n${sp}</View>`;
  }

  const safeName = escapeJsxText(node.name);
  return `${sp}<View style={styles.box}>\n${sp}  <Text style={styles.text}>${safeName}</Text>\n${sp}</View>`;
}

export function generateFromScreenIR(doc: ScreenIRDocument): GeneratorResult {
  ScreenIRDocumentSchema.parse(doc);
  const screenName = componentName(doc.name.replace(/Screen$/, "")) + "Screen";
  assertValidIdentifier(screenName, "screen component name");
  const isNW = doc.target === "nativewind";

  let content: string;
  if (isNW) {
    const body = renderIRNodeNativeWind(doc.root, 8);
    content = [
      `import React from "react";`,
      `import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";`,
      ``,
      `export default function ${screenName}() {`,
      `  return (`,
      `    <SafeAreaView className="flex-1 bg-zinc-950">`,
      `      <StatusBar barStyle="light-content" />`,
      `      <ScrollView className="flex-1 px-4 py-6" contentContainerStyle={{ gap: 16 }}>`,
      body,
      `      </ScrollView>`,
      `    </SafeAreaView>`,
      `  );`,
      `}`,
    ].join("\n");
  } else {
    const styleNames = new Set<string>();
    const body = renderIRNodeStyleSheet(doc.root, 8, styleNames);
    content = [
      `import React from "react";`,
      `import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";`,
      ``,
      `export default function ${screenName}() {`,
      `  return (`,
      `    <SafeAreaView style={styles.container}>`,
      `      <StatusBar barStyle="light-content" />`,
      `      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>`,
      body,
      `      </ScrollView>`,
      `    </SafeAreaView>`,
      `  );`,
      `}`,
      ``,
      `const styles = StyleSheet.create({`,
      `  container: { flex: 1, backgroundColor: "#09090b" },`,
      `  scroll: { flex: 1 },`,
      `  content: { padding: 16, gap: 16 },`,
      `  vstackStyle: { flexDirection: "column", gap: 16 },`,
      `  hstackStyle: { flexDirection: "row", alignItems: "center", gap: 12 },`,
      `  boxStyle: { padding: 16, borderRadius: 16, backgroundColor: "#18181b" },`,
      `  spacer: { flex: 1 },`,
      `  text: { fontSize: 16, color: "#ffffff" },`,
      `  card: { padding: 16, borderRadius: 16, backgroundColor: "#18181b", borderWidth: 1, borderColor: "#27272a" },`,
      `  button: { height: 44, borderRadius: 12, backgroundColor: "#0284c7", alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },`,
      `  buttonText: { fontSize: 14, fontWeight: "600", color: "#ffffff" },`,
      `  box: { padding: 12, borderRadius: 12, backgroundColor: "#18181b" },`,
      `});`,
    ].join("\n");
  }

  const filePath = `screens/${screenName}.tsx`;
  assertValidTSX(content, filePath);

  return {
    files: [
      {
        path: filePath,
        content,
      },
    ],
    dependencies: ["react", "react-native", isNW ? "nativewind" : ""].filter(Boolean),
  };
}

export class NavigationGenerator implements Generator<NavigationDocument, GeneratorResult> {
  async validate(input: NavigationDocument): Promise<void> {
    await NavigationDocumentSchema.parseAsync(input);
  }

  async generate(
    input: NavigationDocument,
    options?: { framework?: "react-navigation" | "expo-router" }
  ): Promise<GeneratorResult> {
    await this.validate(input);
    const framework = options?.framework ?? "react-navigation";
    if (framework === "expo-router") {
      return this.generateExpoRouter(input);
    }
    return this.generateReactNavigation(input);
  }

  generateReactNavigation(input: NavigationDocument): GeneratorResult {
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
        `        initialRouteName=${JSON.stringify(input.initialRouteName)}`,
        `        screenOptions={{`,
        `          headerStyle: { backgroundColor: ${JSON.stringify(input.backgroundColor)} },`,
        `          headerTintColor: "#ffffff",`,
        `          tabBarStyle: { backgroundColor: ${JSON.stringify(input.backgroundColor)}, borderTopColor: "#27272a" },`,
        `          tabBarActiveTintColor: ${JSON.stringify(input.activeTintColor)},`,
        `          tabBarInactiveTintColor: ${JSON.stringify(input.inactiveTintColor)},`,
        `        }}`,
        `      >`,
      );
      for (const route of input.routes) {
        navCode.push(
          `        <Tab.Screen`,
          `          name=${JSON.stringify(route.name)}`,
          `          component={${route.component}}`,
          `          options={{`,
          `            title: ${JSON.stringify(route.title)},`,
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
        `        initialRouteName=${JSON.stringify(input.initialRouteName)}`,
        `        screenOptions={{`,
        `          headerStyle: { backgroundColor: ${JSON.stringify(input.backgroundColor)} },`,
        `          headerTintColor: "#ffffff",`,
        `        }}`,
        `      >`,
      );
      for (const route of input.routes) {
        navCode.push(
          `        <Stack.Screen`,
          `          name=${JSON.stringify(route.name)}`,
          `          component={${route.component}}`,
          `          options={{ title: ${JSON.stringify(route.title)}, headerShown: ${route.headerShown} }}`,
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
        `        initialRouteName=${JSON.stringify(input.initialRouteName)}`,
        `        screenOptions={{`,
        `          headerStyle: { backgroundColor: ${JSON.stringify(input.backgroundColor)} },`,
        `          headerTintColor: "#ffffff",`,
        `          drawerStyle: { backgroundColor: ${JSON.stringify(input.backgroundColor)} },`,
        `          drawerActiveTintColor: ${JSON.stringify(input.activeTintColor)},`,
        `          drawerInactiveTintColor: ${JSON.stringify(input.inactiveTintColor)},`,
        `        }}`,
        `      >`,
      );
      for (const route of input.routes) {
        navCode.push(
          `        <Drawer.Screen`,
          `          name=${JSON.stringify(route.name)}`,
          `          component={${route.component}}`,
          `          options={{ title: ${JSON.stringify(route.title)}, headerShown: ${route.headerShown} }}`,
          `        />`
        );
      }
      navCode.push(`      </Drawer.Navigator>`, `    </NavigationContainer>`, `  );`, `}`);
    }

    const typesCode = [
      `/** Strictly typed React Navigation parameters */`,
      `export type RootNavParamList = {`,
      ...input.routes.map((r: { name: string }) => `  ${JSON.stringify(r.name)}: undefined;`),
      `};`,
    ].join("\n");

    const rootNavContent = navCode.join("\n");
    assertValidTSX(rootNavContent, "navigation/root-navigator.tsx");
    assertValidTSX(typesCode, "navigation/types.ts");

    const packageMap: Record<string, string> = {
      tabs: "@react-navigation/bottom-tabs",
      stack: "@react-navigation/native-stack",
      drawer: "@react-navigation/drawer",
    };

    return {
      files: [
        { path: "navigation/root-navigator.tsx", content: rootNavContent },
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

  generateExpoRouter(input: NavigationDocument): GeneratorResult {
    const rawIcons = input.routes.map((r) => r.icon).filter((ic) => /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(ic));
    const icons = Array.from(new Set(rawIcons));
    const iconImport = icons.length > 0 ? `import { ${icons.join(", ")} } from "lucide-react-native";` : `import { Home } from "lucide-react-native";`;

    const files: GeneratorFileResult[] = [];

    if (input.type === "tabs") {
      const tabLayoutLines = [
        `import React from "react";`,
        `import { Tabs } from "expo-router";`,
        iconImport,
        ``,
        `export default function TabLayout() {`,
        `  return (`,
        `    <Tabs`,
        `      initialRouteName=${JSON.stringify(input.initialRouteName)}`,
        `      screenOptions={{`,
        `        headerStyle: { backgroundColor: ${JSON.stringify(input.backgroundColor)} },`,
        `        headerTintColor: "#ffffff",`,
        `        tabBarStyle: { backgroundColor: ${JSON.stringify(input.backgroundColor)}, borderTopColor: "#27272a" },`,
        `        tabBarActiveTintColor: ${JSON.stringify(input.activeTintColor)},`,
        `        tabBarInactiveTintColor: ${JSON.stringify(input.inactiveTintColor)},`,
        `      }}`,
        `    >`,
      ];

      for (const route of input.routes) {
        const iconComp = icons.includes(route.icon) ? route.icon : "Home";
        tabLayoutLines.push(
          `      <Tabs.Screen`,
          `        name=${JSON.stringify(route.name)}`,
          `        options={{`,
          `          title: ${JSON.stringify(route.title)},`,
          `          headerShown: ${route.headerShown},`,
          `          tabBarIcon: ({ color, size }: { color: string; size: number }) => <${iconComp} color={color} size={size} />,`,
          `        }}`,
          `      />`
        );
      }

      tabLayoutLines.push(`    </Tabs>`, `  );`, `}`);

      const tabLayoutContent = tabLayoutLines.join("\n");
      const rootLayoutContent = [
        `import React from "react";`,
        `import { Stack } from "expo-router";`,
        ``,
        `export default function RootLayout() {`,
        `  return (`,
        `    <Stack screenOptions={{ headerShown: false }}>`,
        `      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />`,
        `    </Stack>`,
        `  );`,
        `}`,
      ].join("\n");

      assertValidTSX(tabLayoutContent, "app/(tabs)/_layout.tsx");
      assertValidTSX(rootLayoutContent, "app/_layout.tsx");

      files.push(
        { path: "app/(tabs)/_layout.tsx", content: tabLayoutContent },
        { path: "app/_layout.tsx", content: rootLayoutContent }
      );
    } else if (input.type === "stack") {
      const stackLayoutLines = [
        `import React from "react";`,
        `import { Stack } from "expo-router";`,
        ``,
        `export default function RootLayout() {`,
        `  return (`,
        `    <Stack`,
        `      initialRouteName=${JSON.stringify(input.initialRouteName)}`,
        `      screenOptions={{`,
        `        headerStyle: { backgroundColor: ${JSON.stringify(input.backgroundColor)} },`,
        `        headerTintColor: "#ffffff",`,
        `      }}`,
        `    >`,
      ];

      for (const route of input.routes) {
        stackLayoutLines.push(
          `      <Stack.Screen`,
          `        name=${JSON.stringify(route.name)}`,
          `        options={{`,
          `          title: ${JSON.stringify(route.title)},`,
          `          headerShown: ${route.headerShown},`,
          `        }}`,
          `      />`
        );
      }

      stackLayoutLines.push(`    </Stack>`, `  );`, `}`);

      const stackLayoutContent = stackLayoutLines.join("\n");
      assertValidTSX(stackLayoutContent, "app/_layout.tsx");

      files.push({ path: "app/_layout.tsx", content: stackLayoutContent });
    } else {
      const drawerLayoutLines = [
        `import React from "react";`,
        `import { Drawer } from "expo-router/drawer";`,
        ``,
        `export default function DrawerLayout() {`,
        `  return (`,
        `    <Drawer`,
        `      initialRouteName=${JSON.stringify(input.initialRouteName)}`,
        `      screenOptions={{`,
        `        headerStyle: { backgroundColor: ${JSON.stringify(input.backgroundColor)} },`,
        `        headerTintColor: "#ffffff",`,
        `        drawerStyle: { backgroundColor: ${JSON.stringify(input.backgroundColor)} },`,
        `        drawerActiveTintColor: ${JSON.stringify(input.activeTintColor)},`,
        `        drawerInactiveTintColor: ${JSON.stringify(input.inactiveTintColor)},`,
        `      }}`,
        `    >`,
      ];

      for (const route of input.routes) {
        drawerLayoutLines.push(
          `      <Drawer.Screen`,
          `        name=${JSON.stringify(route.name)}`,
          `        options={{`,
          `          title: ${JSON.stringify(route.title)},`,
          `          headerShown: ${route.headerShown},`,
          `        }}`,
          `      />`
        );
      }

      drawerLayoutLines.push(`    </Drawer>`, `  );`, `}`);

      const drawerLayoutContent = drawerLayoutLines.join("\n");
      assertValidTSX(drawerLayoutContent, "app/_layout.tsx");

      files.push({ path: "app/_layout.tsx", content: drawerLayoutContent });
    }

    const dependencies = [
      "expo-router",
      "react-native-safe-area-context",
      "react-native-screens",
      ...(input.type === "tabs" ? ["lucide-react-native"] : []),
      ...(input.type === "drawer" ? ["@react-navigation/drawer", "react-native-gesture-handler", "react-native-reanimated"] : []),
    ];

    return {
      files,
      dependencies,
    };
  }
}

export class ExpoRouterGenerator implements Generator<NavigationDocument, GeneratorResult> {
  private navGen = new NavigationGenerator();

  async validate(input: NavigationDocument): Promise<void> {
    await this.navGen.validate(input);
  }

  async generate(input: NavigationDocument): Promise<GeneratorResult> {
    return this.navGen.generate(input, { framework: "expo-router" });
  }
}// ---------------------------------------------------------------------------
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


