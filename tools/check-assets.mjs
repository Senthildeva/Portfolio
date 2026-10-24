// Lists every Figma layer id the site refers to and whether its exported file exists in src/assets/figma.
// Usage: node tools/check-assets.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const map = JSON.parse(fs.readFileSync(path.join(ROOT, "src/lib/asset-map.json"), "utf8")).map;
const files = new Set(fs.readdirSync(path.join(ROOT, "src/assets/figma")).map((f) => f.replace(/\.[^.]+$/, "")));
const key = (id) => id.replace(/:/g, "-").replace(/;/g, "_");

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const sources = walk(path.join(ROOT, "src")).filter((f) => /\.(astro|ts|yaml)$/.test(f) && !f.endsWith("content.config.ts"));
const ids = new Map();
for (const f of sources) {
  for (const m of fs.readFileSync(f, "utf8").matchAll(/["'](I?\d{3,}:\d+(?:;\d+:\d+)*)["']/g)) {
    if (!ids.has(m[1])) ids.set(m[1], path.relative(ROOT, f));
  }
}
const missing = [...ids].filter(([id]) => !files.has(key(map[id] ?? id)));
console.log(`${ids.size} images referenced, ${ids.size - missing.length} found, ${missing.length} missing`);
for (const [id, where] of missing) console.log(`  ${id.padEnd(28)} ${where}`);
