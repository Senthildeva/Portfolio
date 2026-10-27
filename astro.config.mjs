// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://www.senthildevaraj.co.in",
  // /about, /cna … (Vercel serves about.html at /about via cleanUrls in vercel.json)
  trailingSlash: "never",
  // Styles go inside each page (5–7 KB compressed), so nothing blocks the first paint.
  build: { format: "file", inlineStylesheets: "always" },
  // Keep single spaces between inline elements (Astro 7's default 'jsx' mode can drop them).
  compressHTML: true,
  devToolbar: { enabled: false },
});
