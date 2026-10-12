# Internationalization (i18n) Architecture — GRAND VIEW

## 1. Overview
The Grand View website supports full bilingual presentation in **English (`en`)** and **Arabic (`ar`)** across all 8 static pages:
- Home (`index.html`)
- About Us (`about.html`)
- Services Overview (`services.html`)
- Tile & Marble Work (`tiles-marble.html`)
- Plumbing & Pipe Fitting (`plumbing.html`)
- Electrical Work (`electrical.html`)
- Our Work / Gallery (`projects.html`)
- Contact & WhatsApp Quote (`contact.html`)

## 2. Source of Truth & Dictionaries
All translations are centralized under `src/config/i18n/`:
- `en-core.json` & `ar-core.json`: Site branding, chrome, header, footer, hero, values, navigation.
- `en-services.json` & `ar-services.json`: Services catalog, workflow, detail pages.
- `en-contact.json` & `ar-contact.json`: Enquiry form labels, validation messages, FAQs.

The dictionary build script `tools/gen-dict.mjs` compiles these files into `src/js/i18n-dict.js`, exposing a single ESM module for browser execution with zero runtime dependencies.

## 3. Route & Generation Pipeline
1. `tools/build.mjs` renders both language sets into `dist/`:
   - English pages: `dist/*.html`
   - Arabic pages: `dist/ar/*.html`
2. Attributes applied per language:
   - English: `<html lang="en" dir="ltr">`
   - Arabic: `<html lang="ar" dir="rtl">`
3. Layout partials (`src/templates/partials/`) are shared across both locales. Duplicate template markup is strictly avoided.

## 4. Direction & RTL Typography
- Primary styling uses CSS Logical Properties (`margin-inline`, `padding-inline`, `border-inline-start`, `inset-inline-start`).
- Physical elements that require directional reversal (e.g. process step borders, call-to-action badges, WhatsApp float position) are styled via `[dir="rtl"]` rules in `assets/css/styles.css`.
- Numbers and contact identifiers (`+971 58 164 5299`, email addresses, URLs) preserve LTR reading direction.

## 5. Verification & Tests
- `node tests/verify-i18n-build.mjs`: Verifies route presence, HTML attributes, text presence, and JSON-LD validity.
- Automated Playwright checks verify navigation, contrast, and layout across both locales.
