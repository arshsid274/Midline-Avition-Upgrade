import { Cinzel, Montserrat, IBM_Plex_Mono } from "next/font/google";

/**
 * The Midline type system.
 *
 *  Cinzel      headlines   (h1–h6 and `font-display`)
 *  Montserrat  body text   (site default, weight 300 — "Light")
 *  IBM Plex Mono  tail numbers and technical data (`font-mono`)
 *
 * Self-hosted via next/font: zero external requests, no render-blocking
 * stylesheet, and metric-adjusted fallbacks so nothing shifts as the real
 * fonts swap in.
 *
 * Each exposes a CSS variable consumed by the @theme tokens in globals.css;
 * the variables are attached to <html> in layout.tsx.
 */

/**
 * Headlines. Cinzel is an inscriptional Roman serif — its lowercase is drawn
 * to read like small capitals, so it carries titles well and body copy badly.
 * That is why it is scoped to headings rather than set site-wide.
 *
 * 400 is the specified "Regular". 600 is loaded because existing markup uses
 * font-semibold on some headings; without a real 600 the browser would
 * synthesise faux-bold by smearing the outline, which looks wrong on a serif.
 * Cinzel has no weight below 400, so `font-light` on a heading renders at 400.
 */
export const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-cinzel",
  adjustFontFallback: true,
});

/**
 * Body text. 300 is the specified "Light" and is the site default; 400–600 are
 * loaded because buttons, labels and emphasis already use font-medium and
 * font-semibold, and a missing weight is synthesised rather than substituted.
 */
export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-montserrat",
  adjustFontFallback: true,
});

/** Registrations and specs stay monospaced — Montserrat has no mono cut. */
export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-plex-mono",
  adjustFontFallback: true,
});
