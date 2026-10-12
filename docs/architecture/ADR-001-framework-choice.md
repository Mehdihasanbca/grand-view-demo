# ADR-001 — Retain static HTML/CSS/JS; do not migrate to React/Next/Tailwind

- **Status:** Accepted
- **Date:** 2026-10-11
- **Deciders:** Principal Architect
- **Context:** The brief asks whether to migrate to React/TypeScript/Tailwind and lists many
  React-based UI libraries. It also requires inspecting the existing stack first and only migrating
  "when justified", preserving the original project, and keeping the site runnable locally by the
  simplest method with no unnecessary dependencies.

## Context / facts (verified)

- The project is a **static 8-page brochure site** with **no backend**, **no package.json**, **no
  `node_modules`**, **no framework**.
- The primary conversion is a **WhatsApp deep link**; there is no app-like state, routing, auth, or
  data fetching.
- All requested UI/animation libraries (shadcn/ui, Magic UI, Aceternity UI, React Bits, 21st.dev,
  Animate UI, Animata, Skiper UI, Vengeance UI) are **React + Tailwind + Motion** component
  collections (verified on their official sites — see `docs/research/UI_LIBRARY_AUDIT.md`).

## Decision

**Keep the static HTML/CSS/vanilla-JS stack.** Achieve modularity and rigor through:
- a single company-config source of truth (`src/config/company.js`),
- layout partials rendered by a tiny Node build step (`tools/build.mjs` → `dist/`),
- documented CSS design tokens,
- a dependency-free vanilla motion module,
- a dependency-free Node test harness,
- full engineering documentation.

## Alternatives considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| Migrate to React + Vite + Tailwind + Motion | Access to the requested component libraries; component model | Adds build step, ~100s of deps, larger bundle, hosting complexity, steeper maintenance for a brochure site; conflicts with "no unnecessary dependencies" and "simplest local run" | **Rejected** |
| Migrate to Next.js | SSG/SEO, file routing | Heaviest option; server runtime; overkill for 8 static pages | **Rejected** |
| Astro (static, islands) | Static-first, can embed React islands | Still adds a framework + build + deps for benefit this site doesn't need yet | **Deferred (evaluate later)** |
| **Static + partials + tokens + tests (chosen)** | Zero runtime deps; simplest local run; SEO-native; easy to maintain; preserves original | No component "library"; some manual discipline needed | **Accepted** |

## Consequences

- **Positive:** smallest possible footprint; fastest local preview (`python -m http.server`); no
  supply-chain risk; SEO-friendly real HTML; original project preserved.
- **Negative / accepted:** we forgo drop-in React components; motion is hand-written (kept subtle);
  if the site later grows into an app (booking, accounts, CMS), a re-evaluation via a new ADR is
  warranted.
- **Rollback:** original root `*.html` + assets remain untouched; `dist/` is additive.

## Compliance with constraints

- "Avoid unnecessary frameworks, packages, dependencies" → satisfied (zero added runtime deps).
- "Keep the project simple and maintainable" → satisfied.
- "Ensure the website runs locally using the simplest suitable method" → satisfied.
- "Never overwrite the original supplied logo" → satisfied.
- "No deploy" → nothing is published.
