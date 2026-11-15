import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtemp, rm, writeFile, readFile, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  runProjectAudit,
  planLegacyTouchableFix,
  applyLegacyTouchableFix,
  migrateTouchables,
} from "./commands/audit.js";

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
    const plan = await planLegacyTouchableFix(testDir);
    const fixedFiles = await applyLegacyTouchableFix(testDir, plan);
    expect(fixedFiles).toBe(1);

    const updated = await readFile(filePath, "utf8");
    expect(updated).toContain('import { View, Text, Pressable } from "react-native";');
    expect(updated).toContain("</Pressable>");
    expect(updated).not.toContain("TouchableOpacity");

    // A backup snapshot is written so the change can be rolled back
    const snapshots = await readdir(join(testDir, ".nativra", "backups", "audit-fix"));
    expect(snapshots).toHaveLength(1);
  });
});

describe("migrateTouchables", () => {
  it("produces a valid import when the touchable is the last specifier", () => {
    const out = migrateTouchables(
      'import { View, TouchableOpacity } from "react-native";\nconst A = () => <TouchableOpacity />;\n'
    );
    expect(out.content).toContain('import { View, Pressable } from "react-native";');
    expect(out.content).not.toContain(",,");
  });

  it("handles multi-line imports that already include Pressable", () => {
    const out = migrateTouchables(
      'import {\n  Pressable,\n  TouchableHighlight,\n} from "react-native";\nconst A = () => <TouchableHighlight></TouchableHighlight>;\n'
    );
    expect(out.content).toContain('import { Pressable } from "react-native";');
    expect(out.content).toContain("<Pressable></Pressable>");
  });

  it("refuses files using Touchable-only props", () => {
    const out = migrateTouchables(
      'import { TouchableOpacity } from "react-native";\nconst A = () => <TouchableOpacity activeOpacity={0.5} />;\n'
    );
    expect(out.content).toBeNull();
    expect(out.reason).toMatch(/activeOpacity/);
  });

  it("keeps the import when the touchable is still referenced outside JSX", () => {
    const out = migrateTouchables(
      [
        'import { Animated, TouchableOpacity, type TouchableOpacityProps } from "react-native";',
        "const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);",
        "type P = TouchableOpacityProps;",
        "const A = () => <TouchableOpacity />;",
        "",
      ].join("\n")
    );
    expect(out.content).toContain("Animated.createAnimatedComponent(TouchableOpacity)");
    expect(out.content).toMatch(/import \{[^}]*\bTouchableOpacity\b[^}]*\bPressable\b[^}]*\} from "react-native";/);
    expect(out.content).toContain("<Pressable />");
  });

  it("refuses touchables imported from react-native-gesture-handler", () => {
    const out = migrateTouchables(
      'import { View } from "react-native";\nimport { TouchableOpacity } from "react-native-gesture-handler";\nconst A = () => <TouchableOpacity />;\n'
    );
    expect(out.content).toBeNull();
  });
});
