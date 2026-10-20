# senthildevaraj.co.in

Portfolio of Senthil Devaraj, product designer. Built from the "Portfolio Works" Figma file.

## How it's put together

- `src/` — page templates, styles and scripts. `src/build.mjs` generates every page into `dist/`.
  - `pages.mjs` — Landing, About, My Works, Clientele
  - `cases.mjs` — the case studies (one content block per study)
  - `layout.mjs` — nav, footer, contact panel, splash screen
- `public/` — fonts, images (`public/assets`, named by Figma layer id), resume
- `api/contact.js` — contact form: emails the message to Senthil and sends the sender an auto-reply (via Resend)
- `tools/ingest.py` — imports a Figma export into `public/assets`

## Run locally

```
npm install
npm run build      # writes dist/
```

## Deploy

Vercel builds every push to `main` (`npm run build`, output `dist/`).

Contact form environment variables (Vercel → Settings → Environment Variables):

- `RESEND_API_KEY` — Resend API key
- `CONTACT_TO` — inbox for messages (default senthildevaraj1998@gmail.com)
- `CONTACT_FROM` — verified sender, e.g. `Senthil Devaraj <hello@senthildevaraj.co.in>`

## Fonts

Proxima Nova and Avenir are commercial typefaces; their use on the public site requires a web licence held by the site owner. Caveat is open source (SIL OFL).
