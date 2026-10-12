# NX-6 Premium Experience Upgrade — Proposal & Implementation Plan

**Project:** GRAND VIEW CERAMIC AND MARBLE WORK (Abu Dhabi, UAE)  
**Status:** In Progress (Local Development Only)  
**Version:** 1.0.0

---

## 1. Objectives & Architectural Principles

Transform the existing Grand View marketing website into an ultra-premium, architectural-grade brand experience for stone and ceramic craftsmanship in Abu Dhabi, while adhering strictly to:
- **Zero runtime dependencies**: Vanilla HTML, CSS, and JS only. No React, Tailwind, or heavyweight libraries.
- **Byte-for-byte logo preservation**: Original logo asset unmodified.
- **74 static tests + 75 Playwright tests preserved**: Build, i18n, RTL, accessibility (axe-core WCAG AA), and visual baseline regression safety.
- **Single source of truth**: Company data sourced from `src/config/company.js`.
- **Bilingual parity**: Every tool, material selector, and card interaction works identically in English (`dir="ltr"`) and Arabic (`dir="rtl"`).
- **Theme-aware design**: All upgrades seamlessly support all 4 solar phases (Morning, Day, Evening, Night) and user overrides (Auto / Light / Dark).

---

## 2. Phase Breakdown

### Phase 1: Premium Architectural Design System
- Refined CSS tokens for typography hierarchy with fluid clamping: `clamp(2rem, 5vw, 3.75rem)` for editorial titles.
- Elevated architectural palette: deep obsidian/graphite (`#080808`, `#111110`), warm ivory paper (`#f5f1e8`, `#faf6ee`), and restrained, satin brushed champagne gold (`#d6aa49`, `#c59b3f`) without tacky gradients or neon luster.
- Architectural grid lines, refined subtle border strokes (`rgba(214, 170, 73, 0.18)`), card dividers, and high-contrast visible focus rings.
- Logical CSS properties (`margin-inline`, `padding-inline`, `inset-inline-*`) for full RTL compatibility.

### Phase 2: Elevated Hero & Brand Storytelling
- Sophisticated editorial hierarchy with badge kicker (`ABU DHABI · ARCHITECTURAL FINISHING`).
- Refined typography and dual action CTAs: Direct Project Discussion + WhatsApp instant consultation with pre-composed intent.
- Atmospheric depth treatment: subtle radial grain/vignette overlays without layout shift.
- Fast, non-blocking hero composition on both mobile (375px) and desktop (1365px+).

### Phase 3: Services & Interactive Material Showcase
- Interactive Material Showcase: Ceramic, Large-format Porcelain, Natural Italian & Turkish Marble, Granite, and Decorative Tile.
- Interactive category tabs allowing visitors to preview material characteristics, finish varieties (Polished, Honed, Flamed, Matte), and typical applications (Villas, Majlis, Bathrooms, Commercial lobbies) using existing/fallback assets.
- Refined hover & focus micro-interactions on service cards with smooth elevation and subtle gold accent lighting.

### Phase 4: Restrained Lightweight Motion System
- CSS + vanilla JS scroll-triggered reveal via `motion.js` using `IntersectionObserver`.
- Smooth card hover lift (`transform: translateY(-4px)`), soft border glow, and focus transitions.
- Complete `@media (prefers-reduced-motion: reduce)` override disabling all animations.
- 100% graceful degradation if JavaScript is disabled.

### Phase 5: Client Tools (Calculator & Enquiry Builder)
1. **Tile Area & Material Estimator**:
   - Inputs: Surface length & width (meters), tile format selector (60x60cm, 60x120cm, 80x80cm, 120x240cm slab), and optional wastage allowance (5%, 10%, 15%).
   - Outputs: Total area ($m^2$), estimated tile count, box estimation, and wastage breakdown.
   - Clear disclosure: "Estimates are for planning purposes only and do not constitute an official site quotation."
   - Bilingual support (EN & AR) with numeric and RTL clarity.
2. **Interactive Project Enquiry Builder**:
   - Step-based or consolidated interactive selector: Service type, Property type (Villa, Apartment, Commercial, Retail), Scope (Floor, Walls, Bathroom, Full Fit-out), and preferred timeline.
   - Direct output to sanitized WhatsApp URL hand-off with structured enquiry message format.

### Phase 6: Header, Navigation & Page Polish
- Sticky header with glassmorphism backdrop blur and clean responsive border.
- Smooth mobile menu drawer with trap-focus safety, Escape key dismiss, and outside-click handling.
- Integrated active navigation state (`aria-current="page"`).
- Footer polish with verified company contact details, services catalog, and WhatsApp float.

### Phase 7: Verification & Testing
- Run `node tests/run.js` (all 74 baseline static tests).
- Run `node tests/verify-i18n.mjs` and `node tests/verify-i18n-build.mjs`.
- Run Playwright E2E test suite (`npm run test:e2e`).
- Verify axe-core accessibility across all 8 routes in EN and AR.
