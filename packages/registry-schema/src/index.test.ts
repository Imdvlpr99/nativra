import { describe, expect, it } from "vitest";
import { RegistryItemSchema } from "./index.js";

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
});

