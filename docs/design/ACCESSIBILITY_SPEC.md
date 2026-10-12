# Accessibility Specification — GRAND VIEW Website

WCAG-minded AA for a marketing site. **LOCAL DEV ONLY.**

## 1. Perceivable
- **Contrast:** body text `--paper`/`--muted` on `--ink`; dark text on `--paper` sections; gold is
  accent/border only. All text meets AA.
- **Images:** informative `alt`; decorative `alt=""`. Logo has meaningful alt in header.
- **Non-text content:** icons either `aria-hidden` (decorative) or paired with `aria-label`.

## 2. Operable
- **Keyboard:** every interactive element reachable/operable; visible `:focus-visible` (gold outline,
  offset 3px). Skip link first in tab order; `<main tabindex="-1">`.
- **Menu:** toggle `aria-expanded`/`aria-controls`; Escape + outside-click close; focus returns.
- **Targets:** ≥ ~44px. No keyboard traps. No time limits.

## 3. Understandable
- `lang="en"`. Predictable navigation; consistent header/footer. Descriptive link/button text.
- **Forms:** labelled controls; required marked; errors announced (`aria-live="polite"`) and described.

## 4. Robust
- Semantic landmarks (`header/nav/main/footer`); one `<h1>`; valid heading order.
- ARIA used only where semantics are insufficient (status region, expanded state).

## 5. Motion & cognition
- `prefers-reduced-motion` fully honoured (CSS + JS). No content hidden to enable animation.
- Reduced-motion users get static, complete content.

## 6. Contact & feedback specifics
- Form status region: `role="status" aria-live="polite"`; success/error styling.
- The form states it stores nothing and prepares a WhatsApp message (no false claims).

## 7. Automated vs manual
- Automated (in `tests/run.js`): presence of skip link, `#main-content`, labels, one `<h1>`, `alt`
  attributes, `lang`, reduced-motion CSS, `aria-live`.
- Manual: keyboard tab order, focus visibility, screen-reader phrasing, contrast spot-checks, mobile
  target sizes. Listed in `docs/tasks/QA_CHECKLIST.md`.

## 8. Prohibited
- Removing focus styles; color-only meaning; auto-play media; keyboard traps; faking compliance.
