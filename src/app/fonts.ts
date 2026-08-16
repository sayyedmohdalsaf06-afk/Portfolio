import { JetBrains_Mono, Inter } from "next/font/google";

/**
 * Type system for Portfolio v2 ("In Focus").
 * See docs/04-visual-identity.md
 *
 * - Voice (Primary Sans): General Sans (via fontshare or Inter fallback)
 * - Thinking Register (Mono): JetBrains Mono
 */

export const fontSans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-fallback",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});
