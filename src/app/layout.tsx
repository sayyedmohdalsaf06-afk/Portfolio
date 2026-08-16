import type { Metadata, Viewport } from "next";
import { fontSans, fontMono } from "./fonts";
import { AppProviders } from "@/providers";
import { BackgroundField, CommandPalette, CursorInstrument } from "@/components/system";
import { buildMetadata } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  themeColor: "#17181c",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontMono.variable}`}>
      <head>
        {/* Fontshare General Sans CDN for high-fidelity typography */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap"
        />
      </head>
      <body className="antialiased min-h-screen selection:bg-[var(--accent)] selection:text-white">
        <AppProviders>
          {/* Ambient structural background */}
          <BackgroundField />

          {/* Contextual precision cursor */}
          <CursorInstrument />

          {/* Global ⌘K launcher */}
          <CommandPalette />

          {/* Skip link for accessibility */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-sm focus:bg-[var(--surface)] focus:px-4 focus:py-2 focus:text-[var(--text)] focus:outline-2 focus:outline-[var(--focus-ring)] border border-[var(--hairline-strong)]"
          >
            Skip to content
          </a>

          <main id="main">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
