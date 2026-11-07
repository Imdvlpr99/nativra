import { describe, expect, it } from "vitest";
import {
  RegistryItemSchema,
  NativraConfigV4Schema,
  checkProjectCompatibility,
  DEFAULT_COMPATIBILITY_MATRIX,
} from "./index.js";

const valid = {
  id: "button",
  name: "Button",
  description: "A button",
  type: "component",
  version: "0.1.0",
  stylingTargets: ["nativewind"],
  platforms: { android: true, ios: true },
  files: [{ path: "nativewind/Button.tsx", target: "nativewind" }],
};

describe("RegistryItemSchema", () => {
  it("accepts a valid item and defaults status", () => {
    const r = RegistryItemSchema.parse(valid);
    expect(r.status).toBe("stable");
  });

  it("rejects invalid ids", () => {
    expect(RegistryItemSchema.safeParse({ ...valid, id: "Bad Id" }).success).toBe(false);
  });

  it("requires at least one file", () => {
    expect(RegistryItemSchema.safeParse({ ...valid, files: [] }).success).toBe(false);
  });

  it("supports V4 metadata fields (accessibility, peerDependencies, testing)", () => {
    const v4Item = {
      ...valid,
      title: "Custom Button",
      category: "actions",
      peerDependencies: {
        react: "*",
        "react-native": "*",
      },
      accessibility: {
        required: true,
        role: "button",
        supportsAccessibilityLabel: true,
      },
      testing: {
        hasUnitTests: true,
        hasE2eTests: true,
      },
    };

    const parsed = RegistryItemSchema.parse(v4Item);
    expect(parsed.category).toBe("actions");
    expect(parsed.accessibility?.role).toBe("button");
    expect(parsed.accessibility?.required).toBe(true);
    expect(parsed.peerDependencies?.["react"]).toBe("*");
    expect(parsed.testing?.hasUnitTests).toBe(true);
  });
});

describe("NativraConfigV4Schema", () => {
  it("parses modern V4 nested configuration with defaults", () => {
    const cfg = NativraConfigV4Schema.parse({
      version: 4,
      framework: "expo",
      styling: "nativewind",
      components: {
        directory: "src/components/ui",
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
        },
      },
    });

    expect(cfg.version).toBe(4);
    expect(cfg.framework).toBe("expo");
    expect(cfg.components.directory).toBe("src/components/ui");
    expect(cfg.components.aliases.components).toBe("@/components");
    expect(cfg.registry["default"]).toBe("https://registry.nativra.dev");
  });

  it("maintains backward compatibility with legacy flat v1-v3 fields", () => {
    const legacy = NativraConfigV4Schema.parse({
      componentsDir: "components/ui",
      stylingTarget: "stylesheet",
      registries: [{ name: "default", url: "https://registry.nativra.dev" }],
    });

    expect(legacy.componentsDir).toBe("components/ui");
    expect(legacy.stylingTarget).toBe("stylesheet");
    expect(legacy.registries?.[0]?.name).toBe("default");
  });
});

describe("checkProjectCompatibility", () => {
  it("passes when project meets minimum requirements", () => {
    const result = checkProjectCompatibility(
      {
        expoSdk: 52,
        reactNative: "0.76.0",
      },
      DEFAULT_COMPATIBILITY_MATRIX
    );

    expect(result.compatible).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("reports errors when Expo SDK is below minimum", () => {
    const result = checkProjectCompatibility({
      expoSdk: 49,
    });

    expect(result.compatible).toBe(false);
    expect(result.errors[0]).toContain("below minimum supported SDK");
  });
});
