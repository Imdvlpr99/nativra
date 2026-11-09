import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runProjectAudit, fixLegacyTouchables } from "./commands/audit.js";

describe("audit and --fix", () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = await mkdtemp(join(tmpdir(), "nativra-audit-test-"));
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it("detects line and column numbers for accessibility issues", async () => {
    const filePath = join(testDir, "Screen.tsx");
    const code = `
import React from "react";
import { View, Pressable, Text } from "react-native";

export function Screen() {
  return (
    <View>
      <Pressable onPress={() => {}}>
        <Text>Click me</Text>
      </Pressable>
    </View>
  );
}
`;
    await writeFile(filePath, code, "utf8");
    const report = await runProjectAudit(testDir);
    expect(report.findings.length).toBeGreaterThan(0);
    const finding = report.findings[0];
    expect(finding).toBeDefined();
    expect(finding?.file).toBe("Screen.tsx");
    expect(finding?.line).toBe(8);
    expect(finding?.column).toBe(7);
    expect(finding?.rule).toBe("a11y-interactive-label");
  });

  it("detects allowFontScaling={false} violations", async () => {
    const filePath = join(testDir, "BadText.tsx");
    const code = `
import React from "react";
import { Text } from "react-native";

export function BadText() {
  return <Text allowFontScaling={false}>Locked font size</Text>;
}
`;
    await writeFile(filePath, code, "utf8");
    const report = await runProjectAudit(testDir);
    expect(report.disabledFontScalingCount).toBe(1);
    const finding = report.findings.find((f) => f.rule === "dynamic-type-support");
    expect(finding).toBeDefined();
    expect(finding?.line).toBe(6);
  });

  it("auto-fixes legacy TouchableOpacity to Pressable", async () => {
    const filePath = join(testDir, "LegacyButton.tsx");
    const code = `
import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

export function LegacyButton() {
  return (
    <TouchableOpacity onPress={() => {}}>
      <Text>Legacy</Text>
    </TouchableOpacity>
  );
}
`;
    await writeFile(filePath, code, "utf8");
    const fixedFiles = await fixLegacyTouchables(testDir);
    expect(fixedFiles).toBe(1);

    const updated = await readFile(filePath, "utf8");
    expect(updated).not.toContain("<TouchableOpacity");
    expect(updated).toContain("<Pressable");
    expect(updated).toContain("</Pressable>");
    expect(updated).toContain("Pressable");
    expect(updated).not.toContain("TouchableOpacity");
  });
});
