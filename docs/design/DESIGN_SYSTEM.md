# Design System — GRAND VIEW Website

**Status:** LOCAL DEV ONLY — NOT PUBLISHED. Tokens mirror `assets/css/styles.css` `:root`.

## 1. Brand identity
Luxury black background, metallic gold accents, architectural elegance. Tagline: *Building Better
Tomorrows.* Logo: supplied GV gold-and-black emblem (`assets/images/grand-view-logo.jpg`).

## 2. Color tokens

| Token | Value | Use |
|-------|-------|-----|
| `--ink` | `#080808` | Page background |
| `--panel` | `#111110` | Card/section surface |
| `--panel-2` | `#181817` | Secondary surface |
| `--gold` | `#d6aa49` | Primary accent, borders, primary button |
| `--gold-light` | `#f3d77d` | Highlights, hover, focus, eyebrow text |
| `--paper` | `#f5f1e8` | Body text on dark; light-section background |
| `--white` | `#fff` | Pure white (sparingly) |
| `--muted` | `#a7a6a0` | Secondary text on dark |
| `--line` | `rgba(243,215,125,.22)` | Gold-tinted hairline borders |
| Error | `#e0794f` / text `#f0a489` | Form error |
| Success | `#8fd6a8` | Form success |

Rules: gold = accent/border/CTA only (not body text on dark). Contrast: body uses `--paper`/`--muted`
on dark; dark tokens on light sections.

## 3. Typography

| Role | Font | Token/Size |
|------|------|-----------|
| Headings | Playfair Display | `--serif`; `clamp()` 32–76px |
| Body | DM Sans | `--sans`; 16px / line-height 1.7 |
| Eyebrow / kicker | DM Sans | 11px, uppercase, letter-spacing .18–.2em |
| Small / meta | DM Sans | 12–13px |

Scale uses `clamp()` for fluid headings (e.g. `clamp(44px,6vw,76px)`).

## 4. Spacing scale
Section padding: `.section` 92px, `.section-sm` 64px (reduced on mobile). Component gaps: 12/16/24/
28/35px. Container: `--container:1200px`, `width:min(calc(100% - 40px), var(--container))`.

## 5. Radii, borders, shadows, layering
- Radius: `--radius:18px`; pills `999px`; images `3–4px`.
- Borders: `1px` hairlines (`rgba(255,255,255,.08)` neutral, `--line` gold).
- Shadow: `--shadow:0 22px 70px rgba(0,0,0,.28)` (desktop; subtle on mobile).
- z-index: header `30`, WhatsApp float `40`, mobile menu overlays under header.

## 6. Breakpoints
Mobile-first; overrides at **1000px** (tablet landscape), **780px** (tablet), **480px** (phone).
See `RESPONSIVE_SYSTEM.md`.

## 7. Buttons (states)
- `.button` primary: gold fill, dark text, pill; hover: lift + lighten. `:focus-visible` gold outline.
- `.button-secondary`: transparent, border; hover inverts to dark text.
- Min-height 50px (touch target). Disabled: reduced opacity (where used).

## 8. Component token map
Each component in `COMPONENT_CATALOG.md` lists its tokens. No ad-hoc values — reuse the tokens above.
