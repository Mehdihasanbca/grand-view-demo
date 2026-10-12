# UI Library & Animation Audit

**Date:** 2026-10-11 · **Method:** official sites fetched and read on 2026-10-11.
**Environment:** LOCAL DEVELOPMENT ONLY — NOT PUBLISHED
**Related:** `ADR-001` (we keep a static stack) — so most React component libraries are **REJECTED
for direct use**, but recorded honestly with the facts gathered.

> Every entry below was inspected at its official URL. Where a page returned little machine-readable
> content, that is stated explicitly.

---

## 0. Context that drives every decision

This project is a **static HTML/CSS/vanilla-JS** site (ADR-001). The libraries below are almost all
**React + Tailwind + Motion** component collections. Using any of them directly would require the
React/Tailwind migration that ADR-001 rejects. Therefore the audit records what each library is, and
gives a decision of **REJECT (for this stack)**, **EVALUATE LATER**, or — for the two
framework-agnostic tools (Motion vanilla JS, Lucide) — **SELECTIVELY ADOPT**.

Legend: **ADOPT** · **SELECTIVELY ADOPT** · **EVALUATE LATER** · **REJECT**

---

## 1. Motion (motion.dev) — was Framer Motion

- **Official URL:** https://motion.dev/ (inspected)
- **Purpose:** production-grade JS animation library; transforms, gestures, scroll, layout, springs.
- **Frameworks:** React, **vanilla JavaScript**, Vue. MIT licensed, open source (verified on page).
- **Install:** `npm i motion` (vanilla) or `framer-motion` (React).
- **Licence:** MIT (verified: "Completely free to use, MIT licensed and open source").
- **Perf/a11y notes:** hybrid engine, hardware-accelerated; small footprint vs GSAP.
- **Useful here:** vanilla `animate()`/`scroll()` for future scroll reveals.
- **Should not use:** heavy gesture/drag/layout features unnecessary for a brochure site.
- **Decision:** **EVALUATE LATER** — not needed now (CSS suffices, ADR-004). First candidate if
  richer motion is ever approved. Vanilla build means no React requirement.

## 2. Lucide (lucide.dev)

- **Official URL:** https://lucide.dev/ (inspected)
- **Purpose:** 1800+ consistent, lightweight SVG icons.
- **Frameworks:** many, incl. **vanilla JS** packages; tree-shakable.
- **Licence:** **ISC** (verified: "Released under the ISC License").
- **Perf notes:** SVG, tree-shakable, customizable stroke/color.
- **Useful here:** clean icon set (phone, mail, message, menu, arrow, check).
- **Should not use:** importing the whole set — import only what's used.
- **Decision:** **SELECTIVELY ADOPT (inline the few SVGs we need)** — we inline SVG by hand today
  (ADR-006) to avoid a dependency; if the icon count grows, add the Lucide vanilla package.

## 3. shadcn/ui (ui.shadcn.com)

- **Official URL:** https://ui.shadcn.com/ (inspected)
- **Purpose:** copy-paste accessible component collection (built on Radix primitives).
- **Requires:** **React + Tailwind CSS**; installed via a CLI that copies source into your repo
  (not a runtime dependency). Accessible by default (Radix).
- **Licence:** MIT (source you own).
- **Useful here:** Button, Card, Accordion (FAQ), Dialog patterns — but only in a React app.
- **Decision:** **REJECT (for this static stack)** — requires React+Tailwind (ADR-001). Concepts
  (accessible accordion/card) are already implemented natively with `<details>` and semantic HTML.

## 4. Magic UI (magicui.design)

- **Official URL:** https://magicui.design/ (inspected)
- **Purpose:** 150+ animated components/effects; "perfect companion for shadcn/ui".
- **Requires:** **React + TypeScript + Tailwind CSS + Motion** (verified on page).
- **Licence:** open source (free components).
- **Useful here:** animated hero/marquee/particles — but React-only.
- **Decision:** **REJECT** — React+Tailwind+Motion dependency (ADR-001).

## 5. Aceternity UI (ui.aceternity.com)

- **Official URL:** https://ui.aceternity.com/ (inspected)
- **Purpose:** 200+ components/blocks/templates for landing pages.
- **Requires:** **React + Tailwind CSS + Motion** (verified). Copy-paste; some Pro (paid) blocks.
- **Licence:** free components + paid Pro tiers.
- **Useful here:** hero/bento/CTA blocks — React-only; some paid.
- **Decision:** **REJECT** — React+Tailwind+Motion; paid tiers add licence complexity.

## 6. React Bits (reactbits.dev)

- **Official URL:** https://reactbits.dev/ (inspected)
- **Purpose:** animated components/backgrounds; "install as source you own".
- **Requires:** **React**; choose JS or TS, plain CSS or Tailwind; CLI or copy-paste.
- **Licence:** (source you own; see repo).
- **Decision:** **REJECT** — React dependency (ADR-001).

