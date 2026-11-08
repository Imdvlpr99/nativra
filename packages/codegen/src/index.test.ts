import { describe, expect, it } from "vitest";
import {
  generateInstallCommand,
  generateUsage,
  componentName,
  isValidIdentifier,
  assertValidIdentifier,
  validateTSX,
  assertValidTSX,
  ScreenGenerator,
  NavigationGenerator,
  ExpoRouterGenerator,
  generateFromScreenIR,
  exportAIContext,
} from "./index.js";
import type { ScreenDocument, NavigationDocument, ScreenIRDocument } from "@nativra/studio-schema";

describe("codegen", () => {
  it("generates usage with children", () => {
    expect(generateUsage("button", { variant: "primary", disabled: true, loading: false, children: "Go" })).toBe(
      '<Button variant="primary" disabled>Go</Button>'
    );
  });

  it("self-closes without children and handles numbers", () => {
    expect(generateUsage("separator", { orientation: "vertical", gap: 4 })).toBe(
      '<Separator orientation="vertical" gap={4} />'
    );
  });

  it("safely escapes quotes and JSX delimiters in props and children", () => {
    const usage = generateUsage("dialog", {
      title: 'Warning: "System" Error',
      children: "Values: {x} & <y> are 'special'",
    });
    expect(usage).toContain('title={"Warning: \\"System\\" Error"}');
    expect(usage).toContain('{"Values: {x} & <y> are \'special\'"}');
    assertValidTSX(`export const App = () => ${usage};`);
  });

  it("rejects invalid identifiers in component and prop names", () => {
    expect(isValidIdentifier("validName_123")).toBe(true);
    expect(isValidIdentifier("123invalid")).toBe(false);
    expect(isValidIdentifier("bad-hyphen")).toBe(false);
    expect(isValidIdentifier("has space")).toBe(false);

    expect(() => assertValidIdentifier("bad-ident")).toThrow("Invalid identifier");
    expect(() => generateUsage("btn", { "bad prop": "val" })).toThrow("Invalid prop key");
  });

  it("sanitizes component names correctly", () => {
    expect(componentName("button")).toBe("Button");
    expect(componentName("action-sheet")).toBe("ActionSheet");
    expect(componentName("123-component")).toBe("_123Component");
    expect(componentName("special@#$name")).toBe("Specialname");
  });

  it("validates TSX syntax and catches syntax errors", () => {
    const valid = validateTSX("export const Foo = () => <View><Text>Valid</Text></View>;");
    expect(valid.valid).toBe(true);
    expect(valid.errors).toHaveLength(0);

    const invalid = validateTSX("export const Foo = () => <View><Text>Unclosed");
    expect(invalid.valid).toBe(false);
    expect(invalid.errors.length).toBeGreaterThan(0);
  });

  it("generates install commands", () => {
    expect(generateInstallCommand(["button", "badge"])).toBe("npx nativra add button badge");
    expect(generateInstallCommand("card", "./reg")).toBe("npx nativra add card --registry ./reg");
  });

  it("ScreenGenerator handles special characters and produces valid TSX", async () => {
    const generator = new ScreenGenerator();
    const doc: ScreenDocument = {
      schemaVersion: "3.0.0",
      id: "safe-screen",
      name: "SafeScreen",
      canvas: {
        device: "iphone",
        isLandscape: false,
        zoom: 100,
        target: "nativewind",
        colorScheme: "dark",
      },
      nodes: [
        {
          id: "1",
          type: "header",
          title: 'Special "Title" & <Tags> {foo}',
          subtitle: "Line 1\nLine 2 with `backticks`",
        },
        {
          id: "2",
          type: "search",
          title: 'Search for "shoes" & <more>',
        },
        {
          id: "3",
          type: "metric-card",
          title: "Revenue {Q1}",
          subtitle: "$99.99 <est>",
        },
      ],
    };

    const res = await generator.generate(doc);
    expect(res.files).toHaveLength(1);
    const content = res.files[0]?.content ?? "";
    expect(content).toContain("export default function SafeScreen()");
    const validation = validateTSX(content, res.files[0]?.path);
    expect(validation.valid).toBe(true);
  });

  it("ScreenGenerator generates deterministic NativeWind screen", async () => {
    const generator = new ScreenGenerator();
    const doc: ScreenDocument = {
      schemaVersion: "3.0.0",
      id: "dashboard",
      name: "Dashboard",
      canvas: {
        device: "iphone",
        isLandscape: false,
        zoom: 100,
        target: "nativewind",
        colorScheme: "dark",
      },
      nodes: [
        { id: "1", type: "header", title: "My Dashboard", subtitle: "Overview" },
        { id: "2", type: "metric-card", title: "Total Revenue", subtitle: "$12,450" },
      ],
    };

    const res = await generator.generate(doc);
    expect(res.files).toHaveLength(1);
    expect(res.files[0]?.path).toBe("screens/DashboardScreen.tsx");
    expect(res.files[0]?.content).toContain("export default function DashboardScreen()");
    expect(res.files[0]?.content).toContain("className=");
    expect(res.dependencies).toContain("nativewind");
    expect(validateTSX(res.files[0]!.content).valid).toBe(true);
  });

  it("NavigationGenerator generates React Navigation RootNavigator and types", async () => {
    const generator = new NavigationGenerator();
    const doc: NavigationDocument = {
      schemaVersion: "3.0.0",
      id: "main-nav",
      name: "MainNavigation",
      type: "tabs",
      initialRouteName: "Home",
      routes: [
        { id: "r1", name: "Home", title: 'Home & "Feed"', icon: "Home", component: "HomeScreen", headerShown: false },
        { id: "r2", name: "Settings", title: "Settings <User>", icon: "Settings", component: "SettingsScreen", headerShown: true },
      ],
      activeTintColor: "#3b82f6",
      inactiveTintColor: "#71717a",
      backgroundColor: "#09090b",
    };

    const res = await generator.generate(doc);
    expect(res.files).toHaveLength(2);
    const rootNav = res.files.find((f) => f.path === "navigation/root-navigator.tsx")?.content;
    const types = res.files.find((f) => f.path === "navigation/types.ts")?.content;
    expect(rootNav).toContain("createBottomTabNavigator");
    expect(types).toContain("export type RootNavParamList = {");
    expect(validateTSX(rootNav!, "root-navigator.tsx").valid).toBe(true);
    expect(validateTSX(types!, "types.ts").valid).toBe(true);
  });

  it("exportAIContext exports structured context payload", () => {
    const json = exportAIContext({
      framework: "expo-sdk-52",
      stylingSystem: "nativewind",
      installedComponents: ["button", "card"],
    });

    const parsed = JSON.parse(json);
    expect(parsed.platform).toBe("nativra-v3");
    expect(parsed.framework).toBe("expo-sdk-52");
    expect(parsed.installedComponents).toContain("button");
  });

  it("generateFromScreenIR generates deterministic NativeWind TSX from Screen IR", () => {
    const doc: ScreenIRDocument = {
      version: "1.0.0",
      name: "UserProfile",
      target: "nativewind",
      root: {
        id: "root-1",
        type: "primitive",
        name: "VStack",
        layout: { flexDirection: "column", gap: 16 },
        children: [
          {
            id: "card-1",
            type: "component",
            name: "Card",
            children: [
              {
                id: "txt-1",
                type: "primitive",
                name: "Text",
                props: { children: "Welcome Back: <User> & {Admin}" },
              },
            ],
          },
          {
            id: "btn-1",
            type: "component",
            name: "Button",
            props: { children: 'Sign In "Now"', variant: "primary" },
          },
        ],
      },
    };

    const res = generateFromScreenIR(doc);
    expect(res.files).toHaveLength(1);
    expect(res.files[0]?.path).toBe("screens/UserProfileScreen.tsx");
    expect(res.files[0]?.content).toContain("export default function UserProfileScreen()");
    expect(res.files[0]?.content).toContain("<SafeAreaView className=\"flex-1 bg-zinc-950\">");
    expect(validateTSX(res.files[0]!.content).valid).toBe(true);
    expect(res.dependencies).toContain("nativewind");
  });

  it("generateFromScreenIR generates deterministic StyleSheet TSX from Screen IR", () => {
    const doc: ScreenIRDocument = {
      version: "1.0.0",
      name: "Settings",
      target: "stylesheet",
      root: {
        id: "root-2",
        type: "primitive",
        name: "VStack",
        children: [
          {
            id: "txt-2",
            type: "primitive",
            name: "Text",
            props: { children: "App Settings" },
          },
          {
            id: "btn-2",
            type: "component",
            name: "Button",
            props: { children: "Save Changes" },
          },
        ],
      },
    };

    const res = generateFromScreenIR(doc);
    expect(res.files).toHaveLength(1);
    expect(res.files[0]?.path).toBe("screens/SettingsScreen.tsx");
    expect(res.files[0]?.content).toContain("StyleSheet.create");
    expect(res.files[0]?.content).toContain("App Settings");
    expect(validateTSX(res.files[0]!.content).valid).toBe(true);
    expect(res.dependencies).not.toContain("nativewind");
  });

  it("NavigationGenerator generates valid Expo Router tab layout and root layout", async () => {
    const generator = new NavigationGenerator();
    const doc: NavigationDocument = {
      schemaVersion: "3.0.0",
      id: "main-tabs",
      name: "MainTabs",
      type: "tabs",
      initialRouteName: "feed",
      routes: [
        { id: "1", name: "feed", title: "Feed", component: "FeedScreen", icon: "Home", headerShown: false },
        { id: "2", name: "explore", title: "Explore", component: "ExploreScreen", icon: "Compass", headerShown: true },
      ],
      activeTintColor: "#38bdf8",
      inactiveTintColor: "#71717a",
      backgroundColor: "#09090b",
    };

    const res = await generator.generate(doc, { framework: "expo-router" });
    expect(res.files).toHaveLength(2);
    expect(res.files[0]?.path).toBe("app/(tabs)/_layout.tsx");
    expect(res.files[1]?.path).toBe("app/_layout.tsx");
    expect(res.files[0]?.content).toContain('<Tabs');
    expect(res.files[0]?.content).toContain('tabBarActiveTintColor: "#38bdf8"');
    expect(validateTSX(res.files[0]!.content).valid).toBe(true);
    expect(validateTSX(res.files[1]!.content).valid).toBe(true);
    expect(res.dependencies).toContain("expo-router");
    expect(res.dependencies).toContain("lucide-react-native");
  });

  it("ExpoRouterGenerator generates valid stack navigation layout", async () => {
    const generator = new ExpoRouterGenerator();
    const doc: NavigationDocument = {
      schemaVersion: "3.0.0",
      id: "root-stack",
      name: "RootStack",
      type: "stack",
      initialRouteName: "index",
      routes: [
        { id: "1", name: "index", title: "Welcome", component: "WelcomeScreen", icon: "Home", headerShown: true },
        { id: "2", name: "details", title: "Details", component: "DetailsScreen", icon: "Compass", headerShown: true },
      ],
      activeTintColor: "#3b82f6",
      inactiveTintColor: "#71717a",
      backgroundColor: "#09090b",
    };

    const res = await generator.generate(doc);
    expect(res.files).toHaveLength(1);
    expect(res.files[0]?.path).toBe("app/_layout.tsx");
    expect(res.files[0]?.content).toContain('<Stack');
    expect(validateTSX(res.files[0]!.content).valid).toBe(true);
    expect(res.dependencies).toContain("expo-router");
  });
});



