import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nativra Studio",
  description: "Visual component editor for Nativra",
};

export default function StudioRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-zinc-50">{children}</body>
    </html>
  );
}

