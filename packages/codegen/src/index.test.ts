import { describe, expect, it } from "vitest";
import {
  generateInstallCommand,
  generateUsage,
  ScreenGenerator,
  NavigationGenerator,
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
  it("generates install commands", () => {
    expect(generateInstallCommand(["button", "badge"])).toBe("npx nativra add button badge");
    expect(generateInstallCommand("card", "./reg")).toBe("npx nativra add card --registry ./reg");
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
        { id: "r1", name: "Home", title: "Home", icon: "Home", component: "HomeScreen", headerShown: false },
        { id: "r2", name: "Settings", title: "Settings", icon: "Settings", component: "SettingsScreen", headerShown: true },
      ],
      activeTintColor: "#3b82f6",
      inactiveTintColor: "#71717a",
      backgroundColor: "#09090b",
    };

    const res = await generator.generate(doc);
    expect(res.files).toHaveLength(2);
    expect(res.files.find((f) => f.path === "navigation/root-navigator.tsx")?.content).toContain("createBottomTabNavigator");
    expect(res.files.find((f) => f.path === "navigation/types.ts")?.content).toContain("export type RootNavParamList = {");
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
                props: { children: "Welcome Back" },
              },
            ],
          },
          {
            id: "btn-1",
            type: "component",
            name: "Button",
            props: { children: "Sign In", variant: "primary" },
          },
        ],
      },
    };

    const res = generateFromScreenIR(doc);
    expect(res.files).toHaveLength(1);
    expect(res.files[0]?.path).toBe("screens/UserProfileScreen.tsx");
    expect(res.files[0]?.content).toContain("export default function UserProfileScreen()");
    expect(res.files[0]?.content).toContain("<SafeAreaView className=\"flex-1 bg-zinc-950\">");
    expect(res.files[0]?.content).toContain("Welcome Back");
    expect(res.files[0]?.content).toContain("Sign In");
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
    expect(res.dependencies).not.toContain("nativewind");
  });
});


