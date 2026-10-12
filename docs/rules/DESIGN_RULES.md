# Design Rules — GRAND VIEW Website

Visual language: **luxury black + metallic gold**, architectural elegance. Full token values live in
`docs/design/DESIGN_SYSTEM.md`; this file states the *rules*.

## 1. Color
- Background near-black (`--ink #080808`); surfaces `--panel`/`--panel-2`; light sections use
  `--paper #f5f1e8` with dark text.
- Gold accents only: `--gold #d6aa49`, `--gold-light #f3d77d`. Gold is for emphasis, borders, icons,
  and primary CTAs — **not** for body text on dark (use `--paper`/`--muted`).
- Never introduce off-brand colors. Text on dark must meet contrast (use `--paper`/`--muted`).

## 2. Typography
- Headings: Playfair Display (serif) via `--serif`. Body: DM Sans via `--sans`.
- Use the type scale tokens (`clamp()` sizes). One `<h1>` per page; don't skip heading levels.

## 3. Spacing & layout
- Use the spacing scale (section padding tokens). Align to the `.container` max width.
- Consistent section rhythm: `.section` / `.section-sm`; panels via `.section-panel`/`.section-paper`.

## 4. Buttons & CTAs
- Primary = gold fill; secondary = transparent with border. Rounded pill (`border-radius:999px`).
- Prominent actions: **Request a Quote**, **Call Now** (`tel:`), **WhatsApp Us** — available on every
  page (header CTA, hero, floating WhatsApp, footer).

## 5. Cards & sections
- Cards: subtle border, gentle hover lift (`translateY(-5px)`), no heavy shadows on mobile.
- Keep generous whitespace; avoid clutter and oversized elements on mobile.

## 6. Icons
- Meaningful icons = inline SVG (WhatsApp). Decorative glyphs allowed only if `aria-hidden`.
- Consistent stroke/size; see ADR-006.

## 7. Imagery
- Remote photos need an `onerror` fallback to `placeholder.svg`. Never present illustrative images as
  completed projects. Maintain the illustrative disclaimer on the gallery.

## 8. Responsive rules
- Mobile-first fixes at 780px and 480px. Touch targets ≥ ~44px. No horizontal scroll.
- See `docs/design/RESPONSIVE_SYSTEM.md`.

## 9. Motion
- Subtle, transform/opacity, documented tokens, reduced-motion safe. No parallax/cursor-follow/
  perpetual/3D. See `docs/design/MOTION_SYSTEM.md`.

## 10. Prohibited
- Random hex colors/spacing not in tokens; generic-template look; excessive animation; clutter;
  oversized mobile elements; altering the brand logo.
