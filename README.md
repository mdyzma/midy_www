# Michal Dyzma — personal website

A personal portfolio and Homelab project page with static HTML, SPA-style navigation, and a contact form.

## Stack

- **Astro 7** — static site generation, `astro:content` collections, and `ClientRouter` navigation.
- **Tailwind CSS v4** — via `@tailwindcss/vite`, with theme tokens in [`src/styles/global.css`](src/styles/global.css).
- **React** — only the interactive [`ContactForm`](src/components/ContactForm.tsx) island (`client:load`). Navigation and the typewriter use small vanilla TypeScript custom elements.
- **TypeScript** — strict mode. TypeScript 6 is pinned because the installed Astro checker requires its programmatic API.
- **Cloudflare Pages Function** — [`functions/api/contact.ts`](functions/api/contact.ts) is the only request-time server code. It receives the form submission and sends email through [Resend](https://resend.com/docs/api-reference/emails/send-email).
- **Lucide Icons** — `@lucide/astro` renders SVG icons in headers, cards, links, and buttons at build time. The form receives its send icon as an Astro-rendered slot. No icon font CDN is needed.
- **Vanilla CSS** — global variables (`--primary`, `--bg-main`), flex/grid layouts, glass panels using `backdrop-filter`, and `fadeIn`/`slideUp` animations with reduced-motion support.

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

Tests mock email delivery; they never contact Resend. They cover desktop/mobile navigation, history, Homelab routing, no-JavaScript content, the sole React island, contact retry behavior, validation, origin checks, request limits, and provider errors.

## Content collections

The schema in [`src/content.config.ts`](src/content.config.ts) validates project descriptions under [`src/content/projects`](src/content/projects). The homepage and `/homelab/` read the same Homelab entry, with a short overview and a link to the source repository. Edit `homelab.md` to update the title, summary, technology tags, repository link, and project description.

| File | Edit here |
| --- | --- |
| `src/components/Hero.astro`, `About.astro` | Introduction and competencies |
| `src/components/Footer.astro` | Contact section and social links |
| `src/data/stack.ts` | Technology names |
| `src/components/Stack.astro` | Technology icons |
| `src/content/projects/homelab.md` | Homelab description and metadata |
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

## Site pages

- `/` — personal portfolio, skills, Homelab preview, and contact form.
- `/homelab/` — short project description and GitHub repository link.
- `/404.html` — not-found page.

The former blog archive and article routes have been removed; their content remains in Git history. The site no longer includes blog links or Chart.js.

## Service status MVP

The Homelab page displays `public/status.json` with service-name search, status filtering, and multi-select tag filters (matching any selected tag). React remains exclusive to the contact form.

The included file is **demo data**, not readings from Uptime Kuma. No Kuma connection, credentials, publishing job, or nightly schedule is configured by this MVP. The displayed 23:00 Europe/Warsaw time is the intended update schedule.

JSON format: `version: 1`, `demo: boolean`, `generatedAt: ISO timestamp with timezone`, and `monitors: [{ id, name, status, responseMs, tags }]`. Valid status values are `up`, `down`, `maintenance`, and `unknown`; unavailable response times use `null`. IDs must be unique. Export only approved public names/tags and numeric results, never private monitor URLs, credentials, or error messages.

The page renders a build-time fallback and fetches `/status.json` on arrival without browser caching. Invalid or unavailable JSON keeps the fallback visible with an error notice. Non-demo snapshots older than 26 hours are marked overdue. Without JavaScript, the build-time table remains visible. A future exporter should replace the JSON atomically only after a successful collection and publish it with the site; changing a file on your homelab alone does not update Cloudflare Pages.
