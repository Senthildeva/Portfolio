// Case study pages. Content transcribed from the Figma frames (↳ Final / Case studies).
// Inline markup: <em> = case accent colour, <b> = bold/darker emphasis, <i class="g"> = gradient text (Gnie).
import { img, icon, esc, assetPath } from "./lib.mjs";

/* ---------------- block renderers ---------------- */
const H = {
  hero: (b) => `<section class="wrap cs-hero" aria-labelledby="cs-title">
    <p class="cs-tag">${b.tag}</p>
    <h1 class="cs-title" id="cs-title">${b.title}</h1>
    ${b.lead ? `<p class="lead">${b.lead}</p>` : ""}
    ${b.ctas && b.ctas.length ? `<div class="btn-row">${b.ctas.map((c) => `<a class="btn cs-btn${c.ghost ? " ghost" : ""}" href="${c.href}" target="_blank" rel="noopener">${esc(c.label)} ${icon("arrow-right")}</a>`).join("")}</div>` : ""}
  </section>`,

  stage: (b) => `<section class="cs-stage" aria-label="Project overview">
    <div class="wrap">
      <div class="cs-cover">${img(b.img, { w: 1312, h: 700, alt: b.alt || "", eager: true, label: "Cover image" })}</div>
      <dl class="cs-meta${b.meta.length > 4 ? " six" : ""}">${b.meta.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
      <p class="cs-intro">${b.intro}</p>
    </div>
  </section>`,

  head: (b) => `<div class="cs-head">
    ${b.label ? `<p class="cs-label"><span>${esc(b.label)}</span>${b.num ? `<span>${esc(b.num)}</span>` : ""}</p>` : ""}
    ${b.title ? `<h2 class="cs-h2">${b.title}</h2>` : ""}
    ${b.sub ? `<div class="cs-sub">${[].concat(b.sub).map((p) => `<p>${p}</p>`).join("")}</div>` : ""}
  </div>`,

  split: (b) => `<div class="cs-split"><div class="cs-split-main"><h3 class="cs-h2">${b.title}</h3><div class="cs-sub">${b.body.map((p) => `<p>${p}</p>`).join("")}</div></div><aside class="cs-note"><h3>${b.card.title}</h3><p>${b.card.body}</p></aside></div>`,

  stats: (b) => `<div class="cs-stats${b.grid ? " grid" : ""}">${b.items.map((s) => `<div class="cs-stat">
      <p class="big">${s.big}</p>
      <p class="what${b.caps ? " caps" : ""}">${s.label}</p>
      ${s.body ? `<p class="body">${s.body}</p>` : ""}
      ${s.src ? `<p class="src">${s.src}</p>` : ""}
    </div>`).join("")}</div>`,

  callout: (b) => `<div class="cs-callout${b.tone ? " " + b.tone : ""}">
    ${b.deco ? `<div class="cs-deco" aria-hidden="true">${img(b.deco, { alt: "", label: " " })}</div>` : ""}
    <h3>${b.title}</h3>
    ${[].concat(b.body || []).map((p) => `<p>${p}</p>`).join("")}
    ${b.chips ? `<ul class="cs-chips">${b.chips.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>` : ""}
    ${b.quote ? `<p class="cs-hand">${b.quote}</p>` : ""}
    ${b.by ? `<p class="cs-by">${b.by}</p>` : ""}
  </div>`,

  personas: (b) => `<div class="cs-personas">${b.items.map((p) => `<article class="cs-persona${b.tint ? " tint" : ""}">
      <div class="avatar-lg">${img(p.img, { w: 80, h: 80, alt: "", label: p.name.slice(0, 1) })}</div>
      <div class="cs-persona-name"><h3>${esc(p.name)}</h3><span class="age">${esc(p.age)}</span></div>
      ${p.traits ? `<ul class="cs-traits">${p.traits.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
      ${p.desc ? `<p class="desc">${p.desc}</p>` : ""}
      ${(p.lists || []).map(([t, items], i) => `${i || p.desc ? "<hr>" : ""}<div class="cs-plist"><p class="cs-hand-label">${esc(t)}</p><ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul></div>`).join("")}
      ${p.quote ? `<hr><p class="cs-hand">${p.quote}</p>` : ""}
    </article>`).join("")}</div>`,

  points: (b) => `<div class="cs-points-wrap">
    ${b.heading ? `<p class="cs-points-head">${esc(b.heading)}</p>` : ""}
    <ol class="cs-points${b.one ? " one" : ""}${b.rule ? " rule" : ""}">${b.items.map((p, i) => `<li><span class="n">${String(p.n || i + 1).padStart(2, "0")}</span><div>${p.kicker ? `<p class="cs-kicker">${p.kicker}</p>` : ""}${p.title ? `<p class="t${b.big ? " big" : ""}">${p.title}</p>` : ""}<p class="d${b.small ? " small" : ""}">${p.text}</p></div></li>`).join("")}</ol>
  </div>`,

  table: (b) => `<div class="cs-table-wrap"><table class="cs-table"><thead><tr>${b.head.map((h, i) => `<th${i === b.head.length - 1 ? ' class="hl"' : ""}>${esc(h)}</th>`).join("")}</tr></thead><tbody>${b.rows.map((r) => `<tr>${r.map((c, i) => `<td${i === r.length - 1 ? ' class="hl"' : ""}>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`,

  gallery: (b) => `<div class="cs-gal">${b.title ? `<p class="cs-points-head" style="border:0;padding:0">${esc(b.title)}</p>` : ""}${b.rows.map((row) => `<div class="cs-gal-row cols-${row.length}">${row.map((c) => `<figure>${c.img ? img(c.img, { w: c.w || 644, h: c.h || 322, alt: c.alt || "", label: c.label || "Screenshot" }) : `<div class="ph" style="aspect-ratio:2/1">${esc(c.label || "")}</div>`}<figcaption>${c.cap}</figcaption></figure>`).join("")}</div>`).join("")}</div>`,

  principles: (b) => `<div class="cs-principles${b.tone ? " " + b.tone : ""}">${b.items.map((p, i) => `<div><p class="num">${["I", "II", "III", "IV"][i]}</p><h3>${p.title}</h3><p>${p.text}</p></div>`).join("")}</div>`,

  features: (b) => `<ol class="cs-features">${b.items.map((f, i) => `<li><p class="cs-hand-num">${i + 1}</p><h3>${f.title}</h3><p>${f.text}</p></li>`).join("")}</ol>`,

  steps: (b) => `<ol class="cs-steps">${b.items.map((s, i) => `<li><p class="k">Step ${String(i + 1).padStart(2, "0")}</p><h3>${s.title}</h3><p>${s.text}</p></li>`).join("")}</ol>`,

  takeaways: (b) => `<div class="cs-takeaways"><p class="cs-points-head" style="border:0;padding:0">${esc(b.label)}</p><ul>${b.items.map((t) => `<li>${t}</li>`).join("")}</ul></div>`,

  decision: (b) => {
    const pct = (v, t) => ((v / t) * 100).toFixed(3) + "%";
    const notes = (b.notes || []).map((n) => `<div class="cs-ann" style="left:${pct(n.x, 1312)};top:${pct(n.y, 700)}"><p class="t">${esc(n.t)}</p><p class="s">${esc(n.s)}</p></div>`).join("");
    const arrows = (b.arrows || []).map((a) => `<div class="cs-arrow" style="left:${pct(a.x, 1312)};top:${pct(a.y, 700)};width:${pct(136, 1312)}">${img(a.id, { w: 136, h: 57, alt: "", label: " " })}</div>`).join("");
    return `<div class="cs-decision">
      <p class="cs-dlabel">${esc(b.label)}</p>
      <h3 class="cs-h2">${b.title}</h3>
      <div class="cs-sub"><p>${b.text}</p></div>
      <figure class="cs-dfig">
        <div class="cs-dstage">
          <div class="cs-dimg" style="top:${pct(b.imgY || 0, 700)};height:${pct(b.imgH || 660, 700)}">${img(b.img, { w: 1312, h: b.imgH || 660, alt: b.alt || "", label: "Screen mockup" })}</div>
          ${arrows}${notes}
        </div>
        <ul class="cs-ann-list">${(b.notes || []).map((n) => `<li><b>${esc(n.t)}</b> ${esc(n.s)}</li>`).join("")}</ul>
        <figcaption>${b.cap}</figcaption>
      </figure>
    </div>`;
  },

  image: (b) => `<figure class="cs-img${b.bleed ? " bleed" : ""}${b.radius ? " round" : ""}" style="--ar:${b.w || 1312}/${b.h || 700}">${img(b.img, { w: b.w || 1312, h: b.h || 700, alt: b.alt || "", label: b.label || "Image" })}${b.fade ? '<span class="fade" aria-hidden="true"></span>' : ""}${b.cap ? `<figcaption>${b.cap}</figcaption>` : ""}</figure>`,

  pair: (b) => `<div class="cs-pair">${b.items.map((c) => (c.video ? H.video({ ...c, inPair: true }) : `<figure class="cs-img" style="--ar:${c.w || 644}/${c.h || 600}">${img(c.img, { w: c.w || 644, h: c.h || 600, alt: c.alt || "", label: c.label || "Image" })}</figure>`)).join("")}</div>`,

  video: (b) => {
    const src = assetPath(b.video);
    const poster = assetPath(b.poster || "");
    const inner = src
      ? `<video src="${src}"${poster ? ` poster="${poster}"` : ""} autoplay muted loop playsinline preload="metadata" aria-label="${esc(b.alt || "Product walkthrough video")}"></video>`
      : `<div class="ph">${esc(b.label || "Video")}</div>`;
    return `<figure class="cs-img cs-video${b.bleed ? " bleed" : ""}" style="aspect-ratio:${b.ratio || "1312/700"}">${inner}</figure>`;
  },

  masonry: (b) => `<div class="cs-masonry-wrap"><div class="cs-masonry">${b.cols.map((col) => `<div class="col">${col.map(([id, h, alt]) => `<figure>${img(id, { w: 250, h, alt: alt || "", label: alt || "Screen" })}</figure>`).join("")}</div>`).join("")}</div><span class="fade" aria-hidden="true"></span></div>`,

  styleguide: (b) => b.colors ? `<div class="sg">
    <div class="sg-card" style="--sgbg:${b.colors.bg}">
      <h4>Colors</h4>
      <div class="sg-panel sg-colors">${b.colors.items.map((c) => `<div class="sg-swatch">
        <div class="sg-main" style="background:${c.hex}"><span>${esc(c.name)}</span><span>${esc(c.hex.toUpperCase())}</span></div>
        <div class="sg-tints">${c.tints.map((t) => `<span style="background:${t}" title="${t}"></span>`).join("")}</div>
      </div>`).join("")}</div>
    </div>
    <div class="sg-card" style="--sgbg:#101010">
      <h4>Typeface</h4>
      <div class="sg-panel sg-type">
        <p class="sg-face" style="font-family:${b.face.stack}">${esc(b.face.name)}</p>
        <div class="sg-specimen" style="font-family:${b.face.stack}" aria-hidden="true"><span class="ghost">Aa</span><span>Aa</span></div>
      </div>
    </div>
  </div>` : `<div class="cs-sg"><div class="ph" style="aspect-ratio:${b.ratio || "1312/516"}">${esc(b.label || "Style guide — live version in progress")}</div></div>`,

  html: (b) => b.html,
};

const block = (b) => H[b.type](b);
const section = (s) => `<section class="wrap cs-sec${s.cls ? " " + s.cls : ""}"${s.id ? ` id="${s.id}"` : ""} data-reveal>${s.blocks.map(block).join("\n")}</section>`;
const band = (s) => `<section class="cs-band" data-reveal><div class="wrap cs-sec">${s.blocks.map(block).join("\n")}</div></section>`;

function pager(prev, next) {
  const side = (p, dir) => !p ? "<span></span>" : `<a class="cs-pg ${dir}" href="${p.slug}.html">${dir === "prev" ? icon("arrow-left") : ""}<span><small>${dir === "prev" ? "Previous" : "Next"}</small><b style="${p.color.startsWith("linear") ? `background:${p.color};-webkit-background-clip:text;background-clip:text;color:transparent` : `color:${p.color}`}">${esc(p.label)}</b></span>${dir === "next" ? icon("arrow-right") : ""}</a>`;
  return `<nav class="wrap" aria-label="More case studies"><div class="cs-pager">${side(prev, "prev")}${side(next, "next")}</div></nav>`;
}

/* ---------------- content ---------------- */
const GRAD = "linear-gradient(90deg,#8449e4,#1967d2)";
const LINKS = {
  cna: { slug: "cna", label: "CNA (Mediacorp)", color: "#b71c1c" },
  outgrow: { slug: "outgrow", label: "Outgrow (Waycool labs)", color: "#22914f" },
  gnie: { slug: "gnie", label: "Gnie (Gapblue)", color: GRAD },
  jain: { slug: "jain-connect", label: "Jain Irrigation System (JC)", color: "#1479ff" },
};

const CNA = {
  slug: "cna", theme: "cna", prev: null, next: LINKS.outgrow,
  title: "Reimagining CNA · Senthil Devaraj",
  description: "Redesigning CNA News for Apple TV — bringing Singapore's leading news broadcaster to the couch without losing what makes it CNA.",
  hero: { type: "hero", tag: "<em>Mediacorp</em> • Media &amp; Entertainment • APPLE TV", title: "Reimagining CNA - <em>Newsroom to living room.</em>", lead: "Redesigning <b>CNA News for Apple TV</b> — bringing Singapore's leading news broadcaster to the couch without losing what makes it CNA.", ctas: [{ label: "View Live", href: "https://apps.apple.com/in/app/cna-channel-newsasia/id520773971?platform=tv" }] },
  stage: { type: "stage", img: "13858:1644", alt: "CNA on Apple TV", meta: [["Client", "MEDIACORP - CNA NEWS"], ["Platforms", "Apple TV"], ["Role", "UX Research · Interaction · UI"], ["Target Audience", "News Followers"]], intro: "Most news apps on TV fail one of two ways — too cluttered to navigate, or too thin to feel credible. CNA had to do both jobs at once, <span class=\"hl\">through four arrow keys and a click.</span>" },
  sections: [
    { blocks: [
      { type: "head", label: "The Setup", num: "001" },
      { type: "split", title: "A mobile-first newsroom, asked to live in the <em>living room</em>", body: ["CNA is Singapore's most-followed news brand. But news consumption has moved to the biggest screen in the house - and the existing CNA TV experience hadn't moved with it.", "The Apple TV adaptation was the first move. It would set the design standard for the Android TV and Roku rollouts that followed."], card: { title: "A TV is not a large phone.", body: "The task wasn't porting the app. It was rethinking the entire experience for a remote-first, lean-back context - then scaling it across 3 platforms." } },
      { type: "stats", items: [
        { big: "<em>47</em><small>%</small>", label: "most-used online news in Singapore", src: "Reuters Institute, Digital News Report 2025" },
        { big: "<em>65.6</em><small>%</small>", label: "of Singapore internet users now stream SVOD", src: "GWI, via IAB SEA" },
        { big: "<em>47.5</em><small>%</small>", label: "of all TV viewing is now streaming in SINGAPORE", src: "Nielsen, The Gauge - Dec 2025" },
      ] },
    ] },
    { raw: { type: "image", img: "13764:3166", w: 1440, h: 250, bleed: true, alt: "", label: "Banner" } },
    { blocks: [{ type: "callout", title: "UX Strategy &amp; Methodology", body: "My approach: competitor teardown across 4 major TV news apps, remote-first interaction audit, and iterative usability testing with the actual d-pad hardware - not a mouse simulation.", chips: ["Competitor Analysis", "Remote-First UX Audit", "Usability Testing"] }] },
    { blocks: [
      { type: "head", label: "The Problem", num: "002", title: "The data told the story before users did." },
      { type: "personas", items: [
        { img: "13764:3188", name: "The Habitual Watcher", age: "User Age (40 - 60)", desc: "Turns the TV on expecting news to just play. Doesn't want to search, browse, or decide. Gets frustrated when she has to.", quote: "\"I just want to watch the news. Why do I have to pick something first?\"" },
        { img: "13764:3200", name: "The Catch-Up Viewer", age: "User Age (25–40)", desc: "Returns for a specific programme she missed. Finds content buried under generic categories. Gives up and switches apps.", quote: "\"I know the show exists. I just can't find it from here.\"" },
      ] },
      { type: "stats", caps: true, items: [
        { big: "<em>3.4</em><small class=\"reg\">/5</small>", label: "App Store rating", body: "Recurring complaints: Confusing navigation, playback issues, &amp; difficulty finding Singapore-specific content.", src: "Google Play / App Store listing" },
        { big: "<em>≈ ½</em>", label: "the session length of leading TV", body: "Viewers tuned in, then tuned out - engagement ran well below competing news apps.", src: "Project benchmarking" },
        { big: "<em>No. 1</em>", label: "no platform leads the living room", body: "The connected-TV landscape is fragmented and varies by region - one design had to flex across all of it.", src: "Pixalate CTV Report, Q3 2025" },
      ] },
    ] },
    { blocks: [
      { type: "points", heading: "Reframed as user problems", items: [
        { kicker: "How might we …", text: "help users land on live content immediately - without even searching?" },
        { kicker: "How might we …", text: "make browsing feel natural on a remote, not borrowed from mobile?" },
        { kicker: "How might we …", text: "make finding a specific programme effortless - without forcing a keyboard?" },
        { kicker: "How might we …", text: "build one design system that feels native across three platforms?" },
      ] },
      { type: "callout", title: "Aha Moment !", body: "Four separate complaints was one pattern: viewers were doing work the platform should be doing for them. It collapse that into a single design principle - <b>Reduce effort at every turn, and let the rest follow from it.</b>" },
    ] },
    { blocks: [
      { type: "head", label: "The Approach", num: "003", title: "Competitors shaped our principles, not our aesthetics.", sub: "We weren't looking for visual cues to borrow. We were looking for <b>solved problems</b> - and mapping each pattern to a decision we'd have to make." },
      { type: "table", head: ["Pattern observed", "Where", "What we took from it"], rows: [
        ["Land on Live TV immediately", "All news apps", "Auto-play live on launch. Full-screen after 10–15s inactivity."],
        ["Grid keyboard + voice search", "Netflix, YouTube, tvOS", "Live-filtering grid keyboard with hold-to-dictate."],
        ["Top nav over spatial rails", "Haystack, Prime Video, Netflix, tvOS apps", "Flat layout, predictable focus order, no dead-ends."],
        ["Channel guide overlaid on live", "Linear TV, YouTube TV", "A ‘Now & Next’ schedule summoned over the feed."],
        ["TopShelf integration", "Apple TV native", "Live + curated editorial. Premium real estate for a news brand."],
      ] },
    ] },
    { blocks: [
      { type: "gallery", title: "Research, Competitors and Use cases", rows: [
        [{ img: "13764:3315", w: 421, h: 238, cap: "<b>Apple TV</b> - Menu Navigation" }, { img: "13764:3318", w: 421, h: 237, cap: "<b>Fox News</b> - Menu Navigation" }, { img: "13764:3321", w: 421, h: 237, cap: "<b>Haystack News</b> - Menu Navigation" }],
        [{ img: "13764:3325", w: 644, h: 322, cap: "<b>Apple TV</b> - Menu Navigation" }, { img: "13764:3328", w: 644, h: 322, cap: "<b>Apple TV</b> - Top Shelf" }],
      ] },
      { type: "head", title: "Three principles we locked in early" },
      { type: "principles", items: [
        { title: "Remote-first", text: "Every interaction must work with a d-pad and a select. If it needs a swipe, it's wrong." },
        { title: "Live-first", text: "Live TV is the entry point - not buried content, else is discovered around it." },
        { title: "Platform-native", text: "Leverage Apple TV behaviours. One system, platform-specific interactions." },
      ] },
    ] },
    { blocks: [
      { type: "head", label: "The Process", num: "004", title: "UX Audit &amp; Usability and Production Testing" },
      { type: "points", rule: true, items: [
        { kicker: "Concept review", text: "Walked the flat-navigation model and auto-play concept past the product team before any pixels shipped." },
        { kicker: "Moderated usability", text: "Habitual watchers and catch-up viewers navigated the on-device prototype, Siri Remote in hand, thinking aloud." },
        { kicker: "Focus &amp; legibility pass", text: "Every focus state and type size checked from a real ten-foot seat — not a desktop monitor." },
        { kicker: "Search validation", text: "Timed how many key-presses it took to find a named programme, comparing grid-keyboard vs. voice." },
        { kicker: "Cross-platform review", text: "Checked the system held up on Android TV and Roku hardware before handing off for build." },
      ] },
    ] },
    { blocks: [
      { type: "head", label: "The Solution", num: "005", title: "Designed once. Native on three platforms.", sub: "What follows are the four decisions that defined the experience. Mockups are concept frames built for this case study - they communicate the pattern, not CNA's shipped UI." },
      { type: "head", title: "Style Guides", sub: "Our style guide was thoughtfully created to uphold a unified visual identity. We embraced a clean and modern design, emphasizing user-friendly elements." },
      { type: "styleguide", colors: { bg: "#b71c1c", items: [{ name: "Primary Red", hex: "#b71c1c", tints: ["#801414", "#a51919", "#be3333", "#c54949", "#cd6060", "#d47777", "#e2a4a4"] }, { name: "Primary Black", hex: "#101010", tints: ["#282828", "#484848", "#707070", "#666666", "#9f9f9f", "#cfcfcf", "#e7e7e7"] }] }, face: { name: "SF Pro", stack: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" } },
      { type: "html", html: `<div class="cs-components" aria-label="Component sample"><span class="cs-signin">Sign In</span>${img("13764:3398", { w: 67, h: 22, alt: "", label: " " })}</div>` },
    ] },
    { blocks: [
      { type: "decision", label: "Decision 01 · Home Screen", title: "<em>Don't make me pick</em> something first.", text: "Live TV auto-plays on launch, with a collapsible rail beneath it. <b>After 10–15s of inactivity</b> the feed goes full screen — matching how viewers already expect a television to behave.", img: "13858:5200", imgY: 40, imgH: 660, alt: "CNA Apple TV home screen with live news playing", notes: [{ x: 95, y: 122, t: "Auto Live", s: "5-10s of inactivity" }, { x: 62, y: 440, t: "Your Choice", s: "Personalised Carousel" }], arrows: [{ id: "13764:3456", x: 320, y: 235 }, { id: "13764:3458", x: 388, y: 556 }], cap: "Live plays on launch. Rail surfaces options without breaking the broadcast." },
      { type: "decision", label: "Decision 02 · Search", title: "Make the <em>hardest</em> input on TV the <em>easiest</em>.", text: "A spatial grid keyboard filters results as you type, and <b>hold-to-dictate voice</b> search skips the keyboard entirely — two routes to the same programme in three or four presses.", img: "13858:5197", imgY: 0, imgH: 621, alt: "CNA search screen with grid keyboard", notes: [{ x: 1015, y: 202, t: "hold-to-dictate", s: "voice search for anyone" }], arrows: [{ id: "13764:3470", x: 947, y: 151 }], cap: "Grid keyboard + live filtering, with hold-to-dictate voice as the shortcut." },
      { type: "decision", label: "Decision 03 · Navigation Model", title: "<em>Three d-pad</em> moves. Always.", text: "A flat, spatial layout — side nav over intent-based rails — keeps every destination within <b>two or three d-pad moves</b>, with oversized, high-contrast focus states legible from a ten-foot seat.", img: "13858:5203", imgY: 40, imgH: 621, alt: "CNA browse screen with intent-based rails", notes: [{ x: 24, y: 321.5, t: "3 d-pad moves", s: "Upcoming shows" }], arrows: [{ id: "13764:3480", x: 306, y: 461 }], cap: "Intent-based rails. Focus state visible from 10 feet." },
      { type: "decision", label: "Decision 04 · Now & Next", title: "Tell me what's on, <em>without leaving the broadcast.</em>", text: "One press summons a <b>'Now &amp; Next'</b> guide over the live feed — the current programme, its progress, and the next three slots — mirroring the channel schedule viewers already trust, without ever interrupting it.", img: "13858:5205", imgY: 40, imgH: 621, alt: "Now and Next guide over the live feed", notes: [{ x: 1041, y: 320, t: "Now & Next", s: "Upcoming shows" }], arrows: [{ id: "13764:3491", x: 1003, y: 429 }], cap: "The channel's running order, overlaid on live. One press to summon, one to dismiss." },
    ] },
    { raw: { type: "video", video: "video-cna", poster: "13764:3493", bleed: true, ratio: "1440/723", label: "Walkthrough video" } },
    { blocks: [
      { type: "head", label: "The Outcome", num: "006", title: "One system. Native on every platform." },
      { type: "points", items: [
        { kicker: "We Transformed as", text: "+40% boost in user engagement after the redesign (Mediacorp published project impact)." },
        { kicker: "We Transformed as", text: "Auto-play live meant viewers landed on content the instant the app opened - no menu, no decision, the broadcast simply on." },
        { kicker: "We Transformed as", text: "The Now &amp; Next guide let viewers see the running order without ever leaving live - the channel schedule they already trust, on demand." },
        { kicker: "We Transformed as", text: "A remote-first navigation model kept every destination within two/ three d-pad moves, and became the benchmark every later platform rollout inherited." },
      ] },
      { type: "callout", title: "What I learned", body: "This project reshaped how I think about interaction design. TV is a genuinely different medium. I learned to design remote-first, Apple’s Native behaviour and its targeted audience to treat focus and motion as core feedback, and to build a single system flexible enough to feel native across very different platforms.", quote: "“Designing for TV taught me that constraints are the design. When your only input is a directional pad, every placement - and every animation - is a UX decision. <em>The best thing we did was stop treating the TV like a large phone.”</em>" },
    ] },
  ],
};

const OUTGROW = {
  slug: "outgrow", theme: "outgrow", prev: LINKS.cna, next: LINKS.gnie,
  title: "Outgrow · Senthil Devaraj",
  description: "Outgrow by WayCool Labs — the one-stop solution for farmers, in their own language.",
  hero: { type: "hero", tag: "<em>OUTGROW (Waycool Labs)</em> • Agritech • Mobile APP", title: "The <em>One-Stop Solution</em> for Farmers.", ctas: [{ label: "Prototype Link", href: "https://xd.adobe.com/view/8759bb74-6a20-4ecb-b025-7eceb5e92f88-d20a/" }] },
  stage: { type: "stage", img: "13764:3541", alt: "Outgrow farmer app", meta: [["Client", "Way-cool Foods - OUTGROW"], ["Industry", "Agri-tech"], ["Role", "UX Researcher · Visual Designer"], ["Target Audience", "Small & marginal farmers"]], intro: "Outgrow takes what WayCool learned beside <span class=\"hl\"><b>85,000 farmers</b></span> - Mandi prices, soil testing, weather, crop health - and puts it in one app, in the farmer's own language." },
  sections: [
    { blocks: [
      { type: "head", label: "The Setup", num: "001", title: "A Farmer network, <em>Three years</em> in the making.", sub: ["Outgrow is the farmer-engagement platform from <b>WayCool Labs</b>, the technology arm of Chennai's WayCool Foods. Long before any app, agronomists and field advisors of Outgrow had spent <b>over three years working alongside farmers on the ground</b> - building a network of more than 85,000 of them.", "In March 2022, that on-ground knowledge became a free - launched in six languages across five states, with one stated mission: <b>To raise the income and profitability of small and marginal farmers, and ultimately reach five million of them.</b>"] },
      { type: "stats", items: [
        { big: "<em>85,000</em><small>+</small>", label: "farmers in the Outgrow network at launch", src: "WayCool Foods, 2022" },
        { big: "<em>3</em><small>+yrs</small>", label: "on the ground before the app existed", src: "Outgrow extension program" },
        { big: "<em>5M</em><small>+</small>", label: "farmers the platform aims to reach", src: "Stated goal — WayCool" },
      ] },
    ] },
    { raw: { type: "image", img: "13764:3653", w: 1440, h: 250, bleed: true, alt: "", label: "Banner" } },
    { blocks: [{ type: "callout", tone: "alt", title: "UX Strategy &amp; Methodology", body: "I combined field visits with farmers, a competitor scan of existing agri-advisory apps, and persona synthesis to ground every decision in real usage, not assumptions", chips: ["Field Interviews", "Competitor Analysis", "Persona Synthesis"] }] },
    { blocks: [
      { type: "head", label: "The problem", num: "002", title: "What we heard, again and again.", sub: ["Across every conversation, the same picture emerged. Farmers like Gandhi and Murugan didn't lack information - they were lost in scattered, unsolicited advice with no single source to trust. And for farmers on thin margins, that uncertainty translates straight into lost income.", "Listing the pains as we understood them from the field:"] },
      { type: "points", small: true, items: [
        { title: "No water &amp; irrigation guidance", text: "No reliable way to plan irrigation or manage water across the farm." },
        { title: "Scattered, untrusted advice", text: "Overexposed to unsolicited tips from many sources, with no single voice to trust." },
        { title: "No help with high-yield crops", text: "Little guidance on managing or improving yield for demanding crops." },
        { title: "Opaque, late prices", text: "Mandi rates arrive late &amp; unclear, leaving farmers at the mercy of middlemen." },
        { title: "Insights that come too late", text: "Soil and crop-health information rarely arrives in time to act on it." },
        { title: "A language barrier", text: "Most digital tools simply don't speak the farmer's mother tongue." },
      ] },
      { type: "callout", tone: "alt quote", title: "\"Today, a farmer depends on multiple platforms and at times is overexposed to unsolicited advisory sources.\"", by: "- Sendhil Kumar · Head of Farmer Engagement &amp; Outgrow, WayCool Foods" },
    ] },
    { blocks: [
      { type: "head", label: "Our research", title: "We started where the farmers are.", sub: ["Building on this farmer-engagement platform, the two of us, A small design team - went into the field ourselves. We ran a survey across farming households, sat with farmers on their own land, and watched how they plan, plant, price, and sell across a season.", "The goal was simple: understand the real pain points, not the assumed ones."] },
      { type: "html", html: `<ul class="cs-traits lined"><li>Field survey</li><li>Contextual interviews</li><li>On-farm observation</li><li>Persona synthesis</li></ul>` },
      { type: "personas", tint: true, items: [
        { img: "13764:3606", name: "Gandhi", age: "User Age (66)", traits: ["Hardworking", "Punctual", "Observant", "Problem-solver"], lists: [["Goals", ["More information to manage all his crops", "Updates on crops, Irrigation &amp; prices"]], ["Pain points", ["No good mechanism for water irrigation", "No proper guidance for high-yield crops"]]] },
        { img: "13764:3632", name: "Murugan", age: "User Age (38)", traits: ["Curious", "Cost-conscious", "Tech-ready", "Persistent"], lists: [["Goals", ["Sell at fair, transparent prices", "Adopt modern methods to raise yield"]], ["Pain points", ["Middlemen and unclear mandi rates cut margins", "No early warning for pests or bad weather"]]] },
      ] },
    ] },
    { blocks: [
      { type: "head", label: "The Process", num: "003", title: "Three principles we locked in early", sub: "Working back from the research, we mapped each pain to a concrete, science-backed feature — the set of solutions that became Outgrow." },
      { type: "features", items: [
        { title: "Real-time market price", text: "Live Mandi rates from 2,500+ markets, so farmers sell at the right price - not a middleman's." },
        { title: "Farm data &amp; NDVI", text: "Add a farm area and monitor it - farm data analysis, health monitoring and NDVI scores across the season." },
        { title: "Weather &amp; climate", text: "Farm-specific forecasts and microclimatic conditions, with early disease-risk alerts ahead of trouble." },
        { title: "Expert advisory", text: "Agronomist guidance on crops by voice, text or IVR method (Customer Support) - in the farmer's own language." },
        { title: "Crop information &amp; Solution", text: "How to grow each crop, and how to remedy disease the moment it spreads - backed by 500+ remedies." },
        { title: "Soil testing", text: "An Outgrow partner service collects soil from the field and turns it into an actionable report." },
      ] },
    ] },
    { blocks: [
      { type: "head", label: "The design language" },
      { type: "styleguide", label: "Colours & typeface — rebuilding as live text", ratio: "1312/706" },
      { type: "styleguide", label: "UI components — rebuilding as live text", ratio: "1312/948" },
    ] },
    { blocks: [
      { type: "head", label: "High • Fidelity Wires" },
      { type: "image", img: "13764:4016", w: 1312, h: 1279, alt: "High fidelity wireframes of the Outgrow app", label: "Hi-fi wires", cap: "From early flows and wireframes to a single, consistent interface system." },
    ] },
    { blocks: [
      { type: "head", label: "The solution", num: "004", title: "One app for the whole farming cycle.", sub: "Those research-driven features came to life as a single, calm interface — every service a tap away, every screen readable in bright field light and in the farmer's own language." },
      { type: "takeaways", label: "Key Take-aways", items: ["Real Time Market Price Access.", "Farm Data Analysis and Health Monitoring and NDVI Scores", "Weather and Climatic Condition.", "Expert Advisory Information about Crops.", "Farmers get information about each Crop and how to product and how to remedy if any diseases spread across.", "Outgrow partnered service will help on the soil testing by collecting data from the field."] },
    ] },
    { raw: { type: "image", img: "13764:4029", w: 1439, h: 1791, bleed: true, fade: true, alt: "Outgrow app screens", label: "App screens" } },
    { raw: { type: "image", img: "13773:4372", w: 1440, h: 788, bleed: true, alt: "Outgrow in use", label: "Outgrow showcase" } },
    { blocks: [
      { type: "head", label: "The OUTCOME", num: "005", title: "Income, not just information.", sub: "The measure of success was never screen time - it was the balance sheet of a farm. By replacing a scatter of half-trusted sources with one credible, multilingual place, Outgrow turned scattered advice into the kind farmers could act on - and farmers in the program saw it land where it matters most: their income." },
      { type: "stats", grid: true, items: [
        { big: "<em>20 - 40</em><small>%</small>", label: "Income increase for Outgrow farmers", src: "Outgrow program — WayCool, 2022" },
        { big: "<em>100K</em><small>+</small>", label: "Downloads on Google Play", src: "Cumulative, app-level — Google Play" },
        { big: "<em>2,500</em><small>+</small>", label: "Markets feeding live prices", src: "Per Google Play listing" },
        { big: "<em>6</em>", label: "Languages, fully localised", src: "EN · TA · TE · KN · MR · HI" },
      ] },
      { type: "callout", tone: "solid", title: "What I learned", // TODO: the end of this sentence was cut off in the Figma read; complete it from the exported image of 13764:4060.
        body: "Designing for users I'd never meet in a lab forced a discipline I'm proud of every decision had to survive a dusty field, a small screen, low connectivity, and …", quote: "“The hard part wasn't adding features. It was earning enough trust to replace five.”" },
    ] },
  ],
};

const GNIE = {
  slug: "gnie", theme: "gnie", prev: LINKS.outgrow, next: LINKS.jain,
  title: "Gnie at GITEX 2024 · Senthil Devaraj",
  description: "Tap, Scratch, Win — designing a gamified progressive web app for Gapblue at GITEX Global 2024 in Dubai.",
  hero: { type: "hero", tag: "<i class=\"g\">GNIE (Gapblue)</i> • Generative AI Solutions • Progressive Web App", title: "<i class=\"g\">Tap, Scratch, Win</i> - Designing a Gamified PWA for the World's Largest Tech Show <i class=\"g\">(GITEX 2024).</i>" },
  stage: { type: "stage", img: "13764:4074", alt: "Gnie booth app", meta: [["Client", "GNIE - Gapblue Software Labs"], ["Industry", "Generative AI Solutions"], ["Event", "GITEX Global 2024, Dubai"], ["Deliverable", "Progressive Web App (PWA)"], ["Role", "Product Designer"], ["Target Audience", "investors & enterprise buyers"]], intro: "Thousands of booths compete for fleeting attention. Gapblue needed a booth experience that stop people, pull them in, and gift them with something - a memory, a reward, and a reason to be followed up." },
  sections: [
    { blocks: [
      { type: "head", label: "The Setup", num: "001", title: "The client, the product, and the stage", sub: ["<b>Gapblue Software Labs</b> is a Kochi-based AI integrator building Gen AI - powered enterprise tools for SMEs across Asia and North America. Their flagship platform, <b>Gnie</b>, is an AI-driven productivity and performance management system - built to help businesses close the gap between human potential and business outcomes", "For October 2024, Gapblue had secured a booth at <b>GITEX Global</b> - the world's largest technology conference, held in Dubai, drawing over 100,000 attendees from 170+ countries. The stakes were high: this was Gapblue's moment to put Gnie in front of decision-makers, investors, and enterprise buyers at a single point in time."] },
      { type: "stats", items: [
        { big: "<i class=\"g\">GITEX 2024</i>", label: "GITEX Global 2024, Dubai" },
        { big: "<i class=\"g\">170</i><small>+</small>", label: "countries" },
        { big: "<i class=\"g\">100,000</i>", label: "attendees" },
      ] },
    ] },
    { raw: { type: "image", img: "13764:4121", w: 1440, h: 250, bleed: true, alt: "", label: "Banner" } },
    { blocks: [{ type: "callout", title: "UX Strategy &amp; Methodology", body: "With a hard deadline and no time for traditional research, I relied on rapid prototyping and stakeholder alignment sessions to validate the concept before build - testing assumptions through paper sketches rather than user interviews.", chips: ["Constraint-Driven Design", "Stakeholder Validation", "Gamified Experience"] }] },
    { blocks: [
      { type: "head", label: "The problem", num: "002", title: "What I was asked to build", sub: ["The brief was clear: build a <b>kiosk-style Progressive Web App</b> that could run simultaneously across multiple devices at the booth - capturing visitor interest, collecting contact data, and distributing a gamified reward.", "As the <b>Project Lead</b> on this engagement, I owned the end-to-end design - from defining the user journey and interaction model to delivering the final UI for development handoff."] },
      { type: "features", items: [
        { title: "Engage booth visitors", text: "Create an experience compelling enough to stop foot traffic and hold attention on a busy trade floor." },
        { title: "Capture lead data", text: "Collect visitor contact information interactively - without it feeling like a cold form fill." },
        { title: "Reward participation", text: "Incentivise form completion with a branded gamified reward - a scratch-and-win coupon experience." },
      ] },
      { type: "callout", title: "Aha Moment !", body: "The question wasn't just how do we show up - it was how do we make the <b>90 seconds a visitor spends at our booth count.</b>" },
    ] },
    { blocks: [
      { type: "head", title: "Three problems hiding inside one request", sub: "What looked like a straightforward booth app unpacked into a set of layered technical and experience constraints - each requiring deliberate design decisions." },
      { type: "points", one: true, big: true, rule: true, items: [
        { title: "Getting 90 seconds without anyone noticing", text: "The moment a visitor feels like they're filling a form, they leave. The flow had to draw people in through curiosity and play - so they were already sharing their details before it felt like that's what they were doing." },
        { title: "Zero instruction on a loud, distracting floor", text: "No staff walking people through it. No onboarding screen. The UI had to be self-evident in under three seconds - legible mid-conversation, operable by anyone regardless of language or tech comfort." },
        { title: "Keeping the experience fresh for each person", text: "The app resets for every visitor. What feels exciting for the first person still had to land for the hundredth. The motion, anticipation, and scratch reveal couldn't feel like a loop - it had to feel like a moment." },
        { title: "Unreliable connectivity at a 100,000-person event", text: "Trade show WiFi is unreliable. Dead kiosks at peak hours wasn't an option. Every interaction had to be captured and stored locally - no server dependency, no risk." },
      ] },
    ] },
    { band: true, blocks: [
      { type: "head", label: "The Process", num: "003", title: "From a blank screen to a Genie in a bottle", sub: "The conceptual challenge was to connect Gapblue's AI brand to a human, playful moment at a busy exhibition booth. The name \"Gnie\" gave me a creative opening - a genie that grants wishes, reimagined for enterprise AI." },
      { type: "takeaways", label: "Early sketches explored the visitor flow:", items: ["What they see first, how they fill in data naturally", "How the reward reveal creates a memorable peak moment", "The scratch-and-win mechanic was chosen specifically because it combines tactile interaction (familiar from physical cards) with digital delight - something worth photographing and sharing."] },
      { type: "image", img: "13764:4191", w: 1312, h: 700, alt: "Early sketches of the Gnie booth flow", label: "Sketches" },
      { type: "principles", tone: "dark", items: [
        { title: "The Genie character", text: "An animated Genie mascot was designed as the visual anchor - personifying Gnie's AI identity and giving the booth a recognisable, approachable face." },
        { title: "The gift box reveal", text: "A gift-box animation served as the transition between form completion and reward reveal - building anticipation before the scratch interaction begins" },
        { title: "Tech pivot: React → Next.js", text: "The initial React build was migrated to Next.js to leverage better PWA support, offline caching via service workers, and improved cross-device rendering." },
      ] },
      { type: "pair", items: [{ img: "13764:4209", w: 644, h: 600, alt: "Genie character", label: "Genie character" }, { img: "13764:4210", w: 644, h: 600, alt: "Gift box reveal", label: "Gift box reveal" }] },
    ] },
    { blocks: [
      { type: "head", label: "The Solution", num: "004", title: "A kiosk that works, with or without the internet", sub: "The final PWA was built on Next.js, deployed as a Progressive Web App, and optimised for installation on all three device families in kiosk mode. Every interaction state - from the initial landing screen to the scratch-and-win reveal — was designed to require zero user instruction." },
      { type: "points", big: true, items: [
        { title: "Universal cross-device compatibility", text: "Same layout, same touch targets, same animations - on Android tablets, iPad kiosks, and Microsoft Surface without a single platform-specific fix." },
        { title: "Fully offline lead capture", text: "Lead data stored locally via IndexedDB and service workers. No internet needed - everything reviewable on-device, syncable after the event." },
        { title: "Scratch-and-win gamification", text: "A digital scratch card revealed the reward - making data collection feel like participation, not a form fill. Tactile, memorable, and worth sticking around for." },
        { title: "Fair reward distribution system", text: "10 coupons per day across 5 devices - pool controlled, distribution fair, no server required. Local state handled it all." },
      ] },
      { type: "video", video: "video-gnie-1", poster: "13764:4240", ratio: "1312/700", label: "Kiosk walkthrough video" },
      { type: "pair", items: [{ video: "video-gnie-2", poster: "13764:4242", ratio: "636/700", label: "Scratch-and-win video" }, { img: "13764:4243", w: 636, h: 700, alt: "Gnie kiosk screens", label: "Kiosk screens" }] },
      { type: "image", img: "13764:4244", w: 1312, h: 700, alt: "Gnie PWA screens", label: "PWA screens" },
    ] },
    { blocks: [
      { type: "head", label: "The Outcome", num: "005", title: "What the booth delivered - <i class=\"g\">Elevating Gapblue’s Presence at Gitex 2024</i>", sub: ["Five kiosks. Five days. Zero downtime. The PWA ran fully offline - capturing leads and distributing rewards from Day 1 through Futuristic Friday without a single failure.", "By Day 3, Gapblue reported <b>\"Fast gaining momentum, with increased footfalls\"</b> and introductions to <b>\"Various industry leaders.\"</b> The scratch-and-win mechanic was the hook that made people stop."] },
      { type: "stats", grid: true, items: [
        { big: "<i class=\"g\">50</i>", label: "Companies partnered up with Gnie Studio 3.0 for innovative technology and digital solutions." },
        { big: "<i class=\"g\">764</i>", label: "Customers enrolled their data in this process to discover more about Gnie's optimized solutions." },
        { big: "<i class=\"g\">7</i>", label: "AI companies tied up with Gapblue for their core technology." },
        { big: "<i class=\"g\">20</i><small>+</small>", label: "Countries companies participated and engaged in this project." },
      ] },
      { type: "image", img: "13764:4268", w: 1312, h: 700, alt: "Gapblue booth at GITEX 2024", label: "Booth photo" },
      { type: "callout", tone: "solid", deco: "13764:4274", title: "Outcome", body: "Gapblue and Gnie Studio are fast gaining momentum, with increased footfalls at our booth. The day has offered us great opportunities for networking and collaboration, providing us with the valuable chance to introduce Gnie Studio and its unique features to various industry leaders.\"", quote: "◦ Gapblue Software Labs, LinkedIn — Day 3, GITEX Global 2024" },
    ] },
  ],
};

const JAIN = {
  slug: "jain-connect", theme: "jain", prev: LINKS.gnie, next: LINKS.cna,
  title: "Jain Connect · Senthil Devaraj",
  description: "Jain Connect — one dashboard for every level of sales at Jain Irrigation Systems.",
  hero: { type: "hero", tag: "<em>Jain Irrigation Systems</em> • Agri - Sales Enablement • Mobile APP", title: "Jain Connect - <em>One dashboard for every level of sales.</em>" },
  stage: { type: "stage", img: "13779:1685", alt: "Jain Connect dashboard", meta: [["Client", "Jain Irrigation Systems - (Jain Dealer Connect JDC)"], ["Industry", "Agri - Sales Enablement"], ["Role", "UX Research · End to End Product Designer"], ["Target Audience", "Employee Sales Dealers"]], intro: "Redesigning how Jain Irrigation's sales team <span class=\"hl\">sees its own numbers -</span> Pending and Delivered Orders, Monthly Targets and Account Balances - across 8 product categories and a 5 level management hierarchy." },
  sections: [
    { blocks: [
      { type: "head", label: "The Setup", num: "001", title: "A new brief: The dashboard <em>behind the dealer network.</em>", sub: ["With the customer-facing showcasing app shipped, the client came back with a very different brief: an <b>Admin-and-Dealer application</b> built entirely around hierarchy, salesperson data and managerial activity.", "A salesperson needed to raise a new order, manage it through to delivery, and track the financials behind it - while every level above them saw the orders, payments and targets relevant to their role."] },
      { type: "stats", items: [
        { big: "<em>8</em>", label: "Drip Irrigation · Sprinkler · Solar · Tissue Culture · PVC · Food Processing · Renewable Energy &amp; more", src: "Product categories in one comparison view" },
        { big: "<em>5</em>", label: "Aggregated reports down to individual performance (Sales, targets, performance)", src: "Management levels, top to salesperson" },
        { big: "<em>1</em><small>st</small>", label: "Extra attention went into usability, and it pushed me to think in more directions towards solutions.", src: "My first dashboard project" },
      ] },
    ] },
    { raw: { type: "image", img: "13779:1726", w: 1440, h: 250, bleed: true, alt: "", label: "Banner" } },
    { blocks: [{ type: "callout", title: "UX Strategy &amp; Methodology", body: "I ran structured interviews across two hierarchy levels, mapped the existing data model by hand, and validated each design decision against a real sales scenario before building it.", chips: ["Stakeholder Interviews", "Data Modeling", "Hierarchy Mapping"] }] },
    { blocks: [
      { type: "head", label: "The problem", num: "002", title: "The old system was <em>too simple to be useful.</em>", sub: "Across conversations with Salespersons and managers, one thing kept surfacing - the system held all the data, but gave nobody a way to act on it. Listing the pains as we understood them from the field:" },
      { type: "points", heading: "Reframed as user problems", small: true, items: [
        { title: "No order categorisation", text: "Pending and dispatched orders shown as one flat list, with no way to filter across 8 product categories." },
        { title: "Categories that didn't compare", text: "Each product category tracked on a different scale — comparing performance across them meant manual cross-referencing." },
        { title: "One dashboard, five roles", text: "The same screen served sales persons, regional managers and top management, with no way to see only what a role actually needed." },
        { title: "Account status buried", text: "Outstanding amounts and balances lived outside the daily order flow, so sales persons had no early warning on dues." },
        { title: "No target-vs-actual view", text: "Sales targets and achieved numbers sat in separate reports, with no simple way to see how far off the target you were." },
        { title: "Built for a desk, used on the move", text: "Dealers needed this in the field, but the existing system assumed a browser and a desk." },
      ] },
      { type: "html", html: `<p class="cs-points-head" style="border:0;padding:0;margin-bottom:-24px">What Jain Connect does</p>` },
      { type: "principles", tone: "card", items: [
        { title: "Raise, Manage and Track Orders", text: "A salesperson creates an order, follows it through dispatch, and tracks the truck and its financials." },
        { title: "Analyse Sales and Targets", text: "Achieved sales against monthly targets - for an individual and at every hierarchy level." },
        { title: "Hierarchy - level Management", text: "Five levels, one system - each role sees the depth of data it actually needs." },
      ] },
      { type: "callout", tone: "solid", title: "Aha Moment !", body: "<b>Both Rajeev and Sunil were drowning in the same flat data.</b> The fix wasn't more numbers — it was shaping the data to whoever was looking. Aggregate at the top, detail at the bottom, and let the login decide the view. That single insight set the direction for everything that followed." },
    ] },
    { blocks: [
      { type: "head", label: "Our research", title: "<em>How we got here</em>", sub: "Before designing anything, we grounded the brief in how the sales team actually works — talking to the people who live in this data every day." },
      { type: "stats", items: [
        { big: "<em>3</em>", label: "Connected virtually with salespeople the client arranged - hearing how orders and targets really move on the ground.", src: "Salesperson interviews" },
        { big: "<em>2</em>", label: "Admin (behind the customer view) and dealer - one system serving very different needs and permissions.", src: "Sides to design for" },
        { big: img("13779:1857", { w: 48, h: 48, alt: "", label: "◎", style: "width:48px;height:48px" }), label: "Studied comparable admin and dealer apps to borrow patterns worth keeping and spot gaps worth fixing.", src: "Competitor scan" },
      ] },
      { type: "html", html: `<p class="cs-points-head" style="border:0;padding:0;margin-bottom:-24px">Who felt it — two ends of the hierarchy</p>` },
      { type: "personas", tint: true, items: [
        { img: "13779:1869", name: "Rajeev", age: "Regional Manager · Age 40", traits: ["Organized", "Thinker", "Introvert"], lists: [["Goals", ["Consistently hit sales targets and exceed quotas.", "Develop and manage a high-performing sales team."]], ["Pain points", ["No hierarchy structure across order sales and performance metrics.", "Managing complex sales cycles with many order statistics."]], ["Behaviours", ["Regularly reviews sales data and performance metrics.", "Proactively identifies and addresses customer concerns."]]] },
        { img: "13779:1897", name: "Sunil", age: "Sales Person · Age 29", traits: ["Overloaded work", "Reactive", "Field-first", "Persistent"], lists: [["Goals", ["Finally hit this month's target after falling short.", "Know which orders and categories to chase first."]], ["Pain points", ["Trailing target with no clear view of the gap left to close.", "Loses track of pending vs. dispatched orders and outstanding payments."]], ["Behaviours", ["Works mostly from mobile, out in the field.", "Reacts to whatever is urgent instead of planning ahead."]]] },
      ] },
    ] },
    { blocks: [
      { type: "head", label: "The Process", num: "003", title: "From flat data to <em>3 design decisions.</em>", sub: "We took the pain points from the interviews and the data-driven findings from the research and converted each one into a concrete design decision. Working closely with my senior and the client, I mapped every metric the sales team relied on, then tested where it belonged in the hierarchy — three decisions did most of the heavy lifting." },
      { type: "steps", items: [
        { title: "Map the metrics", text: "Listed every number each role needs, across all eight categories." },
        { title: "Shape by hierarchy", text: "Decided what each of the five levels should see, and at what depth." },
        { title: "Design &amp; iterate", text: "Built one reusable frame so categories stay comparable at a glance." },
        { title: "Refine post-launch", text: "Folded real client and sales-team feedback into three revisions." },
      ] },
    ] },
    { blocks: [
      { type: "head", label: "The design language" },
      { type: "styleguide", label: "Colours & typeface — rebuilding as live text", ratio: "1312/514" },
      { type: "styleguide", label: "UI components — rebuilding as live text", ratio: "1312/640" },
    ] },
    { blocks: [
      { type: "head", label: "The Solution", num: "004", title: "Detailed tracking, <em>Shaped by hierarchy.</em>", sub: "One dashboard covering orders, financials and targets - where the same system reshapes itself for every login, from a Zonal Head's overview down to a single Sales Executive's day." },
      { type: "principles", tone: "card", items: [
        { title: "<em>5 levels,</em> <b>one source of truth</b>", text: "Login decides scope — aggregate at the top, a person's own orders and targets at the bottom." },
        { title: "8 categories, <b>only one frame</b>", text: "Mismatched category data made comparable — switch the tab, keep the same analytics layout." },
        { title: "Target vs achieved, <b>at a glance</b>", text: "Over- and under-achievement read instantly, with a per-category breakdown in crores." },
      ] },
    ] },
    { raw: { type: "masonry", cols: [
      [["13779:2204", 1925, "Home — hierarchy view"], ["13779:2205", 660, "Account balance"]],
      [["13779:2207", 902, "Sales by customer type"], ["13779:2208", 514, "Add profile details"], ["13779:2209", 449, "Account balance"], ["13779:2210", 354, "Add profile details"]],
      [["13779:2212", 509, "Salesperson profile"], ["13779:2213", 600, "Videos home"], ["13779:2214", 751, "Open orders"], ["13779:2215", 514, "Onboarding"]],
      [["13779:2217", 364, "Dialog"], ["13779:2218", 669, "3 years data"], ["13779:2219", 534, "Product detail — PVC ball valves"], ["13779:2220", 514, "Design calculator"], ["13779:2221", 514, "Design calculator"]],
      [["13779:2223", 514, "Log in"], ["13779:2224", 201, "Dialog"], ["13779:2225", 514, "Drip irrigation"], ["13779:2226", 514, "Onboarding"], ["13779:2227", 449, "Account balance"]],
    ] } },
    { blocks: [
      { type: "image", img: "13779:2230", w: 1280, h: 760, radius: true, alt: "Jain Connect web dashboard", label: "Dashboard" },
      { type: "pair", items: [{ img: "13779:2232", w: 620, h: 620, alt: "Jain Connect app detail", label: "App detail" }, { img: "13779:2233", w: 620, h: 620, alt: "Jain Connect app detail", label: "App detail" }] },
    ] },
    { blocks: [
      { type: "head", label: "The Outcome", num: "005", title: "One dashboard, five levels, <em>decisions in a glance.</em>" },
      { type: "points", small: true, items: [
        { kicker: "take away", text: "A real understanding of hierarchy-level design - modelling how the same data should change shape as it moves up and down an organisation." },
        { kicker: "take away", text: "My first time handling the admin app - the layer behind the customer view - and designing for permissions, not just screens." },
        { kicker: "shipped as", text: "Detailed tracking of pending and dispatched orders with truck tracking, segmented across all 8 product categories." },
        { kicker: "shipped as", text: "Login-based visibility - higher managers see orders, payments and targets across every location; a salesperson sees only their own." },
      ] },
      { type: "callout", tone: "solid", deco: "13779:2462", title: "What I learned", body: "As my <b>1st dashboard Project</b> - and my first admin app behind a customer-facing product - this project reshaped how I think about presenting data. <b>I learned to design around hierarchy</b> and <b>login-based permissions</b>, and to <b>structure complex</b>, mismatched data into something a busy salesperson can actually read and act on.", quote: "\"The best dashboards don't show more — they show less, to the right person.\"" },
    ] },
  ],
};

export const CASES = [CNA, OUTGROW, GNIE, JAIN];

export function caseStudies() {
  return CASES.map((c) => ({
    file: c.slug + ".html",
    title: c.title,
    description: c.description,
    active: "work",
    body: `<main id="main" class="cs theme-${c.theme}">
${H.hero(c.hero)}
${H.stage(c.stage)}
${c.sections.map((s) => (s.raw ? `<div data-reveal>${block(s.raw)}</div>` : s.band ? band(s) : section(s))).join("\n")}
${pager(c.prev, c.next)}
</main>`,
  }));
}
