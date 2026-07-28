import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

/**
 * The Midline type system — IBM Plex, per DESIGN-ibm.md (Carbon Design System).
 * One family carries the whole hierarchy; display sizes run at weight 300
 * (the brand signature), body at 400, emphasis at 600. Self-hosted via
 * next/font (zero external requests, metric-adjusted fallbacks):
 *
 *  sans — IBM Plex Sans   display + body + UI (default, and `font-display`)
 *  mono — IBM Plex Mono   tail numbers & technical data (`font-mono`)
 *
 * Each exposes a CSS variable consumed by the @theme tokens in globals.css;
 * the variables are attached to <html> in layout.tsx.
 */

export const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-plex-sans",
  // Adjusts the fallback font metrics so the layout doesn't shift when
  // the real font swaps in — eliminates CLS caused by font loading
  adjustFontFallback: true,
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-plex-mono",
  adjustFontFallback: true,
});
