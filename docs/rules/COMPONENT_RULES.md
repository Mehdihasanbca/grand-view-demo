# Component Rules — GRAND VIEW Website

In a static stack, "components" are **reusable markup patterns + CSS classes + small JS behaviours**.
Create a reusable component only when there is a genuine reuse case (≥2 usages), not for abstraction's
sake.

## 1. Component inventory (current)

| Component | Where | Reuse |
|-----------|-------|-------|
| Button (`.button`, `.button-secondary`) | CSS | All pages |
| Service card (`.service-card`) | services + home | 2 pages |
| Value card (`.value-card`) | about + service pages | multiple |
| Process step (`.process-step`) | home + services | 2 pages |
| Gallery card (`.gallery-card`) | projects | 1 (pattern) |
| Contact method (`.contact-method`) | contact | 1 (pattern) |
| FAQ (`<details>` in `.faq-list`) | contact | 1 (pattern) |
| Wide CTA (`.wide-cta`) | every page | 8 pages |
| Topbar / Header / Footer / WhatsApp float | layout partials | every page |

## 2. Naming conventions
- CSS classes: kebab-case, Block-Element-Modifier-ish (`.service-card`, `.service-body`,
  `.contact-form`). State classes: `.is-open`, `.is-visible`, `.has-error`, `.is-fallback`.
- JS: query by stable class/id; behaviour attaches to a single root element.
- Data attributes for hooks: `data-page`, `data-current-year`, `data-reveal`.

## 3. Reusable-component requirements
A pattern becomes a shared partial (in `src/templates/partials/`) when it appears on ≥2 pages
(header, footer, topbar, WhatsApp float, CTA). Single-page patterns stay in the page body.

## 4. Accessibility contract for every component
- Interactive elements are real `<button>`/`<a>`; correct roles; keyboard operable.
- Icon-only controls carry `aria-label`; decorative icons are `aria-hidden`.
- Visible `:focus-visible`; sufficient contrast; respects reduced-motion.

## 5. Interaction states (must be defined)
- Default, hover, active, focus-visible, disabled (where relevant).
- Loading/empty/error/success for the form status region.
- Image fallback state (`.is-fallback`).

## 6. Motion contract
- Subtle, purposeful; transform/opacity only; documented tokens; reduced-motion safe.
- See `docs/design/MOTION_SYSTEM.md`.

## 7. Prohibited
- Duplicating a shared partial by copy-paste instead of using the build partials.
- Inline styles except the documented `--hero-image` custom-property pattern.
- Random one-off spacing/color values (use tokens).
