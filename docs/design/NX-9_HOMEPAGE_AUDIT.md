# NX-9 Homepage Experience Audit & Plan — GRAND VIEW Website

**Document Status:** Local Development Design Specification · 2026-10-12  
**Target:** [index.html](file:///d:/Grand%20View/grand-view-website/index.html) and [dist/ar/index.html](file:///d:/Grand%20View/grand-view-website/dist/ar/index.html)  
**Constraints:** Local development only. Zero new external dependencies. Preserve exact original logo, 100% bilingual parity (EN + AR RTL), 4-phase adaptive themes, and zero fabricated claims.

---

## 1. Executive Summary & Context

Under the Continuous Development Roadmap, **NX-9 Homepage Experience** bridges the foundational and interactive work established across NX-1 through NX-8. While previous passes added dynamic tools on detail pages (the Tile Calculator & Material Showcase on `tiles-marble.html`, and the Project Enquiry Builder on `contact.html`), the homepage remained primarily an introductory portal.

NX-9 elevates the homepage into a cohesive architectural journey that actively introduces visitors to Grand View's core craftsmanship, allows rapid discovery of materials, guides prospective clients toward scoping their projects, and answers fundamental service questions before inquiry.

---

## 2. Audit of Existing Homepage Narrative Flow

### 2.1 Current Section Structure
1. **Hero (`.hero`)**:
   - *Headline*: "Beautiful surfaces. Better spaces."
   - *Actions*: "Discuss your project" (primary), "Call now" (secondary phone), "Explore our services" (secondary).
   - *Footnotes*: 3 check items (Detail-led workmanship, Residential & commercial, Abu Dhabi).
   - *Status*: Clean, functional, good contrast. Can feature an architectural badge indicator and better button breathing space.
2. **Intro Grid (`.intro-grid`)**:
   - *Content*: "A considered approach" / "Craftsmanship you can see. Care in every detail."
   - *Media*: Contemporary interior stone image.
   - *Link*: "More about Grand View →".
   - *Status*: Strong narrative anchor. Works well as a transition into core offerings.
3. **Core Services Grid (`.service-grid`)**:
   - *Content*: 3 cards (01 Tile & Marble Work, 02 Plumbing & Pipe Fitting, 03 Electrical Work).
   - *Status*: Essential for test 46 (`service cards link to their detail pages`). Must be strictly preserved.
4. **Brand Principles (`.values-grid`)**:
   - *Content*: 3 value cards (Attention to detail, Clear communication, Practical delivery) on `.section-paper`.
   - *Status*: Honest, professional, communicates practical delivery.
5. **Process Grid (`.process-grid`)**:
   - *Content*: 4-step workflow (01 Tell us, 02 Discuss site, 03 Confirm plan, 04 Complete with care).
   - *Status*: Clear client expectations roadmap.
6. **Wide CTA Banner (`.wide-cta`)**:
   - *Content*: "Have a space that needs the right finish?" with button to `contact.html`.

### 2.2 Opportunities for Highest-Value Enhancements
1. **Architectural Material Discovery Teaser (`.home-material-teaser`)**:
   - *The Gap*: Visitors landing on the homepage cannot preview key architectural materials (Natural Marble, Large Porcelain Slabs, Vitrified Tiles) without navigating to `tiles-marble.html`.
   - *The Solution*: An editorial 3-column architectural material feature card grid directly connecting homeowners and commercial planners to material categories and directing them into the interactive showcase.
2. **Quick Project Scoping & Estimator Spotlight (`.home-tool-spotlight`)**:
   - *The Gap*: The dynamic Tile Area Calculator and Project Enquiry Builder are hidden on inner routes.
   - *The Solution*: A dedicated preview section on the homepage highlighting the interactive Tile Area Calculator with quick dimension baselines and a direct link to try the estimator.
3. **Craftsmanship & Service FAQ Accordion (`.home-faq`)**:
   - *The Gap*: FAQs previously only lived on `contact.html`. Homeowners often need quick clarity on service areas, photo submissions, and quotation procedures directly on the homepage.
   - *The Solution*: Accessible native `<details>`/`<summary>` accordion answering key initial questions with zero layout shift or JavaScript dependencies.

---

## 3. Implementation Plan & Affected Files

### 3.1 Files to Modify
1. `src/config/i18n/en-core.json`: Add new keys for the homepage material teaser, tool spotlight, and homepage FAQ.
2. `src/config/i18n/ar-core.json`: Add corresponding Arabic translations maintaining strict 1:1 key parity.
3. `index.html`: Update the homepage structure with the new sections in clean semantic HTML.
4. `assets/css/styles.css`: Add styling for `.home-material-teaser`, `.home-tool-spotlight`, and `.home-faq` using existing semantic tokens and theme variables.

### 3.2 Preserved Code & Invariants
- Exactly one `<h1>` on the page.
- Service card links to `tiles-marble.html`, `plumbing.html`, `electrical.html` preserved.
- Contact phone number `+971 58 164 5299` and WhatsApp link unchanged.
- Original logo byte-for-byte intact.
- Full RTL logical properties used throughout (`margin-inline`, `padding-inline`, `border-inline-start`).
- Strict `prefers-reduced-motion` compliance.

---

## 4. Verification Protocol
1. Run `node tools/build.mjs` to compile English and Arabic routes into `dist/`.
2. Run `node tests/run.js` (Verify 74/74 checks pass).
3. Run `npm run check:js` to verify syntax.
4. Run `node tests/verify-i18n.mjs` to ensure 100% dictionary key synchronization.
5. Run `npm run test:a11y` (Verify 16 axe-core checks pass).
6. Run `npm run test:e2e` to verify full regression status, reviewing and updating visual snapshots for `home-desktop` and `home-mobile` as needed.
