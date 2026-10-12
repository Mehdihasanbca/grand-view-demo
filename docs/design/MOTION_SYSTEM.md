# Motion System — GRAND VIEW Website

Subtle, purposeful motion via a documented token system + a tiny dependency-free reveal. **LOCAL DEV
ONLY.** Implements ADR-004 (no animation library).

## 1. Motion tokens (CSS custom properties)

| Token | Value | Use |
|-------|-------|-----|
| `--dur-fast` | 150ms | Micro-feedback (color, small moves) |
| `--dur` | 220ms | Default transitions (hover, links) |
| `--dur-slow` | 500ms | Reveals, image scale |
| `--ease` | `cubic-bezier(.2,.7,.2,1)` | Standard easing |
| `--ease-out` | `cubic-bezier(.16,1,.3,1)` | Entrance/exit |
| `--dist` | 15px | Reveal travel distance |

> These are added to `:root` and used by `.fade-up`, reveals, and hovers.

## 2. Allowed motion
- **Entrance:** hero/`.fade-up` (opacity + translateY), `0.7s ease both`.
- **Section reveal:** `IntersectionObserver` adds `.is-visible` (opacity 0→1, translateY `--dist`→0).
- **Hover:** buttons translateY(-2px); service/gallery images `scale(1.04)`; card lift `translateY(-5px)`;
  text-link arrow `translateX(5px)`.
- **WhatsApp float:** translateY(-3px) scale(1.03) on hover.

## 3. Prohibited motion
- No parallax, cursor-following, perpetual/looping movement, 3D transforms, or auto-playing motion
  that delays reading. Only `transform`/`opacity` animate.

## 4. Reduced motion
- `@media (prefers-reduced-motion: reduce)`: durations → `.01ms`, iterations → 1, smooth-scroll off.
- The JS reveal checks `matchMedia('(prefers-reduced-motion: reduce)')` and does nothing when reduced,
  leaving content fully visible.

## 5. Implementation
- CSS: `styles.css` tokens + keyframes (`fade-up`).
- JS: `src/js/motion.js` (~40 lines) — `IntersectionObserver` on `[data-reveal]`, additive; content is
  visible by default if JS/observer is unavailable (progressive enhancement).

## 6. Performance & a11y
- Compositor-friendly (transform/opacity). No layout shift. Content never hidden from AT/keyboard.
- Usable on low-end mobile (short durations, GPU-friendly).
