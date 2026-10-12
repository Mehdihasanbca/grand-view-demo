# Performance & Asset Optimization Audit (NX-4) — GRAND VIEW

## 1. Executive Summary
This document records the NX-4 performance and asset optimization pass for GRAND VIEW CERAMIC AND MARBLE WORK. The website is an ultra-lean static HTML/CSS/vanilla-JS multi-page application with zero runtime npm dependencies.

The objective was to audit and eliminate render-blocking chains, optimize font delivery across English and Arabic routes, enforce layout stability with intrinsic image dimensions, verify lazy loading and branded image fallbacks, and benchmark Core Web Vitals using local Chromium telemetry.

## 2. Resource Audit & Identified Bottlenecks

### Render-Blocking Resources
- **Identified**: In `assets/css/styles.css`, an `@import url('https://fonts.googleapis.com/css2?...')` rule caused a sequential render-blocking network waterfall. The browser had to parse `styles.css`, then initiate an additional request to Google Fonts, delaying stylesheet parsing and initial paint.
- **Resolution**: Removed the CSS `@import`. Added `<link rel="preconnect" href="https://fonts.googleapis.com">`, `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`, and `<link rel="stylesheet" href="...">` directly to `src/templates/partials/head.html`. This parallelizes font connection handshakes while the stylesheet loads.

### Typography & Language Support
- Fonts requested: `DM Sans` (latin) and `Playfair Display` (serif headline).
- Arabic typography uses system fallbacks (`Arial, sans-serif`) with native UAE OS font rendering, avoiding unnecessary multi-megabyte Arabic font downloads while ensuring instant glyph display without clipping or FOIT.

### Cumulative Layout Shift (CLS)
- **Identified**: The brand logo emblem in `src/templates/partials/chrome-top.html` and `chrome-bottom.html` previously lacked explicit HTML `width` and `height` attributes, risking layout shifts as images resolved.
- **Resolution**: Added explicit intrinsic dimension attributes:
  - Header logo: `width="55" height="55"`
  - Footer logo: `width="48" height="48"`

### Lazy Loading Strategy
- Non-critical below-the-fold content images utilize `loading="lazy"`.
- Above-the-fold hero images are rendered via background CSS variables with immediate priority, ensuring Largest Contentful Paint (LCP) is not delayed by lazy loading heuristics.

### Offline & Remote Image Fallback
- Illustrated Unsplash imagery utilizes an inline vanilla JS fallback (`assets/js/main.js`): if an external image fails or is blocked by network policy, it seamlessly swaps to `assets/images/placeholder.svg` with `.is-fallback` styling.
- Verified in automated test `tests/e2e/behavior.spec.js`.

## 3. Performance Benchmark Measurements

Measurements were captured using `tools/perf-measure.mjs` against a local static HTTP server via headless Chromium navigation performance timings:

| Route | TTFB (Before) | TTFB (After) | FCP (Before) | FCP (After) | DCL (Before) | DCL (After) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Home (EN)** | 4 ms | 3 ms | 452 ms | 436 ms | 436 ms | 423 ms |
| **Home (AR)** | 1 ms | 1 ms | N/A (instant) | N/A (instant) | 79 ms | 78 ms |
| **Services (EN)** | 1 ms | 1 ms | 416 ms | 364 ms | 400 ms | 355 ms |
| **Contact (EN)** | 1 ms | 1 ms | 432 ms | 372 ms | 417 ms | 358 ms |

*Note: Environment limitations — Google Lighthouse CLI was not installed in the Windows environment, so exact automated Lighthouse scores are not fabricated. Deterministic browser performance telemetry (Navigation Timing Level 2 and Paint Timing API) was captured via Playwright Chromium.*

## 4. Test Verification
All automated suites were executed and verified:
1. `node tests/run.js`: **74/74 passed** (0 regressions).
2. `node tests/verify-i18n-build.mjs`: **16/16 routes verified** across English and Arabic.
3. `node node_modules/@playwright/test/cli.js test`: **75/75 passed** (E2E, responsive, a11y, behavior, and visual regression snapshots).

## 5. Remaining External Bottlenecks (Owner-Gated)
- **Stock Photography**: Current high-resolution photos are hosted on Unsplash CDN. Replacing these with locally hosted, optimized WebP/AVIF assets will occur once real project photography is provided by the owner (Task BL-04).
- **Domain & CDN**: Real-world TTFB and Edge HTTP/3 delivery will be achieved once the owner approves and connects the production domain.
