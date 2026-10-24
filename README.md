# senthildevaraj.co.in

Portfolio of Senthil Devaraj, product designer. Built with [Astro](https://astro.build) from the "Portfolio Works" Figma file (page "↳ Final").

## Where things are

| What | Where |
|---|---|
| Case studies and "coming soon" cards | `src/content/work/*.yaml` — one file per project; the file name is the page address (`cna.yaml` → `/cna`) |
| What a case-study file may contain | `src/content.config.ts` (checked at build time — a typo gives a clear error) |
| Case-study building blocks | `src/components/case-study/` (`head`, `stats`, `callout`, `personas`, `decision`, `styleguide`, `board` …) |
| Pages | `src/pages/` — `index`, `about`, `work`, `clientele`, `[slug]` (case studies), `404` |
| Shared parts | `src/components/` — Nav, Footer, SayHello (contact panel), Splash, Ticker, LogoStrip, ProjectCard, Img, Icon |
| Lists of brands, experience, testimonials | `src/data/` |
| Contact details, navigation | `src/site.ts` |
| Design tokens, fonts, base styles | `src/styles/global.css` (components keep their own CSS next to them) |
| Images from Figma | `src/assets/figma/<layer-id>.webp\|svg` — the build makes responsive sizes |
| Fonts, résumé, videos | `public/` (`public/videos/video-cna.mp4` etc.) |
| Contact form | `api/contact.js` (Vercel Function → Resend) |

## Adding a case study

1. Copy an existing file in `src/content/work/`, rename it (that becomes the URL), set `order` (position on My Works) and `featured` (show on the landing page).
2. Fill in `card`, `seo`, `hero`, `stage` and `sections`. Text can use inline HTML: `<em>` (case colour), `<b>`, `<span class="hl">`, `<i class="g">` (gradient).
3. Images are Figma layer ids (`"13764:3166"`). Give each image layer in Figma an export setting with the suffix `__<layer id>` (e.g. `__13764-3166`), export, then run `npm run ingest -- "<export folder>"`.
4. `npm run build` checks everything; `node tools/check-assets.mjs` lists images still missing.

A project that isn't written yet: `status: soon` and only a `card`.

## Commands

```
npm install
npm run dev          # local preview at http://localhost:4321
npm run build        # writes dist/
npm run ingest -- <Figma export folder or .zip>
node tools/check-assets.mjs
npm run claude-preview   # dist/ → preview/ for the Claude artifact preview
```

Node 24 (Vercel uses the `engines` setting in `package.json`).

## Deploy

Vercel builds every push to `main` (`npm run build`, output `dist/`); other branches get preview deployments. `vercel.json` turns on clean URLs (`/about`).

Contact form environment variables (Vercel → Settings → Environment Variables):

- `RESEND_API_KEY` — Resend API key (sending access)
- `CONTACT_TO` — inbox for messages (default senthildevaraj1998@gmail.com)
- `CONTACT_FROM` — verified sender, e.g. `Senthil Devaraj <hello@senthildevaraj.co.in>`

## Fonts

Proxima Nova and Avenir are commercial typefaces; their use on the public site requires a web licence held by the site owner. Caveat is open source (SIL OFL). The typeface specimens in the case studies use tiny subsets of open-source fonts (`public/fonts/specimen/`).
