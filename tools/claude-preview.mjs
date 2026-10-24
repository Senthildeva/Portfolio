// Turns the built site (dist/) into preview/ for the private Claude artifact preview:
// links become relative .html files, the contact form runs in demo mode, and a small note says it's a preview.
// Usage: npm run build && npm run claude-preview
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const DIST = path.join(ROOT, "dist");
const OUT = path.join(ROOT, "preview");
if (!fs.existsSync(DIST)) throw new Error("Run `npm run build` first.");
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(DIST, OUT, { recursive: true });

// The artifact host reserves names starting with "_", so Astro's _astro/ folder is published as assets/.
if (fs.existsSync(path.join(OUT, "_astro"))) fs.renameSync(path.join(OUT, "_astro"), path.join(OUT, "assets"));
const pages = new Set(fs.readdirSync(OUT).filter((f) => f.endsWith(".html")).map((f) => f.replace(/\.html$/, "")));
const relink = (html) =>
  html
    .replace(/(href|src|poster)="\/([^"]*)"/g, (m, attr, p) => {
      const [route, hash = ""] = p.split("#");
      if (route === "") return `${attr}="index.html${hash ? "#" + hash : ""}"`;
      if (pages.has(route)) return `${attr}="${route}.html${hash ? "#" + hash : ""}"`;
      return `${attr}="${p}"`;
    })
    .replace(/srcset="([^"]*)"/g, (m, s) => `srcset="${s.replace(/(^|,\s*)\//g, "$1")}"`)
    .replace(/(["'(,\s])_astro\//g, "$1assets/");

const note = `<div class="preview-note">Preview · images arrive with your Figma export</div><script>window.SITE_PREVIEW=true</script>`;
for (const p of pages) {
  const file = path.join(OUT, p + ".html");
  let html = relink(fs.readFileSync(file, "utf8")).replace("</body>", `${note}</body>`);
  if (p === "index") {
    // The artifact host wraps the entry page in its own document: keep only <head> contents + <body> contents.
    const head = html.match(/<head>([\s\S]*)<\/head>/)?.[1] ?? "";
    const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] ?? "";
    html = `<meta name="claude:viewport-fit-sides" content="cover">\n${head}\n${body}\n`;
  }
  fs.writeFileSync(file, html);
}
// CSS in _astro/ refers to /fonts/… — make it relative to the stylesheet.
for (const f of fs.readdirSync(path.join(OUT, "assets")).filter((f) => f.endsWith(".css"))) {
  const file = path.join(OUT, "assets", f);
  fs.writeFileSync(file, fs.readFileSync(file, "utf8").replace(/url\((["']?)\/(fonts|_astro)\//g, (m, q, d) => `url(${q}${d === "fonts" ? "../fonts" : "."}/`));
}
for (const f of ["404.html", "robots.txt", "sitemap.xml"]) fs.rmSync(path.join(OUT, f), { force: true });
const all = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : all.push(path.relative(OUT, path.join(d, e.name)))));
walk(OUT);
fs.writeFileSync(path.join(ROOT, "preview-files.json"), JSON.stringify(Object.fromEntries(all.filter((f) => f !== "index.html").map((f) => [f, "preview/" + f])), null, 1));
console.log(`preview/ ready: ${all.length} files`);
