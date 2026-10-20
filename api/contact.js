// Contact form → Resend.
// Sends the message to Senthil's inbox and a short "thanks, will catch up soon" reply to the sender.
// Vercel Function: served at /api/contact.
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY  — Resend API key (sending access)
//   CONTACT_TO      — where messages arrive (default senthildevaraj1998@gmail.com)
//   CONTACT_FROM    — verified sender, e.g. "Senthil Devaraj <hello@senthildevaraj.co.in>"

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function sendEmail(key, payload) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
  return r.json();
}

export async function POST(req) {
  let d;
  try { d = await req.json(); } catch { return json(400, { ok: false, error: "That didn't look like a form submission." }); }

  // Honeypot: bots fill the hidden "company" field. Pretend success.
  if (d.company) return json(200, { ok: true });

  const name = String(d.name || "").trim().slice(0, 80);
  const phone = String(d.phone || "").trim().slice(0, 20);
  const email = String(d.email || "").trim().slice(0, 120);
  const message = String(d.message || "").trim().slice(0, 4000);
  const digits = phone.replace(/\D/g, "");
  if (name.length < 2) return json(400, { ok: false, error: "Please enter your name." });
  if (digits.length < 8 || digits.length > 15) return json(400, { ok: false, error: "Please enter a valid mobile number." });
  if (!EMAIL.test(email)) return json(400, { ok: false, error: "Please enter a valid email address." });
  if (message.length < 5) return json(400, { ok: false, error: "Please write a short message." });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || "senthildevaraj1998@gmail.com";
  const from = process.env.CONTACT_FROM || "Senthil Devaraj <hello@senthildevaraj.co.in>";
  if (!key) return json(500, { ok: false, error: "The contact form isn't set up yet. Please email senthildevaraj1998@gmail.com." });

  const first = esc(name.split(/\s+/)[0]);
  const when = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });

  try {
    await sendEmail(key, {
      from,
      to: [to],
      reply_to: email,
      subject: `New message from ${name} — senthildevaraj.co.in`,
      text: `Name: ${name}\nMobile: ${phone}\nEmail: ${email}\nSent: ${when} IST\n\n${message}`,
      html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#101010">
        <h2 style="margin:0 0 12px;font-size:20px">New message from your portfolio</h2>
        <table style="border-collapse:collapse;margin-bottom:16px">
          <tr><td style="padding:2px 12px 2px 0;color:#666">Name</td><td><b>${esc(name)}</b></td></tr>
          <tr><td style="padding:2px 12px 2px 0;color:#666">Mobile</td><td><a href="tel:${esc(digits)}">${esc(phone)}</a></td></tr>
          <tr><td style="padding:2px 12px 2px 0;color:#666">Email</td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
          <tr><td style="padding:2px 12px 2px 0;color:#666">Sent</td><td>${esc(when)} IST</td></tr>
        </table>
        <div style="white-space:pre-wrap;padding:16px;background:#fafafa;border-radius:8px">${esc(message)}</div>
        <p style="color:#888;font-size:13px">Reply to this email to answer ${first} directly.</p></div>`,
    });
  } catch (e) {
    console.error(e);
    return json(502, { ok: false, error: "The message didn't go through. Please try again, or email senthildevaraj1998@gmail.com." });
  }

  // Auto-reply. If it fails, the main message has still arrived, so don't fail the request.
  try {
    await sendEmail(key, {
      from,
      to: [email],
      reply_to: to,
      subject: "Thanks, will catch up soon",
      text: `Hi ${name.split(/\s+/)[0]},\n\nThanks for reaching out through my portfolio. I've got your message and will catch up soon.\n\nSenthil Devaraj\nProduct Designer · senthildevaraj.co.in\n`,
      html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#101010">
        <p>Hi ${first},</p>
        <p>Thanks for reaching out through my portfolio. I've got your message and <b>will catch up soon</b>.</p>
        <p style="margin-top:24px">Senthil Devaraj<br><span style="color:#666">Product Designer · <a href="https://senthildevaraj.co.in" style="color:#4f46e5">senthildevaraj.co.in</a></span></p></div>`,
    });
  } catch (e) {
    console.error("auto-reply failed", e);
  }
  return json(200, { ok: true });
}

export function GET() {
  return json(405, { ok: false, error: "Use POST." });
}
