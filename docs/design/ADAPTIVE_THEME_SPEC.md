# Adaptive Theme Specification — GRAND VIEW

## 1. Overview
The Grand View Adaptive Sunlight/Moonlight system dynamically shifts the visual tone across 4 solar-inspired phases aligned with Abu Dhabi local time (UTC+4):
1. **Morning (`morning`)**: Sunrise-inspired warm ivory and champagne (`06:00 – 09:00`).
2. **Day (`day`)**: Bright marble, natural light, crisp contrast, refined gold (`09:00 – 17:00`).
3. **Evening (`evening`)**: Warm amber, sunset gold, charcoal (`17:00 – 20:00`).
4. **Night (`night`)**: Premium black, graphite, moonlight highlights, gold (`20:00 – 06:00`).

## 2. Scheduling & Calculations
- **Timezone**: Asia/Dubai (`UTC+4`, no Daylight Saving Time).
- **Calculation Mechanism**:
  ```js
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
  const adMs = utcMs + 4 * 3_600_000;
  const abuDhabiHour = new Date(adMs).getHours();
  ```
- **Interval Check**: Polled once every 60 seconds with low CPU impact. No third-party network or weather APIs.

## 3. User Controls
- The `#theme-toggle` button in the site header allows visitors to cycle between:
  - `Auto`: Follows current Abu Dhabi time.
  - `Light`: Locks to the Day phase.
  - `Dark`: Locks to the Night phase.
- User overrides are stored in `sessionStorage` (`gv-theme-mode`).

## 4. Accessibility & Contrast
- Minimum contrast ratio of 4.5:1 (WCAG AA) enforced across all four phases.
- Verified by automated axe-core scanning across all 8 routes in both LTR and RTL orientations.
- Motion transitions between phases respect `prefers-reduced-motion: reduce`.