## 7. 21st.dev (21st.dev)

- **Official URL:** https://21st.dev/ (inspected)
- **Purpose:** community **registry/marketplace** of 12,000+ React components/templates/themes;
  ships as AI prompts + shadcn-CLI installs.
- **Requires:** **React + Tailwind + shadcn/ui conventions** (verified).
- **Licence:** browsing free (2 free copies/day); membership for unlimited/premium; per-author.
- **Decision:** **REJECT** — a React/shadcn registry (ADR-001). Noted as inspiration only.

## 8. Animate UI (animate-ui.com)

- **Official URL:** https://animate-ui.com/ (inspected)
- **Purpose:** animated React components.
- **Requires:** **React + Tailwind + Motion**; CLI install.
- **Note:** the fetched page returned minimal machine-readable content (title only) — it is a
  client-rendered docs site; the framework requirement is stated on the page title/branding.
- **Decision:** **REJECT** — React dependency (ADR-001). (Inspected; limited static content — stated
  honestly.)

## 9. Animata (animata.design)

- **Official URL:** https://animata.design/ (inspected)
- **Purpose:** 156+ animated React components, copy-paste; "works everywhere" (Next/Remix/Vite/
  Astro/Gatsby/TanStack). **MIT licensed** (verified). Accessibility built in (keyboard focus,
  reduced-motion fallbacks — verified on page).
- **Requires:** **React** (+ Tailwind/Framer Motion per component).
- **Decision:** **REJECT** — React dependency (ADR-001). Praised for a11y; revisit only if we adopt
  React.

## 10. Skiper UI (skiper-ui.com)

- **Official URL:** https://www.skiper-ui.com/ (inspected)
- **Purpose:** "un-common components for shadcn/ui"; 106+ components via shadcn CLI
  (`npx shadcn add @skiper-ui/...`). Built with Next.js + Motion.
- **Licence:** free components + paid Pro.
- **Decision:** **REJECT** — React/shadcn/Next + paid tiers (ADR-001).

## 11. Vengeance UI (vengenceui.com)

- **Official URL:** https://www.vengenceui.com/ (inspected — note the spelling "vengence")
- **Purpose:** animated React components (hover effects, tooltips, scroll-driven layouts); installs
  via `npx shadcn add @vengeanceui/[component]`. React + Next; Vercel OSS.
- **Licence:** open source components.
- **Decision:** **REJECT** — React/shadcn dependency (ADR-001).

## 12. Animmaster Lib (animmasterlib.dev)

- **Official URL:** https://animmasterlib.dev/ (also searched as Animaster Lib)
- **Purpose:** 300+ PRO-level components inspired by Awwwards websites; scroll animations, WebGL shaders, 3D animations, hero sections.
- **Requires:** Three.js, WebGL shaders, GSAP, React/Next.js; paid/commercial license model ($).
- **Decision:** **REJECT** — Paid proprietary library with heavy WebGL/Three.js dependencies that violate our lightweight static performance budget and no-dependency architecture.

## 13. Other tools considered

- **GSAP** — powerful but heavier; not needed for subtle CSS-achievable motion. **REJECT** for now.
- **Lenis** (smooth scroll) — nice but the brief warns against smooth-scroll/perpetual effects that
  can harm accessibility. **EVALUATE LATER** only with reduced-motion care.
- **AOS / ScrollReveal** — small vanilla reveal libs; we implement a ~40-line reveal instead to stay
  dependency-free. **REJECT** (in-house equivalent chosen).

---

## 14. Decision summary

| Library | Decision | One-line reason |
|---------|----------|-----------------|
| Motion (vanilla JS) | EVALUATE LATER | MIT, framework-agnostic; CSS suffices today |
| Lucide | SELECTIVELY ADOPT (inline SVGs) | ISC; only a few icons needed |
| shadcn/ui | REJECT | React+Tailwind required |
| Magic UI | REJECT | React+Tailwind+Motion required |
| Aceternity UI | REJECT | React+Tailwind+Motion; paid tiers |
| React Bits | REJECT | React required |
| 21st.dev | REJECT | React/shadcn registry |
| Animate UI | REJECT | React required (limited static content) |
| Animata | REJECT | React required (MIT, a11y-good) |
| Skiper UI | REJECT | React/shadcn/Next; paid |
| Vengeance UI | REJECT | React/shadcn required |
| Animmaster Lib | REJECT | Paid proprietary; heavy WebGL/3D runtime |
| GSAP / Lenis / AOS | REJECT / LATER | Weight or a11y concerns; in-house equivalent |

**Net dependency added to the website: none.** All motion, cards, and icons are hand-written/inlined,
keeping the site dependency-free per ADR-001 and the standing constraints.


