# Accessibility Rules — GRAND VIEW Website

Target: WCAG-minded AA for a marketing site. Full spec in `docs/design/ACCESSIBILITY_SPEC.md`.

## 1. Keyboard
- All interactive elements reachable and operable by keyboard (Tab/Shift+Tab/Enter/Space/Esc).
- Mobile menu: opens with the button, closes on **Escape** and outside-click; focus returns to the
  toggle.
- Visible `:focus-visible` on every link, button, and form control (gold outline, offset).

## 2. Structure & semantics
- Landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`. Exactly **one `<h1>`** per page; logical
  heading order (no skipped levels).
- `lang="en"` on `<html>`. Descriptive link text (avoid "click here").

## 3. Forms
- Every input has a `<label for>`; required fields marked with `*` and `required`.
- Validation errors are user-friendly and announced via an `aria-live="polite"` status region.
- The form never claims to email or store data — it prepares a WhatsApp message.

## 4. Images & icons
- Informative images have meaningful `alt`; decorative images use `alt=""`.
- Icon-only controls have `aria-label`; decorative glyphs are `aria-hidden`.

## 5. Motion & media
- Honour `prefers-reduced-motion: reduce` — disable transitions/animations and scroll reveals.
- Never hide content from AT or keyboard users to enable an animation.

## 6. Contrast
- Body text on dark: `--paper`/`--muted`. On light sections: dark tokens. Gold is accent/border only.

## 7. Skip link
- A "Skip to main content" link is the first focusable element on every page; `<main>` is focusable
  (`tabindex="-1"`).

## 8. Prohibited
- Removing focus outlines; using color alone to convey meaning; auto-playing media; keyboard traps;
- Disabling an a11y feature to make a check "pass".
