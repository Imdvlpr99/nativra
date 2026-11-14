import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { THEME_INIT_SCRIPT, ThemeProvider } from "./contexts/ThemeContext";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { getCliVersion } from "@/lib/site";

const fontSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sans", display: "swap" });
const fontMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://nativra.vercel.app"),
  applicationName: "Nativra",
  title: {
    default:
      "Nativra — Source-First React Native & Expo UI Components (shadcn/ui for Mobile)",
    template: "%s | Nativra — React Native & Expo UI",
  },
  description:
    "Nativra is the source-first UI component library and CLI for React Native & Expo (shadcn/ui for mobile). Copy 39 accessible components, 18 blocks, and 8 screen templates with full NativeWind v4 and StyleSheet parity.",
  keywords: [
    "Nativra",
    "Nativra UI",
    "nativra-cli",
    "shadcn for React Native",
    "shadcn ui React Native",
    "shadcn Expo",
    "React Native UI library",
    "Expo UI components",
    "React Native components",
    "NativeWind v4 components",
    "React Native StyleSheet components",
    "React Native design system",
    "source-first React Native UI",
    "copy paste React Native components",
    "Expo SDK 52 UI",
    "React Native New Architecture UI",
    "React Native Bridgeless components",
    "mobile UI kit React Native",
  ],
  authors: [{ name: "Nativra", url: "https://github.com/Imdvlpr99/nativra" }],
  creator: "Nativra",
  publisher: "Nativra",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nativra.vercel.app",
    siteName: "Nativra",
    title:
      "Nativra — Source-First React Native & Expo UI Components (NativeWind & StyleSheet)",
    description:
      "Copy production-grade React Native & Expo UI components, blocks, and templates directly into your codebase. Dual NativeWind v4 and StyleSheet parity with zero runtime lock-in.",
    images: [
      {
        url: "/nativra-banner.png",
        width: 1024,
        height: 576,
        alt: "Nativra — Source-First React Native & Expo UI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Nativra — Source-First React Native & Expo UI Components (shadcn/ui for Mobile)",
    description:
      "Copy 39 accessible React Native & Expo components, 18 blocks, and 8 screen templates into your codebase. Full NativeWind v4 and StyleSheet parity.",
    images: ["/nativra-banner.png"],
  },
};

const rootJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://nativra.vercel.app/#website",
      url: "https://nativra.vercel.app",
      name: "Nativra",
      alternateName: [
        "Nativra UI",
        "nativra-cli",
        "shadcn for React Native",
      ],
      description:
        "Source-first UI development platform and component registry for React Native and Expo.",
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://nativra.vercel.app/#software",
      name: "Nativra",
      applicationCategory: "DeveloperApplication",
      applicationSubCategory: "React Native UI Component Library & CLI",
      operatingSystem: "iOS, Android, Web, macOS, Windows, Linux",
      softwareVersion: getCliVersion(),
      license: "https://opensource.org/licenses/MIT",
      url: "https://nativra.vercel.app",
      downloadUrl: "https://www.npmjs.com/package/nativra-cli",
      codeRepository: "https://github.com/Imdvlpr99/nativra",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "A source-first UI component library and CLI (`npx nativra-cli`) for React Native & Expo with 1:1 NativeWind v4 and StyleSheet parity.",
    },
    {
      "@type": "Organization",
      "@id": "https://nativra.vercel.app/#organization",
      name: "Nativra",
      url: "https://nativra.vercel.app",
      logo: "https://nativra.vercel.app/icon.png",
      sameAs: [
        "https://github.com/Imdvlpr99/nativra",
        "https://www.npmjs.com/package/nativra-cli",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const version = getCliVersion();
  return (
    <html lang="en" suppressHydrationWarning className={`${fontSans.variable} ${fontMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(rootJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <a
          href="#main-content"
          className="fixed left-4 top-3 z-[60] -translate-y-20 rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background transition-transform focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar version={version} />
            <div className="flex-1">{children}</div>
            <SiteFooter version={version} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
