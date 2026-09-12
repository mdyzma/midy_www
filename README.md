# Michal Dyzma — personal website

A personal portfolio and engineering blog with static HTML, SPA-style navigation, and a contact form.

## Stack

- **Astro 7** — static site generation, `astro:content` collections, and `ClientRouter` navigation.
- **Tailwind CSS v4** — via `@tailwindcss/vite`, with theme tokens in [`src/styles/global.css`](src/styles/global.css).
- **React** — only the interactive [`ContactForm`](src/components/ContactForm.tsx) island (`client:load`). Navigation, archive filters, and the typewriter use small vanilla TypeScript custom elements.
- **TypeScript** — strict mode. TypeScript 6 is pinned because the installed Astro checker requires its programmatic API.
- **Cloudflare Pages Function** — [`functions/api/contact.ts`](functions/api/contact.ts) is the only request-time server code. It receives the form submission and sends email through [Resend](https://resend.com/docs/api-reference/emails/send-email).
- **Lucide Icons** — `@lucide/astro` renders SVG icons in headers, cards, links, and buttons at build time. The form receives its send icon as an Astro-rendered slot. No icon font CDN is needed.
- **Vanilla CSS** — global variables (`--primary`, `--bg-main`), flex/grid layouts, glass panels using `backdrop-filter`, and `fadeIn`/`slideUp` animations with reduced-motion support.
- **Chart.js** — preserves the existing article's illustrative charts, initializing and cleaning up on page navigation.

## Prerequisites

- Node.js **22.12+** (see `engines` in [`package.json`](package.json)).
- npm **10+**.
- A Resend account, verified sender domain, and API key for email delivery.

## Development

```sh
npm ci
npm run dev
```

Astro serves the frontend at `http://localhost:4321`. `npm run dev` and `npm run preview` do not run the Cloudflare contact endpoint. To test the entire application locally, configure `.dev.vars` as described below, then run:

```sh
npm run pages:dev
```

Wrangler serves the built site and Pages Function together at `http://localhost:8788`. Rebuild/restart after editing frontend source.

```sh
npm run check          # Strict Astro and TypeScript checks
npm run build          # Static production output in dist/
npm run pages:build    # Compile the Pages Function without deploying
npm run preview        # Preview static frontend only
npx playwright install chromium
npm test               # Build first; browser and function tests
```

Tests mock email delivery; they never contact Resend. They cover desktop/mobile navigation, history, search, charts, no-JavaScript content, the sole React island, contact retry behavior, validation, origin checks, request limits, and provider errors.

## Content collections

The schema in [`src/content.config.ts`](src/content.config.ts) validates Markdown posts under [`src/content/posts`](src/content/posts). Both the archive and generated article routes read this collection. A post starts with:

```yaml
---
title: A useful engineering note
description: A short summary for cards and search engines.
slug: useful-engineering-note
category: Automation
tags: [Python, Tools]
draft: false
---
```

Write the article below the frontmatter. `draft: true` excludes it from routes and listings. Slugs must be unique. The migrated developer-setup article retains its HTML layout inside Markdown; its original `/blog/posts/dotfiles_automate.html` URL resolves to a generated directory and may gain a trailing slash on static hosts.

| File | Edit here |
| --- | --- |
| `src/components/Hero.astro`, `About.astro` | Introduction and competencies |
| `src/components/Footer.astro` | Contact section and social links |
| `src/data/stack.ts` | Technology names |
| `src/components/Stack.astro` | Technology icons |
| `src/content/posts/developer-setup.md` | Existing article and metadata |
| `src/scripts/article-charts.js` | Illustrative chart data |
| `src/styles/global.css` | Theme tokens, global styling, animations, form layout |
| `src/layouts/Layout.astro` | Metadata and shared page shell |

## Contact form email delivery

1. In Resend, verify a domain you control and create an API key with permission to send email.
2. For local development, copy `.dev.vars.example` to `.dev.vars` and set:
   - `RESEND_API_KEY`: your secret Resend API key.
   - `CONTACT_FROM`: an address on your verified domain, such as `Website <contact@your-domain.com>`.
   - `CONTACT_TO`: the inbox that should receive submissions.
3. In Cloudflare Pages, configure the same bindings for the production environment (and preview environment if needed). Store `RESEND_API_KEY` as an encrypted secret. Redeploy after changing bindings.
4. Use the form on the Wrangler-served site or deployed Pages site to verify real delivery.

`.dev.vars` is ignored by Git. Never prefix these values with `PUBLIC_` or put them in frontend code. The visitor's email becomes `reply_to`; the sender and recipient always come from server configuration.

The endpoint validates same-origin JSON requests and field lengths, bounds the body size, ignores filled honeypots, and uses a Resend idempotency key for retries. It sends plain text and returns generic provider errors. These basic checks do not provide distributed rate limiting; any traffic-based limits should be configured in Cloudflare for the deployed site. Without JavaScript, the email link remains available.

The frontend preserves input on failure and only reports success after the endpoint confirms acceptance. A successful API response means Resend accepted the send request, not that inbox delivery has been confirmed.

## Deployment

Cloudflare Pages build command: `npm run build`. Output directory: `dist`. [`wrangler.jsonc`](wrangler.jsonc) defines the Pages project configuration. The root `functions/` directory must be included in the Pages build/deployment; uploading only `dist` to a generic static host will not enable contact email.

[`public/_routes.json`](public/_routes.json) limits function invocation to `/api/contact`; all other routes remain static. No Astro server adapter or catch-all rewrite is needed. Change `site` in `astro.config.mjs` if the production domain changes.

No deployment or real email delivery has been performed by the migration.

## Original project analysis

The original project had three standalone HTML pages, duplicated navigation/styles, runtime Tailwind CDN scripts, and no build/test setup. Blog search and categories were visual only; six teaser posts linked to `#`. The archive now lists published collection entries only, while the old teasers remain in Git history. The slate/sky design, personal contact links, technology stack, and existing developer-setup article are preserved.
