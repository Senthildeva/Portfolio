// Vercel Routing Middleware: keeps the case studies under NDA behind the shared password (lib/nda-lock.js).
// It runs only for the addresses in config.matcher, before Vercel's cache:
//   • visitors who unlocked get the real page or video;
//   • everyone else gets the "Restricted" page (src/pages/locked/[slug].astro) at the same address,
//     and the videos answer 401.
//
// To lock another project: add  nda: true  to its YAML in src/content/work, move its videos into
// public/videos/nda/, and add its three addresses below. The site build stops with a clear message if a
// project marked nda: true is missing here, or if one listed here isn't marked nda: true.
import { next, rewrite } from "@vercel/functions";
import { hasAccess } from "./lib/nda-lock.js";

export const config = {
  matcher: [
    "/cna", "/cna/", "/cna.html",
    "/videos/nda/:path*",
    // Addresses written with %-escapes (like /%63na for /cna) are checked too, after decoding.
    "/:path(.*%.*)",
  ],
};

// The locked case studies, read from the matcher above (cna, …).
const LOCKED = new Set(config.matcher.filter((p) => !p.includes(":")).map((p) => p.replace(/^\/+|\.html$|\/+$/g, "")));
const PRIVATE = { "Cache-Control": "private, no-cache", "X-Robots-Tag": "noindex" };

const decode = (s) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

export default async function middleware(request) {
  const path = decode(new URL(request.url).pathname).toLowerCase();
  const video = path.startsWith("/videos/nda/");
  const slug = path.replace(/^\/+|\.html$|\/+$/g, "");
  if (!video && !LOCKED.has(slug)) return next();
  if (await hasAccess(request)) return next({ headers: PRIVATE });
  if (video)
    return new Response("This video is part of a case study under NDA.", {
      status: 401,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  return rewrite(new URL(`/locked/${slug}`, request.url), { headers: { ...PRIVATE, "Cache-Control": "private, no-store" } });
}
