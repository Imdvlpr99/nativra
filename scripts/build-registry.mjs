#!/usr/bin/env node
/**
 * scripts/build-registry.mjs
 *
 * CLI script that runs the registry builder to produce deployable
 * registry.json + per-item JSON output, and syncs static registry
 * artifacts into apps/docs/public for zero-config CDN hosting.
 *
 * Usage: node scripts/build-registry.mjs [--out ./dist/registry] [--pretty]
 */
import { buildRegistry } from "@nativra/registry-builder";
import { cp, mkdir, writeFile } from "node:fs/promises";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const args = process.argv.slice(2);
const outFlag = args.indexOf("--out");
if (outFlag !== -1 && (!args[outFlag + 1] || args[outFlag + 1].startsWith("--"))) {
  console.error("❌ Error: --out flag requires a destination directory argument.");
  process.exit(1);
}
const outDir = outFlag !== -1 ? resolve(args[outFlag + 1]) : resolve(root, "dist/registry");
const pretty = args.includes("--pretty");

console.log(`Building registry...`);
console.log(`  Source: ${resolve(root, "registry")}`);
console.log(`  Output: ${outDir}`);

const result = await buildRegistry({
  sourceDir: resolve(root, "registry"),
  outDir,
  registryName: "default",
  baseUrl: "https://nativra.vercel.app",
  pretty,
});

if (result.errors.length > 0) {
  console.error("\n❌ Build completed with errors:");
  for (const err of result.errors) {
    console.error(`   - ${err}`);
  }
  process.exit(1);
}

// Mirror static registry files into apps/docs/public when using default output
if (outFlag === -1) {
  const docsPublicDir = resolve(root, "apps/docs/public");
  await mkdir(join(docsPublicDir, "items"), { recursive: true });
  await cp(join(outDir, "registry.json"), join(docsPublicDir, "registry.json"));
  await cp(join(outDir, "items"), join(docsPublicDir, "items"), { recursive: true });

  // Update apps/docs/components/searchItems.json with full catalog
  const staticDocItems = [
    {
      id: "intro",
      name: "Introduction",
      category: "Documentation",
      href: "/docs",
      description: "Source-first UI philosophy & core principles",
    },
    {
      id: "install",
      name: "Installation Guide",
      category: "Documentation",
      href: "/docs/installation",
      description: "Expo SDK 51/52, NativeWind, and StyleSheet setup",
    },
    {
      id: "principles",
      name: "Principles & Architecture",
      category: "Documentation",
      href: "/docs/principles",
      description: "Deep dive into source ownership and dual targets",
    },
    {
      id: "compatibility",
      name: "Platform Compatibility Matrix",
      category: "Documentation",
      href: "/docs/compatibility",
      description: "Android, iOS, Expo Go, and Fabric verification table",
    },
    {
      id: "cli",
      name: "CLI Reference",
      category: "CLI",
      href: "/docs/cli",
      description: "Commands for init, add, diff, update, doctor, remove, rollback",
    },
    {
      id: "theming",
      name: "Theming & Tokens",
      category: "Documentation",
      href: "/docs/theming",
      description: "Semantic color tokens and theme gallery",
    },
    {
      id: "nativewind",
      name: "NativeWind Guide",
      category: "Documentation",
      href: "/docs/styling/nativewind",
      description: "Tailwind CSS styling for React Native",
    },
    {
      id: "stylesheet",
      name: "StyleSheet Guide",
      category: "Documentation",
      href: "/docs/styling/stylesheet",
      description: "Pure React Native StyleSheet without dependencies",
    },
    {
      id: "contributing",
      name: "Contribution Guide",
      category: "Documentation",
      href: "/docs/contributing",
      description: "How to author dual-target components and build the registry",
    },
    {
      id: "changelog",
      name: "Changelog",
      category: "Documentation",
      href: "/docs/changelog",
      description: "Release notes and roadmap history for v0.2.1",
    },
    {
      id: "cn",
      name: "Class Names Utility",
      category: "Documentation",
      href: "/docs/styling/nativewind",
      description: "Utility function for conditionally merging class names with clsx and tailwind-merge (NativeWind) or flattening style objects (StyleSheet).",
    },
  ];

  const searchItems = [
    ...staticDocItems,
    ...result.items.map((item) => {
      let category = "Component";
      let href = `/docs/components/${item.id}`;
      if (item.type === "block") {
        category = "Block";
        href = `/docs/blocks#${item.id}`;
      } else if (item.type === "template") {
        category = "Template";
        href = `/docs/templates#${item.id}`;
      } else if (item.type === "hook") {
        category = "Hook";
        href = `/docs/hooks#${item.id}`;
      } else if (item.type === "theme") {
        category = "Theme";
        href = `/docs/theming#${item.id}`;
      } else if (item.type === "utility") {
        category = "Documentation";
        href = "/docs/styling/nativewind";
      }
      return {
        id: item.id,
        name: item.name,
        category,
        href,
        description: item.description,
      };
    }),
  ];

  const searchItemsPath = resolve(root, "apps/docs/components/searchItems.json");
  await writeFile(searchItemsPath, JSON.stringify(searchItems, null, 2) + "\n", "utf8");
}

console.log(`\n✅ Registry built successfully!`);
console.log(`   ${result.items.length} item(s) published`);
console.log(`   Manifest: ${outDir}/registry.json`);
