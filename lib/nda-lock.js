// NDA lock: shared by middleware.js (checks every visit to a locked page) and api/unlock.js (checks the password).
//
// One password for every NDA project, kept only in Vercel: Project → Settings → Environment Variables →
// NDA_PASSWORD (type Secret, Production + Preview). It never appears in this repository.
//
// Unlocking sets the nda_access cookie to a signature of the password (HMAC-SHA256), so the cookie proves
// the visitor knew the password without containing it. Changing the password in Vercel (and redeploying)
// signs everyone out. The cookie has no expiry date, so it lasts until the browser is closed.

export const ACCESS_COOKIE = "nda_access";
/** Readable by the page's scripts: tells the pop-up to let the visitor straight through. Grants nothing on its own. */
export const HINT_COOKIE = "nda_ok";

const enc = new TextEncoder();

/** The password set in Vercel, or "" when it hasn't been set yet. Spaces around it are ignored. */
export const ndaPassword = () => (process.env.NDA_PASSWORD || "").trim();

/** The cookie value for a password. */
export async function accessToken(password) {
  if (!password) return "";
  const key = await crypto.subtle.importKey("raw", enc.encode(password), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode("nda-access-v1")));
  let bin = "";
  for (const b of mac) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Compares two strings in constant time (for equal lengths). */
export function sameText(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function readCookie(request, name) {
  for (const part of (request.headers.get("cookie") || "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return "";
}

/** True when the request carries a valid unlock for the current password. */
export async function hasAccess(request) {
  const password = ndaPassword();
  const got = readCookie(request, ACCESS_COOKIE);
  if (!password || !got) return false;
  return sameText(got, await accessToken(password));
}
