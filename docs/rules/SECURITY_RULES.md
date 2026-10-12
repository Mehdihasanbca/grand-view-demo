# Security Rules — GRAND VIEW Website

A static site has a small attack surface, but these rules are binding. **LOCAL DEV ONLY — NOT
PUBLISHED.**

## 1. No secrets
- Never commit or expose private keys, credentials, tokens, API keys, or the licence/owner ID
  numbers. The licence PDF stays private and is never linked from the site.

## 2. No backend, so no injection of user data into storage
- The enquiry form does **not** email or store data. It builds a WhatsApp deep link client-side.
- User input is only placed into a URL via `encodeURIComponent` — never into `innerHTML`. This
  prevents script injection through the form.

## 3. Safe DOM practices
- Prefer `textContent` over `innerHTML` for any user-influenced text.
- External links use `target="_blank"` **with** `rel="noopener noreferrer"`.
- `window.open` for WhatsApp uses `noopener,noreferrer`.

## 4. External resources
- Remote images/fonts are third-party; keep the image `onerror` fallback. Prefer `https` only.
- Do not load untrusted third-party scripts. No analytics/tracking is added without owner approval.

## 5. Privacy
- No cookies, no tracking pixels, no data collection. State clearly (as now) that the form stores
  nothing.

## 6. Publishing controls
- Do not deploy, attach a domain, change DNS, or upload to a host/CDN in this phase.
- `robots.txt`/`sitemap.xml` keep placeholder domain until the owner confirms the real domain.

## 7. Dependency safety
- Zero runtime dependencies (ADR-001). Any future dependency requires an ADR, licence check, and a
  security review (supply-chain).

## 8. Prohibited
- Committing secrets; using `innerHTML` with user input; adding trackers; removing `rel=noopener`;
  publishing anything.
