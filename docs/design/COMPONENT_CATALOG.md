# Component Catalog — GRAND VIEW Website

Reusable patterns with their classes, tokens, states, and accessibility notes. **LOCAL DEV ONLY.**

## 1. Button
- Classes: `.button`, `.button-secondary`, `.nav-cta`.
- Tokens: `--gold`, `--gold-light`, `--radius`, `--paper`.
- States: default, hover (translateY(-2px)), focus-visible (gold outline), active.
- A11y: real `<a>`/`<button>`; icon spans `aria-hidden` where decorative.

## 2. Topbar
- Classes: `.topbar`, `.topbar-inner`, `.topbar-left`, `.topbar-right`.
- Content: tagline + location + phone (`tel:`). Hidden left text on mobile.
- A11y: phone is a real link.

## 3. Header / brand / nav
- Classes: `.site-header`, `.header-inner`, `.brand`, `.brand-logo`, `.main-nav`, `.menu-toggle`.
- Logo: supplied emblem, circular crop. Nav CTA → Contact.
- States: sticky; active link `[aria-current=page]` gold.
- A11y: `aria-label` on brand; toggle has `aria-expanded`/`aria-controls`.

## 4. Mobile menu
- `.main-nav.is-open` reveals stacked links ≤780px. Closes on link/Escape/outside-click.
- A11y: toggle `aria-expanded`, Escape returns focus.

## 5. Hero / page hero
- `.hero` / `.page-hero` with `--hero-image` custom property + gradient overlay.
- Content: eyebrow, `<h1>`, paragraph, actions, breadcrumb (page hero).

## 6. Section heading
- `.section-heading`, `.eyebrow`, `.kicker`, `.gold-text`. One `<h2>` per section.

## 7. Service card
- `.service-card` → `.service-photo` (img + `.service-number`), `.service-body` (h3, p, `.text-link`).
- Hover: lift + image scale. Links to detail page.

## 8. Value card
- `.value-card` with `.value-icon`, h3, p. Used on about + service pages.

## 9. Process step
- `.process-step` with `.step-number`, h3, p. 4-up grid.

## 10. Feature list
- `.feature-list` with `✓` markers (CSS `:before`). 2-column on desktop.

## 11. Gallery card
- `.gallery-card` with img + `.gallery-label`. Illustrative disclaimer nearby.

## 12. Contact method
- `.contact-method` with `.contact-symbol`, label, value; wraps `tel:`/`mailto:`/`wa.me` links.

## 13. Enquiry form
- `.contact-form`, `.field`, `.form-row`; inputs/select/textarea; `#form-status` (`aria-live`).
- Fields: Name\*, Phone\*, Location\*, Email (opt), Service\*, Message\*.
- States: `.has-error` (red border + `.field-error`), `.is-success`/`.is-error` status.

## 14. FAQ
- `.faq-list` with `<details>/<summary>`; native accessible accordion (`+`/`−` marker).

## 15. Wide CTA
- `.wide-cta` with copy + button; decorative `GV` watermark.

## 16. Footer
- `.site-footer`, `.footer-grid`, `.footer-brand`, `.footer-col`, `.footer-bottom`.
- Columns: brand/about, Explore, Our services, Get in touch (contact links). Year auto-filled.

## 17. WhatsApp float
- `.whatsapp-float` fixed bottom-right; inline SVG icon; `aria-label`; `rel=noopener`.

## 18. Notice / disclaimer
- `.notice` gold left-border callout for licensing/illustrative disclaimers.

## Interaction & feedback states (all components)
Default · hover · active · focus-visible · (disabled where relevant) · loading/empty/error/success
(form) · image fallback (`.is-fallback`).
