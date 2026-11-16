import { describe, expect, it } from "vitest";
import {
  RegistryItemSchema,
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

  it("rejects file paths with control characters", () => {
    const escape = { ...valid, files: [{ path: "nativewind/\u001b[2JButton.tsx", target: "nativewind" }] };
    expect(RegistryItemSchema.safeParse(escape).success).toBe(false);
  });

  it("rejects malformed registry names in dependencies", () => {
    const bad = { ...valid, registryDependencies: [{ id: "card", registry: "\u001b]52;c;x" }] };
    expect(RegistryItemSchema.safeParse(bad).success).toBe(false);
    const ok = { ...valid, registryDependencies: [{ id: "card", registry: "acme" }] };
    expect(RegistryItemSchema.safeParse(ok).success).toBe(true);
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

  it("compares versions numerically, not lexically", () => {
    expect(checkProjectCompatibility({ reactNative: "0.100.0" }).warnings).toHaveLength(0);
    expect(checkProjectCompatibility({ reactNative: "^0.76.3" }).warnings).toHaveLength(0);
    expect(checkProjectCompatibility({ reactNative: "0.73.6" }).warnings).toHaveLength(1);
  });

  it("warns about an unsupported NativeWind major and a Tailwind major NativeWind 4 can't use", () => {
    expect(checkProjectCompatibility({ nativewind: "^4.2.7", tailwindcss: "^3.4.17" }).warnings).toEqual([]);
    expect(checkProjectCompatibility({ nativewind: "^5.0.0" }).warnings[0]).toMatch(/NativeWind \^5\.0\.0 isn't supported/);
    expect(checkProjectCompatibility({ nativewind: "~4.1.0", tailwindcss: "^4.1.0" }).warnings).toEqual([
      "NativeWind 4 needs Tailwind CSS 3, but the project has tailwindcss ^4.1.0.",
    ]);
  });
});
