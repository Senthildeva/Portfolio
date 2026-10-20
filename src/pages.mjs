import { img, icon, esc } from "./lib.mjs";

/* ---------- shared data ---------- */
// Logo strip, in Figma order (Landing page "Frame 2147225919"). parts = one or more exported layers.
export const LOGOS = [
  { name: "SBI YONO", parts: [["14086:9781", 150, 40]] },
  { name: "Amazon", parts: [["14086:9782", 107, 36]] },
  { name: "Flipkart", parts: [["14086:9783", 167, 44]] },
  { name: "CNA", parts: [["14086:9853", 108, 36]] },
  { name: "Melisten", parts: [["14086:9862", 106, 36]] },
  { name: "Outgrow", parts: [["14086:9872", 54, 50]] },
  { name: "Jain Irrigation", parts: [["14086:9887", 111, 36]] },
  { name: "mewatch", parts: [["14086:9927", 114, 36]] },
  { name: "Gapblue", parts: [["14086:9938", 150, 36]] },
  { name: "iQuanti", parts: [["14086:9939", 125, 24]] },
  { name: "Jain Farm Fresh", parts: [["14086:9954", 95, 55]] },
  { name: "WayCool", parts: [["14086:9955", 131, 36]] },
  { name: "Taqanal", parts: [["14086:9967", 133, 36]] },
  { name: "Aemco", parts: [["14086:9968", 107, 24]] },
  { name: "Rustic AI", parts: [["14086:9974", 145, 28]] },
  { name: "Rustic Charm", parts: [["14086:9992", 154, 44]] },
  { name: "Danburite", parts: [["14086:9994", 33, 44], ["14086:9995", 110, 28]] },
  { name: "Tenanto", parts: [["14086:9996", 119, 28]] },
];

// Clientele grid (Clientele "Frame 2147225949").
const BRANDS = [
  { name: "SBI", tag: "BFSI", parts: [["14102:6834", 150, 40]] },
  { name: "Amazon", tag: "E-Commerce", parts: [["14102:6837", 119, 40]] },
  { name: "Flipkart", tag: "E-Commerce", parts: [["14102:6840", 190, 50]] },
  { name: "CNA", tag: "Media & OTT", parts: [["14102:6912", 120, 40]] },
  { name: "Melisten", tag: "Media & Entertainment", parts: [["14102:6923", 133, 45]] },
  { name: "Outgrow", tag: "Agri-tech", parts: [["14102:6935", 86, 80]] },
  { name: "Jain Irrigation", tag: "Agriculture", parts: [["14102:6952", 154, 50]] },
  { name: "mewatch", tag: "Media & OTT", parts: [["14102:6994", 142, 45]] },
  { name: "Gapblue", tag: "Generative AI Solutions", parts: [["14102:7007", 167, 40]] },
  { name: "iQuanti", tag: "Digital marketing services", parts: [["14102:7010", 156, 30]] },
  { name: "Jain Farm Fresh", tag: "Agriculture", parts: [["14102:7027", 139, 80]] },
  { name: "WayCool", tag: "Agri-tech", parts: [["14102:7030", 163, 45]] },
  { name: "Taqanal", tag: "EV Mobility", parts: [["14102:7045", 165, 45]] },
  { name: "Aemco", tag: "E-Commerce", parts: [["14102:7047", 124, 28]] },
  { name: "Rustic AI", tag: "Generative AI", parts: [["14102:7055", 165, 32]] },
  { name: "Rustic Charm", tag: "E-Commerce", parts: [["14102:7075", 192, 55]] },
  { name: "Danburite", tag: "Business consulting", parts: [["14102:7079", 41, 55], ["14102:7080", 138, 35]] },
  { name: "Tenanto", tag: "Property technology", parts: [["14102:7083", 149, 35]] },
];

