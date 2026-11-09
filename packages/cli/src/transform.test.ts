import { describe, it, expect } from "vitest";
import { transformFileImports } from "./transform.js";
import { NativraConfigSchema } from "./config.js";

describe("transformFileImports", () => {
  it("preserves standard imports when default config is used", () => {
    const config = NativraConfigSchema.parse({});
    const input = `
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useHaptics } from "@/hooks/useHaptics";
`;
    const result = transformFileImports(input, config);
    expect(result).toContain('from "@/lib/utils"');
    expect(result).toContain('from "@/components/ui/Button"');
    expect(result).toContain('from "@/hooks/useHaptics"');
  });

  it("rewrites imports when custom src directories and aliasPrefix are configured", () => {
    const config = NativraConfigSchema.parse({
      componentsDir: "src/components/ui",
      hooksDir: "src/hooks",
      utilsDir: "src/utils/cn",
      aliasPrefix: "~/",
    });
    const input = `
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useHaptics } from "@/hooks/useHaptics";
import { AppHeader } from "@/blocks/AppHeader";
`;
    const result = transformFileImports(input, config);
    expect(result).toContain('from "~/src/utils/cn"');
    expect(result).toContain('from "~/src/components/ui/Button"');
    expect(result).toContain('from "~/src/hooks/useHaptics"');
    expect(result).toContain('from "~/src/components/ui/AppHeader"');
  });

  it("respects explicit aliases object", () => {
    const config = NativraConfigSchema.parse({
      aliases: {
        components: "@/custom/ui",
        utils: "@/shared/utils",
        hooks: "@/shared/hooks",
      },
    });
    const input = `
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useHaptics } from "@/hooks/useHaptics";
`;
    const result = transformFileImports(input, config);
    expect(result).toContain('from "@/shared/utils"');
    expect(result).toContain('from "@/custom/ui/Button"');
    expect(result).toContain('from "@/shared/hooks/useHaptics"');
  });
});
