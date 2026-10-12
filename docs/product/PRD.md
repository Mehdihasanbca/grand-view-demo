# Product Requirements Document (PRD) — GRAND VIEW Website

**Version:** 1.0 · **Date:** 2026-10-11 · **Status:** LOCAL DEVELOPMENT ONLY — NOT PUBLISHED
**Owner:** GRAND VIEW CERAMIC AND MARBLE WORK, Abu Dhabi, UAE

---

## 1. Business objective

Provide a premium, trustworthy web presence that (a) presents GRAND VIEW's ceramic, marble,
plumbing and electrical services to customers in Abu Dhabi and the wider UAE, and (b) converts
visitors into WhatsApp enquiries — the company's primary contact channel — without any backend.

**Primary conversion goal:** a visitor opens a pre-filled WhatsApp message and sends it.
**Secondary goals:** click-to-call, email, and clear service understanding.

## 2. Target customers

- Homeowners in Abu Dhabi renovating kitchens, bathrooms, and floors.
- Property managers / villa owners planning tile, marble, or maintenance work.
- Small commercial fit-out clients (shops, offices).
- Contractors needing sub-contracted finishing, pipe fitting, or electrical work.

## 3. Customer problems → business goals

| Customer problem | How the site helps | Business goal |
|------------------|--------------------|---------------|
| "Who does quality tile/marble work near me?" | Clear service pages + Abu Dhabi focus + gallery | Generate qualified enquiries |
| "How do I get a quote?" | One-tap WhatsApp + enquiry form | Lower friction to contact |
| "Is this business legit and easy to reach?" | Consistent branding, contact details, professional design | Build trust |
| "I'm on my phone" | Mobile-first responsive layout, sticky WhatsApp button | Convert mobile traffic |

## 4. Scope

### In scope
- 8 static pages (Home, About, Services, Tiles & Marble, Plumbing, Electrical, Projects, Contact).
- Responsive layout (mobile/tablet/desktop) with a working mobile menu.
- Click-to-call, email, and WhatsApp deep links with consistent details everywhere.
- Enquiry form (Name, Phone, Location, Email optional, Service, Message) with validation.
- URL-encoded WhatsApp enquiry message the visitor reviews and sends.
- Per-page SEO metadata + Open Graph; factual LocalBusiness structured data.
- Accessibility (keyboard, focus states, labels, reduced-motion).
- Premium black-and-gold design system with subtle motion.
- Image fallbacks for remote photos.
- Full engineering documentation, tests, and rules.

### Out of scope (explicit exclusions)
- **No backend, database, or email sending.** Enquiries go through WhatsApp only.
- **No deployment / production domain / DNS / hosting** in this phase.
- No user accounts, payments, booking, or CMS.
- No invented credentials, certifications, warranties, years in business, completed-project counts,
  awards, or testimonials.
- No claim that plumbing/electrical work is officially licensed (see §11).

## 5. Functional requirements

| ID | Requirement |
|----|-------------|
| FR-1 | Every page shows consistent header, logo, nav, footer, and contact details. |
| FR-2 | Navigation links resolve to existing pages; the current page is marked `aria-current`. |
| FR-3 | Mobile hamburger menu opens/closes, sets `aria-expanded`, closes on link click / Escape / outside tap. |
| FR-4 | `tel:+971581645299`, `mailto:grandviewceramic202@gmail.com`, `https://wa.me/971581645299` work. |
| FR-5 | Contact form has required Name, Phone, Location, Service, Message; optional Email. |
| FR-6 | Invalid submissions are blocked with friendly messages; valid ones build a WhatsApp deep link. |
| FR-7 | The WhatsApp message is URL-encoded and includes all entered fields. |
| FR-8 | Service cards link to their detail pages. |
| FR-9 | Remote images fall back to an on-brand placeholder if they fail to load. |

## 6. Non-functional requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | No runtime JS/CSS dependencies; runs from static files with no build for the browser. |
| NFR-2 | Loads and is usable on low-end mobile; motion honours `prefers-reduced-motion`. |
| NFR-3 | WCAG-minded: keyboard operable, visible focus, labelled controls, sufficient contrast. |
| NFR-4 | Unique `<title>` + meta description per page; one `<h1>` per page; image `alt` text. |
| NFR-5 | Contact details never drift — single source of truth enforced by tests. |
| NFR-6 | No console errors on any page. |