export const PROJECTS = {
  sbiYb: { soon: true, c: "#673391", tag: "STATE BANK OF INDIA - YB Web", meta: "Corporate BANKING • Customer Website", title: "Coming Soon...", imgId: "I13934:1402;13934:1360" },
  cna: { href: "cna.html", c: "#b71c1c", tag: "CNA - Mediacorp", meta: "Media & Entertainment • APPLE TV", title: "<em>Reimagining CNA</em> - Newsroom to living room.", imgId: "I14086:10015;13934:1360", name: "CNA" },
  outgrow: { href: "outgrow.html", c: "#22914f", tag: "OUTGROW (Waycool Labs)", meta: "Agritech • Mobile APP", title: "The <em>One-Stop Solution</em> for Farmers", imgId: "I14086:10016;13934:1360", name: "Outgrow (Waycool labs)" },
  gnie: { href: "gnie.html", c: "linear-gradient(168deg,#8449e4 11%,#1967d2 93%)", tag: "GNIE (Gapblue)", meta: "Generative AI Solutions • Progressive Web App", title: 'Designing a Gamified PWA for <span class="grad">GITEX 2024</span>', imgId: "I14086:10017;13934:1360", name: "Gnie (Gapblue)" },
  jain: { href: "jain-connect.html", c: "#1479ff", tag: "JDC - Jain Irrigation Systems", meta: "Agri - Sales Enablement • Mobile APP", title: "<em>One dashboard</em> for every level of sales", imgId: "I14086:10018;13934:1360", name: "Jain Connect" },
  sbiYbbi: { soon: true, c: "#673391", tag: "STATE BANK OF INDIA - YBBI Web", meta: "Corporate BANKING • Branch Interface Website", title: "Coming Soon...", imgId: "I13934:3531;13934:1360" },
};

/* ---------- partials ---------- */
const logoParts = (parts, alt) =>
  parts.map(([id, w, h], i) => img(id, { w, h, alt: i === 0 ? alt : "", label: i === 0 ? alt : "", style: `width:${w}px;height:${h}px` })).join("");

export function ticker(groupHtml, { cls = "", speed = 40, label = "" } = {}) {
  return `<div class="ticker ${cls}" style="--speed:${speed}s"${label ? ` role="region" aria-label="${esc(label)}"` : ""}>
  <div class="ticker-track"><div class="ticker-group">${groupHtml}</div><div class="ticker-group" aria-hidden="true">${groupHtml.replace(/ alt="[^"]*"/g, ' alt=""')}</div></div>
</div>`;
}

export const logoStrip = () =>
  ticker(LOGOS.map((l) => `<div class="logo-item" title="${esc(l.name)}">${logoParts(l.parts, l.name)}</div>`).join(""), { cls: "logos", speed: 55, label: "Brands I've designed for" });

const arrow = () => icon("arrow-right");

export function card(p) {
  const tagStyle = p.c.startsWith("linear") ? `background:${p.c}` : `--c:${p.c}`;
  const inner = `<div class="card-media">${img(p.imgId, { w: 612, h: 300, alt: p.soon ? "" : `${p.name} case study cover`, label: p.tag })}</div>
  <div class="card-tags"><span class="tag" style="${tagStyle}">${esc(p.tag)}</span><span class="tag tag-line">${esc(p.meta)}</span></div>
  <h3 class="card-title" style="--c:${p.c.startsWith("linear") ? "#4f46e5" : p.c}">${p.title}</h3>`;
  if (p.soon) return `<article class="card soon" aria-label="${esc(p.tag)}, coming soon">${inner}</article>`;
  return `<a class="card" href="${p.href}" data-reveal>${inner}
  <span class="btn btn-lg">View Project ${arrow()}</span></a>`;
}

