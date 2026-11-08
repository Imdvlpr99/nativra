import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nativra — Source-First React Native & Expo UI",
    short_name: "Nativra",
    description:
      "A source-first UI component library and CLI for React Native & Expo (shadcn/ui for mobile). Dual NativeWind v4 and StyleSheet styling targets.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#0ea5e9",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}

