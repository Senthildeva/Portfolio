// Builds the site into dist/ (Netlify) and preview/ (Claude artifact preview).
import fs from "node:fs";
import path from "node:path";
import { ROOT, SITE, missing } from "./lib.mjs";
import { page } from "./layout.mjs";
import { landing, about, work, clientele } from "./pages.mjs";
import { caseStudies } from "./cases.mjs";

const PUBLIC = path.join(ROOT, "public");
const copyDir = (from, to) => {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b = path.join(to, e.name);
    e.isDirectory() ? copyDir(a, b) : fs.copyFileSync(a, b);
  }
};

const PAGES = [
  { file: "index.html", title: "Senthil Devaraj", description: "Senthil Devaraj, product designer in Chennai — banking, media, e-commerce and AI products used by millions.", body: landing(), active: "", withSplash: true },
  { file: "about.html", title: "About · Senthil Devaraj", description: "Engineer turned product designer. Experience, expertise and what I do off the clock.", body: about(SITE), active: "about" },
  { file: "work.html", title: "My Works · Senthil Devaraj", description: "Case studies: CNA on Apple TV, Outgrow for farmers, Gnie at GITEX 2024 and Jain Connect.", body: work(), active: "work" },
  { file: "clientele.html", title: "Clientele · Senthil Devaraj", description: "Brands and industries I've designed for, and what people say about working with me.", body: clientele(), active: "clientele" },
  ...caseStudies(),
];

for (const target of ["dist", "preview"]) {
  const out = path.join(ROOT, target);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  copyDir(PUBLIC, out);
  fs.copyFileSync(path.join(ROOT, "src", "styles.css"), path.join(out, "styles.css"));
  fs.copyFileSync(path.join(ROOT, "src", "main.js"), path.join(out, "main.js"));
  const preview = target === "preview";
  for (const p of PAGES) {
    const html = page({ ...p, preview, isEntry: p.file === "index.html", canonical: p.file === "index.html" ? "" : p.file.replace(/\.html$/, "") });
    fs.writeFileSync(path.join(out, p.file), html);
  }
  if (!preview) {
    fs.writeFileSync(path.join(out, "404.html"), page({ title: "Page not found · Senthil Devaraj", description: "This page doesn't exist.", active: "", body: `<main id="main"><section class="wrap hero"><p class="eyebrow">404</p><h1 class="display">This page wandered off.</h1><p class="lead">The link may be old or mistyped.</p><div class="btn-row"><a class="btn btn-dark" href="index.html">Go home</a><a class="btn btn-line" href="work.html">See my work</a></div></section></main>` }));
    fs.writeFileSync(path.join(out, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE.url}/sitemap.xml\n`);
    fs.writeFileSync(path.join(out, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PAGES.map((p) => `  <url><loc>${SITE.url}/${p.file === "index.html" ? "" : p.file.replace(/\.html$/, "")}</loc></url>`).join("\n")}\n</urlset>\n`);
  }
}
console.log(`Built ${PAGES.length} pages. Images still waiting on export: ${missing.size}`);