const heroFacts = ["4+ years of Design", "Engineering Mindset × Design Thinking", "Balancing user needs and business reality", "Learning where AI fits in design", "Design Systems at Scale"];
const skillsA = ["User Research & Discovery", "UX Strategy", "Product thinking", "Complex B2B SaaS", "Business Analysis", "Creative tech"];
const skillsB = ["Complex workflow design", "Interaction design", "Rapid prototyping", "Design systems", "Human-AI Interaction", "Enterprise Scale"];
const sparkle = () => img("14095:10393", { w: 24, h: 24, alt: "", label: "✦", cls: "sparkle" });
const skillGroup = (list) => list.map((s) => `<span>${esc(s)}</span>${sparkle()}`).join("");

/* ---------- Landing ---------- */
export function landing() {
  return `<main id="main">
  <section class="wrap hero" aria-labelledby="hero-title">
    <p class="eyebrow">Product designer  •  BORN XDS (An Tech Mahindra Company)  •  Chennai</p>
    <h1 class="display" id="hero-title">Engineer by Background. <span class="accent">Designer by Curiosity.</span></h1>
    <p class="lead">Engineer turned product designer based in Chennai. Over 4+ years, I’ve designed banking, media, e-commerce, and AI products used by millions</p>
    <div class="btn-row">
      <a class="btn btn-dark" href="about.html">About me</a>
      <a class="btn btn-line" href="work.html">Explore my Works</a>
    </div>
  </section>

  <div class="wrap">${ticker(heroFacts.map((f) => `<span class="facts">${esc(f)}</span><span class="facts sep" aria-hidden="true">|</span>`).join(""), { speed: 45, label: "Highlights" })}</div>

  <section class="wrap stack-xl" aria-label="Featured work and clients">
    <a class="media hero-media" href="cna.html" aria-label="Open the CNA case study" data-reveal>${img("14086:9778", { w: 1312, h: 700, alt: "CNA newsroom", eager: true, label: "Hero image · CNA" })}</a>
    ${logoStrip()}
  </section>

  <section class="wrap statement" aria-labelledby="one-thing" data-reveal>
    <p class="label" id="one-thing">one thing that people know about me</p>
    <div class="statement-body">
      <p><strong>I love clearing up chaos.</strong>I design, I research, I overthink (usefully). Systems thinking helps me understand the mess, storytelling helps me make sense of it, and design helps me turn it into something people can actually use.</p>
      <div class="sticker">${img("14102:1918", { w: 225, h: 110, alt: "Positive minded sticker", label: "Positive minded" })}</div>
    </div>
  </section>

  <section class="wrap work" aria-labelledby="cs-title">
    <div class="section-head">
      <h2 class="h2" id="cs-title">Case Studies</h2>
      <p class="sub">Each project, each different constraint - here's how I solved it.</p>
    </div>
    <div class="cards">
      ${[PROJECTS.cna, PROJECTS.outgrow, PROJECTS.gnie, PROJECTS.jain].map(card).join("\n      ")}
    </div>
    <a class="btn btn-lg btn-outline-dark view-all" href="work.html">View all Projects ${arrow()}</a>
  </section>

  <section class="skills" aria-labelledby="good-at" data-reveal>
    <p class="label wrap" id="good-at">What I’m Good at</p>
    <div class="skills-rows">
      ${ticker(skillGroup(skillsA), { cls: "skill-row", speed: 50 })}
      ${ticker(skillGroup(skillsB), { cls: "skill-row reverse", speed: 55 })}
    </div>
    <p class="exploring wrap">Currently exploring: AI-assisted product development and agentic workflows.</p>
  </section>
</main>`;
}

