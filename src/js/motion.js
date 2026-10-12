/**
 * GRAND VIEW — dependency-free scroll-reveal module.
 *
 * Adds `.is-visible` to elements with [data-reveal] when they scroll into view. Purely additive:
 * content is visible by default in CSS, so if JS or IntersectionObserver is unavailable, nothing is
 * hidden. Fully honours prefers-reduced-motion (does nothing when reduced).
 *
 * No libraries. ~40 lines. See docs/design/MOTION_SYSTEM.md and ADR-004.
 */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window) || targets.length === 0) {
    // No motion: reveal everything immediately (CSS keeps it visible anyway).
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // reveal once
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
  );

  targets.forEach((el) => observer.observe(el));
})();
