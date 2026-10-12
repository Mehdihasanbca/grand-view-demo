/**
 * GRAND VIEW — Adaptive Sunlight/Moonlight Theme (NX-3).
 *
 * Four-phase theme that follows Abu Dhabi local time (UTC+4, no DST):
 *   morning  06:00–09:00  — warm ivory and champagne
 *   day      09:00–17:00  — bright marble, natural light
 *   evening  17:00–20:00  — amber, sunset gold, charcoal
 *   night    20:00–06:00  — premium black, graphite, moonlight gold (brand identity)
 *
 * Decision ADR-008: local time intervals rather than real astronomical
 * sunrise/sunset calculations (see docs/architecture/ADR-008-adaptive-theme.md).
 * Abu Dhabi offset: UTC+4 (no daylight saving). The visitor's device clock
 * is used with a +4 hour correction — no API call, no external dependency.
 *
 * User control:
 *   data-theme-mode="auto"  — follows Abu Dhabi time (default)
 *   data-theme-mode="light" — locked to the Day phase
 *   data-theme-mode="dark"  — locked to the Night phase
 *
 * Persistence: sessionStorage (cleared when tab closes). Not cookies; no tracking.
 * Flash prevention: a blocking <script> in <head> (applied by build) reads
 * sessionStorage and sets the correct theme attribute before first paint.
 * JS-disabled fallback: Night theme (CSS default; full brand identity retained).
 *
 * Local dev only. No deployment.
 */
(() => {
  'use strict';

  // Abu Dhabi is UTC+4 with no DST.
  const ABU_DHABI_OFFSET_H = 4;

  /** Return current Abu Dhabi hour (0–23). */
  function abuDhabiHour() {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
    const adMs = utcMs + ABU_DHABI_OFFSET_H * 3_600_000;
    return new Date(adMs).getHours();
  }

  /** Map Abu Dhabi hour to one of the four theme phases. */
  function hourToPhase(h) {
    if (h >= 6 && h < 9)   return 'morning';
    if (h >= 9 && h < 17)  return 'day';
    if (h >= 17 && h < 20) return 'evening';
    return 'night';
  }

  const STORAGE_KEY = 'gv-theme-mode';
  const VALID_MODES = ['auto', 'light', 'dark'];

  /** Read stored user preference. Returns 'auto' if none or invalid. */
  function storedMode() {
    try {
      const v = sessionStorage.getItem(STORAGE_KEY);
      return VALID_MODES.includes(v) ? v : 'auto';
    } catch (_) {
      return 'auto';
    }
  }

  /** Persist user preference. */
  function saveMode(mode) {
    try {
      sessionStorage.setItem(STORAGE_KEY, mode);
    } catch (_) { /* storage unavailable — silent */ }
  }

  /** Resolve the actual data-theme value from a mode string. */
  function modeToTheme(mode) {
    if (mode === 'light') return 'day';
    if (mode === 'dark')  return 'night';
    // 'auto' — compute from Abu Dhabi time with a fallback to 'night'.
    try { return hourToPhase(abuDhabiHour()); }
    catch (_) { return 'night'; }
  }

  const html = document.documentElement;

  /** Apply theme + mode attributes. Updates aria-label on the control. */
  function applyTheme(mode) {
    const theme = modeToTheme(mode);
    html.setAttribute('data-theme', theme);
    html.setAttribute('data-theme-mode', mode);
    updateControl(mode, theme);
  }

  /** Update the theme control UI to reflect current state. */
  function updateControl(mode, theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const labels = {
      auto:  'Theme: Auto (Abu Dhabi time)',
      light: 'Theme: Light — click to reset to Auto',
      dark:  'Theme: Dark — click to reset to Auto',
    };
    btn.setAttribute('aria-label', labels[mode] || labels.auto);
    btn.setAttribute('data-mode', mode);
    btn.setAttribute('data-theme', theme);
    const icons = { morning: '🌅', day: '☀️', evening: '🌇', night: '🌙' };
    const icon = btn.querySelector('.theme-icon');
    if (icon) icon.textContent = icons[theme] || '🌙';
    const modeLabel = btn.querySelector('.theme-mode-label');
    if (modeLabel) {
      modeLabel.textContent = mode === 'auto' ? 'Auto' : mode === 'light' ? 'Light' : 'Dark';
    }
  }

  /** Cycle through modes: auto → light → dark → auto. */
  function cycleMode() {
    const current = html.getAttribute('data-theme-mode') || 'auto';
    const next = current === 'auto' ? 'light' : current === 'light' ? 'dark' : 'auto';
    saveMode(next);
    applyTheme(next);
  }

  // Apply the correct theme immediately (before any paint when possible).
  const initialMode = storedMode();
  applyTheme(initialMode);

  // Wire up the toggle button once DOM is ready.
  function init() {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', cycleMode);
      // Re-sync in case applyTheme ran before btn existed.
      updateControl(initialMode, modeToTheme(initialMode));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Auto-advance across phase boundaries when mode is 'auto'.
  // Check once per minute — minimal overhead, no continuous animation.
  let lastPhase = modeToTheme(storedMode());
  setInterval(() => {
    const mode = html.getAttribute('data-theme-mode') || 'auto';
    if (mode !== 'auto') return;
    try {
      const nextPhase = hourToPhase(abuDhabiHour());
      if (nextPhase !== lastPhase) {
        lastPhase = nextPhase;
        html.setAttribute('data-theme', nextPhase);
        updateControl('auto', nextPhase);
      }
    } catch (_) { /* time calculation failed — keep current theme */ }
  }, 60_000);

  // Expose for debugging / i18n integration (no required external use).
  window.GV_THEME = { applyTheme, cycleMode, modeToTheme, abuDhabiHour, hourToPhase, storedMode };
})();