/* ---------- About ---------- */
const XP = [
  { when: "June 2026 - Present", current: true, co: "BORN XDS (A Tech Mahindra company)", role: "Associate UX Designer | Product Designer" },
  { when: "Jun 23 - Jul 25", co: "Mikado UX/UI & Branding Studio", role: "Product Designer" },
  { when: "May 22 - Jun 23", co: "Pebels - Digital Experience Studio", role: "Junior Product Designer" },
];
const EXPERTISE = [
  ["Design", ["Product Design", "User Research", "UX Design", "Interaction Design", "Design Systems", "User Centric", "Business Lens", "UI Design", "Prototyping"]],
  ["Expertise", ["BFSI", "OTT Platforms", "E-commerce", "Agri-tech", "Media & Entertainment", "Enterprise SaaS", "EV - Mobility", "Generative AI", "Consulting, Marketing"]],
  ["Tools", ["Figma", "Adobe Illustrator", "Adobe Photoshop", "Framer", "Claude AI", "Lovable AI", "ChatGPT"]],
  ["Currently exploring", ["AI-Augmented Design", "Fintech", "Design Leadership", "Claude Entire Suite", "Agentic AI"]],
];
const OFF_CLOCK = ["14218:10264", "14218:10265", "14218:10266", "14218:10267", "14218:10268", "14218:10269"];

export function about(SITE) {
  const B = (t) => `<b>${t}</b>`;
  return `<main id="main">
  <section class="wrap hero" aria-labelledby="about-title">
    <p class="eyebrow">Product DESIGNER</p>
    <div>
      <h1 class="display" id="about-title">Hey, I’m Senthil Devaraj <span aria-hidden="true" style="font-size:.7em">👋🏻</span></h1>
      <div class="rotator" aria-label="Product Designer by Curiosity, Engineer by background, UX Researcher by Data and instinct, Builder by habit">
        <ul aria-hidden="true"><li>— Product Designer by Curiosity</li><li>— Engineer by background.</li><li>— UX Researcher by Data &amp; instinct.</li><li>— Builder by habit.</li></ul>
      </div>
    </div>
    <p class="lead">Engineer turned product designer based in Chennai. Over 4+ years, I’ve designed Banking, Media &amp; Entertainment, Enterprises UX, Agri-tech, E-commerce, and AI products used by millions</p>
    <p class="lead">Currently at <strong>BORN XDS (An Tech Mahindra Company)</strong></p>
    <div class="btn-row">
      <a class="btn btn-dark" href="${SITE.resume}" target="_blank" rel="noopener">Download Resume</a>
      <a class="btn btn-line" href="${SITE.linkedin}" target="_blank" rel="noopener" aria-label="Connect on LinkedIn">Connect on ${img("14169:8963", { w: 63, h: 16, alt: "LinkedIn", label: "LinkedIn", cls: "li-mark", style: "width:63px;height:16px" })}</a>
    </div>
  </section>

  <div class="wrap"><div class="media about-hero-media" data-reveal>${img("14199:9930", { w: 1312, h: 700, alt: "Senthil — the AI enthusiast, the problem-solver, the curious one", label: "About collage" })}</div></div>

  <section class="wrap" aria-labelledby="about-me" data-reveal>
    <div class="section-head label-first" style="gap:40px">
      <p class="label" id="about-me">About Me</p>
      <div class="prose-xl">
        <p>I’ve always been someone who wants to understand ${B("why")} before figuring out how.</p>
        <p>My engineering background taught me to look at problems through ${B("logic")}, ${B("systems")}, ${B("cause")} and ${B("effect")}. Design gave me another lens — ${B("people")}, ${B("behaviour")}, ${B("context")}, and ${B("creativity")}. Somewhere between these two is how I approach UX.</p>
        <p>I like getting beneath the surface of a problem: understanding who is affected, what makes their experience difficult, what the evidence tells us, and what a meaningful solution could look like.</p>
        <p>For me, UX isn’t something that begins with a screen. It’s a way of looking at the world — noticing friction, questioning the things we take for granted, understanding why they happen, and imagining how they could work better.</p>
        <p>${B("That’s how I think. That’s how I design.")}</p>
      </div>
    </div>
  </section>

  <section class="wrap" aria-labelledby="xp-title" data-reveal>
    <div class="section-head label-first">
      <p class="label">Experience</p>
      <h2 class="h2" id="xp-title">The places that shaped the designer I am today</h2>
    </div>
    <div class="timeline" style="margin-top:40px">
      <div class="tl-rail" aria-hidden="true"></div>
      <ol class="tl-list" style="list-style:none;margin:0;padding:0">
        ${XP.map((x) => `<li class="tl-item${x.current ? " current" : ""}">
          <div class="tl-when"><span>${esc(x.when)}</span>${x.current ? '<span class="badge-current">CURRENT</span>' : ""}</div>
          <div class="tl-what"><h3>${esc(x.co)}</h3><p class="role">${esc(x.role)}</p><p class="note todo">Role summary coming soon.</p></div>
        </li>`).join("\n        ")}
      </ol>
    </div>
  </section>

  <section class="band" aria-labelledby="exp-title">
    <div class="wrap" data-reveal>
      <div class="section-head label-first">
        <p class="label">EXPERTISE</p>
        <h2 class="h2" id="exp-title">What I bring to a team</h2>
      </div>
      <div class="xp-grid">
        ${EXPERTISE.map(([t, chips]) => `<div class="xp-card"><h3>${esc(t)}</h3><div class="chips">${chips.map((c) => `<span class="chip">${esc(c)}</span>`).join("")}</div></div>`).join("\n        ")}
      </div>
    </div>
  </section>

  <section aria-labelledby="off-title" data-reveal>
    <div class="wrap head-row">
      <div class="section-head label-first">
        <p class="label">Off the clock</p>
        <h2 class="h2" id="off-title">When I’m not designing</h2>
      </div>
      <div class="gallery-nav"><button type="button" data-gallery-prev="off" aria-label="Previous photos">${icon("arrow-left")}</button><button type="button" data-gallery-next="off" aria-label="Next photos">${icon("arrow-right")}</button></div>
    </div>
    <div class="gallery" data-gallery="off" style="margin-top:40px;padding-left:max(var(--gutter),calc((100vw - var(--wrap)) / 2))" tabindex="0" aria-label="Photos from outside work">
      <div class="gallery-track">${OFF_CLOCK.map((id, i) => `<figure>${img(id, { w: 400, h: 500, alt: `Off the clock photo ${i + 1}`, label: `Photo ${i + 1}` })}</figure>`).join("")}</div>
    </div>
  </section>
</main>`;
}

