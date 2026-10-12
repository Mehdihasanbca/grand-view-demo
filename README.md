# GRAND VIEW CERAMIC AND MARBLE WORK — Website

A responsive, black-and-gold, multi-page business website prepared for GRAND VIEW CERAMIC AND MARBLE WORK, Abu Dhabi, United Arab Emirates.

> **Status: LOCAL DEVELOPMENT ONLY — NOT PUBLISHED.** No deployment, domain, DNS, hosting, or CDN has been configured. See `AGENTS.md` and `docs/` for the engineering setup.

## Included pages

- `index.html` — Home
- `about.html` — About Grand View
- `services.html` — Services overview
- `tiles-marble.html` — Tile and marble work
- `plumbing.html` — Plumbing and pipe fitting
- `electrical.html` — Electrical work
- `projects.html` — Visual inspiration gallery
- `contact.html` — Contact details, FAQs and WhatsApp enquiry form

## Engineering structure (added in this pass)

- `src/config/company.js` — **single source of truth** for company data (phone, email, WhatsApp, location, nav, services).
- `src/templates/partials/` — canonical shared chrome (head, topbar, header, footer, WhatsApp, scripts).
- `src/js/motion.js` — dependency-free scroll-reveal module (reduced-motion safe).
- `tools/build.mjs` — renders `dist/` from config + partials (contact data cannot drift).
- `tests/run.js` — dependency-free Node test harness (74 checks).
- `dist/` — generated static output (deployable when the owner authorizes).
- `docs/` — PRD, architecture + ADRs, rules, design system, tasks, memory, research.
- `AGENTS.md` — concise AI-agent rules.

**Zero runtime dependencies.** Node is used only for local build/test and is never shipped to the browser. See `docs/architecture/ARCHITECTURE.md` and `docs/architecture/ADR-001` for why the static stack was kept.

## Run locally in VS Code

This is a plain HTML/CSS/JavaScript website, so no runtime package installation is required to *view* it.

**Option A — quick preview (no build):**
1. Open the project folder in VS Code (**File → Open Folder**).
2. Install the **Live Server** extension and click **Go Live**, or run:
   ```bash
   python -m http.server 8000
   ```
3. Open `http://localhost:8000`.

**Option B — build + test + serve the generated output (recommended for development):**
```bash
npm run build      # node tools/build.mjs   → writes dist/
npm test           # node tests/run.js      → 74 automated checks
npm run serve:dist # python -m http.server 8000 --directory dist
# then open http://localhost:8000
```
(If `npm` is unavailable, run the underlying commands directly: `node tools/build.mjs`, `node tests/run.js`.)

The root `*.html` pages remain fully functional on their own; the build is used to regenerate from the config and to run the test suite.

## Work with OpenCode

1. Open the project folder in VS Code.
2. Start OpenCode using your installed OpenCode workflow.
3. Read `AGENTS.md` first, then the task in `OPENCODE_GUIDE.md`.
4. Ask OpenCode to change only the required files, keep the website responsive, run `node tests/run.js`, and re-check all links and forms after edits.

## Contact details used

- Business name: GRAND VIEW CERAMIC AND MARBLE WORK
- Location: Abu Dhabi, United Arab Emirates
- Phone / WhatsApp: +971 58 164 5299
- Email currently used in site: `grandviewceramic202@gmail.com`
- Supplied logo file: `assets/images/grand-view-logo.jpg`

**Email confirmation needed:** the supplied brand banner shows `grandview@email.com`, while the business licence lists `grandviewceramic202@gmail.com` as the official email. This site uses the email printed on the licence. Confirm which inbox the company wants public before publishing.

## ⚠️ Licence & approvals — please verify before launch

The supplied trade-licence text identifies **“Marble and stone cutting works.”** This website describes marble and stone work accordingly, and also lists plumbing/pipe-fitting and electrical work as services.

**Before publishing, the owner must verify the applicable UAE trade-licence activities and any required approvals** (for example Abu Dhabi DED / relevant municipality or authority approvals) so that the services advertised match the licensed activities. Do **not** present plumbing or electrical work as officially licensed, approved or certified unless supporting documentation is available. Remove or reword those sections if they are not covered by the current licence. This site intentionally makes no claims about licences, certifications, warranties, years of experience, completed projects or testimonials.

## Important before launch

- The photos in the page backgrounds and gallery are remotely loaded from the Unsplash image CDN and need an internet connection. If a photo fails to load, an on-brand placeholder (`assets/images/placeholder.svg`) is shown automatically. Replace these with original project photos you own or are permitted to use before launch, if possible.
- The current gallery is clearly described as illustrative, not as a list of completed Grand View projects.
- Update `sitemap.xml` with the real public domain and submit it to search engines after launch. `robots.txt` already points crawlers to the sitemap location (update the URL after the domain is known).
- Confirm the public email, service area, final contact number and business hours.
- Canonical link tags are intentionally **not** included because the final production domain is not yet known. Add a `<link rel="canonical" href="https://YOUR-DOMAIN/page.html">` to each page once the domain is confirmed.
- The enquiry form opens WhatsApp with a prepared, URL-encoded draft. It does not send anything automatically and it does not save submissions to a database. The visitor must review and press **Send** in WhatsApp. The form includes Name, Phone, Location, Email (optional), Service required and Project details.
- This is a front-end website; it does not include an admin panel, database, online payment, booking system or a backend CMS.

## What was improved in this pass

- Added a **Location / area** field to the contact form and included it in the prepared WhatsApp message (alongside Name, Phone, Email, Service and Project details).
- Added an **image-load fallback**: any remote photo that fails to load is replaced with an on-brand placeholder so the layout never shows a broken image.
- Replaced the WhatsApp floating-button text glyph with an inline **SVG WhatsApp icon** for consistent rendering across devices.
- Added a **skip-to-content link** and `tabindex="-1"` on `<main>` for keyboard users; added visible focus styles for all interactive elements.
- Improved the mobile menu: it now closes on **Escape** and when tapping outside the open menu.
- Added friendly per-field validation messages and clearer form status messages (error/success states).
- Added factual **LocalBusiness JSON-LD** structured data (name, phone, email, Abu Dhabi location) on the Home and Contact pages — no invented credentials or reviews.
- Added `og:site_name` metadata to every page.
- Confirmed all internal navigation links, `tel:`, `mailto:` and `wa.me/971581645299` links resolve correctly and contact details are consistent across every page.

## Publish

Because this is a static website, it can be hosted on a static web host such as Netlify, Cloudflare Pages, GitHub Pages or the company's existing hosting account. Upload the contents of this folder (not the zip itself) so `index.html` is at the web root. Attach the domain and enable HTTPS using the hosting provider's instructions.
