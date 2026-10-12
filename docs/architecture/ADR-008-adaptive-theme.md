# ADR-008: Adaptive Sunlight / Moonlight Visual Theme System

## Status
ACCEPTED (NX-3)

## Context
The Grand View brand identity is grounded in luxury black and metallic gold. To elevate the user experience, an adaptive visual theme was requested that evolves across the day through four phases:
1. **Morning**: Sunrise-inspired warm ivory and champagne.
2. **Day**: Bright marble, natural light, crisp contrast, refined gold.
3. **Evening**: Warm amber, sunset gold, and charcoal.
4. **Night**: Premium black, graphite, moonlight highlights, and gold (original brand identity).

## Decision
1. **Abu Dhabi Time Reference (UTC+4)**:
   - Scheduling is anchored to Abu Dhabi local time (`UTC+4`, no Daylight Saving Time), rather than the visitor's device timezone.
   - External weather or sunrise APIs are avoided on page loads to eliminate network latency, third-party failure modes, and security risks.
   - Configurable fixed Abu Dhabi time intervals are adopted (Option B):
     - `06:00 – 09:00`: Morning
     - `09:00 – 17:00`: Day
     - `17:00 – 20:00`: Evening
     - `20:00 – 06:00`: Night
2. **User Control & Persistence**:
   - Three user modes:
     - `auto`: Follows Abu Dhabi local time (default).
     - `light`: Locked override to the Day phase.
     - `dark`: Locked override to the Night phase.
   - User overrides take priority over time-of-day changes.
   - Persistent preference stored in `sessionStorage` (`gv-theme-mode`), with no cookies or tracking.
3. **Flash of Incorrect Theme Prevention (FOIT)**:
   - A synchronous inline script in `<head>` executes before initial DOM rendering to evaluate `sessionStorage` or Abu Dhabi time, immediately applying `data-theme` and `data-theme-mode` attributes to `<html>`.
4. **CSS Token Architecture**:
   - Centralized semantic CSS custom properties prefixed with `--th-*`:
     - `--th-bg`, `--th-surface`, `--th-surface-2`
     - `--th-text`, `--th-text-muted`, `--th-text-subtle`
     - `--th-gold`, `--th-gold-light`, `--th-gold-access`
     - `--th-border`, `--th-border-sub`
     - `--th-btn-bg`, `--th-btn-fg`
     - `--th-focus`, `--th-header`, `--th-footer`
   - Scoped under `[data-theme="..."]` attributes.
5. **Accessibility & Motion Considerations**:
   - All theme phases preserve WCAG AA contrast (≥ 4.5:1 for body and controls).
   - Theme color transitions respect `prefers-reduced-motion: reduce`.
   - Clear visual focus rings are maintained across all themes.

## Consequences
- Preserves the original dark luxury aesthetic as the default and night phase.
- Seamless, dependency-free theme transitions without runtime libraries.