/* ---------- My Works ---------- */
export function work() {
  const order = [PROJECTS.sbiYb, PROJECTS.cna, PROJECTS.outgrow, PROJECTS.gnie, PROJECTS.jain, PROJECTS.sbiYbbi];
  return `<main id="main">
  <section class="wrap hero" aria-labelledby="work-title">
    <p class="eyebrow">CASE STUDIES · 2020 - 2026</p>
    <h1 class="display" id="work-title">Solving complex problems under real business constraints.</h1>
    <p class="lead">Meaningful work happens where constraints, people, and purpose intersect. These case studies represent my work solving complex challenges, making deliberate decisions, and delivering measurable impact.</p>
  </section>

  <section class="wrap" aria-labelledby="trusted" style="display:flex;flex-direction:column;gap:40px">
    <p class="label" id="trusted" style="color:var(--ink);font-weight:800">Trusted by global brands</p>
    <div style="border-block:1px solid var(--line);padding-block:40px">${logoStrip()}</div>
  </section>

  <section class="wrap work" aria-labelledby="cs-title">
    <div class="section-head">
      <h2 class="h2" id="cs-title">Case Studies</h2>
      <p class="sub">Each project, each different constraint - here's how I solved it.</p>
    </div>
    <div class="cards">
      ${order.map(card).join("\n      ")}
    </div>
  </section>
</main>`;
}

/* ---------- Clientele ---------- */
const SECTORS = [["landmark", "BFSI"], ["tv", "OTT Platforms"], ["shopping-bag", "E-commerce"], ["clapperboard", "Media & Entertainment"], ["building-2", "Enterprise SaaS"], ["tractor", "Agri-tech"], ["plug-zap", "EV - Mobility"], ["sparkle", "Generative AI"], ["briefcase-business", "Consulting, Marketing"]];

