import { img, icon, esc, SITE, assetPath } from "./lib.mjs";

// Launch sequence from Figma (Component 28): "hello" → "I'm" → Senthil logo. Asset ids are filled once the export arrives.
export const SPLASH_WORDS = [["splash-hello", "hello"], [null, "I’m"], ["splash-senthil", "Senthil Devaraj"]];

const NAV = [
  { href: "about.html", label: "About", key: "about" },
  { href: "work.html", label: "My Works", key: "work" },
  { href: "clientele.html", label: "Clientele", key: "clientele" },
];

export function nav(active) {
  return `<header class="nav" role="banner">
  <a class="nav-logo" href="index.html" aria-label="Senthil Devaraj, home">${img("I14169:8973;13931:1034", { w: 89, h: 44, alt: "Senthil design", eager: true, label: "logo" })}</a>
  <nav class="nav-links" id="nav-links" aria-label="Main">
    ${NAV.map((n) => `<a class="nav-link" href="${n.href}"${active === n.key ? ' aria-current="page"' : ""}>${n.label}</a>`).join("\n    ")}
  </nav>
  <div class="nav-right">
    <button class="btn btn-dark btn-hello" type="button" data-say-hi aria-controls="say-hi">${icon("corner-down-right")}<span>Say Hello</span><span class="wave" aria-hidden="true">👋🏻</span></button>
    <button class="nav-burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="nav-links">${icon("menu")}</button>
  </div>
</header>`;
}

export function footer() {
  return `<footer class="footer">
  <div class="footer-bg" aria-hidden="true">${img("I14086:10073;13934:1491", { w: 1440, h: 545, alt: "" , label: " "})}</div>
  <div class="footer-inner">
    <div class="footer-grid">
      <div class="f-cta">
        <div>
          <h2>Let’s Design <span>incredible work together.</span></h2>
          <button class="chai" type="button" data-say-hi><span class="chai-pill">Let's chat over Chai ☕️</span><span class="chai-arrow">${icon("arrow-right")}</span></button>
        </div>
        <div class="socials">
          <a class="social" href="${SITE.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon("linkedin")}</a>
          <a class="social" href="tel:${SITE.phoneHref}" aria-label="Call ${SITE.phoneDisplay}">${icon("phone")}</a>
        </div>
      </div>
      <div class="f-side">
        <div class="glass f-status"><span class="pulse" aria-hidden="true"></span>Open to new work</div>
        <div class="f-row">
          <div class="glass f-note">
            <p class="from">Note from <b>Senthil</b> ❤</p>
            <div>
              <p>Hi, thank you for being here 👋🏻</p>
              <hr>
              <p>Design, to me, is understanding the problem behind the screen,<br>If you want to build something intentional together,</p>
              <hr>
              <p>Don't be shy, say hi!<br><a href="mailto:${SITE.email}">${SITE.email}</a></p>
            </div>
          </div>
          <div class="glass f-logo">${img("I14086:10073;13934:1548", { w: 232, h: 232, alt: "Senthil design", label: "logo" })}</div>
        </div>
      </div>
    </div>
    <div class="f-bottom"><p>© <span data-year>2026</span> Senthil Devaraj</p><p>100% designed and integrated on Claude by me ❤</p></div>
  </div>
</footer>`;
}

export function sayHi() {
  return `<div class="hi-scrim" data-close-hi></div>
<aside class="hi-panel" id="say-hi" role="dialog" aria-modal="true" aria-labelledby="hi-title" aria-hidden="true">
  <button class="hi-close" type="button" data-close-hi aria-label="Close">${icon("x")}</button>
  <div class="hi-top">
    <div class="hi-head">
      <h2 id="hi-title">Let’s Design <span>incredible work together.</span></h2>
      <p>Let's chat over a virtual tea break.☕️</p>
    </div>
    <form class="form" id="hi-form" novalidate>
      <div class="fields">
        <div class="field"><label for="hi-name">Name*</label><input id="hi-name" name="name" type="text" autocomplete="name" placeholder="Your name" required maxlength="80"><span class="err" aria-live="polite"></span></div>
        <div class="field-row">
          <div class="field"><label for="hi-phone">Mobile Number*</label><input id="hi-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="Eg : 98765 43210" required maxlength="20"><span class="err" aria-live="polite"></span></div>
          <div class="field"><label for="hi-email">Email ID*</label><input id="hi-email" name="email" type="email" autocomplete="email" placeholder="name@company.com" required maxlength="120"><span class="err" aria-live="polite"></span></div>
        </div>
        <div class="field"><label for="hi-message">Your Thoughts*</label><textarea id="hi-message" name="message" placeholder="Write your message here..." required maxlength="4000"></textarea><span class="err" aria-live="polite"></span></div>
        <div class="hp" aria-hidden="true"><label for="hi-company">Company</label><input id="hi-company" name="company" type="text" tabindex="-1" autocomplete="off"></div>
      </div>
      <p class="form-msg" role="alert" hidden></p>
      <button class="send" type="submit"><span class="send-label">Send Message</span>${icon("arrow-right")}</button>
    </form>
  </div>
  <div class="hi-foot">
    <h3>Say hi !</h3>
    <div class="hi-actions">
      <a href="tel:${SITE.phoneHref}">Buzz me ${icon("phone")}</a>
      <a href="mailto:${SITE.email}">Ping me ${icon("mail")}</a>
      <a href="${SITE.resume}" target="_blank" rel="noopener">Resume ${icon("file-user")}</a>
    </div>
    <p class="hi-contact-line"><a href="tel:${SITE.phoneHref}">${SITE.phoneDisplay}</a> · <a href="mailto:${SITE.email}">${SITE.email}</a></p>
  </div>
</aside>`;
}

export function splash() {
  return `<div class="splash" id="splash" aria-hidden="true">
  ${SPLASH_WORDS.map(([id, text]) => `<div class="splash-word">${id && assetPath(id) ? img(id, { alt: "", eager: true }) : `<p class="splash-text">${text}</p>`}</div>`).join("\n  ")}
  <div class="splash-wipe"></div>
  <button class="skip-splash" type="button">Skip</button>
</div>`;
}

export function page({ title, description, active, body, preview, isEntry, withSplash, canonical }) {
  const head = `<title>${esc(title)}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="${esc(description)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
${canonical ? `<link rel="canonical" href="${SITE.url}/${canonical}">` : ""}
<meta name="theme-color" content="#ffffff">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="preload" href="fonts/proxima-bold.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/avenir-roman.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="styles.css">`;
  const inner = `${withSplash ? splash() : ""}
${nav(active)}
${body}
${footer()}
${sayHi()}
${preview ? `<div class="preview-note">Preview · images arrive with your Figma export</div><script>window.SITE_PREVIEW=true</script>` : ""}
<script src="main.js" defer></script>`;
  if (preview && isEntry) return `${head}\n${inner}\n`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${head}
</head>
<body>
${inner}
</body>
</html>
`;
}
