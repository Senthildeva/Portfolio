// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://www.senthildevaraj.co.in",
  // /about, /cna … (Vercel serves about.html at /about via cleanUrls in vercel.json)
  trailingSlash: "never",
  build: { format: "file" },
  // Keep single spaces between inline elements (Astro 7's default 'jsx' mode can drop them).
  compressHTML: true,
  devToolbar: { enabled: false },
});
