import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  metadataBase: new URL("https://nativra.vercel.app"),
  title: {
    default: "Nativra — Source-first React Native UI",
    template: "%s | Nativra",
  },
  description:
    "A source-first UI development platform for React Native & Expo. Own your component code with dual NativeWind and StyleSheet styling targets.",
  keywords: [
    "React Native",
    "Expo",
    "UI components",
    "NativeWind",
    "StyleSheet",
    "mobile UI",
    "source-first",
    "shadcn for React Native",
  ],
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    title: "Nativra — Native UI, built your way",
    description:
      "A source-first UI development platform for React Native. Zero runtime lock-in.",
    images: [
      {
        url: "/nativra-banner.png",
        width: 1024,
        height: 576,
        alt: "Nativra — Source-first React Native UI",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-sky-500 selection:text-white">
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8 text-xs text-muted-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <img src="/icon.png" alt="Nativra" className="h-4 w-4 object-contain" />
          <span className="font-semibold text-foreground">Nativra</span>
          <span>— Built for high-performance React Native & Expo apps. MIT License.</span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="/docs"
            className="hover:text-foreground transition-colors"
          >
            Documentation
          </a>
          <a
            href="/docs/components"
            className="hover:text-foreground transition-colors"
          >
            Components
          </a>
          <a
            href="/docs/cli"
            className="hover:text-foreground transition-colors"
          >
            CLI
          </a>
          <a
            href="https://github.com/Imdvlpr99/nativra"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