## 7. User personas

- **Renovating homeowner (primary):** 30–50, on mobile, wants quality + a fast quote. Needs clear
  service info and a one-tap way to send photos/details via WhatsApp.
- **Property/villa manager:** needs reliability and a point of contact; values clear communication.
- **Commercial fit-out client:** needs scope clarity and coordination; uses email + WhatsApp.
- **Accessibility-conscious user:** uses keyboard/screen reader; needs focus states, labels, and
  reduced-motion respect.

## 8. User journeys

1. **Enquiry (primary):** Land on Home → read hero → tap "Discuss your project" or "Call now" →
   Contact page → fill form → tap "Prepare WhatsApp enquiry" → review & send in WhatsApp.
2. **Service discovery:** Home → Services overview → a service card → service detail page → enquire.
3. **Direct contact:** Any page → topbar phone / floating WhatsApp / footer links.
4. **Inspiration:** Projects gallery → "Discuss your project" → Contact.

## 9. Sitemap & page specifications

| Route | File | `<h1>` intent | Key components |
|-------|------|---------------|----------------|
| `/` | `index.html` | Hero headline | Hero, intro, service cards, values, process, CTA |
| `/about` | `about.html` | About headline | Page hero, story, principles, CTA |
| `/services` | `services.html` | Services headline | Page hero, service cards, process, CTA |
| `/tiles-marble` | `tiles-marble.html` | Tile & marble headline | Page hero, feature list, notice, CTA |
| `/plumbing` | `plumbing.html` | Plumbing headline | Same pattern as tiles-marble |
| `/electrical` | `electrical.html` | Electrical headline | Same pattern |
| `/projects` | `projects.html` | Gallery headline | Page hero, gallery grid, disclaimer, CTA |
| `/contact` | `contact.html` | Contact headline | Contact methods, enquiry form, FAQ |

## 10. Contact & WhatsApp requirements

- Click-to-call: `tel:+971581645299`.
- Email: `mailto:grandviewceramic202@gmail.com`.
- WhatsApp: `https://wa.me/971581645299`.
- Enquiry form fields: **Name\*, Phone\*, Location\*, Email (optional), Service\*, Message\***.
- On valid submit: build a URL-encoded message and open `https://wa.me/971581645299?text=…`.
- The UI must state clearly that the message is **prepared for the visitor to review and send**,
  and that nothing is emailed or stored.

## 11. Business & licensing content restrictions (binding)

- Do **not** invent experience, completed projects, awards, reviews, certifications, guarantees,
  warranties, or statistics.
- The supplied licence lists **marble and stone cutting work**. Do **not** present plumbing or
  electrical activities as officially licensed/approved/certified unless documentation is provided.
- Gallery/service images are **illustrative** and must be labelled as such, not as completed work.
- **Owner action required:** verify applicable UAE licence activities and approvals before
  advertising plumbing/electrical as licensed services.

## 12. Mobile-first requirements

- Touch targets ≥ ~44px; sticky WhatsApp button; stacked layouts at ≤780px and ≤480px.
- Hamburger menu with full-width stacked links on small screens.

## 13. SEO & accessibility requirements

- Unique title + description per page; one `<h1>`; descriptive `alt`; `lang="en"`.
- Open Graph + `og:site_name`; factual LocalBusiness JSON-LD (Home + Contact).
- Canonical URLs only once the domain is known (currently omitted by design).
- Keyboard operable; visible focus; labelled form controls; `aria-live` status; reduced-motion.

## 14. Acceptance criteria (per major feature)

- **Navigation:** every nav link loads a real page; active page marked; mobile menu works.
- **Contact links:** all three (tel/mail/wa.me) present and correct on every page.
- **Form:** required validation blocks empty submits; valid submit opens a correctly encoded
  `wa.me` URL containing Name, Phone, Location, Service, Message.
- **Images:** a failed remote image is replaced by the placeholder.
- **SEO/a11y:** title/description/h1/alt present; focus visible; no console errors.
- **Consistency:** automated test asserts identical contact details across all 8 pages.

## 15. Future enhancements (separate from current scope)

- Real project photography replacing illustrative images.
- Canonical URLs + real sitemap once the domain is set.
- Optional lightweight scroll-reveal library (vanilla) if approved.
- Multi-language (Arabic) support.
- A hosted form backend **only if** the owner later wants stored enquiries (not now).