export function clientele() {
  return `<main id="main">
  <section class="wrap hero" aria-labelledby="cl-title">
    <p class="eyebrow">Trusted by global brands</p>
    <h1 class="display" id="cl-title">Clients across industries, One way of working.</h1>
    <p class="lead" style="max-width:1000px">Over 4+ years, I've designed for BFSI, Media &amp; OTT, Agri-tech, E-commerce, Generative AI, and Enterprise SaaS - different domains, same focus on solving the actual problem.</p>
  </section>

  <section class="wrap" aria-label="At a glance">
    <dl class="stats" style="margin:0">
      <div class="stat"><dt>Role</dt><dd>Product Designer</dd></div>
      <div class="stat"><dt>Experience</dt><dd>4+ YEARS OF DESIGN</dd></div>
      <div class="stat"><dt>Clients</dt><dd>20+ BRANDS</dd></div>
    </dl>
  </section>

  <section class="wrap" aria-label="Brands">
    <ul class="brand-grid" style="list-style:none;margin:0;padding:0">
      ${BRANDS.map((b) => `<li class="brand" data-reveal><div class="brand-logo">${logoParts(b.parts, b.name)}</div><p class="brand-tag">${esc(b.tag)}</p></li>`).join("\n      ")}
    </ul>
  </section>

  <section class="wrap" aria-labelledby="sec-title" data-reveal>
    <div class="sectors">
      <h2 class="h2" id="sec-title">Industries and Sectors</h2>
      <ul class="pills" style="list-style:none;margin:0;padding:0">${SECTORS.map(([i, t]) => `<li class="pill">${icon(i)}${esc(t)}</li>`).join("")}</ul>
    </div>
  </section>

  <section class="wrap" aria-labelledby="say-title" data-reveal>
    <h2 class="h2" id="say-title" style="margin-bottom:40px">What people say...</h2>
    <div class="quotes">
      <figure class="quote" style="margin:0">
        <figcaption class="quote-head">
          <div class="quote-who"><span class="avatar">${img("13840:3996", { w: 40, h: 40, alt: "", label: "SV" })}</span><b>Sahil Verma</b></div>
          <div class="quote-meta"><span>Associate Manager - Marketing</span>${img("13840:4001", { w: 83, h: 16, alt: "iQuanti", label: "iQuanti", style: "width:83px;height:16px" })}</div>
        </figcaption>
        <blockquote>I had the pleasure of working with Senthil, and it was an incredibly positive experience. He <b>brings a creative and thoughtful approach</b> to everything he does whether it's designing visuals, developing creatives, or enhancing user experiences. Senthil consistently demonstrates a <b>proactive attitude</b> and is always willing to lend a helping hand. His <b>collaborative spirit</b> and creative mindset make him a <b>valuable asset to any team.</b></blockquote>
      </figure>
      <figure class="quote" style="margin:0">
        <figcaption class="quote-head" style="--qbg:linear-gradient(90deg,#f6f0ff,#efe9ff)">
          <div class="quote-who"><span class="avatar">${img("13873:8230", { w: 40, h: 40, alt: "", label: "SV" })}</span><b>Shashwat Verma</b></div>
          <div class="quote-meta"><span>AI Agents | Adtech@Glance AI | 1x-Founder</span>${img("13873:8235", { w: 83, h: 16, alt: "Rustic AI", label: "Rustic AI", style: "width:83px;height:16px" })}</div>
        </figcaption>
        <blockquote>Senthil is a diligent, sincere and fun to work with. He <b>conducts deep competitor research, understands user journeys deeply</b> and structures his work systematically so that it is quick to iterate. I most appreciate his <b>work ethic</b> and would recommend him for any full-time, or freelancing work. He can be trusted with the task!</blockquote>
      </figure>
    </div>
  </section>
</main>`;
}
