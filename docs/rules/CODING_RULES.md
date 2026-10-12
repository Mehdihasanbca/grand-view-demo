# Coding Rules — GRAND VIEW Website

Detailed rules. `AGENTS.md` is the quick reference. **Environment: LOCAL DEV ONLY — NOT PUBLISHED.**

## 1. Language & syntax
- HTML5, modern CSS, and **vanilla JavaScript (ES2017+)**. No TypeScript in the current stack.
- JS uses `const`/`let` (never `var`), arrow functions, template literals, and strict mode (`'use strict'`)
  inside IIFEs or ES modules.
- Semicolons required. Single quotes for JS strings; double quotes for HTML attributes.

## 2. Files & folders
- Pages: kebab-case file names (`tiles-marble.html`).
- Assets: `assets/css`, `assets/js`, `assets/images`.
- Config: `src/config/company.js`. Templates: `src/templates/`. Build: `tools/build.mjs`.
- Tests: `tests/run.js`. Docs: `docs/`.
- No empty folders or speculative abstraction layers.

## 3. Company data
- **Single source of truth:** `src/config/company.js`. Pages must not hard-code contact details.
- After changing config, re-run the build and tests.

## 4. Imports & dependencies
- **Zero runtime dependencies.** Do not add npm packages to the browser bundle.
- Node is dev-only. Any new dependency requires an ADR + licence check + proof CSS/JS can't do it.
- In JS, prefer small local modules over libraries.

## 5. Error handling
- Feature-detect DOM elements before use; never throw on a missing node.
- Images get an `onerror` fallback to `assets/images/placeholder.svg`.
- Forms use native validation + an `aria-live` status region; no silent failures.
- The build fails loudly on a missing template or config key.

## 6. Performance
- `loading="lazy"` on below-the-fold images; `decoding="async"` where helpful.
- Animate only `transform`/`opacity`. No layout-thrashing scroll handlers.
- Keep CSS/JS small; avoid `@import` for new critical CSS (documented optimization).

## 7. Accessibility (summary — see ACCESSIBILITY_RULES.md)
- Keyboard operable; visible `:focus-visible`; labelled controls; one `<h1>`; `alt` text;
  `prefers-reduced-motion` honoured.

## 8. Code review requirements
- Every change: run `node tests/run.js` and `node --check` on edited JS.
- Update `docs/tasks/CHANGELOG.md`.
- No invented company claims; no false "email sent"/"saved to database" wording.

## 9. Prohibited shortcuts
- TODO/FIXME left in deliverables; commented-out dead code; deleting originals; disabling a11y to
  pass a check; claiming a test passed without running it; any publish/deploy action.

## 10. Required tests after modification
- `node tests/run.js` (links, consistency, encoding, assets, JSON-LD, SEO/a11y) must pass.
- Manual checks listed in `docs/tasks/QA_CHECKLIST.md` when UI/visual changes are made.
