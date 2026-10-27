// Unlocks the case studies under NDA: checks the shared password (NDA_PASSWORD in Vercel, see lib/nda-lock.js)
// and sets the browser-session cookies that middleware.js looks for. Vercel Function: served at /api/unlock.
// Takes JSON {password} from the pop-up, or a plain form post {password, next} when JavaScript is off.
import { ACCESS_COOKIE, HINT_COOKIE, accessToken, ndaPassword, sameText } from "../lib/nda-lock.js";

const json = (status, body, headers = new Headers()) => {
  headers.set("Content-Type", "application/json");
  headers.set("Cache-Control", "no-store");
  return new Response(JSON.stringify(body), { status, headers });
};
// Form posts go back to the page they came from; only addresses on this site, like /cna.
const safeNext = (s) => (/^\/[a-z0-9-]{1,80}$/.test(s) ? s : "/");
const back = (path, why) => new Response(null, { status: 303, headers: { Location: `${path}?nda=${why}`, "Cache-Control": "no-store" } });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const ERRORS = {
  setup: [503, "The password isn't set up yet. Please ask me for access."],
  empty: [400, "Enter the password."],
  wrong: [401, "That password didn't work. Check it and try again."],
};

export async function POST(req) {
  const isJson = (req.headers.get("content-type") || "").includes("application/json");
  let password = "";
  let next = "/";
  try {
    if (isJson) {
      password = String((await req.json())?.password ?? "");
    } else {
      const f = await req.formData();
      password = String(f.get("password") ?? "");
      next = safeNext(String(f.get("next") ?? ""));
    }
  } catch {
    return json(400, { ok: false, error: "That didn't look like a password." });
  }
  password = password.trim().slice(0, 200);

  const fail = (why) => (isJson ? json(ERRORS[why][0], { ok: false, error: ERRORS[why][1] }) : back(next, why));
  const secret = ndaPassword();
  if (!secret) return fail("setup");
  if (!password) return fail("empty");

  const [given, expected] = await Promise.all([accessToken(password), accessToken(secret)]);
  if (!sameText(given, expected)) {
    await wait(700); // slows down guessing
    return fail("wrong");
  }

  // No Max-Age or Expires: the unlock lasts until the browser is closed.
  const headers = new Headers();
  headers.append("Set-Cookie", `${ACCESS_COOKIE}=${expected}; Path=/; HttpOnly; Secure; SameSite=Lax`);
  headers.append("Set-Cookie", `${HINT_COOKIE}=1; Path=/; Secure; SameSite=Lax`);
  if (isJson) return json(200, { ok: true }, headers);
  headers.set("Location", next);
  headers.set("Cache-Control", "no-store");
  return new Response(null, { status: 303, headers });
}
