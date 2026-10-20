import fs from "node:fs";
import path from "node:path";

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const ASSET_DIR = path.join(ROOT, "public", "assets");
const ICON_DIR = path.join(ROOT, "node_modules", "lucide-static", "icons");
const ASSET_MAP = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "asset-map.json"), "utf8")).map;
export const canonical = (id) => ASSET_MAP[id] || id;

export const key = (id) => id.replace(/:/g, "-").replace(/;/g, "_");
const exts = [".webp", ".svg", ".png", ".jpg"];
export const missing = new Set();

// Layers that were exported whole by mistake (sections with text inside). They are rebuilt as live HTML,
// so even if a file for them arrives it is never used.
export const COMPOSITES = new Set(["13764:3166","13764:3399","13764:3653","13764:3764","13764:3827","13764:4121","13779:1726","14199:9930","13779:1959","13779:2003","13764:4060","I14086:10073;13934:1548"]);

export function assetPath(id) {
  if (!id || COMPOSITES.has(id)) return null;
  const k = key(canonical(id));
  for (const e of exts) {
    const f = path.join(ASSET_DIR, k + e);
    if (fs.existsSync(f)) return "assets/" + k + e;
  }
  return null;
}

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Image from the Figma export by node id; falls back to a labelled placeholder until the asset arrives. */
export function img(id, { w, h, alt = "", cls = "", eager = false, label = "", style = "" } = {}) {
  const p = assetPath(id);
  if (!p) {
    missing.add(id);
    const sz = w && h ? ` style="--w:${w}px;--h:${h}px;${style}"` : style ? ` style="${style}"` : "";
    return `<div class="ph ${cls}"${sz} role="img" aria-label="${esc(alt || label)}">${esc(label || alt || "image")}</div>`;
  }
  const dims = w && h ? ` width="${Math.round(w)}" height="${Math.round(h)}"` : "";
  const st = style ? ` style="${style}"` : "";
  return `<img src="${p}"${dims} alt="${esc(alt)}"${cls ? ` class="${cls}"` : ""}${st} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

export function icon(name, cls = "") {
  let f = path.join(ICON_DIR, name + ".svg");
  if (!fs.existsSync(f)) throw new Error("icon missing: " + name);
  let s = fs.readFileSync(f, "utf8").replace(/<!--[\s\S]*?-->/g, "").replace(/\s*class="[^"]*"/, "").trim();
  s = s.replace("<svg", `<svg aria-hidden="true" focusable="false"${cls ? ` class="${cls}"` : ""}`);
  return s.replace(/\n\s*/g, " ");
}

export const SITE = {
  name: "Senthil Devaraj",
  url: "https://senthildevaraj.co.in",
  email: "senthildevaraj1998@gmail.com",
  phoneDisplay: "+91 90425 67775",
  phoneHref: "+919042567775",
  linkedin: "https://www.linkedin.com/in/senthildevaraj/",
  resume: "Senthil-Devaraj-Resume.pdf",
};
