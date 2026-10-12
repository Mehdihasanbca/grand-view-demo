# Responsive System — GRAND VIEW Website

Mobile-first with progressive enhancement at three breakpoints. **LOCAL DEV ONLY.**

## 1. Breakpoints

| Name | Min-width | Key changes |
|------|-----------|-------------|
| Phone (base) | — | Single column; hamburger menu; stacked hero actions; 1-col grids |
| Phone-large | ≤480px | Larger hero type clamp; full-width buttons; 1-col service/gallery |
| Tablet | ≤780px | 2-col service/gallery; topbar left text hidden; menu becomes dropdown; section padding reduced |
| Tablet-landscape | ≤1000px | Tighter header; 2-col footer; grids collapse toward 1–2 col |
| Desktop | >1000px | Full multi-column layouts; 3-col service/values; 4-col process/footer |

## 2. Container
`width:min(calc(100% - 40px), 1200px)`, centered. Narrower gutters (32px) at ≤780px.

## 3. Grid behavior
- Services/values: 3 → 2 → 1 columns.
- Process: 4 → 2 → 2 → 1.
- Gallery: 3 → 2 → 1.
- Footer: 4 → 2 → 1 (brand spans full width on tablet).
- Contact/intro/content grids: 2 → 1.

## 4. Navigation
- Desktop: horizontal nav + CTA.
- ≤780px: hamburger; `.main-nav` becomes a full-width dropdown (`position:absolute`), stacked links,
  CTA full-width. Closes on link/Escape/outside-click.

## 5. Touch & mobile rules
- Touch targets ≥ ~44px (buttons 50px min-height; menu rows padded).
- No horizontal scrolling; images `max-width:100%`.
- Sticky WhatsApp float; prominent Call/WhatsApp actions.
- Avoid oversized elements; keep type readable (hero clamp scales down).

## 6. Typography responsiveness
- Headings use `clamp()`; body stays 16px. Line lengths capped for readability (`max-width` on copy).

## 7. Images
- `object-fit:cover` with fixed heights per breakpoint; `loading="lazy"`; `onerror` fallback.

## 8. Testing matrix (manual)
Verify at ~360px, ~414px, ~768px, ~1024px, ~1440px: nav, hero, cards, gallery, form, footer, and the
WhatsApp float. Recorded in `docs/tasks/QA_CHECKLIST.md`.
