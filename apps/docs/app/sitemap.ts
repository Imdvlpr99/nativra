import type { MetadataRoute } from "next";
import { getComponents } from "@/lib/registry";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://nativra.dev";
  const components = await getComponents();

  const staticRoutes = [
    "",
    "/docs",
    "/docs/installation",
    "/docs/principles",
    "/docs/compatibility",
    "/docs/theming",
    "/docs/styling/nativewind",
    "/docs/styling/stylesheet",
    "/docs/cli",
    "/docs/components",
    "/docs/blocks",
    "/docs/templates",
    "/docs/hooks",
    "/docs/contributing",
    "/docs/changelog",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : route.startsWith("/docs/components") ? 0.9 : 0.8,
  }));

  const componentRoutes = components.map((c) => ({
    url: `${baseUrl}/docs/components/${c.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...componentRoutes];
}

