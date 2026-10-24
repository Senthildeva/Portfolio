import type { APIRoute } from "astro";
import { SITE } from "../site";
import { caseStudies } from "../lib/work";

export const GET: APIRoute = async () => {
  const paths = ["", "about", "work", "clientele", ...(await caseStudies()).map((e) => e.id)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${SITE.url}/${p}</loc></url>`).join("\n")}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
