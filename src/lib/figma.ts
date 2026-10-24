// Images exported from the Figma file ("Portfolio Works", ↳ Final page) live in src/assets/figma,
// named by Figma layer id: 13764:3166 → 13764-3166.webp, I14086:10015;13934:1360 → I14086-10015_13934-1360.webp.
// tools/ingest.py fills that folder from a Figma export.
import type { ImageMetadata } from "astro";
import assetMap from "./asset-map.json";

const files = import.meta.glob<{ default: ImageMetadata }>("../assets/figma/*.{webp,png,jpg,jpeg,svg}", { eager: true });

const byKey = new Map<string, ImageMetadata>();
for (const [file, mod] of Object.entries(files)) {
  const name = file.split("/").pop()!.replace(/\.[^.]+$/, "");
  byKey.set(name, mod.default);
}

/** Figma node id → file name stem. */
export const keyOf = (id: string) => id.replace(/:/g, "-").replace(/;/g, "_");

/** Several layers in Figma are copies of one artwork; they all point at the one exported file. */
export const canonical = (id: string) => (assetMap.map as Record<string, string>)[id] ?? id;

/** Ids asked for during the build that have no exported file yet (reported at the end of the build). */
export const missing = new Set<string>();

export function figmaAsset(id?: string | null): ImageMetadata | undefined {
  if (!id) return undefined;
  const found = byKey.get(keyOf(canonical(id)));
  if (!found) missing.add(id);
  return found;
}

export const isSvg = (a: ImageMetadata) => a.format === "svg";
