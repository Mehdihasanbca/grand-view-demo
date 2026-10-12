# ADR-007: Internationalization (English + Arabic) Architecture

## Status
ACCEPTED (NX-2)

## Context
GRAND VIEW CERAMIC AND MARBLE WORK operates in Abu Dhabi, United Arab Emirates, where bilingual English/Arabic presentation is essential for residential and commercial property clients. The site is a static marketing website without client-side rendering frameworks or heavy runtime dependencies.

## Decision
1. **Maintain Static Architecture**:
   - We reject migrating to React, Next.js, or complex client frameworks solely for i18n.
   - Dual-mode approach:
     - **Build-Time Prerendering**: Pre-renders `/ar/` routes into `dist/ar/*.html` alongside root English routes in `dist/*.html`.
     - **Runtime Synchronization**: A lightweight vanilla JS module (`assets/js/i18n.js` + `assets/js/i18n-dict.js`) handles client-side language switching, query param synchronization (`?lang=ar`), and text node replacement if visited dynamically.
2. **Document Language & Direction Semantics**:
   - English: `<html lang="en" dir="ltr">`.
   - Arabic: `<html lang="ar" dir="rtl">`.
3. **Styling & RTL Adaptations**:
   - CSS logical properties (`margin-inline`, `padding-inline`, `border-inline-start`, `inset-inline-start`) are prioritized.
   - Dedicated `[dir="rtl"]` overrides in `assets/css/styles.css` mirror physical directional elements (e.g. process steps, floating WhatsApp icon, borders).
4. **URL & Navigation Strategy**:
   - Default root routes represent English (e.g., `/index.html`, `/services.html`).
   - Arabic equivalents are mirrored statically under `/ar/` (e.g., `/ar/index.html`, `/ar/services.html`).
   - Language selector retains the equivalent page destination during language switches.
5. **Content Integrity & Safeguards**:
   - Company facts originate strictly from `src/config/company.js`.
   - Central dictionaries are organized in `src/config/i18n/` (`{en,ar}-{core,services,contact}.json`).
   - Phone numbers (`+971 58 164 5299`), email (`grandviewceramic202@gmail.com`), and WhatsApp links remain strictly ungarbled and LTR-safe across both languages.
   - No unofficial legal claims or unverified business licenses are introduced in translations.

## Consequences
- Zero browser runtime dependencies added.
- All 8 pages available in both English and Arabic.
- 100% testable via offline automated tests and Playwright headless tests.
